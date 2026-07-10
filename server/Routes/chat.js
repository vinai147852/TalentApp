const db = require('../utils/db');
const router = require('express').Router();

// Create New Conversation ------------------------------------------------------------
router.post('/create/conversation', async (req, res) => {
  const IDsarray = [req.body.senderId, req.body.receiverId];
  try {
    const isPrevConversation = await db.query(
      ` SELECT * FROM conversations where ARRAY[${req.body.senderId},${req.body.receiverId}]::integer[] = members`
    );

    if (isPrevConversation.rows[0]) {
      res.status(200).json(isPrevConversation.rows[0]);
      return;
    }

    const savedConversation = await db.query(
      `INSERT INTO conversations (members) values ($1) returning *`,
      [IDsarray]
    );
    res.status(200).json(savedConversation.rows[0]);
  } catch (error) {
    res.status(500).json(error);
  }
});

// Get My Conversations ---------------------------------------------------------------
router.get('/get/conversations/:id', async (req, res) => {
  try {
    const myconversations = await db.query(
      `SELECT * FROM conversations where (${req.params.id} = ANY(members) and "isStarted" = true) ORDER BY "updatedAt" DESC`
    );
    res.status(200).json(myconversations.rows);
  } catch (error) {
    res.status(500).json(error);
  }
});

// Create Messages --------------------------------------------------------------------
router.post('/create/messages', async (req, res) => {
  const date = new Date();
  try {
    await db.query(
      'UPDATE conversations SET "updatedAt"=$1 , "isStarted"=true where _id = $2 returning *',
      [date, req.body.conversationId]
    );

    const savedMessage = await db.query(
      'INSERT INTO messages ("conversationId","senderId",message) values ($1,$2,$3) returning *',
      [req.body.conversationId, req.body.senderId, req.body.message]
    );
    res.status(200).json(savedMessage.rows[0]);
  } catch (error) {
    res.status(200).json(error);
  }
});

// Get Messages of current Conversation ---------------------------------------------------------------
router.get('/get/messages/:id', async (req, res) => {
  try {
    const allmessages = await db.query(
      `SELECT * FROM messages where "conversationId" = ${req.params.id} ORDER BY _id ASC`
    );
    res.status(200).json(allmessages.rows);
  } catch (error) {
    res.status(500).json(error);
  }
});

// Get Last Message of the conversation -----------------------------------------------------------
router.get('/get/last/messages/:id', async (req, res) => {
  try {
    const lastmessages = await db.query(
      `SELECT * FROM messages where "conversationId" = ${req.params.id} ORDER BY _id DESC LIMIT 1`
    );
    res.status(200).json(lastmessages.rows);
  } catch (error) {
    res.status(500).json(error);
  }
});

// Get Reciever of the conversation -----------------------------------------------------------
router.get('/receiver/:id', async (req, res) => {
  try {
    let receiver;
    const isUser = await db.query(
      `SELECT * FROM users where _id = ${req.params.id}`
    );
    const isAdmin = await db.query(
      `SELECT * FROM admins where _id = ${req.params.id}`
    );
    const isAssistant = await db.query(
      `SELECT * FROM assistants where _id = ${req.params.id}`
    );

    if (isUser.rows[0]) {
      receiver = isUser.rows[0];
    } else if (isAdmin.rows[0]) {
      receiver = isAdmin.rows[0];
    } else {
      receiver = isAssistant.rows[0];
    }

    const { password, ...other } = receiver;
    password.replace('', '');
    res.status(200).json(other);
  } catch (error) {
    res.status(500).json(error);
  }
});

// Mark Conversation Messages as read --------  ---------------------------------------------
router.put('/messages/read/:id', async (req, res) => {
  try {
    await db.query(
      `UPDATE messages SET "isRead" = true where ("conversationId" = ${req.params.id} and NOT "senderId" = ${req.body.senderId})`
    );

    res.status(200).json('Marked as Read');
  } catch (error) {
    res.status(500).json(error);
    console.log(error);
  }
});

// get Unread Messages ------------------------------ -----------------------------------------
router.post('/unread/messages/:id', async (req, res) => {
  try {
    const unreadMsgs = await db.query(
      `SELECT * FROM messages where ("conversationId" = ${req.params.id} and NOT "senderId" = ${req.body.senderId}  and "isRead"=false)`
    );
    res.status(200).json(unreadMsgs.rows);
  } catch (error) {
    res.status(500).json(error);
  }
});

// Get All Unread Messages of Single User
router.post('/get/all/unread/msgs/:id', async (req, res) => {
  try {
    let conversationId = [];
    const AllmyConversations = await db.query(
        `
          SELECT * FROM conversations
          WHERE 
            $1 = ANY(members)
            AND "isStarted" = true
        `,
        [req.params.id]
      );
    for (let i = 0; i < AllmyConversations.rows?.length; i++) {
      conversationId.push(AllmyConversations.rows[i]?._id);
    }

    if(!conversationId.length ) {
      res.status(200).json([]);
      return;
    }

    const UnReadMsgs = await db.query(`
        SELECT * FROM messages
        WHERE 
          "senderId" != '${req.params.id}'
          AND "isRead" = false
          AND "conversationId" IN (
            ${conversationId.map(item => `'${item}'`).join(",")}
          );
      `);

    res.status(200).json(UnReadMsgs.rows);
  } catch (error) {
    console.log('error in fetching messages', error);
    res.status(500).json(error);
  }
});

// Close Conversation -------------------------------   -------------------------------

router.post('/close/open/:id', async (req, res) => {
  try {
    const CurrentConversation = await db.query(
      `SELECT * FROM conversations where _id = ${req.params.id}`
    );
    if (CurrentConversation.rows[0]?.isClosed) {
      await db.query(
        `UPDATE conversations SET "isClosed" = false where _id = ${req.params.id}`
      );
      res.status(200).json('Conversation Opened');
    } else {
      await db.query(
        `UPDATE conversations SET "isClosed" = true where _id = ${req.params.id}`
      );
      res.status(200).json('Conversation Closed');
    }
  } catch (error) {
    res.status(500).json(error);
  }
});

module.exports = router;
