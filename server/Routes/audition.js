const { VerifyTokenAndAuth, VerifyTokenAndAdmin } = require("./verifytoken");
const schedule = require("node-schedule");
const router = require("express").Router();
const db = require("../utils/db");

// Create Auditions --------------------------------------------------------------------
router.post("/create", VerifyTokenAndAuth, async (req, res) => {
  try {
    const savedaudition = await db.query(
      `INSERT INTO auditions (image,"userId",title,descp,linkedproject,type,location,contactperson,contactnumber,timefrom,timeto,applydate,startdate,enddate,status,"projectId") values ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16) returning *`,
      [
        req.body.image,
        req.body.userId,
        req.body.title,
        req.body.desc,
        req.body.linkedproject,
        req.body.type,
        req.body.location,
        req.body.contactperson,
        req.body.contactnumber,
        req.body.timefrom,
        req.body.timeto,
        req.body.applydate,
        req.body.startdate,
        req.body.enddate,
        req.body.status,
        req.body.projectId,
      ]
    );
    HandleAuditionStatus(res, savedaudition.rows[0]);
  } catch (err) {
    res.status(500).json(err);
  }
});

// Get All Auditions --------------------------------------------------------------------
router.get("/all", async (req, res) => {
  const qNew = req.query.new;
  const qId = req.query.id;
  const qUpcoming = req.query.upcoming;
  const qunlinked = req.query.unlinked;
  const qfeatured = req.query.featured;
  try {
    let allauditions;
    if (qNew) {
      allauditions = await db.query(
        "SELECT * FROM auditions ORDER BY _id DESC LIMIT 3"
      );
    } else if (qunlinked) {
      const unlikedauditions = await db.query(
        `SELECT * FROM auditions where ("userId" = '${qunlinked}' and not (linkedproject is not null))`
      );
      allauditions = unlikedauditions;
    } else if (qId) {
      allauditions = await db.query(
        `SELECT * FROM auditions where "userId" =${qId} ORDER BY _id DESC`
      );
    } else if (qUpcoming) {
      allauditions = await db.query(
        "SELECT * FROM auditions where status = 2 ORDER BY _id DESC LIMIT 3"
      );
    } else if (qfeatured) {
      allauditions = await db.query(
        `SELECT * FROM auditions where "userId" =${qfeatured} ORDER BY _id DESC LIMIT 3`
      );
    } else {
      allauditions = await db.query(
        "SELECT * FROM auditions ORDER BY _id DESC"
      );
    }
    res.status(200).json(allauditions.rows);
  } catch (err) {
    res.status(500).json(err);
  }
});

// Get Single Audition
router.get("/single/:id", async (req, res) => {
  try {
    const singleaudtion = await db.query(
      `SELECT * FROM auditions where _id = ${req.params.id}`
    );
    res.status(200).json(singleaudtion.rows[0]);
  } catch (err) {
    res.status(500).json(err);
  }
});

// Get Single Admins Auditions -------------------------------------------------------
router.get("/single/admin/:id", async (req, res) => {
  try {
    const singleadminsAud = await db.query(
      `SELECT * FROM auditions where "userId" = '${req.params.id}' ORDER BY _id DESC`
    );
    res.status(200).json(singleadminsAud.rows);
  } catch (err) {
    res.status(500).json(err);
  }
});

// Update Auditions --------------------------------------------------------------------
router.put("/update/:id", VerifyTokenAndAuth, async (req, res) => {
  try {
    await db.query(
      `UPDATE auditions 
      SET 
          image = COALESCE (NULLIF($1, ''), image),
          title = COALESCE (NULLIF($2, ''), title),
          descp = COALESCE (NULLIF($3, ''), descp),
          location = COALESCE (NULLIF($4, ''), location),
          contactperson = COALESCE (NULLIF($5, ''), contactperson),
          contactnumber = COALESCE (NULLIF($6, ''), contactnumber),
          timefrom = COALESCE (NULLIF($7, ''), timefrom),
          timeto = COALESCE (NULLIF($8, ''), timeto),
          applydate = COALESCE (NULLIF($9, '')::timestamp, applydate),
          startdate = COALESCE (NULLIF($10, '')::timestamp, startdate),
          enddate = COALESCE (NULLIF($11, '')::timestamp, enddate),
          linkedproject = $12
          WHERE _id = $13 RETURNING *`,
      [
        req.body.image,
        req.body.title,
        req.body.desc,
        req.body.location,
        req.body.contactperson,
        req.body.contactnumber,
        req.body.timefrom,
        req.body.timeto,
        req.body.applydate,
        req.body.startdate,
        req.body.enddate,
        req.body.linkedproject,
        req.params.id,
      ]
    );
    res.status(200).json("Audition updated");
  } catch (err) {
    res.status(500).json(err);
  }
});

