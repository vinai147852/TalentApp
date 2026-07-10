const db = require('../utils/db');

const router = require('express').Router();

// Create Admin Logs On Login --------------------------------------------------------------------

router.post('/create', async (req, res) => {
  try {
    const data = await db.query(
      'INSERT INTO adminlogs ("userId",device,status) values ($1,$2,$3) returning *',
      [req.body.userId, req.body.device, req.body.status]
    );
    res.status(200).json(data.rows[0]);
  } catch (error) {
    res.status(500).json(error);
  }
});

// Get Logs of single admin

router.get('/get/:id', async (req, res) => {
  try {
    const Logs = await db.query(
      `SELECT * FROM adminlogs where "userId"='${req.params.id}' ORDER BY _id DESC`
    );
    res.status(200).json(Logs.rows);
  } catch (error) {
    res.status(500).json(error);
  }
});

module.exports = router;
