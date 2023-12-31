const express = require("express");
const myposts = require("./data");
const mongoose = require("mongoose")
const bodyParser = require("body-parser");
require("dotenv").config();

const app = express();

app.use(bodyParser.urlencoded({ extended: true }));

const url = process.env.url;

mongoose.connect(url).then(() => {
    console.log("DB connected");
}).catch(() => {

});

const blogSchema = new mongoose.Schema({
    title : String,
    imageURL : String,
    description : String 
});

const Blog = new mongoose.model("blog",blogSchema);



app.set('view engine', 'ejs');
app.use(express.static('public'));

app.get("/", (req, res) => {
    // res.render("index");
    Blog.find({}).then((arr) => {
        res.render("index", { posts: arr })
    }).catch(() => {
        console.log("Connot find blogs");
        res.redirect("404")
    });

    // res.render("index", { posts: myposts })
})

app.get("/contact", (req, res) => {
    res.render("contact");
})

app.get("/about", (req, res) => {
    res.render("about")
})

app.get("/compose", (req, res) => {
    res.render("compose")
})

app.post("/compose", (req, res) => {
    const img = req.body.imageUrl;
    const title = req.body.title;
    const discription = req.body.description;

    const newBlog = new Blog( {
        // _id: myposts.length + 1,
        imgageURL: img,
        title: title,
        description: discription
    })

    newBlog.save().then(() => {
        console.log("Blog posted succesfully");
    }).catch(() => {
        console.log("Blog posted unsuccesfully")
    });


    // myposts.push(obj);

    res.redirect("/");
})

app.get("/post/:id", (req, res) => {

    
    const id = req.params.id;


    myposts.forEach(post => {
        if (post._id === id) {
            res.render("/post", { post: post })
        }
    })



})

app.get("/login", (req, res) => {
    res.render("login")
})


const PORT = process.env.PORT;
app.listen(4000 || PORT, () => {
    console.log("Server is running on port 4000");

})