const express = require('express');
const bodyParser = require('body-parser');
const app = express();



app.use(bodyParser.urlencoded({ extended: true }))
app.set('view engine', 'ejs') //Looking for files with ending .ejs. keep render without .ejs


var campgrounds = [
    {"name": "Jungle", "image": "https://pixabay.com/get/e837b1072af4003ed1584d05fb1d4e97e07ee3d21cac104490f3c17ba7edb4b8_340.jpg"},
    {"name": "Lake", "image": "https://pixabay.com/get/e83db50929f0033ed1584d05fb1d4e97e07ee3d21cac104490f3c17ba7edb4b8_340.jpg"},
    {"name": "Ocean", "image": "https://pixabay.com/get/e03db50f2af41c22d2524518b7444795ea76e5d004b0144496f0c379a7ecb5_340.jpg"},
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
    console.log(name)
    var newCampground = { name : name, image: image}
    console.log(newCampground)
    campgrounds.push(newCampground)

    res.redirect('/campgrounds')
})
app.listen(5000, ()=>{
    console.log('Server starts at port 5000')
})