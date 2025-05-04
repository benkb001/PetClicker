const path = require("path");
const express = require('express');
const session = require('express-session')
const morgan = require('morgan');
const cookieParser = require("cookie-parser");
const app = express(); 

app.use(express.json()); 
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
    
app.set("view engine", "ejs");
app.set("views", path.resolve(__dirname, "templates"));
app.use(express.static('public'));
require("dotenv").config({
    path: path.resolve(__dirname, ".env"),
 });

const MONGO_CONNECTION_STRING = `mongodb+srv://${process.env.MONGO_DB_USERNAME}:${process.env.MONGO_DB_PASSWORD}@cmsc335.wrgderv.mongodb.net/?retryWrites=true&w=majority&appName=CMSC335`;

const { MongoClient, ServerApiVersion } = require("mongodb");

app.use(morgan('dev'));

app.get("/", (req, res) => {
    res.render('login');
});

app.use(session({
    resave: true,
    saveUninitialized: false,
    secret: process.env.SECRET
  }));

app.post("/login", async (req, res) => {
    const client = new MongoClient(MONGO_CONNECTION_STRING, { serverApi: ServerApiVersion.v1 });
    try {
        await client.connect(); 
        const database = client.db(process.env.MONGO_DB_NAME);
        const collection = database.collection(process.env.MONGO_COLLECTION);
        req.session.user = req.body.user;
        console.log("body user: " + req.body.user);
        let d = await collection.findOne({user: req.body.user});
        if (d == null) {
            req.session.coins = 0; 
            req.session.dogs = 1; 
            req.session.cats = 1;
            req.session.dogPics = ["https://images.dog.ceo/breeds/pariah-indian/The_Indian_Pariah_Dog.jpg"];
            req.session.catPics = ["https://cataas.com/cat/GPz9v7NpZ8F7xLFi?position=center"];
            await collection.insertOne({user: req.body.user, coins: 0, dogs: 1, cats: 1});
        } else {
            console.log("logged user: " + d.user);
            req.session.coins = d.coins; 
            req.session.dogs = d.dogs; 
            req.session.cats = d.cats; 
            req.session.dogPics = d.dogPics;
            req.session.catPics = d.catPics;  
        }
        res.redirect('/home');
    } finally {
        //await client.close();
    }
});

app.get("/home", async (req, res) => {
    res.render('index', {coins: req.session.coins ?? 0, dogs: req.session.dogs ?? 1, cats: req.session.cats ?? 1});
});

app.get("/getData", async (req, res) => {
    const client = new MongoClient(MONGO_CONNECTION_STRING, { serverApi: ServerApiVersion.v1 });
    try {
        await client.connect(); 
        const database = client.db(process.env.MONGO_DB_NAME);
        const collection = database.collection(process.env.MONGO_COLLECTION);
    } catch {
        res.status(404).send("error");
    } finally {
        //await client.close();
    }
    res.json({coins: coins, dogs: dogs, cats: cats});
});

app.post("/updateData", (req, res) => {
    req.session.coins = req.body.coins; 
    console.log("updated coins: " + req.session.coins);
    req.session.cats = req.body.cats; 
    req.session.dogs = req.body.dogs;
    console.log(" updating user: " + req.session.user);
    res.end(); 
});

app.post("/updateDogPics", (req, res) => {
    req.session.dogPics.push(req.body.dogPic);
    console.log(req.body.dogPic); 
    res.end(); 
});

app.post("/updateCatPics", (req, res) => {
    req.session.catPics.push(req.body.catPic);
    res.end(); 
});

app.post("/save", async (req, res) => {
    const client = new MongoClient(MONGO_CONNECTION_STRING, { serverApi: ServerApiVersion.v1 });
    try {
        await client.connect(); 
    
        const database = client.db(process.env.MONGO_DB_NAME);
        const collection = database.collection(process.env.MONGO_COLLECTION);
        await collection.updateOne({user: req.session.user}, 
            { $set: 
                {
                coins: req.session.coins, 
                dogs: req.session.dogs, 
                cats: req.session.cats,
                catPics: req.session.catPics, 
                dogPics: req.session.dogPics
                } 
            });
        } catch(e) {
            res.send(e); 
        } finally {
        //await client.close();
    }
    res.redirect('/home');
});

const buyRouter = require('./routes/buy');
const viewRouter = require('./routes/view');
app.use('/buy', buyRouter);
app.use('/view', viewRouter);

module.exports = app; 