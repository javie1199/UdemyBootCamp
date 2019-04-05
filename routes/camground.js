var express = require('express')
var router = express.Router()
var Campground = require('../models/campground')

//SHOW CAMPGROUNDS
router.get('/', (req, res) => {
    Campground.find({}, function (err, allCampgrounds) {
        if (err) { console.log(err) }
        else { res.render('index', { campgrounds: allCampgrounds }) } //passing object campground :{ All Campgrounds }. Using ejs to fetch them.
    })


})

//CREATE A CAMPGROUND
router.post('/', isLoggedIn, (req, res) => {
    var name = req.body.name
    var image = req.body.image
    var desc = req.body.description
    var author = {
        _id: req.user._id,
        username: req.user.username
    }
    var newCampground = { name: name, image: image, description: desc, author: author }
    // console.log(newCampground)
    // console.log(req)
    try {
        Campground.create(newCampground)
    } catch (error) {
        console.log(error)
    } finally { res.redirect('/campgrounds') }


})

// ADD A CAMGROUND
//put get campgrounds/new before campgrounds/:id so that it use /new first
router.get('/new', isLoggedIn, (req, res) => {
    res.render('campgrounds/addCampgrounds')
})

// SHOW A CAMPGROUD
router.get('/:id', (req, res) => {
    // console.log(req.params.id) //req.params get info from URL. req.body get infor from POST method
    Campground.findById(req.params.id).populate('comments').exec(function (err, foundCampground) {
        if (err) { console.log(err) }
        else {
            // console.log(foundCampground)
            res.render('campgrounds/show', { campgrounds: foundCampground })
        }
    })
})

//EDIT A CAMPGROUND
router.get('/:id/edit', checkCampgroundOwnership, (req,res)=>{
    Campground.findById(req.params.id,(err,campground)=>{
        if(err){
            console.log(err)
            redirect('/campgrounds')
        }
        res.render('campgrounds/editCampground',{campground: campground})
        
    })
    
})

router.put('/:id',checkCampgroundOwnership,(req,res)=>{
    // console.log(req.body.campground)
    Campground.findByIdAndUpdate(req.params.id,req.body.campground,(err, updatedCampground)=>{
        Campground.findById(req.params.id).populate('comments').exec(function (err, foundCampground) {
            if (err) { console.log(err) }
            else {
                console.log(foundCampground)
                res.render('campgrounds/show', { campgrounds: foundCampground })
            }
        })
    })  
})

//DELETE A CAMPGROUND
router.delete('/:id',checkCampgroundOwnership,(req,res)=>{
    Campground.findByIdAndRemove(req.params.id,(err)=>{
        if(err){
            console.log(err)
            res.redirect('/campgrounds')
        }
        res.redirect('/campgrounds')
    })
})

function isLoggedIn(req,res,next){
    if(req.isAuthenticated()){
        return next()
    }
    res.redirect('/login')
}

function checkCampgroundOwnership(req,res,next){
    if(req.isAuthenticated()){
        Campground.findById(req.params.id,(err, foundCampground)=>{
            if(err){
                res.redirect('back')
            }else{
                if(foundCampground.author._id.equals(req.user._id)){
                    return next()
                 }
                 else{
                     console.log('You need authorize to edit/delete campground')
                     res.redirect("back")
                 }
            }
        })
    }else{
        console.log('You need to login to edit/delete campground')
        res.redirect("back")
    }
    
}

module.exports = router