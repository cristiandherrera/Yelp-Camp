const express = require("express"),
	 app = express(),
	 bodyParser = require("body-parser"),
	 mongoose = require('mongoose'),
	 flash = require("connect-flash"),
	 passport = require("passport"),
	 LocalStrategy = require("passport-local"),
	 methodOverride = require("method-override"),
	 Campground = require("./models/campground"),
	 Comment = require("./models/comment"),
	 User = require("./models/user"),
	 seedDB = require("./seeds")

// requiring routes
const commentRoutes = require("./routes/comments"),
	campgroundRoutes = require("./routes/campgrounds"),
	indexRoutes = require("./routes/index")

mongoose.connect('mongodb://localhost:27017/yelp_camp_v12', {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log('Connected to DB!'))
.catch(error => console.log(error.message));
// mongoose.connect('mongodb+srv://cristiandherrera:XBJjPio6gVLMrimK@cluster0.byueb.mongodb.net/<dbname>?retryWrites=true&w=majority', {
//   useNewUrlParser: true,
//   useUnifiedTopology: true
// })
// .then(() => console.log('Connected to DB!'))
// .catch(error => console.log(error.message));

app.use(bodyParser.urlencoded({extended:true}));
app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));
app.use(methodOverride("_method"));
app.use(flash());

// seedDB(); //seed the database

// PASSPORT CONFIGURATION
app.use(require("express-session")({
	secret: "I seriously do not feel good... someone help me...",
	resave: false,
	saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(function(req, res, next){
	res.locals.currentUser = req.user;
	res.locals.error = req.flash("error");
	res.locals.success = req.flash("success");
	next();
});

app.use("/", indexRoutes);
app.use("/campgrounds", campgroundRoutes);
app.use("/campgrounds/:id/comments", commentRoutes);

const port = process.env.PORT || 3000;
 app.listen(port, function () {
   console.log("Server Has Started!");
 });

