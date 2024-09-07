const mongoose = require('mongoose');

const movieSchema = mongoose.Schema({
    movietitle: String,
    movieyear: Number,
    author: String,
});

module.exports = mongoose.model('Movie', movieSchema);
