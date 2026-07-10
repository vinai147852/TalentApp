const router = require('express').Router();
const db = require('../utils/db');
// Add Multiple Artists to the Project --------------------------------------------------------------------

router.post('/add/multiple', async (req, res) => {
  if (req.body) {
    req.body.forEach((obj) => delete obj._id);
  }
  try {
    for (let i = 0; i < req.body.length; i++) {
      await db.query(
        `INSERT INTO addedartists ("artistId","userId","projectId",by,"From") values ($1,$2,$3,$4,$5)`,
        [
          req.body[i].artistId,
          req.body[i].userId,
          req.body[i].projectId,
          req.body[i].by,
          req.body[i].from,
        ]
      );
    }

    res.status(200).json('Artists Added');
  } catch (err) {
    res.status(500).json(err);
    console.log(err);
  }
});

// Add Single artist to Project --------------------------------------  -----------------------------------
router.post('/add/single', async (req, res) => {
  try {
    const validatetoadd = await db.query(
      `SELECT * FROM addedartists where ("userId" = '${req.body.userId}' and "projectId" = '${req.body.projectId}' and "artistId" = '${req.body.artistId}')`
    );

    const project = await db.query(
      `SELECT * FROM projects WHERE _id = ${req.body.projectId}`
    );

    if (project?.rows[0].islocked) {
      res.status(401).json('Project is Locked');
      return;
    }

    if (validatetoadd.rows[0]) {
      res.status(401).json('Artists Already Added');
      return;
    }

    await db.query(
      `INSERT INTO addedartists ("artistId","userId","projectId",by,"From") values ($1,$2,$3,$4,$5)`,
      [
        req.body.artistId,
        req.body.userId,
        req.body.projectId,
        req.body.by,
        req.body.from,
      ]
    );
    res.status(200).json('Artist Added');
  } catch (error) {
    res.status(500).json(error);
    console.log(error);
  }
});

// Get Added Artists for a single Project --------------------------------------------------------------
router.get('/project/:id', async (req, res) => {
  try {
    const projectsartists = await db.query(
      `SELECT * FROM addedartists where "projectId" = '${req.params.id}'`
    );
    res.status(200).json(projectsartists.rows);
  } catch (error) {
    res.status(500).json(error);
  }
});

// Get Users Active Projects -----------------------------------------------------------
router.get('/user/active/projects/:id', async (req, res) => {
  try {
    const activeprojects = await db.query(
      `SELECT * FROM addedartists where "artistId" = '${req.params.id}'`
    );
    res.status(200).json(activeprojects.rows);
  } catch (error) {
    res.status(500).json(error);
  }
});

// Delete Added Artist --------------------------------------------------------------

router.delete('/delete/:id', async (req, res) => {
  try {
    await db.query(`DELETE FROM addedartists WHERE _id = ${req.params.id}`);
    res.status(200).json('Artist Removed');
  } catch (error) {
    res.status(500).json(error);
  }
});

// Finalize Artist ---------------------------------------------------------------------
router.post('/finalize/:id', async (req, res) => {
  try {
    const currentItem = await db.query(
      `SELECT * FROM addedartists where _id = ${req.params.id}`
    );
    if (currentItem.rows[0]?.final) {
      await db.query(
        'UPDATE addedartists SET final = $1 where _id = $2 returning *',
        [false, req.params.id]
      );
      res.status(200).json('Artist Removed From Finalized');
    } else {
      await db.query(
        'UPDATE addedartists SET final = $1 where _id = $2 returning *',
        [true, req.params.id]
      );
      res.status(200).json('Artist Finalised');
    }
  } catch (error) {
    res.status(500).json(error);
  }
});

// ShortList Artist ---------------------------------------------------------------------
router.post('/shortlist/:id', async (req, res) => {
  try {
    const currentItem = await db.query(
      `SELECT * FROM addedartists where _id = ${req.params.id}`
    );
    if (currentItem.rows[0]?.shortlisted) {
      await db.query(
        'UPDATE addedartists SET shortlisted = $1 where _id = $2 returning *',
        [false, req.params.id]
      );
      res.status(200).json('Artist Removed From ShortListed');
    } else {
      await db.query(
        'UPDATE addedartists SET shortlisted = $1 where _id = $2 returning *',
        [true, req.params.id]
      );
      res.status(200).json('Artist ShortListed');
    }
  } catch (error) {
    res.status(500).json(error);
  }
});

module.exports = router;
