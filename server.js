const express = require("express");
const bodyParser = require("body-parser");
const path = require("path");
const app = express();
const axios = require('axios')
const port = process.env.PORT || 3009;
const Nightmare = require('nightmare');
nightmare = Nightmare({show: true})

const URL = `https://www.shopgoodwill.com/`
let searchString;

//this function creates the URL segment of for API that determines what the search string
(function setSearchString(string){
    searchString = string
})(`gamecube`);
console.log(searchString)

app.use(express.static("dist"));
app.use(
  bodyParser.json({
    strict: false
  })
);

app.get('/api',(req,res)=>{
res.send('test');
})

nightmare
.goto(URL)
.wait()
.type('input[name="SearchText"]', 'gamecube')
.click('button[aria-label="Search"]')
.wait()
.evaluate(() =>{ 
    let page = []
    Array.from(document.querySelector(`ul.products`).children).forEach((ele)=>{
        console.log(ele)
        page.push({
            url : ele.children[0].href,
            image : ele.children[0].children[0].children[0].src, 
            // title : ele.children[0].children[1].children[2].innerHTML
        })
    })
    return page;
})
.end(console.log)