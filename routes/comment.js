var express = require('express')
var router = express.Router({mergeParams:true})
var Campground = require('../models/campground')
var Comment = require('../models/comment')

//ADD NEW COMMENT
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
					// console.log(createdComment)
                    foundCampground.comments.push(createdComment);
                    foundCampground.save();
                    res.redirect('/campgrounds/' + foundCampground._id)
                }
            })
        }
    })
})

//EDIT A COMMENT
router.get('/:comment_id/edit', checkCommentOwnership, (req,res)=>{
    Comment.findById(req.params.comment_id, (err, foundComment)=>{
        if(err){
            console.log(err)
            res.redirect('back')
        }
        res.render('comments/editComment',{
            campground_id: req.params.id,
            comment: foundComment
        })
    })
    
})

router.put('/:comment_id', checkCommentOwnership, (req,res)=>{
    Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment, (err, updatedComment)=>{
        if(err){console.log(err); res.redirect('back')}
        else{
            res.redirect('/campgrounds/' + req.params.id)
        }
    })
})


// DELETE COMMENT
router.delete('/:comment_id',checkCommentOwnership,(req,res)=>{
    Comment.findByIdAndDelete(req.params.comment_id,(err)=>{
        if(err){console.log(err); res.redirect('back')}
        else{
            res.redirect('/campgrounds/' + req.params.id)
        }
    })
    
})

function isLoggedIn(req,res,next){
    if(req.isAuthenticated()){
        return next()
    }
    res.redirect('/login')
}

function checkCommentOwnership(req,res,next){
    if(req.isAuthenticated()){
        Comment.findById(req.params.comment_id, (err, foundComment)=>{
            if(err){console.log(err);res.redirect('back')}
            else{
                if(foundComment.author._id.equals(req.user._id)){
                    return next()
                }
                else{
                    console.log('You need authorize to edit/delete comments');
                    res.redirect('back')
                }
                
            }
        })
    }else{
        console.log('You need authorize to edit/delete comments');
        res.redirect('back')
    }
}


module.exports = router