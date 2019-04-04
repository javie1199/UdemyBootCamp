var express = require('express')
var router = express.Router()
var Campground = require('../models/campground')

router.get('/', (req, res) => {
    Campground.find({}, function (err, allCampgrounds) {
        if (err) { console.log(err) }
        else { res.render('index', { campgrounds: allCampgrounds }) } //passing object campground :{ All Campgrounds }. Using ejs to fetch them.
    })


})

router.post('/', (req, res) => {
    var name = req.body.name
    var image = req.body.image
    var desc = req.body.description
    var newCampground = { name: name, image: image, description: desc }
    console.log(newCampground)
    try {
        Campground.create(newCampground)
    } catch (error) {
        console.log(error)
    } finally { res.redirect('/') }


})

//put get campgrounds/new before campgrounds/:id so that it use /new first
router.get('/new', (req, res) => {
    res.render('addCampgrounds')
})

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

module.exports = router