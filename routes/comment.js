var express = require('express')
var router = express.Router({mergeParams:true})
var Campground = require('../models/campground')
var Comment = require('../models/comment')
var middlewares = require('../middlewares')

//ADD NEW COMMENT
router.get('/new', middlewares.isLoggedIn, (req, res) => {
    Campground.findById(req.params.id, (err, foundCampground) => {
        if (err) { 
            req.flash('error', err.message)  
            res.redirect('back')
        }
        else {
            res.render('./comments/new', { campgrounds: foundCampground })
        }
    })
})

router.post('/', middlewares.isLoggedIn, (req, res) => {
    Campground.findById(req.params.id, (err, foundCampground) => {
        if (err) { 
            req.flash('error', err.message) 
            res.redirect('back')
         }
        else {
            Comment.create(req.body.comment, (err, createdComment) => {
                if (err) { 
                    req.flash('error', err.message)  
                    res.redirect('back')
                }
                else {
					createdComment.author._id = req.user._id
					createdComment.author.username = req.user.username
					createdComment.save()
                    foundCampground.comments.push(createdComment);
                    foundCampground.save();
                    req.flash('success', 'You have added a new comment') 
                    res.redirect('/campgrounds/' + foundCampground._id)
                }
            })
        }
    })
})

//EDIT A COMMENT
router.get('/:comment_id/edit', middlewares.checkCommentOwnership, (req,res)=>{
    Comment.findById(req.params.comment_id, (err, foundComment)=>{
        if(err){
            req.flash('error', err.message) 
            res.redirect('back')
        }
        res.render('comments/editComment',{
            campground_id: req.params.id,
            comment: foundComment
        })
    })
    
})

router.put('/:comment_id', middlewares.checkCommentOwnership, (req,res)=>{
    Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment, (err, updatedComment)=>{
        if(err){
            req.flash('error', err.message)  
            res.redirect('back')
        }
        else{
            req.flash('success', 'You have editted your comment') 
            res.redirect('/campgrounds/' + req.params.id)
        }
    })
})


// DELETE COMMENT
router.delete('/:comment_id', middlewares.checkCommentOwnership,(req,res)=>{
    Comment.findByIdAndDelete(req.params.comment_id,(err)=>{
        if(err){
            req.flash('error', err.message) 
            res.redirect('back')
        }
        else{
            req.flash('success','You have deleted a comment') 
            res.redirect('/campgrounds/' + req.params.id)
        }
    })
    
})

module.exports = router