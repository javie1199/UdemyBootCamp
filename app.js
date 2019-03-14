const express = require('express');

const app = express();

app.set('view engine', 'ejs') //Looking for files with ending .ejs. keep render without .ejs

app.get('/',(req,res)=>{
    res.render('landing')
})

app.get('/campgrounds',(req,res)=>{
    var campgrounds = [
        {"name": "Jungle", "img": "https://media-cdn.tripadvisor.com/media/photo-s/11/80/05/25/large-camping-area.jpg"},
        {"name": "Lake", "img": "http://www.camp-liza.com/wp-content/uploads/2017/10/20170708_093155_HDR-1.jpg"},
        {"name": "Ocean", "img": "https://www.backpackerguide.nz/wp-content/uploads/2015/12/camping-2581242_1920.jpg"},
    ]

    res.render('campgrounds',{campgrounds:campgrounds})
})
app.listen(5000, ()=>{
    console.log('Server starts at port 5000')
})