const express = require("express");
const mysql = require("mysql2");
require("dotenv").config();
const app = express();
const port = 8080;
const cors = require("cors");
const nodemailer = require("nodemailer");
const multer = require("multer");
const crypto = require('crypto');
const { google } = require('googleapis');
const cookieParser = require('cookie-parser');
const localstorage = {};
const sessionstorage = {};
const verificationstorage = {};
const mysqldump = require('mysqldump');
const fs = require('fs');
const emailtemplates = require('./emailtemplates');
var url = require('url');
const { exec } = require("child_process");

function backup() {
  var date_time = new Date().toISOString().replaceAll(':', '_');
  
  exec(`mysqldump -u ${process.env.DB_USER} -p${process.env.DB_PASSWORD} ${process.env.DB_DATABASE} > ./backups/${date_time}.sql`, (error, stdout, stderr) => {
    if (error) {
      console.log(`error: ${error.message}`);
      return;
    }

  });
}


setTimeout(function () {
  backup();
}, 1000 * 60 * 60 * 24); // 10 seconds


app.use(cors({
  origin: [
    "http://localhost:3000",
    "http://127.0.0.1",
  ],
  credentials: true
}
));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());


const con = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
  waitForConnections: true,
  connectionLimit: 10,
  maxIdle: 10, // max idle connections, the default value is the same as `connectionLimit`
  idleTimeout: 60000, // idle connections timeout, in milliseconds, the default value 60000
  queueLimit: 0
});

const transporter = nodemailer.createTransport({
  service: process.env.EMAIL_PROVIDER,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD
  }
});

const transporter2 = nodemailer.createTransport({
  service: process.env.EMAIL2_PROVIDER,
  auth: {
    user: process.env.EMAIL2_USER,
    pass: process.env.EMAIL2_PASSWORD
  }
});



var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, '../public/recipes')
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname.replace(/ /g, "_"));
  }
});

const upload = multer({ storage: storage });

var storage2 = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, '../public/invoices')
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  }
});

const upload2 = multer({ storage: storage2 });



app.post("/api/auth/resetpass", function (req, res) {
  let key = req.body.key;
  let pass = req.body.password;

  if (typeof localstorage[key] === "undefined") {
    res.json({ message: "Authentication token expired! Please try again." });
    return;
  }

  let email = localstorage[key];

  con.query(`UPDATE users SET password=SHA2(?,0) WHERE email=?`, [pass, email], function (err) {
    if (err !== null) {
      console.log(err);
      res.json(err);
    } else
      delete localstorage[key];
    res.json({ message: "Password reset successfully!" });
  });
});




app.post("/api/email", function (req, res) {
  let mailOptions = {
    from: process.env.EMAIL_USER,
    to: req.body.to,
    subject: req.body.subject,
    text: req.body.text
  }

  transporter.sendMail(mailOptions, function (error, info) {
    if (error) {
      console.log(error);
    } else {
      console.log('Email sent: ' + info.response);
    }
  });
});


/*app.post("/api/emailset", function(req, res){
    console.log(req.body.email);
    console.log(req.body.pass);
    let newEmail = req.body.email.replace(/;|'|"|`|\[|\]|/g, '');
    let newPass = req.body.pass.replace(/;|'|"|`/g, '');
    let sql = `UPDATE emailservice SET email=?,pass=SHA2(?,0) WHERE email=?`;
    con.query(sql,[newEmail,newPass,email], function (err, result) {
      if(err!==null){
        console.log(err);
      } else
        console.log("new email set");
        email=newEmail;
        pass=newPass;
    });
});*/



