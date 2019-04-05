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

router.get('/register', (req, res) => {
    res.render('users/register')
})

router.post('/register', (req, res) => {
    var newUser = new User({ username: req.body.username })
    User.register(newUser, req.body.password, (err, user) => {
        if (err) {
            console.log(err)
            return res.render('users/register')
        }
        passport.authenticate('local')(req, res, () => {
            res.redirect('/campgrounds')
        })
    })
})

router.get('/login', (req, res) => {
    res.render('users/login')
})

router.post('/login', passport.authenticate('local', {
    successRedirect: '/campgrounds',
    failureRedirect: '/login'
    }), (req, res) => {
})

router.get('/logout',(req,res)=>{
    req.logOut()
    res.redirect('/campgrounds')
})

function isLoggedIn(req,res,next){
    if(req.isAuthenticated()){
        return next()
    }
    res.redirect('/login')
}

module.exports = router