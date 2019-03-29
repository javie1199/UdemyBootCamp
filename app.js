const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const mongoose = require('mongoose')
const Campground = require('./models/campground')
const Comment = require('./models/comment')
const seedDB = require('./seed')

// seedDB()
//create or connect to mongodb database
mongoose.connect("mongodb://localhost/yelp_camp", { useNewUrlParser: true })

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
    Campground.findById(req.params.id).populate('comments').exec(function(err, foundCampground){
        if(err){console.log(err)}
        else{
            console.log(foundCampground)
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

app.get('/campgrounds/:id/comments/new',(req,res)=>{
    Campground.findById(req.params.id,(err,foundCampground)=>{
        if(err){throw err}
        else{   
            res.render('./comments/new',{campgrounds: foundCampground})
        }
    })
})

app.post('/campgrounds/:id/comments',(req,res)=>{
    Campground.findById(req.params.id, (err, foundCampground)=>{
        if(err){throw err}
        else{
            Comment.create(req.body.comment, (err, createdComment)=>{
                if(err){throw err}
                else{
                    foundCampground.comments.push(createdComment);
                    foundCampground.save();
                    res.redirect('/campgrounds/' + foundCampground._id)
                }
            })
        }
    })
})


app.listen(5000, ()=>{
    console.log('Server starts at port 5000')
})