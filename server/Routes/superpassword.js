const { VerifyTokenAndAdmin } = require('./verifytoken');
var CryptoJS = require('crypto-js');
const db = require('../utils/db');
const router = require('express').Router();

router.post('/create', VerifyTokenAndAdmin, async (req, res) => {
  if (req.body.password) {
    req.body.password = await CryptoJS.AES.encrypt(
      req.body.password,
      process.env.CRYPTOKEY
    ).toString();
  }
  try {
    // Check if password already exists -----------------------------------------------

    const isExist = await db.query('SELECT * FROM superpasswords');
    if (isExist.rows[0]) {
      await db.query(
        `DELETE from superpasswords where _id = ${isExist.rows[0]?._id}`
      );
    }

    await db.query(
      'INSERT INTO superpasswords (password) values ($1) returning *',
      [req.body.password]
    );
    res.status(200).json('New Super Password Created');
  } catch (error) {
    res.status(500).json(error);
  }
});

router.get('/get', VerifyTokenAndAdmin, async (req, res) => {
  try {
    const spassword = await db.query('SELECT * FROM superpasswords');
    const dehashedpassword = CryptoJS.AES.decrypt(
      spassword.rows[0].password,
      process.env.CRYPTOKEY
    ).toString(CryptoJS.enc.Utf8);
    res.status(200).json(dehashedpassword);
  } catch (error) {
    res.status(500).json(error);
  }
});

module.exports = router;
