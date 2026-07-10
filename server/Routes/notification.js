const db = require('../utils/db');
const router = require('express').Router();

// Create New Notification ------------------------------------------------------------
router.post('/create', async (req, res) => {
  try {
    const SavedNotification = await db.query(
      'INSERT INTO notifications (data,link,"recieverId","isRead","deleteIds",too,"forAll","forAdmins") values ($1,$2,$3,$4,$5,$6,$7,$8) returning *',
      [
        req.body.data,
        req.body.link,
        req.body.recieverId ? req.body.recieverId : [],
        req.body.isRead ? req.body.isRead : [],
        req.body.deleteIds ? req.body.deleteIds : [],
        req.body.too,
        req.body.forAll ? req.body.forAll : false,
        req.body.forAdmins ? req.body.forAdmins : false,
      ]
    );
    res.status(200).json(SavedNotification.rows[0]);
  } catch (error) {
    res.status(500).json(error);
    console.log(error);
  }
});

// Get Notifications with query ----------      ----------------------------------------

router.get('/get/all', async (req, res) => {
  try {
    const notifications = await db.query(
      'SELECT * FROM notifications ORDER BY _id DESC'
    );
    res.status(200).json(notifications.rows);
  } catch (error) {
    res.status(500).json(error);
  }
});

// Mark All Notifications as read -------------------------------------------------------
router.post('/all/markas/read/:id', async (req, res) => {
  try {
    const data = await db.query(
      `SELECT * FROM notifications where NOT ${req.params.id} = ANY("isRead")`
    );
    const Unread = data.rows;
    for (let i = 0; i < Unread?.length; i++) {
      const readdata = Unread[i].isRead ? Unread[i].isRead : [];
      readdata.push(req.params.id);
      await db.query(
        'UPDATE notifications SET "isRead" = $1 where _id = $2 returning *',
        [readdata, Unread[i]?._id]
      );
    }
    res.status(200).json('Marked as read');
  } catch (error) {
    res.status(500).json(error);
  }
});

module.exports = router;
