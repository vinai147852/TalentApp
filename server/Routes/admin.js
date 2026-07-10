const { VerifyTokenAndAdmin } = require('./verifytoken');
const bcrypt = require('bcrypt');
const SaltRounds = 10;
const router = require('express').Router();
const db = require('../utils/db');
console.log('Admin Routes Loaded');
// Get All Admins --------------------------------------------------------------------
router.get('/single/:id', async (req, res) => {
  try {
    console.log('Getting Admin Details on login admin');
    const admin = await db.query(
      `SELECT * FROM admins where _id=${req.params.id}`
    );
    console.log("uyrtfghrgfrjghjrg@@@@@@@@@@@@@@@@@@@@@");
    const { password, ...other } = admin.rows[0];
    password.replace('', '');
    res.status(200).json(other);
  } catch (err) {
    console.log("uyrtfghrgfrjghj@", err);
    res.status(500).json(err);
  }
});

// Get All Admins --------------------------------------------------------------------
router.get('/all', async (req, res) => {
  try {
    console.log('Getting All Admins 2');
    const admins = await db.query('SELECT * FROM admins where role =2');
    res.status(200).json(admins.rows);
  } catch (err) {
    res.status(500).json(err);
  }
});

// Update Admin ------------------------------- ----------------------------------------------
router.put('/update/:id', VerifyTokenAndAdmin, async (req, res) => {
  try {
    // Check if admins email already in database
    const Checkbyemail = await db.query(
      `select * from admins where lower(email) = lower('${req.body.email}');`
    );
    if (Checkbyemail.rows[0]) {
      res.status(401).json('Email is already taken');
      return;
    }

    // Check if admins phonenumber already in database
    const Checkbymobileno = await db.query(
      `select * from admins where (mobileno) = ('${req.body.mobileno}');`
    );
    if (Checkbymobileno.rows[0]) {
      res.status(401).json('Phone Number is already taken');
      return;
    }

    const updatedadmin = await db.query(
      `UPDATE admins 
      SET 
          username = COALESCE (NULLIF($1, ''), username),
          "ProfilePic" = COALESCE (NULLIF($2, ''), "ProfilePic"),
          email = COALESCE (NULLIF($3, ''), email),
          mobileno = COALESCE (NULLIF($4, ''), mobileno)
          WHERE _id = $5 RETURNING *`,
      [
        req.body.username,
        req.body.ProfilePic,
        req.body.email,
        req.body.mobileno,
        req.params.id,
      ]
    );
    res
      .status(200)
      .json({ message: 'Admin Updated', item: updatedadmin.rows[0] });
  } catch (err) {
    res.status(500).json(err);
  }
});

// Terminate Admin ------------------------------- ----------------------------------------------
router.post('/terminate/:id', VerifyTokenAndAdmin, async (req, res) => {
  try {
    const terminatedadmin = await db.query(
      `SELECT * FROM admins where _id=${req.params.id}`
    );
    if (terminatedadmin?.rows[0]?.isTerminated) {
      await db.query(
        `UPDATE admins SET "isTerminated" = false WHERE _id=${req.params.id}`
      );
      res.status(200).json('Admin Determinated');
    } else {
      await db.query(
        `UPDATE admins SET "isTerminated" = true WHERE _id=${req.params.id}`
      );
      res.status(200).json('Admin Terminated');
    }
  } catch (err) {
    res.status(500).json(err);
  }
});

// Change Password for admin ----------------------------------------------------------------
router.post('/change/password/:id', async (req, res) => {
  if (req.body.newpassword) {
    req.body.newpassword = await bcrypt.hash(req.body.newpassword, SaltRounds);
  }
  try {
    // Check if we got data or not ----------------------------------------------
    if (!req.body.presentpassword) {
      res.status(401).json('Please Enter Present Password');
      return;
    }

    // Check if we got data or not ----------------------------------------------
    if (!req.body.newpassword) {
      res.status(401).json('Please Enter New Password');
      return;
    }

    // Get the current user ----------------------------------------------------
    const user = await db.query(
      `SELECT * FROM admins where _id = ${req.params.id}`
    );
    if (!user.rows[0]) {
      res.status(401).json('User not found');
      return;
    }

    // Check  if presentpassword is correct
    const isCorrect = await bcrypt.compare(
      req.body.presentpassword,
      user.rows[0].password
    );
    if (!isCorrect) {
      res.status(401).json('Incorrect Present Password');
      return;
    }

    await db.query(
      'UPDATE admins SET password = $1 where _id = $2 returning *',
      [req.body.newpassword, req.params.id]
    );
    res.status(200).json('Password changed');
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;
