const { VerifyTokenAndAdmin } = require('./verifytoken');
const db = require('../utils/db');
const router = require('express').Router();

// Create New Review --------------------------------------------------------------------
router.post('/create', VerifyTokenAndAdmin, async (req, res) => {
  try {
    // Artist Can blocked once at a time
    const CheckisBlocked = await db.query(
      `SELECT * FROM blocks where "artistId" = '${req.body.artistId}' and isblocked = true`
    );

    if (CheckisBlocked.rows[0]) {
      res.status(401).json('Artist is Already Blocked');
      return;
    }

    await db.query(
      'INSERT INTO blocks ("userId","artistId",username,reason) values ($1,$2,$3,$4) returning *',
      [req.body.userId, req.body.artistId, req.body.username, req.body.reason]
    );

    await db.query(
      'INSERT INTO blocklogs ("userId","artistId",username,reason) values ($1,$2,$3,$4) returning *',
      [req.body.userId, req.body.artistId, req.body.username, req.body.reason]
    );

    res.status(200).json('Artist Blocked');
  } catch (error) {
    res.status(200).json(error);
  }
});

// unblock user -----------------------------------------------------------
router.put('/unblock/:id', VerifyTokenAndAdmin, async (req, res) => {
  try {
    await db.query(
      `UPDATE blocks 
      SET 
          "userId" = COALESCE (NULLIF($1, ''), "userId"),
          "artistId" = COALESCE (NULLIF($2, ''), "artistId"),
          username = COALESCE (NULLIF($3, ''), username),
          reason = COALESCE (NULLIF($4, ''), reason),
          isblocked = COALESCE (NULLIF($5, '')::boolean, isblocked)
          WHERE _id = $6 RETURNING *`,
      [
        req.body.userId,
        req.body.artistId,
        req.body.username,
        req.body.reason,
        req.body.isblocked,
        req.params.id,
      ]
    );

    await db.query(
      'INSERT INTO blocklogs ("userId","artistId",username,isblocked) values ($1,$2,$3,$4) returning *',
      [
        req.body.userId,
        req.body.artistId,
        req.body.username,
        req.body.isblocked,
      ]
    );

    res.status(200).json('Artist Unblocked');
  } catch (error) {
    res.status(200).json(error);
  }
});

// Get All Block Logs of a artist --------------------------------------------------
router.get('/logs/user/all/:id', async (req, res) => {
  try {
    const Allblocks = await db.query(
      `SELECT * FROM blocklogs where "artistId" = '${req.params.id}'`
    );
    res.status(200).json(Allblocks.rows);
  } catch (error) {
    res.status(200).json(error);
  }
});

// Check for single user if he is blocked or not
router.get('/logs/single/:id', async (req, res) => {
  try {
    const singlelog = await db.query(
      `SELECT * FROM blocks where "artistId" = '${req.params.id}' and isblocked = true`
    );
    res.status(200).json(singlelog.rows[0]);
  } catch (error) {
    res.status(200).json(error);
  }
});

module.exports = router;