//Handling select queries
app.post("/api/select", function (req, res) {

  //Check for authorization
  if (check(req.cookies.auth)) {
    res.json({ message: "Authentication token expired! Please try again." });
    return;
  }

  //SQL Preparation
  let sql = ``;
  let columns = req.body.select.replace(/;|'|"|`/g, '');
  let table = req.body.from.replace(/;|'|"|`/g, '');

  if (typeof req.body.where === 'undefined')
    sql = `SELECT ${columns} FROM ${table};`;
  else {
    let where = req.body.where.replace(/;|'|`/g, '')
    sql = `SELECT ${columns} FROM ${table} WHERE ${where} ;`;
  }

  //Execute query
  con.query(sql, function (err, result) {
    if (err !== null) {
      console.log(err);
      res.json(err);
    } else
      res.json(result);
  });
});

app.post("/api/homepage-data", function (req, res) {
  if (check(req.cookies.auth)) {
    res.json({ message: "Authentication token expired! Please try again." });
    return;
  }

  sql = `SELECT 
  (SELECT COUNT(*) FROM staff WHERE deleted=0) AS staff,
  (SELECT COUNT(*) FROM suppliers WHERE deleted=0) AS suppliers,
  (SELECT COUNT(*) FROM stock WHERE deleted=0)AS stock,
  (SELECT COUNT(*) FROM recipes WHERE deleted=0) AS recipes,
  (SELECT COUNT(*) FROM orders WHERE orderstatus="Pending") as orders,
  (SELECT COUNT(*) FROM todolist WHERE completed=0) AS todos`
  con.query(sql, function (err, result) {
    if (err !== null) {
      console.log(err);
      res.json(err);
    } else
      res.json(result);
  });
});



//Handling insert queries
app.post("/api/insert", function (req, res) {

  //Check for authorization
  if (check(req.cookies.auth)) {
    res.json({ message: "Authentication token expired! Please try again." });
    return;
  }

  //SQL Preparation
  let sql = ``;
  let values = req.body.values.replace(/;|'|`/g, '');
  let table = req.body.table.replace(/;|'|"|`/g, '');
  sql = `INSERT INTO ${table} VALUES ${values};`;

  //Execute query
  con.query(sql, function (err, result, fields) {
    if (err !== null) {
      console.log(err);
      res.json(err);
    } else {
      res.json({ insertID: result.insertId });
    }
  });
});



app.post("/api/insert-recipe", upload.single('image'), (req, res) => {

  //Check for authorization
  if (check(req.cookies.auth)) {
    res.json({ message: "Authentication token expired! Please try again." });
    return;
  }

  //SQL Preparation
  let sql = ``;
  let values = req.body.values.replace(/;|'|`|\?/g, '');
  let table = req.body.table.replace(/;|'|"|`/g, '');
  sql = `INSERT INTO ${table} VALUES ${values};`;

  //Execute query
  con.query(sql, values, function (err, result, fields) {
    if (err !== null) {
      console.log(err);
      res.json(err);
    } else
      res.json({ insertID: result.insertId });
  });
});



app.post("/api/logging", function (req, res) {

  //Check for authorization
  if (check(req.cookies.auth)) {
    res.json({ message: "Authentication token expired! Please try again." });
    return;
  }

  //SQL Preparation
  let sql = `INSERT INTO logs VALUES (DEFAULT,?,?,?,?,?,sysdate())`;
  let user = req.body.user.replace(/;|'|`/g, '');
  let action = req.body.action.replace(/;|'|"|`/g, '');
  let ID = req.body.ID.replace(/;|'|"|`/g, '');
  let table = req.body.table.replace(/;|'|"|`/g, '');
  let description = req.body.description.replace(/;|'|"|`/g, '');

  //Execute query
  con.query(sql, [user, action, ID, table, description], function (err) {
    if (err !== null) {
      console.log(err);
    } else
      res.json("Logging error!");
  });
});


app.post("/api/logging-revert", function (req, res) {
  const input = req.body;

  //Check for authorization
  if (check(req.cookies.auth)) {
    res.json({ message: "Authentication token expired! Please try again." });
    return;
  }

  sql = `UPDATE suppliers SET deleted = 0 WHERE supplierID in (?)`;
  sql2 = `UPDATE stock SET deleted = 0 WHERE stockProductID in (?)`;
  sql3 = `UPDATE recipes SET deleted = 0 WHERE recipeID in (?)`;
  sql4 = `UPDATE staff SET deleted = 0 WHERE staffID in (?)`;
  sql5 = `UPDATE users SET deleted = 0 WHERE userID in (?)`;

  
  for (const [k,v] of Object.entries(input)) {
    switch (k) {
      case "suppliers":
        con.query(sql, [v], function (err) {
          if (err !== null)
            console.log(err);
        });
        break;
      case "stock":
        con.query(sql2, [v], function (err) {
          if (err !== null)
            console.log(err);
        });
        break;
      case "recipes":
        con.query(sql3, [v], function (err) {
          if (err !== null)
            console.log(err);
        });
        break;
      case "staff":
        con.query(sql4, [v], function (err) {
          if (err !== null)
            console.log(err);
        });
        break;
      case "users":
        con.query(sql5, [v], function (err) {
          if (err !== null)
            console.log(err);
        });
        break;
      default:
        console.log("Error");
        res.status(500);
    }
    con.query('DELETE FROM logs WHERE `table` = ? AND `ID` in (?)', [k,v], function (err) {
      if (err !== null)
        console.log(err);
    });
  }
  res.status(200).send();
});



//Handling update queries
app.post("/api/update", function (req, res) {

  //Check for authorization
  if (check(req.cookies.auth)) {
    res.json({ message: "Authentication token expired! Please try again." });
    return;
  }

  //SQL Preparation
  let sql = ``;
  let columns = req.body.columns.replace(/;|'|`/g, '');
  let table = req.body.table.replace(/;|'|"|`/g, '');
  if (typeof req.body.where === 'undefined')
    sql = `UPDATE ${table} SET ${columns};`;
  else {
    let where = req.body.where.replace(/;|'|`/g, '');
    sql = `UPDATE ${table} SET ${columns} WHERE ${where} ;`;
  }

  //Execute query
  con.query(sql, function (err, result, fields) {
    if (err !== null) {
      console.log(err);
      res.json(err);
    } else
      res.json({ insertID: result.insertId });
  });
});

app.post("/api/update-order", upload2.single('image'), function (req, res) {

  //Check for authorization
  if (check(req.cookies.auth)) {
    res.json({ message: "Authentication token expired! Please try again." });
    return;
  }
  try {
    //SQL Preparation
    let sql = ``;

    //Check for cases where arrival date is not provided
    if (req.body.arrivalDate === "null") {
      sql = `UPDATE orders SET orderInvoice=? WHERE orderID = ?`;
      con.query(sql, [req.body.imageName, req.body.orderID]);
    } else {
      //Check for cases where arrival date is provided
      upload2.single(req.body.image);
      sql = `UPDATE orders SET orderStatus="Arrived", orderInvoice=?, arrivalDate=? WHERE orderID = ?`;
      con.query(sql, [req.body.imageName, req.body.arrivalDate, req.body.orderID]);
    }
    res.json("Order updated!");
  } catch (err) {
    res.json(err);
  }

});

app.post("/api/delete", function (req, res) {

  //Check for authorization
  if (check(req.cookies.auth)) {
    res.json({ message: "Authentication token expired! Please try again." });
    return;
  }

  //SQL Preparation
  let where = req.body.where.replace(/;|'|`/g, '');
  let table = req.body.table.replace(/;|'|"|`/g, '');
  let sql = `DELETE FROM ${table} WHERE ${where}`;

  //Execute query
  con.query(sql);
  return;
});


app.post("/api/emailsupplier",function (req,res) {
  const input = req.body;

  let products = "";
  
  input.products.map(product=>{
    products+=`${product}<br>` 
  });


  let mailOptions = {
    from: process.env.EMAIL2_USER,
    to: useremail,
    subject: "Παραγγελία από Host Larnaca",
    text: emailtemplates.supplierEmailHtml(products,input.comments)
  }

  transporter2.sendMail(mailOptions, function (error, info) {
    if (error)
      console.log(error);
  });
  
});


//Authorization section

app.post("/api/auth", (req, res) => {
  let sql = ``;
  let randomkey;
  let email = req.body.email;
  let password = req.body.password;
  sql = `SELECT userID, username FROM users WHERE email=? AND password=SHA2(?,0) ;`;
  con.query(sql, [email, password], function (err, result) {
    if (err !== null) {
      console.log(err);
      res.json({ error: "Mysql error" });
      return;
    }
    if (result.length === 0)
      res.json({ error: "User not found" });
    else if (typeof result !== "undefined") {
      /* if (sessions.username===result[0].username){
        console.log("Session already exists");
        return;
      } */
      randomkey = crypto.randomBytes(20).toString('hex');
      sessionstorage[randomkey] = result[0].userID;
      res.status(202).cookie("auth", randomkey, {
        sameSite: 'strict',
        path: "/",
        expires: new Date(new Date().getTime() + 100000 * 1000),
        httpOnly: true
      });
      res.status(202).cookie("userID", result[0].userID, {
        sameSite: 'strict',
        path: "/",
        expires: new Date(new Date().getTime() + 100000 * 1000),
        httpOnly: true
      });
      res.send({ username: result[0].username });
    } else {
      res.json({ error: "User not found" });
    }

  });
});

app.post("/api/auth/validate", (req, res) => {

  //Check for authorization
  const auth = req.cookies.auth;
  if (typeof auth === "undefined") {
    res.send({});
    return;
  }

  const userID = sessionstorage[auth];

  if (typeof userID === "undefined") {
    res.status(202).clearCookie("auth");
    res.status(202).clearCookie("userID");
    res.send("Expired");
  } else {
    let sql = "SELECT username FROM users WHERE userID=?";
    con.query(sql, userID, function (err, result) {
      res.status(202).cookie("userID", userID, {
        sameSite: 'strict',
        path: "/",
        expires: new Date(new Date().getTime() + 100000 * 1000),
        httpOnly: true
      });

      res.send({ username: result[0].username })
    });
  }
});

app.post("/api/auth/logout", (req, res) => {
  const auth = req.cookies.auth;
  delete sessionstorage[auth];
  res.status(202).clearCookie("auth");
  res.status(202).clearCookie("userID");
  res.send();
});


app.post("/api/auth/reset", (req, res) => {
  let useremail = req.body.email;
  if (typeof useremail === "undefined" || useremail === "" || useremail === null) {
    res.status(418).send();
    return;
  }
  con.query("SELECT email, username FROM users WHERE email=? LIMIT 1", useremail, function (err, result) {
    if(typeof result === "undefined")
      return;
    if (result.length === 0) //check for null returns
      return;
    if (result[0].email === useremail) {

      let code = Math.floor(100000 + Math.random() * 900000);
      verificationstorage[code] = useremail;
      let user = result[0].username;


      let mailOptions = {
        from: process.env.EMAIL_USER,
        to: useremail,
        subject: "Request to reset your password",
        text: emailtemplates.resetEmailText(user,code),
        html: emailtemplates.resetEmailHtml(user,code)
      }

      transporter.sendMail(mailOptions, function (error, info) {
        if (error)
          console.log(error);
      });

      setTimeout(() => { delete verificationstorage[code]; }, 10000000) //Expire code after 10 minutes
      res.status(202).send();
    } else {
      return;
    }
  });
});

app.post("/api/auth/reset-code", (req, res) => {
  const code = req.body.code;
  const email = req.body.email;
  if (typeof code === "undefined" || code === "" || code === null) {
    res.status(418).send();
    return;
  }
  if (typeof verificationstorage[code] === "undefined") {
    res.status(418).send();
    return;
  } else if (verificationstorage[code] === email){
    res.status(200).json({status:true});
  }
});

app.post("/api/auth/reset-pass", (req, res) => {
  const email = req.body.email;
  const password = req.body.password;
  const code = req.body.code;

  if(password.length < 8 || password.length > 16){
    res.json({message:"Password must be between 8 and 16 characters long!"});
    return;
  }

  if (typeof code === "undefined" || code === "" || code === null) {
    res.status(418).send();
    return;
  }
  if (typeof verificationstorage[code] === "undefined") {
    res.status(418).send();
    return;
  } else if (verificationstorage[code] === email){
    con.execute("UPDATE users SET password=SHA2(?,0) WHERE email=?",[password,email], function (err) {
      if(err){
        console.log(err);
        res.status(503).send();
        return;
      }
      res.status(200).json({status:true});
      delete verificationstorage[code];
    });
  }
});


app.post("/api/updateaccount", function (req, res) {
  try {
      if (req.cookies.userID == null)
          return;
      
      const userID = req.cookies.userID;

      con.query(`SELECT email FROM users WHERE userID = ? AND password=SHA2(?,0)`, [userID, req.body.oldpassword], function (err, result) {
          if (err !== null)
              console.log(err);
          else {
              if (result.length === 0) {
                  res.status(401).json({sqlMessage:"Wrong password provided"}).send();
                  return; 
              } else {
                  const sql = `UPDATE users SET password=SHA2(?,0) WHERE userID=?`;
                  con.query(sql, [req.body.password, userID], function (err, result) {
                      if (err !== null)
                          console.log(err);
                      else
                          res.json(result.insertId).send();
                  });
              }
          }
      });

  } catch (err) {
      console.log(err);
      res.status(500).send();
  }
});


//Backup restore


app.post("/api/backup",(req, res) => {
  if(check(req.cookies.auth)){
    res.status(401).send();
    return;
  }
  try{
    var arr = [];

    fs.readdir("./backups", (err,files) => {
      files.forEach(file => {
        arr.push([file.substring(0,file.length-4),file]);
      });

      res.json(arr);
      return;
    });

  } catch(err){
    console.log(err);
    return [];
  }
});

app.post("/api/backup-restore", (req, res) => {
  if(check(req.cookies.auth)){
    res.status(401).send();
    return;
  }

  try{

    const filename = req.body.filename;

    exec(`mysql -u ${process.env.DB_USER} -p${process.env.DB_PASSWORD} ${process.env.DB_DATABASE} < ./backups/${filename}`, (err, stdout, stderr) => {
      if (err) {
        console.log(err);
        res.status(503).send();
        return;
      }
      res.status(200).send();});


}catch(err){
  console.log(err);
}

});




//Authentication Function
function check(req) {
  if (typeof req === "undefined")
    return true;
  else if (sessionstorage[req] === "undefined")
    return true;
  return false;
}



app.listen(port, function () {
  console.log(process.env.DB_HOST);
  console.log(`Listening on port ${port}!`);
  backup();
});