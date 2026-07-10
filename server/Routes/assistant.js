const { VerifyTokenAndAdmin } = require('./verifytoken');
const bcrypt = require('bcrypt');
const db = require('../utils/db');
const SaltRounds = 10;
const router = require('express').Router();

// Get All Assistants --------------------------------------------------------------------
router.get('/single/:id', async (req, res) => {
  try {
    const assistant = await db.query(
      `SELECT * FROM assistants where _id= ${req.params.id}`
    );
    const { password, ...other } = assistant.rows[0];
    password.replace('', '');
    res.status(200).json(other);
  } catch (err) {
    res.status(500).json(err);
    console.log(err);
  }
});

// Get All Assistants --------------------------------------------------------------------
router.get('/all', async (req, res) => {
  try {
    const AllAssistants = await db.query('SELECT * FROM assistants');
    res.status(200).json(AllAssistants.rows);
  } catch (err) {
    res.status(500).json(err);
  }
});

// Get All Assistants --------------------------------------------------------------------
router.get('/all/admin/:id', async (req, res) => {
  let qRole = req.query.role;
  try {
    let AllAssistants;

    if (qRole) {
      AllAssistants = await db.query(
        `SELECT * FROM assistants where ("userId" = ${req.params.id} and role =${qRole} )`
      );
    } else {
      AllAssistants = await db.query(
        `SELECT * FROM assistants where "userId" = ${req.params.id}`
      );
    }
    res.status(200).json(AllAssistants.rows);
  } catch (err) {
    res.status(500).json(err);
  }
});

// Update Assistant ------------------------------- ----------------------------------------------
router.put('/update/:id', VerifyTokenAndAdmin, async (req, res) => {
  try {
    // Check if assistant email already in database
    const Checkbyemail = await db.query(
      `select * from assistants where lower(email) = lower('${req.body.email}');`
    );
    if (Checkbyemail.rows[0]) {
      res.status(401).json('Email is already taken');
      return;
    }

    // Check if assistant phonenumber already in database
    const Checkbymobileno = await db.query(
      `select * from admins where (mobileno) = ('${req.body.mobileno}');`
    );
    if (Checkbymobileno.rows[0]) {
      res.status(401).json('Phone Number is already taken');
      return;
    }

    const updatedassis = await db.query(
      `UPDATE assistants 
      SET 
          username = COALESCE (NULLIF($1, ''), username),
          "ProfilePic" = COALESCE (NULLIF($2, ''), "ProfilePic"),
          email = COALESCE (NULLIF($3, ''), email),
          mobileno = COALESCE (NULLIF($4, ''), mobileno),
          permissions = COALESCE (NULLIF($5, '')::json[], permissions)
          WHERE _id = $6 RETURNING *`,
      [
        req.body.username,
        req.body.ProfilePic,
        req.body.email,
        req.body.mobileno,
        req.body.permissions,
        req.params.id,
      ]
    );
    res
      .status(200)
      .json({ message: 'Assistant Updated', item: updatedassis.rows[0] });
  } catch (err) {
    res.status(500).json(err);
  }
});

// Delete Assistant ------------------------------- ----------------------------------------------
router.post('/delete/:id', VerifyTokenAndAdmin, async (req, res) => {
  try {
    await db.query(`DELETE from assistants where _id = ${req.params.id}`);
    res.status(200).json('Assistant Deleted');
  } catch (err) {
    res.status(500).json(err);
  }
});

// Change Password for Assistant ----------------------------------------------------------------
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
      `SELECT * FROM assistants where _id = ${req.params.id}`
    );
    if (!user.rows[0]) {
      res.status(401).json('User not found');
      return;
    }

    // Check  if presentpassword is correct
    const isCorrect = await bcrypt.compare(
      req.body.presentpassword,
      user.rows[0]?.password
    );
    if (!isCorrect) {
      res.status(401).json('Incorrect Present Password');
      return;
    }

    await db.query(
      'UPDATE assistants SET password = $1 where _id = $2 returning *',
      [req.body.newpassword, req.params.id]
    );
    res.status(200).json('Password changed');
  } catch (err) {
    res.status(500).json(err);
  }
});

// Assign a Project To Assistant ---------------------------------------------------------
router.put('/assign/project/:id', async (req, res) => {
  try {
    const assistant = await db.query(
      `SELECT * FROM assistants where _id = ${req.params.id}`
    );
    if (!assistant.rows[0]?.projects?.includes(req.body.projectId)) {
      let allprojects = assistant.rows[0].projects
        ? assistant.rows[0].projects
        : [];
      allprojects.push(req.body.projectId);
      await db.query(
        `UPDATE assistants SET projects = $1 where _id = $2 returning *`,
        [allprojects, req.params.id]
      );
      res.status(200).json('Project Assigned to Assistant');
    } else {
      res.status(401).json('Project Already Assigned');
    }
  } catch (error) {
    res.status(500).json(error);
  }
});

// UnAssign a Project To Assistant ---------------------------------------------------------
router.put('/unassign/project/:id', async (req, res) => {
  try {
    const assistant = await db.query(
      `SELECT * FROM assistants where _id = ${req.params.id}`
    );
    if (assistant.rows[0]?.projects?.includes(req.body.projectId.toString())) {
      let allprojects = assistant.rows[0].projects.filter(
        (item) => item !== req.body.projectId.toString()
      );
      await db.query(
        `UPDATE assistants SET projects = $1 where _id = $2 returning *`,
        [allprojects, req.params.id]
      );
      res.status(200).json('Project UnAssigned');
    } else {
      res.status(401).json('Project Already UnAssigned');
    }
  } catch (error) {
    res.status(500).json(error);
    console.log(error);
  }
});

// Get Assistant from the project
router.post('/project/assigned/:id', async (req, res) => {
  try {
    const bothassistants = await db.query(
      `SELECT * FROM assistants where '${req.params.id}' = ANY(projects)`
    );
    res.status(200).json(bothassistants.rows);
  } catch (error) {
    res.status(500).json(error);
  }
});

// Get  permissions of Assistangts   -------------------------------------------------------
router.get('/permissions/:id', async (req, res) => {
  try {
    const permissions = await db.query(
      `SELECT * FROM assistants where _id = ${req.params.id}`
    );
    res
      .status(200)
      .json(permissions.rows[0]?.permissions?.map((item) => item?.value));
  } catch (error) {
    res.status(500).json(error);
  }
});

module.exports = router;
