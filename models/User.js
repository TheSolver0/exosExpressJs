const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const userSchema = mongoose.Schema({
    pseudo: {
        type: String,
        required: true,
        unique: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
});

// Avant de sauvegarder un utilisateur, on hache le mot de passe
userSchema.pre('save', async function(next) {
    // Si le mot de passe n'a pas été modifié, on passe au middleware suivant
    if (!this.isModified('password')) return next();

    console.log("Hachage du mot de passe...");

    try {
        // Générer un sel avec un facteur de coût de 10
        const salt = await bcrypt.genSalt(10);
        // Hacher le mot de passe
        this.password =  await bcrypt.hash(this.password, salt);
        console.log(this.password);
        next();
    } catch (err) {
        next(err);
    }
});

// Comparer le mot de passe lors de la connexion
userSchema.methods.comparePassword = async function(candidatePassword) {
    return await bcrypt.compare(candidatePassword, this.password);
};


module.exports = mongoose.model('User', userSchema);
