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
const methodOverride = require('method-override')
const flash = require('connect-flash')
const CampgroundRoutes = require('./routes/camground')
const CommentRoutes = require('./routes/comment')
const IndexRoutes = require('./routes/index')

//USING SEEDDB TO CREATE MOCK DATA
// seedDB()

//create or connect to mongodb database
mongoose.connect("mongodb://localhost/yelp_camp", { useNewUrlParser: true })

//Using bodyParser for get info from POST method
app.use(bodyParser.urlencoded({ extended: true }))
app.use(express.static(__dirname + "/public"))
// console.log(__dirname + "/public")

// app.use(flash());  comes before your passport configuration in app.js
app.use(flash())

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

//SETING USER ACCESS TO FETCH THE USER DATA
app.use(function(req,res,next){
    res.locals.currentUser = req.user
    next()
})

//USING METHOD OVERRIVE FOR PUT/DELETE ROUTE
app.use(methodOverride('_method'))

//Looking for files with ending .ejs. keep render without .ejs
app.set('view engine', 'ejs')

//SETTING UP TO SHORTEN THE ROUTE
app.use('/campgrounds',CampgroundRoutes)
app.use('/campgrounds/:id/comments',CommentRoutes)
app.use('/',IndexRoutes)


//SETTING SERVER UP
const PORT = 5000
app.listen(PORT, () => {
    console.log(`Server starts at port : ${PORT}`)
})