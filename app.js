require("dotenv").config
var express = require("express"),
	app = express(),
    bodyParser = require("body-parser"),
    mongoose = require("mongoose"),
    passport = require("passport"),
    LocalStrategy = require("passport-local"),
    methodOverride = require("method-override"),
    passportLocalMongoose = require("passport-local-mongoose");

var User = require("./models/user"),
    Dealer = require("./models/dealer"),
    Supplier = require("./models/supplier");

//mongoose.connect("mongodb://localhost:27017/website")
mongoose.connect("mongodb+srv://Aznan:Aznan@1234@cluster0-vryyw.mongodb.net/stockmanagement?retryWrites=true&w=majority", {
    useNewUrlParser: true, useUnifiedTopology: true })
//mongoose.connect(process.env.databaseUrl, { useNewUrlParser: true});


// User.create({
//     username: "AznanKhan",
//     password: "password"
// }, (err, user) => {
//     if(err) {
//         console.log(err)
//     } else {
//         console.log("Added to database")
//     }
// })

app.use(bodyParser.urlencoded({extended: false}))

//passport configurations
app.use(require("express-session")({
	secret: "Fav is SRK",
	resave: false,
	saveUninitialized: false
}));

app.use(passport.initialize())
app.use(passport.session())
passport.use(new LocalStrategy(User.authenticate()))
passport.serializeUser(User.serializeUser())
passport.deserializeUser(User.deserializeUser())

app.set("view engine", "ejs")
app.use(methodOverride("_method"))
app.use(express.static(__dirname + '/public'));
app.use((req, res, next) => {
    res.locals.currentUser = req.user
    next()
})

//=======Routes==============
app.get("/", (req, res) => {
    res.render("landing")
})
app.get("/home", (req, res) => {
	res.render("home")
})
app.get("/dealer/new", (req, res) => {
    res.render("newdealer")
})
app.post("/dealer/new", (req, res) => {
    const newDealer = {
        companyname: req.body.companyname,
        fname: req.body.fname,
        lname: req.body.lname,
        address: req.body.address,
        city: req.body.city,
        state: req.body.state,
        zip: req.body.zip,
        email: req.body.email,
        contact: req.body.contact,
        website: req.body.website 
    }
    Dealer.create(newDealer, (err, newdealer) => {
        if(err) {
            console.log(err) 
        } else {
            res.redirect("/home")
        }
    })
})

app.get("/supplier/new", (req, res) => {
    res.render("newsupplier")
})
app.post("/supplier/new", (req, res) => {
    const newSupplier = {
        companyname: req.body.companyname,
        fname: req.body.fname,
        lname: req.body.lname,
        address: req.body.address,
        city: req.body.city,
        state: req.body.state,
        zip: req.body.zip,
        email: req.body.email,
          
        
          contact: req.body.contact,
        website: req.body.website  
    }
    Supplier.create(newSupplier, (err, newsupplier) => {
        if(err) {
            console.log(err) 
        } else {
            res.redirect("/home")
        }
    })
})

app.get("/dealer", (req, res) => {
    Dealer.find({}, (err, dealers) => {
        if(err) {
            console.log(err)
        } else {
            res.render("showDealer", {dealers: dealers})
        }
    })  
})

app.get("/supplier", (req, res) => {
    Supplier.find({}, (err, suppliers) => {
        if(err) {
            console.log(err)
        } else {
            res.render("showSupplier", {suppliers: suppliers})
        }
    })  
})

app.delete("/dealer/:id/", (req, res) => {
    Dealer.findById(req.params.id, (err, dealer) => {
        if(err) {
            console.log(err);
            res.redirect("/dealer");
        } else {
            dealer.remove();
            res.redirect("/dealer");
        }
    })
})

app.delete("/supplier/:id/", (req, res) => {
    Supplier.findById(req.params.id, (err, supplier) => {
        if(err) {
            console.log(err);
            res.redirect("/supplier");
        } else {
            console.log(supplier)
            supplier.remove();
            res.redirect("/supplier");
        }
    })
})
app.get("/stocks", (req, res) => {
    res.render("showstocks")
}) 
app.get("/register", (req, res) => {
    res.render("register")
})
app.post("/register", (req, res) => {
    const newUser = new User({username: req.body.username})
    User.register(newUser, req.body.password, function(err, user) {
        if(err) {
            console.log(err)
            res.redirect("/register")
        } else {
            passport.authenticate("local")(req, res, function() {
                res.redirect("/home")
            })
        }
    })
})

app.get("/login", (req, res) => {
    res.render("login")
})

app.post("/login", passport.authenticate("local", {
    successRedirect: "/home",
    failureRedirect: "/login"
}), function(req, res) {

})

app.get("/logout", (req, res) => {
    req.logout()
    res.redirect("/")
})
    



app.listen(3000, () => {
	console.log("Server started")
})