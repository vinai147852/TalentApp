const { VerifyTokenAndAdmin } = require('./verifytoken');
const db = require('../utils/db');
const router = require('express').Router();

// Add New Visitor --------------------------------------------------------------------

router.post('/create', async (req, res) => {
  try {
    const CheckVisitor = await db.query(
      `SELECT * FROM visitors where "visitorId" = '${req.body.visitorId}'`
    );

    if (CheckVisitor.rows[0]) {
      res.status(401).json('Vistor already there');
      return;
    }

    await db.query(
      'INSERT INTO visitors (ip,"visitorId",country,"isRegistered") values ($1,$2,$3,$4) returning *',
      [req.body.ip, req.body.visitorId, req.body.country, req.body.isRegistered]
    );
    res.status(200).json('Visitor Added');
  } catch (error) {
    res.status(500).json(error);
    console.log(error);
  }
});

// Get Visitors ---------------------------------   -----------------------------------
router.get('/get', VerifyTokenAndAdmin, async (req, res) => {
  try {
    const visitorsdata = await db.query(
      'SELECT * FROM visitors ORDER BY _id DESC'
    );
    res.status(200).json(visitorsdata.rows);
  } catch (error) {
    res.status(500).json(error);
  }
});

module.exports = router;
