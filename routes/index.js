var express = require('express')
var router = express.Router()
var User = require('../models/user')
const passport = require('passport')


router.get('/', (req, res) => {
    res.render('landing') //langding.ejs file created in views folder
})
//=========
// AUTHENTICATE ROUTE
//=========

//GET REGISTER PAGE
router.get('/register', (req, res) => {
    res.render('users/register',{page: 'register'})
})

// SUBMIT REGISTER FORM
router.post('/register', (req, res) => {
    var newUser = new User({ username: req.body.username })
    if(req.body.adminCode === '123') {
        newUser.isAdmin = true;
      }
    User.register(newUser, req.body.password, (err, user) => {
        if (err) {
            req.flash('error', err.message)
            return res.redirect('/register')
        }
        passport.authenticate
            ('local',{ failureRedirect: '/register' })
            (req, res, () => { 
                req.flash('success','Welcome to YelpCamp ' + req.body.username)
                res.redirect('/campgrounds') 
            })
    })
})

// GET LOGIN PAGE
router.get('/login', (req, res) => {
    res.render('users/login',{page: 'login'})
})

// SUBMIT LOGIN PAGE FORM
router.post('/login', passport.authenticate
    ('local', {
        failureRedirect: '/login',
        failureFlash: true
    }), (req, res, ) => {
            req.flash('success','Welcome to YelpCamp ' + req.user.username)
            res.redirect('/campgrounds')
})

// CLICK LOGOUT BUTTON
router.get('/logout',(req,res)=>{
    req.logOut()
    req.flash('success','You have logged out')
    res.redirect('/campgrounds')
})

module.exports = router