var Campground = require('../models/campground')
var Comment = require('../models/comment')

let middlewareObj = {}

middlewareObj.checkCommentOwnership = function(req,res,next){
	if(req.isAuthenticated()){
		Comment.findById(req.params.comment_id, (err, foundComment)=>{
            if(err){
                req.flash('error','Comment not found')
                res.redirect('back')
            }
			else{
				if(foundComment.author._id.equals(req.user._id)){
					return next()
				}
				else{
                    req.flash('error','You need permission to do that')
					res.redirect('back')
				}
				
			}
		})
	}else{
        req.flash('error','You need to login to do that')
		res.redirect('back')
	}
}

middlewareObj.isLoggedIn = function(req,res,next){
    if(req.isAuthenticated()){
        return next()
    }
    req.flash('error','You need to login to do that')
    res.redirect('/login')
}

middlewareObj.checkCampgroundOwnership = function(req,res,next){
    if(req.isAuthenticated()){
        Campground.findById(req.params.id,(err, foundCampground)=>{
            if(err){
                req.flash('error','Campground not found')
                res.redirect('back')
            }else{
                if(foundCampground.author._id.equals(req.user._id)){
                    return next()
                 }
                 else{
                    req.flash('error','You need permission to do that')
                    res.redirect("back")
                 }
            }
        })
    }else{
        req.flash('error','You need to login to do that')
        res.redirect("back")
    }
    
}
module.exports = middlewareObj