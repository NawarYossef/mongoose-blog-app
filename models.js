
const mongoose = require('mongoose');

const blogPostSchema = new mongoose.Schema({
  title: {type: String, required: true},
  content: {type: String, required: true},
  author: {
    firstName: String,
    lastName: String
  }
})

blogPostSchema.virtual('fullName').get(function() {
  return this.author.firstName + ' ' + this.author.lastName;
})

blogPostSchema.methods.apiRepr = function() {
  return {
    id: this._id,
    title: this.title,
    fullName: this.fullName,
    content: this.content
  }
}

const BlogPost = mongoose.model('BlogPost', blogPostSchema);

module.exports = {BlogPost}