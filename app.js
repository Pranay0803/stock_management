require("dotenv").config
var express = require("express"),
    app = express(),
    bodyParser = require("body-parser"),
    mongoose = require("mongoose"),
    flash = require("connect-flash"),
    passport = require("passport"),
    LocalStrategy = require("passport-local"),
    methodOverride = require("method-override"),
    passportLocalMongoose = require("passport-local-mongoose");

var User = require("./models/user"),
    Dealer = require("./models/dealer"),
    Category = require("./models/category"),
    Supplier = require("./models/supplier");
    Record = require("./models/records");

var middleware = require("./middleware");

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
app.use(flash())

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
    res.locals.success = req.flash("success");
    res.locals.error = req.flash("error");
    next()
})


//=======Routes==============
app.get("/", (req, res) => {
    res.render("landing")
})
app.get("/home", middleware.isLoggedIn, (req, res) => {
    Dealer.find({}, (err, dealer) => {
        if(err) {
            console.log(err);
            res.redirect("/")
        } else {
            Supplier.find({}, (err, supplier) => {
                if(err) {
                    console.log(err);
                    res.redirect("/")
                } else {
                    const dealerscount = Object.keys(dealer).length;
                    const supplierscount = Object.keys(supplier).length;
                    console.log(supplierscount);
                    console.log(dealerscount)
                    res.render("home", {dealerscount: dealerscount, supplierscount: supplierscount})
                }
            })
        }
    })
    
})
app.get("/sales", middleware.isLoggedIn, (req, res) => {
    Category.find({}, (err, category) => {
        if(err) {
            req.flash("error", err.message)
            res.redirect("/sales");
        } else {
            res.render("sales", {categories: category, option: "Yearly"})
        }
    })
})
app.get("/stocks/sales", middleware.isLoggedIn, (req, res) => {
    var dealer = [];
    var amount = 0;
    var quantity = 0;
    const option = req.query.name;
    // Record.find({category: categ}, (err, records) => {
    //     if(err) {
    //         req.flash("error", err.message)
    //         res.redirect("/stocks");
    //     } else {
            Category.find({}, (err, category) => {
                if(err) {
                    req.flash("error", err.message)
                    res.redirect("/sales");
                } else {
                    res.render("sales", {categories: category, option: option})
                }
            })
//         }
     })
// })


app.get("/dealer/new",  middleware.isLoggedIn, (req, res) => {
    res.render("newdealer")
})
app.post("/dealer/new",  middleware.isLoggedIn, (req, res) => {
    const newDealer = {
        companyname: req.body.companyname,
        fname: req.body.fname,
        lname: req.body.lname,
        category: req.body.category,
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
            req.flash("error", err.message)
            res.redirect("/home") 
        } else {
            req.flash("success", "Added a new Dealer")
            res.redirect("/home")
        }
    })
})

app.get("/supplier/new",  middleware.isLoggedIn, (req, res) => {
    res.render("newsupplier")
})
app.post("/supplier/new",  middleware.isLoggedIn, (req, res) => {
    const newSupplier = {
        companyname: req.body.companyname,
        fname: req.body.fname,
        lname: req.body.lname,
        category: req.body.category,
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
            req.flash("error", err.message)
            res.redirect("/home")
        } else {
            req.flash("success", "Added a new Dealer")
            res.redirect("/home")
        }
    })
})

app.get("/dealer",  middleware.isLoggedIn, (req, res) => {
    Dealer.find({}, (err, dealers) => {
        if(err) {
            req.flash("error", err.message)
            res.redirect("/home")
        } else {
            res.render("showDealer", {dealers: dealers})
        }
    })  
})

app.get("/supplier", middleware.isLoggedIn, (req, res) => {
    Supplier.find({}, (err, suppliers) => {
        if(err) {
            req.flash("error", err.message)
            res.redirect("/home")
        } else {
            res.render("showSupplier", {suppliers: suppliers})
        }
    })  
})

app.delete("/dealer/:id/", middleware.isLoggedIn, (req, res) => {
    Dealer.findById(req.params.id, (err, dealer) => {
        if(err) {
            req.flash("error", err.message)
            res.redirect("/dealer");
        } else {
            dealer.remove();
            req.flash("success", "Successfully Removed Dealer !!")
            res.redirect("/dealer");
        }
    })
})

