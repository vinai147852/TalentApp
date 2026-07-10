const bcrypt = require('bcrypt');
const router = require('express').Router();
const db = require('../utils/db');
const jwt = require('jsonwebtoken');
const { VerifyTokenAndAdmin } = require('./verifytoken');
const SaltRounds = 10;

// Create Admins --------------------------------------------------------------------

router.post('/admin/register', async (req, res) => {
  if (req.body.password) {
    req.body.password = await bcrypt.hash(req.body.password, SaltRounds);
  }
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
    // Check if alreday a super admin is created
    const isSuperadmin = await db.query(`select * from admins where role = 1;`);
    if (isSuperadmin?.rows[0]?.role === req.body.role) {
      res.status(401).json('There can only be one Superadmin');
      return;
    }

    const savedaadmin = await db.query(
      'INSERT INTO admins (username,"ProfilePic",email,mobileno,password,role) values ($1,$2,$3,$4,$5,$6) returning *',
      [
        req.body.username,
        req.body.ProfilePic,
        req.body.email,
        req.body.mobileno,
        req.body.password,
        req.body.role ? req.body.role : 2,
      ]
    );
    res.status(200).json({
      message: 'Admin created Successfully',
      data: savedaadmin.rows[0],
    });
  } catch (err) {
    res.status(500).json(err);
    console.log(err);
  }
});

// // Admin Login ----------------------------------------------------------------------------

router.post('/admin/login', async (req, res) => {
  try {
    let user;
    // Check email of admin if valid or not
    const admin = await db.query(
      `SELECT * FROM admins where lower(email) = lower('${req.body.email}')`
    );
    const assistant = await db.query(
      `SELECT * FROM assistants where lower(email) = lower('${req.body.email}')`
    );

    if (admin.rows[0]) {
      user = admin.rows[0];
    } else {
      user = assistant.rows[0];
    }

    if (!user) {
      res.status(401).json('Email is not valid');
      return;
    }

    // Check  password is correct or not
    const Hashedpassword = await bcrypt.compare(
      req.body.password,
      user.password
    );
    if (!Hashedpassword) {
      res.status(401).json('Password is incorect');
      return;
    }

    if (user?.isTerminated) {
      res.status(401).json('This account is Currently Terminated');
      return;
    }

    const accesstoken = jwt.sign(
      { userId: user._id, role: user.role },
      process.env.JWTKEY
    );

    const { password, ...other } = user;
    password.replace('', '');
    res.status(200).json({ ...other, accesstoken });
  } catch (err) {
    res.status(500).json(err);
  }
});

// // Create Assistant -------------------------------------------------------------------
router.post('/assistant/register', VerifyTokenAndAdmin, async (req, res) => {
  if (req.body.password) {
    req.body.password = await bcrypt.hash(req.body.password, SaltRounds);
  }
  try {
    // Check if admins email already in database
    const Checkbyemail = await db.query(
      `select * from assistants where lower(email) = lower('${req.body.email}');`
    );
    if (Checkbyemail.rows[0]) {
      res.status(401).json('Email is already taken');
      return;
    }
    // Check if admins phonenumber already in database
    const Checkbymobileno = await db.query(
      `select * from assistants where (mobileno) = ('${req.body.mobileno}');`
    );
    if (Checkbymobileno.rows[0]) {
      res.status(401).json('Phone Number is already taken');
      return;
    }

    const savedassistant = await db.query(
      `INSERT INTO assistants (username,"ProfilePic",email,mobileno,password,"userId",role,permissions,projects) values ($1,$2,$3,$4,$5,$6,$7,$8,$9)`,
      [
        req.body.username,
        req.body.ProfilePic,
        req.body.email,
        req.body.mobileno,
        req.body.password,
        req.body.userId,
        req.body.role,
        req.body.permissions,
        req.body.projects,
      ]
    );

    res.status(200).json({
      message: 'Assistant created Successfully',
      data: savedassistant.rows[0],
    });
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;
