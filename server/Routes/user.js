const { VerifyTokenAndAuth } = require('./verifytoken');
const router = require('express').Router();
const bcrypt = require('bcrypt');
const SaltRounds = 10;
const db = require('../utils/db');

// Complete New Users Profile --------------------------------------------------------------------
router.put('/update/profile', VerifyTokenAndAuth, async (req, res) => {
  if (req.body.password) {
    req.body.password = await bcrypt.hash(req.body.password, SaltRounds);
  }
  try {
    // Check if admins email already in database
    if (req.body.email) {
      const Checkbyemail = await db.query(
        `SELECT * from users where lower(email) = lower('${req.body.email}')`
      );
      if (Checkbyemail.rows[0]) {
        res.status(401).json('Email is already taken');
        return;
      }
    }

    // Check if admins phonenumber already in database
    if (req.body.mobileno) {
      const Checkbymobileno = await db.query(
        `SELECT * FROM users where mobileno = '${req.body.mobileno}'`
      );
      if (Checkbymobileno.rows[0]) {
        res.status(401).json('Phone Number is already taken');
        return;
      }
    }

    const updateduser = await db.query(
      `UPDATE users 
      SET 
          "ProfilePic" = COALESCE (NULLIF($1, ''), "ProfilePic"),
          name = COALESCE (NULLIF($2, ''), name),
          surname = COALESCE (NULLIF($3, ''), surname),
          email = COALESCE (NULLIF($4, ''), email),
          mobileno = COALESCE (NULLIF($5, ''), mobileno),
          password = COALESCE (NULLIF($6, ''), password),
          category = COALESCE (NULLIF($7, ''), category),
          subcategory = COALESCE (NULLIF($8, ''), subcategory),
          dateofbirth = COALESCE (NULLIF($9, ''), dateofbirth),
          gender = COALESCE (NULLIF($10, ''), gender),
          height = COALESCE (NULLIF($11, ''), height),
          weight = COALESCE (NULLIF($12, ''), weight),
          motherlanguage = COALESCE (NULLIF($13, ''), motherlanguage),
          knownlanguages = COALESCE (NULLIF($14, '')::json[], knownlanguages),
          state = COALESCE (NULLIF($15, ''), state),
          city = COALESCE (NULLIF($16, ''), city),
          chest = COALESCE (NULLIF($17, ''), chest),
          waist = COALESCE (NULLIF($18, ''), waist),
          shoulders = COALESCE (NULLIF($19, ''), shoulders),
          hips = COALESCE (NULLIF($20, ''), hips),
          image1 = COALESCE (NULLIF($21, ''), image1),
          image2 = COALESCE (NULLIF($22, ''), image2),
          image3 = COALESCE (NULLIF($23, ''), image3),
          image4 = COALESCE (NULLIF($24, ''), image4),
          facebook = COALESCE (NULLIF($25, ''), facebook),
          twitter = COALESCE (NULLIF($26, ''), twitter),
          instagram = COALESCE (NULLIF($27, ''), instagram),
          youtube = COALESCE (NULLIF($28, ''), youtube),
          portfolio = COALESCE (NULLIF($29, '')::text[], portfolio),
          house = COALESCE (NULLIF($30, ''), house),
          street = COALESCE (NULLIF($31, ''), street),
          colony = COALESCE (NULLIF($32, ''), colony),
          zip = COALESCE (NULLIF($33, ''), zip),
          "isCompleted" = COALESCE (NULLIF($34, '')::boolean, "isCompleted")
          WHERE _id = $35 RETURNING *`,
      [
        req.body.ProfilePic,
        req.body.name,
        req.body.surname,
        req.body.email,
        req.body.mobileno,
        req.body.password,
        req.body.category,
        req.body.subcategory,
        req.body.dateofbirth,
        req.body.gender,
        req.body.height,
        req.body.weight,
        req.body.motherlanguage,
        req.body.knownlanguages,
        req.body.state,
        req.body.city,
        req.body.chest,
        req.body.waist,
        req.body.shoulders,
        req.body.hips,
        req.body.image1,
        req.body.image2,
        req.body.image3,
        req.body.image4,
        req.body.facebook,
        req.body.twitter,
        req.body.instagram,
        req.body.youtube,
        req.body.portfolio,
        req.body.house,
        req.body.street,
        req.body.colony,
        req.body.zip,
        req.body.isCompleted,
        req.body.userId,
      ]
    );
    res
      .status(200)
      .json({ message: 'Updated Successfully', item: updateduser.rows[0] });
  } catch (err) {
    res.status(500).json(err);
    console.log(err);
  }
});

// Get single user -------------------------------- -------------------
router.get('/single/:id', async (req, res) => {
  try {
    const singleuser = await db.query(
      `SELECT * FROM users where _id = ${req.params.id}`
    );
    const { password, ...others } = singleuser.rows[0];
    password.replace('', '');
    res.status(200).json(others);
  } catch (err) {
    res.status(500).json(err);
  }
});

// Get All Users ---------------------------------------------------
router.get('/all', async (req, res) => {
  let qCat = req.query.cat;
  let qNew = req.query.new;
  try {
    let allusers;
    if (qCat) {
      allusers = await db.query(
        `SELECT * FROM users (where category = ${qCat} and "isCompleted" = true) ORDER BY _id DESC`
      );
    } else if (qNew) {
      allusers = await db.query(
        `SELECT * FROM users where "isCompleted" = true ORDER BY _id DESC LIMIT 10`
      );
    } else {
      allusers = await db.query(
        `SELECT * FROM users where "isCompleted" = true ORDER BY _id DESC`
      );
    }
    res.status(200).json(allusers.rows);
  } catch (error) {
    res.status(500).json(error);
  }
});

// Get Bulk Users for Assistants ------------------------------------------------------
router.post('/bulk', async (req, res) => {
  const data = req.body.bulk;
  try {
    const Bulkusers = await db.query(
      `SELECT * FROM users where category IN (${data.map((item) => {
        return `'${item}'`;
      })})`
    );
    res.status(200).json(Bulkusers.rows);
  } catch (error) {
    res.status(500).json(error);
    console.log(error);
  }
});

router.post('/delete/:id', VerifyTokenAndAuth, async (req, res) => {
  try {
    const user = await db.query(
      `SELECT * from auditions where ${req.params.id} = ANY(applied)`
    );
    for (let i = 0; i < user.rows.length; i++) {
      const allapplied = user.rows[i].applied.filter(
        (item) => `${item}` !== req.params.id
      );
      await db.query(
        'UPDATE auditions SET applied = $1 where _id = $2 returning *',
        [allapplied, user.rows[i]._id]
      );
    }
    // await Addedartists.deleteMany({ artistId: user?._id?.toString() });
    await db.query(`DELETE FROM users where _id = ${req.params.id}`);
    res.status(200).json('Account Deleted');
  } catch (error) {
    res.status(500).json(error);
    console.log(error);
  }
});

module.exports = router;
