const express = require("express")
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
var Schema = mongoose.Schema;
const morgan = require("morgan");
const {Blog} = require("./models");
const app = express();
const {PORT, DATABASE_URL} = require("./config")

app.use(bodyParser.json());
app.use(morgan('common'));

mongoose.connect(DATABASE_URL, { useMongoClient: true });
mongoose.Promise = global.Promise;

let server;

function runServer(port=PORT, database_url=DATABASE_URL) {
  mongoose.connect(DATABASE_URL, { useMongoClient: true })
  server = app.listen(port, () => {
    console.log(`Your app is listening on port ${port}`);
  }).on("error", err => {
    mongoose.disconnect()
  }) 
}

runServer()


app.get('/posts/:id', (req, res) => {
  Blog
    .findById(req.params.id)
    .then(blog => res.json({blog: blog.serialize()}))
    .catch(err => {
      console.error(err);
      res.status(500).json({ message: 'Internal server error' });
    });
});


app.get("/posts", (req, res) => {
  Blog
  .find()
  .then(posts => {
    res.json({
      posts: posts.map(
        (post) =>  post.serialize())
    })
  })
  .catch(err => res.send(err))
})



app.post('/posts', (req, res) => {
  const requiredFields = ['title', 'content', 'author'];
  for (let i = 0; i < requiredFields.length; i++) {
    const field = requiredFields[i];
    if (!(field in req.body)) {
      const message = `Missing \`${field}\` in request body`;
      console.error(message);
      return res.status(400).send(message);
    }
  }

  Blog
    .create({
      title: req.body.title,
      content: req.body.content,
      author: req.body.author
    })
    .then(blogPost => res.status(201).json(blogPost.serialize()))
    .catch(err => {
      console.error(err);
      res.status(500).json({ error: 'Something went wrong' });
    });

});


app.put("/posts/:id", (req, res) => {
  if(!(req.params.id && res.body.id && req.params.id === res.body.id)) {
    const message = (
      `Request path id (${req.params.id}) and request body id ` +
      `(${req.body.id}) must match`);
    console.error(message);
    return res.status(400).json({ message: message });
  }
  const toUpdate = {}
  requiredFields = [title, author, content]

  requiredFields.forEach(field => {
    if (field in req.body) {
      toUpdate[field] = req.body.field
    }
  })

  Blog
  .findByIdAndUpdate(req.params.id, { $set: toUpdate })
  .then(restaurant => res.status(204).end())
  .catch(err => res.status(500).json({ message: 'Internal server error' }));
})


app.delete("/posts/:id", (req, res) => {
  Blog
  .findByIdAndRemove(req.params.id)
  .then(blog => res.json(blog))
  .catch(err => res.status(500).json({ message: 'Internal server error' }));
})


app.use('*', function (req, res) {
  res.status(404).json({ message: 'Not Found' });
});


