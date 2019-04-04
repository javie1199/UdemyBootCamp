const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const mongoose = require('mongoose')
const Campground = require('./models/campground')
const Comment = require('./models/comment')
const seedDB = require('./seed')
const LocalStrategy = require('passport-local')
const passport = require('passport')
const passportLocalMongoose = require('passport-local-mongoose')
const User = require('./models/user')

// seedDB()
//create or connect to mongodb database
mongoose.connect("mongodb://localhost/yelp_camp", { useNewUrlParser: true })

//Using bodyParser for get info from POST method
app.use(bodyParser.urlencoded({ extended: true }))
app.use(express.static(__dirname + "/public"))
// console.log(__dirname + "/public")

//PASSPORT CONFIGURATION
app.use(require('express-session')({
    secret: "Hello this is authenticate function",
    resave: false,
    saveUninitialized: false
}))



app.use(passport.initialize())
app.use(passport.session())

passport.use(new LocalStrategy(User.authenticate()))
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


app.use(function(req,res,next){
    res.locals.currentUser = req.user
    next()
})

//Looking for files with ending .ejs. keep render without .ejs
app.set('view engine', 'ejs')

app.get('/', (req, res) => {
    res.render('landing') //langding.ejs file created in views folder
})

app.get('/campgrounds', (req, res) => {
    Campground.find({}, function (err, allCampgrounds) {
        if (err) { console.log(err) }
        else { res.render('index', { campgrounds: allCampgrounds }) } //passing object campground :{ All Campgrounds }. Using ejs to fetch them.
    })


})

//put get campgrounds/new before campgrounds/:id so that it use /new first
app.get('/campgrounds/new', (req, res) => {
    res.render('addCampgrounds')
})

app.get('/campgrounds/:id', (req, res) => {
    // console.log(req.params.id) //req.params get info from URL. req.body get infor from POST method
    Campground.findById(req.params.id).populate('comments').exec(function (err, foundCampground) {
        if (err) { console.log(err) }
        else {
            // console.log(foundCampground)
            res.render('show', { campgrounds: foundCampground })
        }
    })
})

app.post('/campgrounds', (req, res) => {
    var name = req.body.name
    var image = req.body.image
    var desc = req.body.description
    var newCampground = { name: name, image: image, description: desc }
    console.log(newCampground)
    try {
        Campground.create(newCampground)
    } catch (error) {
        console.log(error)
    } finally { res.redirect('/campgrounds') }


})

app.get('/campgrounds/:id/comments/new', isLoggedIn, (req, res) => {
    Campground.findById(req.params.id, (err, foundCampground) => {
        if (err) { throw err }
        else {
            res.render('./comments/new', { campgrounds: foundCampground })
        }
    })
})

app.post('/campgrounds/:id/comments', isLoggedIn, (req, res) => {
    Campground.findById(req.params.id, (err, foundCampground) => {
        if (err) { throw err }
        else {
            Comment.create(req.body.comment, (err, createdComment) => {
                if (err) { throw err }
                else {
                    foundCampground.comments.push(createdComment);
                    foundCampground.save();
                    res.redirect('/campgrounds/' + foundCampground._id)
                }
            })
        }
    })
})

//=========
// AUTHENTICATE ROUTE
//=========

app.get('/register', (req, res) => {
    res.render('register')
})

app.post('/register', (req, res) => {
    var newUser = new User({ username: req.body.username })
    User.register(newUser, req.body.password, (err, user) => {
        if (err) {
            console.log(err)
            return res.render('register')
        }
        passport.authenticate('local')(req, res, () => {
            res.redirect('/campgrounds')
        })
    })
})

app.get('/login', (req, res) => {
    res.render('login')
})

app.post('/login', passport.authenticate('local', {
    successRedirect: '/campgrounds',
    failureRedirect: '/login'
    }), (req, res) => {
})

app.get('/logout',(req,res)=>{
    req.logOut()
    res.redirect('/campgrounds')
})

function isLoggedIn(req,res,next){
    if(req.isAuthenticated()){
        return next()
    }
    res.redirect('/login')
}

const PORT = 5000
app.listen(PORT, () => {
    console.log(`Server starts at port : ${PORT}`)
})