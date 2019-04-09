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
    res.render('users/register')
})

// SUBMIT REGISTER FORM
router.post('/register', (req, res) => {
    var newUser = new User({ username: req.body.username })
    User.register(newUser, req.body.password, (err, user) => {
        if (err) {
            req.flash('error', err.message)
            return res.redirect('register')
        }
        passport.authenticate
            ('local',{ failureRedirect: '/register' })
            (req, res, () => { res.redirect('/campgrounds') })
    })
})

// GET LOGIN PAGE
router.get('/login', (req, res) => {
    res.render('users/login')
})

// SUBMIT LOGIN PAGE FORM
router.post('/login', passport.authenticate('local', {
    successRedirect: '/campgrounds',
    failureRedirect: '/login'
    }), (req, res) => {
})

// CLICK LOGOUT BUTTON
router.get('/logout',(req,res)=>{
    req.logOut()
    req.flash('success','You have logged out')
    res.redirect('/campgrounds')
})

module.exports = router