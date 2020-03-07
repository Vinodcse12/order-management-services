//import express from 'express';
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const mySql = require('mysql');
const jwt = require('jsonwebtoken');
const uniqid = require('uniqid');
const btoa = require('btoa');
const atob = require('atob');
const dbConfig = require('./config/db-config.json')
var http = require('http');
var crypto = require('crypto');
var verify = require('./utils/jwtverfiy');
var userdb = require('./db/user-db');
var productdb = require('./db/product-db');

var salt, hash;


http.createServer();
//http.setTimeout(10*60*1000);

var app = express();

app.use(bodyParser.json());

app.use(cors());

var mySqlConnection = mySql.createConnection({
  host : dbConfig.host,
  user : dbConfig.user,
  password : dbConfig.password
});

mySqlConnection.connect((err, result) => {  
  if(!err) {
    userdb.setupDBAndTable(mySqlConnection);
    productdb.setupDBAndTable2(mySqlConnection);
  } else {
    console.log(JSON.stringify(err));
  }  
});


app.post('/signup', function(req, res) {
  var user = req.body.user;
  var password = req.body.user.password;
  salt = crypto.randomBytes(16).toString('hex');
  hash = crypto.pbkdf2Sync(password, salt, 1000, 64, 'sha512').toString('hex')
  const ob = {
      name : user.name,
      email : user.email,
      salt : salt,
      hash : hash,
      company: user.company,
      country: user.country,
      userid : uniqid()
  } 
  jwt.sign({ob}, 'secretkey', (err, token) => {
    userdb.registerUser(ob, function (err, info) {
          if (err) {
              res.send({"error": err})
          } else {
           res.status(200).send({token});
          }
          
      })
  })  
 
});

app.post('/login', (req, res) => {  
  var userData = req.body.user; 
  userdb.loginUser(userData.email, function (err, rows) {
    let user = rows[0];
    if(err) {
      res.send(err);
    } else {
      if (!user) {
        res.status(401).send('Invalid user');
      } else {
        let payload = {user : user};
        let token = jwt.sign(payload, 'secretkey');
        res.status(200).send({
          user: user,
          token: token
        })
      }
    }
      
  })
});

app.post('/addNewOrder', verifyToken, (req, res) => { debugger;
  
      var ob = {
        productName : req.body.payLoad.productName,
        productPrice : req.body.payLoad.productPrice, 
        productQuantity : req.body.payLoad.productQuantity,
        totalAmount : req.body.payLoad.totalAmount,
        paymentMode: req.body.payLoad.paymentMode,         
        userid : req.body.payLoad.userid,
        productId : uniqid()        
      } 
      productdb.createList(ob, function (err, info ) {
          if (err) {
              res.send({"error" : "something went wrong" + err})
          }
          res.send({
              "status": 200,
              "orderInfo": info
              //,
              //token : token
          });
      })
  
});

app.post('/getOrderList', verifyToken, (req, res) => {  
      var ob = {
          id : req.body.userid
      }
      productdb.getItemList(ob, (err, rows) => {
          if(err) {
              res.send({"error" : err})
          } else {
              res.send({
                "status": 200,
                "list": rows
            });
              res.end();
          }
      })  
});

function verifyToken(req, res, next) {
  if(!req.headers.authorization) {
    return res.status(401).send('Unauthorized request');
  }
  let token = req.headers.authorization.split(' ')[1];
  if (token === 'null') {
    return res.status(401).send('Unauthorized request');
  }
  let verifyPayload = jwt.verify(token, 'secretkey');
  if (!verifyPayload) {
    return res.status(401).send('Unauthorized request');
  }
  next();
}

app.listen(9090, function (){
  console.log("Express server is runing on 1000")
});
