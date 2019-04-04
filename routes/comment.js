var express = require('express')
var router = express.Router({mergeParams:true})
var Campground = require('../models/campground')
var Comment = require('../models/comment')

router.get('/new', isLoggedIn, (req, res) => {
    Campground.findById(req.params.id, (err, foundCampground) => {
        if (err) { throw err }
        else {
            res.render('./comments/new', { campgrounds: foundCampground })
        }
    })
})

router.post('/', isLoggedIn, (req, res) => {
    Campground.findById(req.params.id, (err, foundCampground) => {
        if (err) { throw err }
        else {
            Comment.create(req.body.comment, (err, createdComment) => {
                if (err) { throw err }
                else {
					createdComment.author._id = req.user._id
					createdComment.author.username = req.user.username
					createdComment.save()
					console.log(createdComment)
                    foundCampground.comments.push(createdComment);
                    foundCampground.save();
                    res.redirect('/campgrounds/' + foundCampground._id)
                }
            })
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