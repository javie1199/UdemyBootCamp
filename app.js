const express = require('express');
const bodyParser = require('body-parser');
const app = express();



app.use(bodyParser.urlencoded({ extended: true }))
app.set('view engine', 'ejs') //Looking for files with ending .ejs. keep render without .ejs


var campgrounds = [
    {"name": "Jungle", "image": "https://pixabay.com/get/e83db7082af3043ed1584d05fb1d4e97e07ee3d21cac104490f3c779afe5b1b9_340.jpg"},
]

app.get('/',(req,res)=>{
    res.render('landing')
})

app.get('/campgrounds',(req,res)=>{
    

    res.render('campgrounds',{campgrounds:campgrounds})
})

app.get('/campgrounds/new', (req,res)=>{
    res.render('addCampgrounds')
})

app.post('/campgrounds', (req,res)=>{
    var name = req.body.name
    var image = req.body.image
    var newCampground = { name : name, image: image}
    campgrounds.push(newCampground)

    res.redirect('/campgrounds')
})
app.listen(5000, ()=>{
    console.log('Server starts at port 5000')
})