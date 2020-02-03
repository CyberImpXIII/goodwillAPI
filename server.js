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
    nightmare
    .goto(URL)
    .wait('button[aria-label="Search"]')
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
                title : ele.children[0].children[1].children[0].children[1].innerHTML.split('\n')[1].trim(),
                itemNum: ele.children[0].children[1].children[0].children[0].innerHTML.split('</span>')[1]
            })
        })
        return page;
    })
    .end(res.send)
})

app.listen(port, ()=>{
    console.log(`server is listening on port ${port}`)
})