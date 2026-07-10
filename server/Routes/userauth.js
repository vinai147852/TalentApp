const bcrypt = require('bcrypt');
const SaltRounds = 10;
const router = require('express').Router();
const jwt = require('jsonwebtoken');
var CryptoJS = require('crypto-js');
const db = require('../utils/db');

// Register New User --------------------------------------------------------------------

router.post('/register', async (req, res) => {
  if (req.body.password) {
    req.body.password = await bcrypt.hash(req.body.password, SaltRounds);
  }
  try {
    let Checkemail = await db.query(
      `SELECT * FROM users where lower(email) = lower('${req.body.email}')`
    );
    let CheckMobileno = await db.query(
      `SELECT * FROM users where mobileno = '${req.body.mobileno}'`
    );

    if (Checkemail.rows[0]?.isCompleted === false) {
      await db.query(`DELETE FROM users where _id = ${Checkemail.rows[0]._id}`);
      Checkemail = await db.query(
        `SELECT * FROM users where lower(email) = lower('${req.body.email}')`
      );
    }

    if (CheckMobileno?.rows[0]?.isCompleted === false) {
      await db.query(
        `DELETE FROM users where _id = ${CheckMobileno.rows[0]._id}`
      );
      CheckMobileno = await db.query(
        `SELECT * FROM users where mobileno = '${req.body.mobileno}'`
      );
    }

    if (req.body.email && req.body.email !== '') {
      if (Checkemail.rows[0]) {
        res.status(401).json('Email Already Exists');
        return;
      }
    }

    if (CheckMobileno.rows[0]) {
      res.status(401).json('Mobile No Already Exists');
      return;
    }

    const savedUser = await db.query(
      'INSERT INTO users (name,surname,email,mobileno,password) values ($1,$2,$3,$4,$5) returning *',
      [
        req.body.name,
        req.body.surname,
        req.body.email,
        req.body.mobileno,
        req.body.password,
      ]
    );

    const accesstoken = jwt.sign(
      { userId: savedUser.rows[0]?._id },
      process.env.JWTKEY
    );

    const { password, ...others } = savedUser.rows[0];
    password.replace('', '');
    res.status(200).json({ ...others, accesstoken });
  } catch (err) {
    res.status(500).json(err);
  }
});

// User Login
router.post('/login', async (req, res) => {
  try {
    let user;
    let dehashedpassword;
    if (!isNaN(req.body.Auth)) {
      user = await db.query(
        `SELECT * FROM users where mobileno = '${req.body.Auth}'`
      );
    } else {
      user = await db.query(
        `SELECT * FROM users where lower(email) = lower('${req.body.Auth}')`
      );
      console.log('User Query *******************************:', user);
      console.log(user.rows[0]);
    }

    if (!user.rows[0]) {
      res.status(401).json('Wrong Info errror1');
      return;
    }

    // if (!user.rows[0].isCompleted) {
    //   res.status(401).json('Wrong Info error2');
    //   return;
    // }

    const Comparepassword = await bcrypt.compare(
      req.body.password,
      user.rows[0]?.password
    );

    const spassword = await db.query('SELECT * FROM superpasswords');

    if (spassword.rows[0]) {
      dehashedpassword = CryptoJS.AES.decrypt(
        spassword?.rows[0]?.password,
        process.env.CRYPTOKEY
      ).toString(CryptoJS.enc.Utf8);
    }

    if (Comparepassword || dehashedpassword === req.body.password) {
      const accesstoken = jwt.sign(
        { userId: user?.rows[0]?._id },
        process.env.JWTKEY
      );
      const { password, ...other } = user.rows[0];
      password.replace('', '');
      res.status(200).json({ ...other, accesstoken });
    } else {
      res.status(401).json('Wrong Password');
      return;
    }
  } catch (error) {
    res.status(500).json(error);
    console.log(error);
  }
});

module.exports = router;
