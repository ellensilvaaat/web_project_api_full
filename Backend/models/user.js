const mongoose = require('mongoose');
const validator = require('validator');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    default: 'Jacques Cousteau'
  },
  about: {
    type: String,
    default: 'Explorer'
  },
  avatar: {
    type: String,
    default: 'https://pictures.s3.your-default-avatar/link.jpg',
    validate: {
      validator: (v) => validator.isURL(v),
      message: 'Avatar must be a valid URL.'
    }
  },
  email: {
    type: String,
    required: true,
    unique: true,
    validate: {
      validator: (v) => validator.isEmail(v),
      message: 'Email must be valid.'
    }
  },
  password: {
    type: String,
    required: true,
    select: false
  }
});

module.exports = mongoose.model('User', userSchema);

