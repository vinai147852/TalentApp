
-- FIRST OPEN SQL SHELL THAN PRESS ENTER 4 TIMES AND AFTER THAT 
-- ENTER PASSWORD (YOU CANNOT SEE THE PASSWORD YOU ARE TYPING) YOU CREATED WHILE INSTALLING
-- POSTGRES DATABASE AND PRES ENTER NOW FOLLOW THERE STEPS



-- NOW WE NEED TOO CREATE DATABASE 

CREATE DATABASE talentapp;

-- THAN WE WILL SELECT OUR DATABASE
\c talentapp;

-- THAN WE WILL CREATE ALL TABLES 

CREATE TABLE admins(
_id SERIAL PRIMARY KEY,
username VARCHAR(500),
"ProfilePic" VARCHAR(500),
email VARCHAR(500),
mobileno VARCHAR(500),
password VARCHAR(500),
role INT DEFAULT 2,
"isTerminated" BOOLEAN DEFAULT false,
"createdAt" timestamp with time zone default current_timestamp,
"updatedAt" timestamp with time zone default current_timestamp
);


CREATE TABLE addedartists(
_id SERIAL PRIMARY KEY,
"artistId" VARCHAR(500),
"userId" VARCHAR(500),
"projectId" VARCHAR(500),
by INTEGER,
"From" INTEGER,
final BOOLEAN DEFAULT false,
shortlisted BOOLEAN DEFAULT false,
"createdAt" timestamp with time zone default current_timestamp,
"updatedAt" timestamp with time zone default current_timestamp
);


CREATE TABLE adminlogs(
_id SERIAL PRIMARY KEY,
"userId" VARCHAR(500),
device VARCHAR(500),
status VARCHAR(500),
"createdAt" timestamp with time zone default current_timestamp,
"updatedAt" timestamp with time zone default current_timestamp
);


CREATE TABLE assistants(
_id SERIAL PRIMARY KEY,
username VARCHAR(500),
"ProfilePic" VARCHAR(500),
email VARCHAR(500),
mobileno VARCHAR(500),
password VARCHAR(500),
"userId" INT,
role INT,
projects TEXT [] DEFAULT '{}'::text[],
"permissions" JSON [] DEFAULT '{}'::json[],
"createdAt" timestamp with time zone default current_timestamp,
"updatedAt" timestamp with time zone default current_timestamp
);

CREATE TABLE auditions(
_id SERIAL PRIMARY KEY,
image VARCHAR(500),
"userId" INTEGER,
title VARCHAR(500),
descp TEXT,
linkedproject VARCHAR(500),
type INTEGER,
location VARCHAR(500),
contactperson VARCHAR(500),
contactnumber VARCHAR(500),
timefrom text,
timeto text,
applydate timestamp with time zone,
startdate timestamp with time zone,
enddate timestamp with time zone,
applied INTEGER[] DEFAULT '{}'::integer[],
status INTEGER,
"projectId" VARCHAR(500),
"createdAt" timestamp with time zone default current_timestamp,
"updatedAt" timestamp with time zone default current_timestamp
);

CREATE TABLE blocklogs(
_id SERIAL PRIMARY KEY,
"userId" VARCHAR(500),
"artistId" VARCHAR(500),
username VARCHAR(500),
reason VARCHAR(500),
isblocked BOOLEAN DEFAULT true,
"createdAt" timestamp with time zone default current_timestamp,
"updatedAt" timestamp with time zone default current_timestamp
);

CREATE TABLE blocks(
_id SERIAL PRIMARY KEY,
"userId" VARCHAR(500),
"artistId" VARCHAR(500),
username VARCHAR(500),
reason VARCHAR(500),
isblocked BOOLEAN DEFAULT true,
"createdAt" timestamp with time zone default current_timestamp,
"updatedAt" timestamp with time zone default current_timestamp
);

CREATE TABLE conversations(
_id SERIAL PRIMARY KEY,
members INTEGER [],
"isStarted" BOOLEAN DEFAULT false,
"isClosed" BOOLEAN DEFAULT false,
"createdAt" timestamp with time zone default current_timestamp,
"updatedAt" timestamp with time zone default current_timestamp  
);

CREATE TABLE forgotpassword(
_id SERIAL PRIMARY KEY,
"userId" VARCHAR(500),
otp VARCHAR(500),
"createdAt" timestamp with time zone default current_timestamp,
"updatedAt" timestamp with time zone default current_timestamp
);


CREATE TABLE messages(
_id SERIAL PRIMARY KEY,
"conversationId" INTEGER,
"senderId" INTEGER,
message VARCHAR(5000),
"isRead" BOOLEAN DEFAULT false,
"createdAt" timestamp with time zone default current_timestamp,
"updatedAt" timestamp with time zone default current_timestamp  
);

CREATE TABLE newsletters(
_id SERIAL PRIMARY KEY,
email VARCHAR(500),
"createdAt" timestamp with time zone default current_timestamp,
"updatedAt" timestamp with time zone default current_timestamp  
);