// Delete Auditions --------------------------------------------------------------------

router.post("/delete/:id", VerifyTokenAndAdmin, async (req, res) => {
  try {
    await db.query(`DELETE FROM auditions where _id = ${req.params.id}`);
    res.status(200).json("Audition Deleted");
  } catch (err) {
    res.status(500).json(err);
  }
});

// Apply on audition --------------------------------------------------------
router.post("/apply/:id", async (req, res) => {
  try {
    const audition = await db.query(
      `SELECT * FROM auditions where _id = ${req.params.id}`
    );
    if (!audition?.rows[0]?.applied?.includes(req.body.userId)) {
      const allapplied = audition.rows[0].applied;
      allapplied.push(req.body.userId);
      await db.query(
        "UPDATE auditions SET applied = $1 where _id = $2 returning *",
        [allapplied, req.params.id]
      );
      res.status(200).json("You Applied to this Audition");
    } else {
      res.status(403).json("You Already Applied");
    }
  } catch (error) {
    res.status(500).json(error);
  }
});

// UnApply on audition --------------------------------------------------------
router.post("/unapply/:id", async (req, res) => {
  try {
    const audition = await db.query(
      `SELECT * FROM auditions where _id = ${req.params.id}`
    );
    if (audition?.rows[0]?.applied?.includes(req.body.userId)) {
      const allapplied = audition.rows[0].applied.filter(
        (item) => item !== req.body.userId
      );
      await db.query(
        "UPDATE auditions SET applied = $1 where _id = $2 returning *",
        [allapplied, req.params.id]
      );
      res.status(200).json("You Unapplied to this Audition");
    } else {
      res.status(403).json("You Already UnApplied");
    }
  } catch (error) {
    res.status(500).json(error);
  }
});

// Audition status functions ------------------------------------------------------------

schedule.scheduleJob("* * * * * ", function () {
  CheckOpenedAuditions();
  CheckClosedAuditions();
});

const CheckOpenedAuditions = async () => {
  try {
    const allauditions = await db.query("SELECT * FROM auditions");
    for (let i = 0; i < allauditions.rows?.length; i++) {
      const audition = allauditions.rows[i];
      if (
        Date.parse(audition.startdate) <= Date.now() &&
        Date.parse(audition.enddate) > Date.now()
      ) {
        await db.query(
          `UPDATE auditions SET status = $1 where _id = $2 returning *`,
          [1, audition?._id]
        );
      }
    }
  } catch (err) {
    console.log(err);
  }
};

const CheckClosedAuditions = async () => {
  try {
    const allauditions = await db.query("SELECT * FROM auditions");
    for (let i = 0; i < allauditions.rows?.length; i++) {
      const audition = allauditions.rows[i];
      if (Date.parse(audition.enddate) <= Date.now()) {
        await db.query(
          `UPDATE auditions SET status = $1 where _id = $2 returning *`,
          [3, audition?._id]
        );
      }
    }
  } catch (err) {
    console.log(err);
  }
};

const HandleAuditionStatus = async (res, data) => {
  try {
    if (data.startdate <= Date.now() && data.enddate > Date.now()) {
      await db.query(
        `UPDATE auditions SET status = $1 where _id = $2 returning *`,
        [1, data?._id]
      );
      res.status(200).json(data);
    } else if (data.startdate > Date.now()) {
      await db.query(
        `UPDATE auditions SET status = $1 where _id = $2 returning *`,
        [2, data?._id]
      );
      res.status(200).json(data);
    }
  } catch (err) {
    console.log(err);
  }
};

module.exports = router;
