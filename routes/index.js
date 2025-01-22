var express = require('express');
var router = express.Router();
const userModel = require("./users");
const postModel = require("./posts");
const passport = require('passport');
const upload = require("./multer");

const localStrategy = require('passport-local');
passport.use(new localStrategy(userModel.authenticate()));

router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get('/login', function(req, res, next) {
  res.render('login',{error: req.flash('error')});
});

router.get('/feed',isLoggedIn, async function(req, res, next) {
  const user = await userModel.findOne({username: req.session.passport.user});
  const posts = await postModel.find()
  .populate("user")
  res.render('feed' ,{user, posts});
});

router.post('/addpost',isLoggedIn, upload.single("postimage"), async function(req, res, next) {
  // if(!req.file){
  //   return res.status(404).send("no files were given");
  // }
  const user = await userModel.findOne({username: req.session.passport.user});

  const post = await postModel.create(
    {
      image: req.file.filename,
      title: req.body.posttitle,
      description: req.body.postdesc,
      user: user._id
    });

    user.posts.push(post._id); //basically telling user model that post has been created and pushing post's id in posts array of user model
    await user.save();
    res.redirect("/profile");
});  


router.get('/add',isLoggedIn,async function(req, res, next) {
  const user = await userModel.findOne({username: req.session.passport.user});
  res.render("add", {user});
});

router.post('/fileupload',isLoggedIn, upload.single("profileimage"), async function(req, res, next) {
  const user = await userModel.findOne({username: req.session.passport.user}); //based on username , we are finding user. -> req.session.passport.user contains user when the user is logged in
    user.dp = req.file.filename;
    await user.save();
    res.redirect("/profile");
    
});

//This route displays the user's profile, but only if they are logged in (handled by isLoggedIn middleware)
router.get('/profile', isLoggedIn ,async function(req, res, next){
  const user = await userModel.findOne({
    username: req.session.passport.user
  })
  .populate("posts")

  res.render('profile', {user}); //sending user's data on profile page 
})

router.post('/register', function(req, res) {
  const { username, email, fullname } = req.body;//req.body contains all the submitted form data (from the registration form) as key-value pairs
  const userData = new userModel({ username, email, fullname });
  
  userModel.register(userData, req.body.password)
  .then(function(){
    passport.authenticate("local")(req, res, function(){
      res.redirect("/profile")
    })
  })
});

router.post('/login',passport.authenticate("local", {
  successRedirect:"/profile",
  failureRedirect:"/login",
  failureFlash: true
}), function(req, res) {
});

router.get("/logout", function(req, res, next){
  req.logout(function(err){
    if(err) {return next(err);}
    res.redirect('/')
  });
})

function isLoggedIn(req, res, next){
  if(req.isAuthenticated()){
    return next();
  } 
  res.redirect("/login");
}

module.exports = router;
