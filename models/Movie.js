const mongoose = require('mongoose');

const movieSchema = mongoose.Schema({
    movietitle: String,
    movieyear: Number,
    author: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, // Référence à l'utilisateur
    

}, {timestamps: true});

module.exports = mongoose.model('Movie', movieSchema);
