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

// CREATE NEWS lETTER

router.post('/create', async (req, res) => {
  try {
    const checkEmail = await db.query(
      `SELECT * FROM newsletters where lower(email) = lower('${req.body.email}')`
    );

    if (checkEmail.rows[0]) {
      res.status(401).json('You Already Subscribed');
      return;
    }

    await db.query('INSERT INTO newsletters (email) values ($1) returning *', [
      req.body.email,
    ]);
    SendEmail({ email: req.body.email, res });
  } catch (error) {
    res.status(500).json(error);
    console.log(error);
  }
});

const SendEmail = async ({ email, res }) => {
  var Mailoptions = {
    from: 'conflatech@gmail.com',
    to: 'etvtalentapp@gmail.com',
    subject: `Talent-App NewsLetter Update`,
    html: `<p>A new person subscribed to our newsletter</p><br/><p>Email : ${email}</p></br>`,
  };

  transporter
    .sendMail(Mailoptions)
    .then(() => {
      res.status(200).json('NewsLetter Subscribed');
    })
    .catch((err) => {
      res.status(401).json(err.message);
    });
};

module.exports = router;
