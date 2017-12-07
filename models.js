
const mongoose = require('mongoose');

const blogSchema = new mongoose.Schema({
  title: {type: String, required: true},
  content: {type: String, required: true},
  author: {
    firstName: String,
    lastName: String
  }
})

blogSchema.virtual('fullName').get(function() {
  return this.author.firstName + ' ' + this.author.lastName;
})

blogSchema.methods.serialize = function() {
  return {
    id: this._id,
    title: this.title,
    author: this.fullName,
    content: this.content
  }
}

const Blog = mongoose.model('Blog', blogSchema);

module.exports = {Blog}