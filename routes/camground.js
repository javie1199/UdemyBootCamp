var express = require('express')
var router = express.Router()
var Campground = require('../models/campground')
var middlewares = require('../middlewares')

//SHOW CAMPGROUNDS
router.get('/', (req, res) => {
    Campground.find({}, function (err, allCampgrounds) {
        if (err) { req.flash('error', err.message) }
        else { 
            res.render('index', { campgrounds: allCampgrounds }) 
        } //passing object campground :{ All Campgrounds }. Using ejs to fetch them.
    })


})

//CREATE A CAMPGROUND
router.post('/', middlewares.isLoggedIn, (req, res) => {
    var name = req.body.name
    var image = req.body.image
    var desc = req.body.description
    var author = {
        _id: req.user._id,
        username: req.user.username
    }
    var newCampground = { name: name, image: image, description: desc, author: author, date: new Date() }
    try {
        Campground.create(newCampground)
    } catch (error) {
        req.flash('error', error.message)
    } finally { 
        req.flash('success','A new campground is created')
        res.redirect('/campgrounds') 
    }


})

// ADD A CAMGROUND
//put get campgrounds/new before campgrounds/:id so that it use /new first
router.get('/new', middlewares.isLoggedIn, (req, res) => {
    res.render('campgrounds/addCampgrounds')
})

// SHOW A CAMPGROUD
router.get('/:id', (req, res) => {
    // console.log(req.params.id) //req.params get info from URL. req.body get infor from POST method
    Campground.findById(req.params.id).populate('comments').exec(function (err, foundCampground) {
        if (err) { 
            req.flash('error', err.message) 
            res.redirect('/campgrounds')
        }
        else {
            res.render('campgrounds/show', { campgrounds: foundCampground })
        }
    })
})

//EDIT A CAMPGROUND
router.get('/:id/edit', middlewares.checkCampgroundOwnership, (req,res)=>{
    Campground.findById(req.params.id,(err,campground)=>{
        if(err){
            req.flash('error', err.message)
            redirect('/campgrounds')
        }
        res.render('campgrounds/editCampground',{campground: campground})
        
    })
    
})

router.put('/:id', middlewares.checkCampgroundOwnership,(req,res)=>{
    Campground.findByIdAndUpdate(req.params.id,req.body.campground,(err, updatedCampground)=>{
        if(err){
            req.flash('error', err.message)
            res.redirect('/campgrounds')
        }
        else{
            Campground.findById(req.params.id).populate('comments').exec(function (err, foundCampground) {
                if (err) { 
                    req.flash('error', err.message) 
                    res.redirect('/campgrounds')
                }
                else {
                    req.flash('success','You have edited your campground') 
                    res.render('campgrounds/show', { campgrounds: foundCampground })
                }
            })
        }
    })  
})

//DELETE A CAMPGROUND
router.delete('/:id',middlewares.checkCampgroundOwnership,(req,res)=>{
    Campground.findByIdAndRemove(req.params.id,(err)=>{
        if(err){
            req.flash('error', err.message) 
            res.redirect('/campgrounds')
        }
        req.flash('success','You have deleted a campground') 
        res.redirect('/campgrounds')
    })
})

module.exports = router