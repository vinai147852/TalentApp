const router = require('express').Router();
const nodemailer = require('nodemailer');
const dotenv = require('dotenv');
dotenv.config();

let transporter = nodemailer.createTransport({
  service: 'Gmail',
  auth: {
    user: process.env.USER_EMAIL,
    pass: process.env.USER_PASSWORD,
  },
});

router.post('/send', async (req, res) => {
  try {
    var Mailoptions = {
      from: 'conflatech@gmail.com',
      to: 'kreativeprasad@gmail.com',
      subject: `A Message From Talent-App by ${req.body.name}`,
      html: `<p>Name : ${req.body.name}</p></br>
            <p>Phone Number : ${req.body.phonenumber}</p></br>
            <p>Email : ${req.body.email}</p></br>
            <p>Message : ${req.body.message}</p></br>`,
    };

    transporter
      .sendMail(Mailoptions)
      .then(() => {
        res.status(200).json('Email Sent Successfully');
      })
      .catch((err) => {
        res.status(401).json(err.message);
      });
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;
