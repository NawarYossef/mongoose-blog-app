const express = require("express")
const bodyParser = require('body-parser');
const mongoose = require('mongoose')

mongoose.connect('mongodb://localhost/', { useMongoClient: true });

const BlogPost = require("./models")

mongoose.Promise = global.Promise;

const app = express()
app.use(bodyParser.json())


app.get("/posts", (req, res) => {
  BlogPost
  .find()
  .then(Post => res.json(Post.apiRepr()))
  .catch(err => res.status(400).json("sorry"))
})

const port = process.env.PORT || 8080

app.listen(port, () => {
  console.log(`Your app is listening on port ${port}`);
});


