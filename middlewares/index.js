var Campground = require('../models/campground')
var Comment = require('../models/comment')

let middlewareObj = {}

middlewareObj.checkCommentOwnership = function(req,res,next){
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

middlewareObj.isLoggedIn = function(req,res,next){
    if(req.isAuthenticated()){
        return next()
    }
    
    req.flash('error','You need to login first')
    res.redirect('/login')
}

middlewareObj.checkCampgroundOwnership = function(req,res,next){
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
module.exports = middlewareObj