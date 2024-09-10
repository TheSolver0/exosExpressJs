const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const multer = require('multer');
const jwt = require('jsonwebtoken');
const upload = multer();
const {faker} = require('@faker-js/faker');
faker.locale = "fr";

var { expressjwt: ejwt } = require("express-jwt");
const mongoose = require('mongoose');

const movieController = require('./controllers/movieController');
const authController = require('./controllers/authController');
const userController = require('./controllers/userController');
const config = require('./config');

const PORT = 3000;
const SECRET = 'Akqdosfkdkxlfd7f1d51f85dd1515205ssJNIKq51515602scnbhbfsjkdln';
const AUTH = ejwt({secret: SECRET, algorithms: ["HS256"]});


mongoose.connect(`mongodb+srv://${config.DB.user}:${config.DB.password}@cluster0.ryuty.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`);

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error: cannot connect  to my DB'));
db.once('open', () => {
    console.log('connected to the DB :)');
});

app.use(express.json());
const authenticateToken = (req, res, next) => {
    const token = req.headers.cookie.split('token=')[1];

    if (!token) {
        return res.sendStatus(401); // Non authentifié
    }

    jwt.verify(token, SECRET, (err, user) => {
        if (err) {
            return res.sendStatus(403); // Non autorisé
        }

        req.user = user; // Ajouter les informations de l'utilisateur à la requête
        res.locals.user = user.user;
        // console.log(req.user.user);
        next();
    });
};

// app.use(authenticateToken);

app.use('/public',express.static('public'));
// app.use(AUTH
//     .unless({path:['/', '/movies', new RegExp('/movies.*/', 'i'), '/movie-search', '/login', new RegExp('/movie-details.*/', 'i')]}));


var urlencodedParser = bodyParser.urlencoded({ extended:false });

app.set('views', './views');
app.set('view engine', 'ejs');


app.get('/',movieController.getMovies);
app.get('/movies', movieController.getMovies);

app.post('/movies/add',upload.fields([]), movieController.postMovie);

app.get('/movies/search/:term', movieController.getMovieSearch);

// app.get('/movies/search', movieController.getMovieSearch);

app.get('/movies/add', authenticateToken, movieController.getMoviesAdd);

app.get('/movie-details/:id', movieController.getMovieDetails);

app.put('/movie/:id', upload.fields([]), movieController.updateMovie);

app.delete('/movie/:id', movieController.deleteMovie);

app.get('/login', authController.login);


app.post('/login', upload.fields([]) , authController.postLogin);

app.get('/members-only', authController.getMembersOnly);

app.get('/users', userController.getUsers);

app.get('/users/register', userController.getUserRegister);

app.post('/users/register', upload.fields([]), userController.postUser);

app.post('/logout', (req, res) => {
    res.clearCookie('token', {
        httpOnly: true, 
        // secure: process.env.NODE_ENV === 'production', // Assurez-vous d'utiliser true en production avec HTTPS
        maxAge: 3600000 // 1 heure

    });
    res.status(200).json({ message: 'Déconnexion réussie' });
});

app.get('/dashboard', authenticateToken, userController.getProfil);

app.listen(PORT, () => {
    console.log(`listening on port ${PORT}`)
});
