const bcrypt = require('bcrypt');
const SaltRounds = 10;
const router = require('express').Router();
const nodemailer = require('nodemailer');
const dotenv = require('dotenv');
const db = require('../utils/db');
dotenv.config();

let transporter = nodemailer.createTransport({
  service: 'Gmail',
  auth: {
    user: process.env.USER_EMAIL,
    pass: process.env.USER_PASSWORD,
  },
});

// Router Confirm IS User Exists or Not --------------------------------------------------------
router.post('/confirm', async (req, res) => {
  try {
    let user;
    if (!isNaN(req.body.Auth)) {
      user = await db.query(
        `SELECT * FROM users where mobileno = '${req.body.Auth}'`
      );
    } else {
      user = await db.query(
        `SELECT * FROM users where lower(email) = lower('${req.body.Auth}')`
      );
    }

    if (!user.rows[0]) {
      res.status(401).json('No User Found');
      return;
    }

    if (user.rows[0] && !isNaN(req.body.Auth)) {
      const response = {
        isMobile: true,
        mobileno: user.rows[0]?.mobileno,
        userId: user.rows[0]?._id,
      };
      res.status(200).json(response);
    }

    if (user.rows[0] && isNaN(req.body.Auth)) {
      SendOTPEmail({
        email: user.rows[0]?.email,
        userId: user.rows[0]?._id,
        res,
      });
    }
  } catch (error) {
    res.status(500).json(error);
  }
});

router.post('/set/:id', async (req, res) => {
  if (req.body.password) {
    req.body.password = await bcrypt.hash(req.body.password, SaltRounds);
  }
  try {
    if (req.body.password && req.params.id) {
      await db.query(
        'UPDATE users SET password = $1 where _id = $2 returning *',
        [req.body.password, req.params.id]
      );
      res.status(200).json('Password Reset Successfully');
    } else {
      res.status(401).json('You are not Authorized');
    }
  } catch (error) {
    res.status(500).json(error);
  }
});

router.post('/verify', async (req, res) => {
  try {
    const isOtp = await db.query(
      `SELECT * FROM forgotpassword where "userId" = '${req.body.userId}'`
    );
    if (isOtp?.rows[0].otp === req.body.otp) {
      await db.query(
        `DELETE FROM forgotpassword where _id = ${isOtp?.rows[0]._id}`
      );
      res.status(200).json({ Verified: true });
      return;
    } else {
      res.status(500).json('Invalid Code');
      return;
    }
  } catch (error) {
    res.status(500).json(error);
  }
});

router.post('/resend', async (req, res) => {
  try {
    SendOTPEmail({ email: req.body.email, userId: req.body.userId, res });
  } catch (error) {
    res.status(500).json(error);
  }
});

const SendOTPEmail = async ({ email, userId, res }) => {
  const otp = Math.floor(100000 + Math.random() * 900000);
  // const newOtp = new ForgotPassword({ userId, otp });
  var Mailoptions = {
    from: 'etvtalentapp@gmail.com',
    to: email,
    subject: `Reset Password`,
    html: `<p>Your Otp code for Talent-App is ${otp}</p>`,
  };

  //   Check If One Otp is already there ---------------------------
  const CheckOtp = await db.query(
    `SELECT * FROM forgotpassword where "userId" = '${userId}'`
  );
  if (CheckOtp.rows[0]) {
    await db.query(
      `DELETE FROM forgotpassword where _id = ${CheckOtp.rows[0]._id}`
    );
  }

  await db.query(
    'INSERT INTO forgotpassword ("userId",otp) values ($1,$2) returning *',
    [userId, otp]
  );

  transporter
    .sendMail(Mailoptions)
    .then(() => {
      res.status(200).json({ isEmail: true, userId: userId });
    })
    .catch((err) => {
      res.status(401).json(err.message);
    });
};

module.exports = router;
