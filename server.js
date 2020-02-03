const express = require("express");
const bodyParser = require("body-parser");
const path = require("path");
const app = express();
const axios = require('axios')
const port = process.env.PORT || 3009;
const Nightmare = require('nightmare');

const URL = (search = 'gamecube', page = 1)=>(`https://www.shopgoodwill.com/
Listings?st=${search}
&sg=
&c=
&s=
&lp=0
&hp=999999
&sbn=false
&spo=false
&snpo=false
&socs=false
&sd=false
&sca=false
&caed=2/3/2020
&cadb=7
&scs=false
&sis=false
&col=0
&p=${page}
&ps=10
&desc=false
&ss=0
&UseBuyerPrefs=true`)
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

app.get('/api/singlepage',(req,res)=>{
    nightmare = Nightmare({show: true})

    nightmare
    .goto(URL(req.query.search, req.query.page))
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
        const data = {
            data : page,
            url : window.location.href,
            page : window.location.href[window.location.href.indexOf('p=', 170) + 2]

        }
        return data;
    })
    .end((results)=>{
    res.send(results)});
})

app.listen(port, ()=>{
    console.log(`server is listening on port ${port}`)
})