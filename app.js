const express=require('express');
const expressLayouts=require('express-ejs-layouts');
const fileUpload=require('express-fileupload');
const session= require('express-session')
const cookieParser= require('cookie-parser')
const flash=require("connect-flash");
const passport=require('passport');
const LocalStrategy=require('passport-local');
const User=require('./server/models/user');

const userRoutes=require('./server/routes/users');
const app=express();
const port=process.env.PORT || 3000;

require('dotenv').config();

app.use(express.urlencoded({extended:true}));
app.use(express.static('public'));
app.use(expressLayouts);

app.use (cookieParser('CodeChimpsSecure'));
app.use(session({
    secret:'CodeChimpsSecretSession',
    saveUninitialized:true,
    resave:true
}));

app.use(flash());
app.use(fileUpload());

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req,res,next)=>{
    res.locals.currentUser=req.user;
    res.locals.success=req.flash('success');
    res.locals.error=req.flash('error');
    next();
});

app.set('layout','./layouts/main');
app.set('view engine','ejs');

const routes=require('./server/routes/cpRoutes.js');
app.use('/',routes);
app.use('/',userRoutes);

app.listen(port,()=>console.log(`Listening to port ${port}`));