CREATE TABLE notifications(
_id SERIAL PRIMARY KEY,
data JSON,
link VARCHAR(500),
"recieverId" INTEGER[] DEFAULT '{}'::integer[],
"isRead" INTEGER[] DEFAULT '{}'::integer[],
"deleteIds" INTEGER[] DEFAULT '{}'::integer[],
too TEXT[] DEFAULT '{}'::text[],
"forAll" BOOLEAN DEFAULT false,
"forAdmins" BOOLEAN DEFAULT false,
"createdAt" timestamp with time zone default current_timestamp,
"updatedAt" timestamp with time zone default current_timestamp  
);


CREATE TABLE projects(
_id SERIAL PRIMARY KEY,
image VARCHAR(500),
"userId" INTEGER,
title VARCHAR(500),
descp TEXT,
linkedaudition VARCHAR(500),
status INTEGER,
startdate timestamp with time zone,
enddate timestamp with time zone,
type VARCHAR(256),
islocked BOOLEAN DEFAULT false,
"createdAt" timestamp with time zone default current_timestamp,
"updatedAt" timestamp with time zone default current_timestamp
);

CREATE TABLE reviews(
_id SERIAL PRIMARY KEY,
"userId" VARCHAR(500),
"artistId" VARCHAR(500),
review VARCHAR(500),
stars numeric,
"createdAt" timestamp with time zone default current_timestamp,
"updatedAt" timestamp with time zone default current_timestamp
);


CREATE TABLE superpasswords(
_id SERIAL PRIMARY KEY,
password VARCHAR(500),
"createdAt" timestamp with time zone default current_timestamp ,
"updatedAt" timestamp with time zone default current_timestamp 
);


CREATE TABLE visitors(
_id SERIAL PRIMARY KEY,
ip VARCHAR(500),
"visitorId" VARCHAR(500),
country VARCHAR(500),
"isRegistered" BOOLEAN DEFAULT false,
"createdAt" timestamp with time zone default current_timestamp,
"updatedAt" timestamp with time zone default current_timestamp
);

CREATE TABLE users(
_id SERIAL PRIMARY KEY,
"ProfilePic" VARCHAR(500),
name VARCHAR(500),
surname VARCHAR(500),
email VARCHAR(500),
mobileno VARCHAR(500),
password VARCHAR(500),
category VARCHAR(500),
subcategory VARCHAR(500),
dateofbirth VARCHAR(500),
gender VARCHAR(500),
height VARCHAR(500),
weight VARCHAR(500),
motherlanguage VARCHAR(500),
knownlanguages JSON[] default '{}'::json[],
state VARCHAR(500),
city VARCHAR(500),
chest VARCHAR(500),
waist VARCHAR(500),
shoulders VARCHAR(500),
hips VARCHAR(500),
image1 VARCHAR(500),
image2 VARCHAR(500),
image3 VARCHAR(500),
image4 VARCHAR(500),
facebook VARCHAR(500),
twitter VARCHAR(500),
instagram VARCHAR(500),
youtube VARCHAR(500),
portfolio TEXT [] default '{}'::text[],
house VARCHAR(500),
street VARCHAR(500),
colony VARCHAR(500),
zip VARCHAR(500),
"isCompleted" BOOLEAN DEFAULT false,
"createdAt" timestamp with time zone default current_timestamp,
"updatedAt" timestamp with time zone default current_timestamp
);

CREATE SEQUENCE uses_serial_id_seq
   OWNED BY admins._id;

ALTER TABLE admins ALTER _id
   SET DEFAULT nextval('uses_serial_id_seq');

ALTER TABLE assistants ALTER _id
   SET DEFAULT nextval('uses_serial_id_seq');
   
ALTER TABLE users ALTER _id
   SET DEFAULT nextval('uses_serial_id_seq');

   ALTER TABLE conversations ALTER _id
   SET DEFAULT nextval('uses_serial_id_seq');

ALTER TABLE messages ALTER _id
   SET DEFAULT nextval('uses_serial_id_seq');

   ALTER TABLE notifications ALTER _id
   SET DEFAULT nextval('uses_serial_id_seq');

ALTER TABLE auditions ALTER _id
   SET DEFAULT nextval('uses_serial_id_seq');

ALTER TABLE projects ALTER _id
   SET DEFAULT nextval('uses_serial_id_seq');
   


-- THAN WE WILL CREATE OUR SUPER ADMIN

INSERT INTO admins (username,email,mobileno,password,role) values ('Superadmin','superadmin@gmail.com','91123312323','$2b$10$8pEAQmFWSu0KE0wvqpjvyOgnrmzuCJy9S.4Tf5EjJf425COEWdKKG',1);

-- NOW YOUR READY TO LOGIN AS SUPER ADMIN with email = superadmin@gmail.com and password = 1234;

