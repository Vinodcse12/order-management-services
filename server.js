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
  var ob = {
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
              res.send({"error" : "something went wrong" + err})
          } else {
            res.status(200);
          //res.setHeader("Content-Type", "text/html");
            res.send({
                "info": "User Regiestered",
                token : token
            });
          }
          
      })
  })  
 
});

app.post('/login', (req, res) => {  
  var password = req.body.user.password; 
  userdb.loginUser(req.body.user.email, function (err, rows) {
      if(err) {
          res.send(err);
      } else {
          var result = {};
          if (rows.length === 0) {
              result["validPassword"] = false;
              result["validUser"] = false;
              result["message"] = "Invalid User";
              res.send(result);
          } else {
              result["validUser"] = true;
              var user = result["user"] = rows && rows[0];
              //var loginUserHash = crypto.pbkdf2Sync(password, salt, 1000, 64, 'sha512').toString('hex');  
              if (user.userid) {
                res.send({
                  "info" : user
                })
                      // result["validPassword"] = true;
                      // result["message"] = "Success";
                      // jwt.sign({user}, 'secretkey', (err, token) => {                            
                      //     res.send({
                      //         "info": result,
                      //          token : token
                      //     })
                      // })
                     

              } else {
                  result["validPassword"] = false;
                  result["message"] = "Incorrect Password";
                  res.send(result);
              }
          } 
      }
      //return err ? res.json(err) : res.send(rows && rows[0]);
  })
});

app.post('/addNewOrder', (req, res) => { debugger;
  
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

app.post('/getOrderList',  (req, res) => {  
      var ob = {
          id : req.body.info.userid
      }
      productdb.getItemList(ob, (err, rows) => {
          if(err) {
              res.send({"error" : err})
          } else {
              res.send({
                "status": 200,
                "list": rows
                //,
                //token : token
            });
              res.end();
          }
      })  
});

app.listen(9090, function (){
  console.log("Express server is runing on 1000")
});
