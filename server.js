const express = require("express");
const bodyParser = require("body-parser");
const path = require("path");
const app = express();
const axios = require('axios')
const port = process.env.PORT || 3009;
const Nightmare = require('nightmare');

const URL = (search = 'gamecube', page = 1,  discriptions = false)=>(`https://www.shopgoodwill.com/
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
&sd=${discriptions}${/* this determines if we are going to search the item descriptions as well, it should default false */''}
&sca=false
&caed=2/3/2020
&cadb=7
&scs=false${/* TODO determine exact functionality, has to do with canadian listings "The Canada Field is Required" */''}
&sis=false${/* TODO determine exact functionality, has to do with canadian listings "The Outside Canada Field is Required" */''}
&col=0${/* determines orderBy criteria,  TODO determine number and criteria correlation */''}
&p=${page}${/* this determines what page we load */''}
&ps=40${/* this determines what the page size is, and seems to not do anything when changed */''}
&desc=${desc}${/* this determines if we are going to sort descending, it should default false */''}
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
    let nightmare = Nightmare({show: true,
        webPreferences: {
            images: false
        }})

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