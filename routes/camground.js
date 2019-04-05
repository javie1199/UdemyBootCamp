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
    res.render('addCampgrounds')
})

// SHOW A CAMPGROUD
router.get('/:id', (req, res) => {
    // console.log(req.params.id) //req.params get info from URL. req.body get infor from POST method
    Campground.findById(req.params.id).populate('comments').exec(function (err, foundCampground) {
        if (err) { console.log(err) }
        else {
            // console.log(foundCampground)
            res.render('show', { campgrounds: foundCampground })
        }
    })
})

function isLoggedIn(req,res,next){
    if(req.isAuthenticated()){
        return next()
    }
    res.redirect('/login')
}
module.exports = router