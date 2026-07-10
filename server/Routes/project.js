const { VerifyTokenAndAuth, VerifyTokenAndAdmin } = require('./verifytoken');
const schedule = require('node-schedule');
const router = require('express').Router();
const db = require('../utils/db');

// Create New Project --------------------------------------------------------------------

router.post('/create', VerifyTokenAndAuth, async (req, res) => {
  try {
    const savedProject = await db.query(
      'INSERT INTO projects (image,"userId",title,descp,linkedaudition,startdate,enddate,type) values ($1,$2,$3,$4,$5,$6,$7,$8) returning *',
      [
        req.body.image,
        req.body.userId,
        req.body.title,
        req.body.desc,
        req.body.linkedaudition,
        req.body.startdate,
        req.body.enddate,
        req.body.type,
      ]
    );
    HandleProjectstatus(res, savedProject.rows[0]);
  } catch (err) {
    res.status(500).json(err);
    console.log(err);
  }
});

// Get Projects -------------------------------------------------------------------------
router.post('/admins/all', VerifyTokenAndAdmin, async (req, res) => {
  try {
    const AllProjects = await db.query(
      `SELECT * FROM projects where "userId" = ${req.body.userId} ORDER BY _id DESC`
    );
    res.status(200).json(AllProjects.rows);
  } catch (error) {
    res.status(500).json(error);
    console.log(error);
  }
});

// Get All Projects -------------------------------------------------------------------------
router.post('/all', VerifyTokenAndAdmin, async (req, res) => {
  const qId = req.query.id;
  const qLimit = req.query.limit;
  const qfeatured = req.query.featured;
  try {
    let AllProjects;
    if (qId) {
      AllProjects = await db.query(
        `SELECT * FROM projects where "userId" = '${qId}' ORDER BY _id DESC LIMIT 3`
      );
    } else if (qfeatured) {
      AllProjects = await db.query(
        `SELECT * FROM projects where "userId" = '${qfeatured}' ORDER BY _id DESC LIMIT 4`
      );
    } else if (qLimit) {
      AllProjects = await db.query(
        `SELECT * FROM projects ORDER BY _id DESC LIMIT 4`
      );
    } else {
      AllProjects = await db.query(`SELECT * FROM projects ORDER BY _id DESC`);
    }
    res.status(200).json(AllProjects.rows);
  } catch (error) {
    res.status(500).json(error);
  }
});
// Get Bulk Projects for assistant -------------------------------------------------------------------------
router.post('/bulk', VerifyTokenAndAdmin, async (req, res) => {
  try {
    const AllProjects = await db.query(
      `SELECT * FROM projects where _id IN (${req.body.bulk.map((item) => {
        return item;
      })})`
    );
    res.status(200).json(AllProjects.rows);
  } catch (error) {
    res.status(500).json(error);
  }
});

// Get Single Project ------------------------------  -------------------------------------

router.get('/single/:id', async (req, res) => {
  try {
    const singleproject = await db.query(
      `SELECT * FROM projects where _id = ${req.params.id}`
    );
    res.status(200).json(singleproject.rows[0]);
  } catch (error) {
    res.status(500).json(error);
  }
});

// Update Project --------------------------------------------      ------- --------------
router.put('/update/:id', VerifyTokenAndAuth, async (req, res) => {
  try {
    const updatedproject = await db.query(
      `UPDATE projects 
      SET 
          image = COALESCE (NULLIF($1, ''), image),
          title = COALESCE (NULLIF($2, ''), title),
          descp = COALESCE (NULLIF($3, ''), descp),
          enddate = COALESCE (NULLIF($4, '')::timestamp, enddate),
          linkedaudition = $5
          WHERE _id = $6 RETURNING *`,
      [
        req.body.image,
        req.body.title,
        req.body.desc,
        req.body.enddate,
        req.body.linkedaudition,
        req.params.id,
      ]
    );
    res.status(200).json(updatedproject.rows[0]);
  } catch (error) {
    res.status(500).json(error);
  }
});

// Delete Project Here ------------------------------------------------------------
router.post('/delete/:id', VerifyTokenAndAdmin, async (req, res) => {
  try {
    const project = await db.query(
      `SELECT * FROM projects where _id = ${req.params.id}`
    );
    await db.query(
      'UPDATE auditions SET linkedproject = $1 where _id = $2 returning *',
      [null, project.rows[0].linkedaudition]
    );
    await db.query(`DELETE FROM projects where _id = ${req.params.id}`);
    res.status(200).json('Project Deleted');
  } catch (error) {
    res.status(500).json(error);
    console.log(error);
  }
});

router.post('/lock/unlock/:id', async (req, res) => {
  try {
    const project = await db.query(
      `SELECT * FROM projects WHERE _id =${req.params.id}`
    );

    if (project.rows[0].islocked) {
      await db.query(
        'UPDATE projects SET islocked = $1 where _id = $2 returning *',
        [false, req.params.id]
      );
      res.status(200).json('Project Unlocked');
    } else {
      await db.query(
        'UPDATE projects SET islocked = $1 where _id = $2 returning *',
        [true, req.params.id]
      );
      res.status(200).json('Project locked');
    }
  } catch (error) {
    res.status(500).json(error);
  }
});

// Projects status functions ------------------------------------------------------------

schedule.scheduleJob('* * * * * ', function () {
  CheckOpenedProjects();
  CheckClosedProjects();
});

const CheckOpenedProjects = async () => {
  try {
    const allProjects = await db.query('SELECT * FROM projects');
    for (let i = 0; i < allProjects.rows?.length; i++) {
      const project = allProjects.rows[i];
      if (
        Date.parse(project.startdate) <= Date.now() &&
        Date.parse(project.enddate) > Date.now()
      ) {
        await db.query(
          'UPDATE projects SET status = $1 where _id = $2 returning *',
          [1, project?._id]
        );
      }
    }
  } catch (err) {
    console.log(err);
  }
};

const CheckClosedProjects = async () => {
  try {
    const allProjects = await db.query('SELECT * FROM projects');
    for (let i = 0; i < allProjects.rows?.length; i++) {
      const project = allProjects.rows[i];
      if (Date.parse(project.enddate) <= Date.now()) {
        await db.query(
          'UPDATE projects SET status = $1 where _id = $2 returning *',
          [3, project?._id]
        );
      }
    }
  } catch (err) {
    console.log(err);
  }
};

const HandleProjectstatus = async (res, data) => {
  try {
    if (data.startdate <= Date.now() && data.enddate > Date.now()) {
      await db.query(
        'UPDATE projects SET status = $1 where _id = $2 returning *',
        [1, data._id]
      );
      res.status(200).json(data);
    } else if (data.startdate > Date.now()) {
      await db.query(
        'UPDATE projects SET status = $1 where _id = $2 returning *',
        [2, data._id]
      );
      res.status(200).json(data);
    }
  } catch (err) {
    console.log(err);
  }
};

module.exports = router;