app.delete("/supplier/:id/", middleware.isLoggedIn, (req, res) => {
    Supplier.findById(req.params.id, (err, supplier) => {
        if(err) {
            req.flash("error", err.message)
            res.redirect("/supplier");
        } else {
            supplier.remove();
            req.flash("success", "Successfully Removed Supplier !!")
            res.redirect("/supplier");
        }
    })
})
app.get("/stocks", middleware.isLoggedIn, (req, res) => {
    var dealer = [];
    var amount = 0;
    var quantity = 0;
    const categ = "Automobile";
    Category.find({}, (err, category) => {
        if(err) {
            req.flash("error", err.message)
            res.redirect("/home");;
        } else {
            Record.find({category: categ}, (err, records) => {
                if(err) {
                    req.flash("error", err.message)
                    res.redirect("/stocks");
                } else {
                    records.forEach((record) => {
                        dealer.push(record.dealer) ;
                        amount += record.amount;
                        quantity += record.quantity;
                    })
                    res.render("showstocks", {categories: category, selectedCateg: categ, dealer: dealer, payment: amount, quantity: quantity})
                }
            })
        }
    })
}) 

app.get("/stocks/category", middleware.isLoggedIn, (req, res) => {
    var dealer = [];
    var amount = 0;
    var quantity = 0;
    const categ = req.query.name;
    Record.find({category: categ}, (err, records) => {
        if(err) {
            req.flash("error", err.message)
            res.redirect("/stocks");
        } else {
            Category.find({}, (err, category) => {
                if(err) {
                    req.flash("error", err.message)
                    res.redirect("/stocks");
                } else {
                    records.forEach((record) => {
                        dealer.push(record.dealer) ;
                        amount += record.amount;
                        quantity += record.quantity;
                    })
                    res.render("showstocks", {categories: category, selectedCateg: categ, dealer: dealer, payment: amount, quantity: quantity})
                }
            })
        }
    })
})

app.get("/stocks/newcategory", middleware.isLoggedIn, (req, res) => {
    res.render("newcategory")
}) 
app.get("/stocks/newrecords", middleware.isLoggedIn, (req, res) => {
    Category.find({}, (err, category) => {
        if(err) {
            req.flash("error", err.message)
            res.redirect("/stocks");
        } else {
            Dealer.find({}, (err, dealer) => {
                if(err) {
                    req.flash("error", err.message)
                    res.redirect("/stocks");
                } else {
                    res.render("newrecord", {dealers: dealer, categories: category})
                }
            })
        }
    })
})

app.post("/stocks/newrecords", middleware.isLoggedIn, (req, res) => {
    
    const newrecord = {
        dealer: req.body.dealer,
        category: req.body.category,
        quantity: req.body.quantity,
        amount: req.body.amount,
        TransactionDate: req.body.date
    }
    Record.create(newrecord, (err, record) => {
        if(err) {
            req.flash("error", err.message)
            res.redirect("/stocks");
        } else {
            req.flash("success", "New Record Added !!")
            res.redirect("/stocks")
        }
    })
})

app.post("/stocks/newcategory", middleware.isLoggedIn, (req, res) => {
    Category.create( {name: req.body.name}, (err, category) => {
        if(err) {
            req.flash("error", err.message)
            res.redirect("/stocks")
        } else {
            req.flash("success", "New category successfully added !!")
            res.redirect("/stocks")
        }
    })
})



app.get("/register", (req, res) => {
    res.render("register")
})
app.post("/register", (req, res) => {
    const newUser = new User({username: req.body.username})
    User.register(newUser, req.body.password, function(err, user) {
        if(err) {
            req.flash("error", err.message)
            res.redirect("/register")
        } else {
            passport.authenticate("local")(req, res, function() {
                req.flash("success", "Welcome "+ user.username+" !!")
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
    req.flash("success", "Successfully logged out !!")
    res.redirect("/")
})
    



app.listen(3000, () => {
    console.log("Server started")
})