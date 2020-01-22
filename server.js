const express = require("express");
const bodyParser = require("body-parser");
const path = require("path");
const app = express();
const axios = require('axios')
const port = process.env.PORT || 3009;
const cheerio = require('cheerio');

app.use(express.static("dist"));
app.use(
  bodyParser.json({
    strict: false
  })
);

app.get('/api',(req,res)=>{
res.send('test');
})