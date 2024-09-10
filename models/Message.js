const mongoose = require('mongoose');

const messageSchema = mongoose.Schema({
    content: String,
    author: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, // Référence à l'utilisateur
    dest: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, // Référence à l'utilisateur
    

}, {timestamps: true});

module.exports = mongoose.model('Movie', movieSchema);
