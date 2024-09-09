const User = require('../models/User');

exports.getUsers = (req, res) => {
    // liste des user
};
exports.getProfil = (req, res) => {
    res.render('dashboard');
};
exports.getUserDetails = (req, res) => {
    // details d'un user
};
exports.getUserRegister = (req, res) => {
    res.render('register');
};
exports.postUser = async (req, res) => {
    if (!req.body) {
        return res.sendStatus(500);  // Mauvaise requête
    }

    const { pseudo, email, password } = req.body;

    // Vérification des champs obligatoires
    if (!pseudo || !email || !password) {
        return res.status(400).json({ message: "Veuillez fournir un pseudo, un email et un mot de passe." });
    }

    try {
        // Vérifier si un utilisateur avec cet email existe déjà
        const existingUser = await User.findOne({ email });

        if (existingUser) {
            return res.status(400).json({ message: "L'email est déjà utilisé." });
        }

        // Créer un nouvel utilisateur
        const myUser = new User({ pseudo, email, password });

        // Sauvegarder l'utilisateur
        await myUser.save();

        // Réponse après création réussie
        return res.status(201).json({ message: "Utilisateur créé avec succès !" });
    } catch (err) {
        // Gérer les erreurs du serveur ou du hachage
        console.error("Erreur lors de la création de l'utilisateur : ", err);
        return res.status(500).json({ message: "Erreur de serveur lors de la création de l'utilisateur." });
    }
};
