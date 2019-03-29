const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const mongoose = require('mongoose')
const Campground = require('./models/campground')

//create or connect to mongodb database
mongoose.connect("mongodb://localhost/yelp_camp", { useNewUrlParser: true })



// Campground.create(
//     {
//         name: "Ocean",
//         image: "https://pixabay.com/get/e83db7082af3043ed1584d05fb1d4e97e07ee3d21cac104490f3c779afe5b1b9_340.jpg",
//         description: "Beautiful scence and no water, no food, engjoy"
//     },(err, campground)=>{
//         if(err){console.log(err)}
//         else{console.log("Newly created camground")}
//     }
// )

//Using bodyParser for get info from POST method
app.use(bodyParser.urlencoded({ extended: true }))

//Looking for files with ending .ejs. keep render without .ejs
app.set('view engine', 'ejs') 

app.get('/',(req,res)=>{
    res.render('landing') //langding.ejs file created in views folder
})

app.get('/campgrounds',(req,res)=>{
    Campground.find({},function(err, allCampgrounds){
        if(err){console.log(err)}
        else{res.render('index',{campgrounds:allCampgrounds})} //passing object campground :{ All Campgrounds }. Using ejs to fetch them.
    })

    
})

//put get campgrounds/new before campgrounds/:id so that it use /new first
app.get('/campgrounds/new', (req,res)=>{
    res.render('addCampgrounds')
})

app.get('/campgrounds/:id',(req, res)=>{
    console.log(req.params.id) //req.params get info from URL. req.body get infor from POST method
    Campground.findById(req.params.id,function(err, foundCampground){
        if(err){console.log(err)}
        else{
            res.render('show',{campgrounds: foundCampground})
        }
    })
    
})

app.post('/campgrounds', (req,res)=>{
    var name = req.body.name
    var image = req.body.image
    var desc = req.body.description
    var newCampground = { name : name, image: image, description: desc}
    console.log(newCampground)
    try {
        Campground.create(newCampground)
    } catch (error) {
        console.log(error)
    } finally{ res.redirect('/campgrounds')}

    
})

app.listen(5000, ()=>{
    console.log('Server starts at port 5000')
})