const { VerifyTokenAndAdmin } = require('./verifytoken');
const db = require('../utils/db');
const router = require('express').Router();

// Create New Review --------------------------------------------------------------------
router.post('/create', VerifyTokenAndAdmin, async (req, res) => {
  console.log(req.body.stars);
  try {
    // One Admin Can Add only One Review
    const CheckReview = await db.query(
      `SELECT * FROM reviews where "userId" = '${req.body.userId}' and "artistId" = '${req.body.artistId}'`
    );

    if (CheckReview.rows[0]) {
      res.status(401).json('You Already Added a review');
      return;
    }

    const savedreview = await db.query(
      'INSERT INTO reviews ("userId","artistId",review,stars) values ($1,$2,$3,$4) returning *',
      [req.body.userId, req.body.artistId, req.body.review, req.body.stars]
    );
    res
      .status(200)
      .json({ message: 'Review Added', data: savedreview.rows[0] });
  } catch (error) {
    res.status(200).json(error);
    console.log(error);
  }
});

// Get All Reviews of a user --------------------------------------------------
router.post('/user/all/:id', async (req, res) => {
  try {
    const Allreviews = await db.query(
      `SELECT * FROM reviews where "artistId" = '${req.params.id}'`
    );
    res.status(200).json(Allreviews.rows);
  } catch (error) {
    res.status(200).json(error);
  }
});

module.exports = router;
