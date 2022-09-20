//jshint esversion:6
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require('mongoose');

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

mongoose.connect("mongodb://localhost:27017/wikiDB");

const articleSchema = {
    title: String,
    content: String
};

const Article = mongoose.model("Article", articleSchema);

app.route("/articles")

    .get(function (req, res) {
        Article.find({}, function (err, foundArticles) {
            if (!err) {
                res.send(foundArticles);
            } else {
                res.send(err);
            }
        });
    })

    .post(function (req, res) {
        const newArticle = new Article({
            title: req.body.title,
            content: req.body.content
        });
        newArticle.save(function (err) {
            if (!err) {
                res.send("Successfully Added new article!");
            } else {
                res.send("err");
            }
        });
    })

    .delete(function (req, res) {
        Article.deleteMany(function (err, result) {
            if (!err) {
                res.send("Successfully deleted all articles!");
            } else {
                res.send(err);
            }
        })
    });

app.route("/articles/:articleName")

    .get(function(req,res){
        const articleName = req.params.articleName;
        Article.findOne({title: articleName}, function(err, foundArticle){
            if (!err) {
                res.send(foundArticle);
            } else {
                res.send("No article found in that title!");
            }
        });
    }).put(function(req,res){
        const articleName = req.params.articleName;
        Article.updateOne(
            {title: articleName},
            {title: req.body.title, content: req.body.content},
            function(err){
                if (!err) {
                    res.send("Article updated Successfully!");
                }
            }
        )
    }).patch(function(req,res){
        const articleName = req.params.articleName;
        Article.updateOne(
            {title: articleName},
            {$set: req.body},
            function(err){
                if (!err) {
                    res.send("Article patched Successfully!");
                }
            }
        )
    }).delete(function(req,res){
        const articleName = req.params.articleName;
        Article.deleteOne(
            {title: articleName},
            function(err){
                if (!err) {
                    res.send("Article deleted Successfully!");
                }
            }
        )
    });

app.listen(3000, function () {
    console.log("Server started on port 3000");
});