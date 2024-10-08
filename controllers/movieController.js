const Movie = require('../models/Movie');
const User = require('../models/User');

exports.getMovies = (req, res) => {

    // var payload = parseJwt();

    Movie.find({})
        .populate('author')
        .sort({ _id: -1 })
        .then(users => {
            frenchMovies = users;
            res.render('movies', { frenchMovies });
        })
        .catch(err => {
            console.error(err);
        });

};

exports.getMovieDetails = (req, res) => {
    const id = req.params.id;
    Movie.findById(id)
        .then(movie => {
            res.render('movie-details', { movie: movie });
        })
        .catch(err => {
            console.error(err);
        })
};

exports.getMoviesAdd = (req, res) => {
    res.render('add-movie');
};

exports.getMovieSearch = (req, res) => {
    const title = req.params.term;
    Movie.find({ movietitle: { $regex: `.*${title}.*`, $options: "i" } })
        .then(movie => {
            frenchMovies = movie;
            console.log(frenchMovies);
            //  res.send(movie);
            res.render('movies-search', { frenchMovies });
        })
        .catch(err => {
            console.error(err);
            alert('err');
        })
};

exports.postMovie = (req, res) => {
    if (!req.body)
        return res.sendStatus(500);

    const formData = req.body;
    console.log('formData: ', formData);
    // console.log(req.body.user_id);

    User.findById(req.body.user_id)
        .then(user => {
            if (!user) {
                return console.log('Utilisateur non trouvé');
            }
            // console.log('user :', user._id);
            const image = req.file ? req.file.filename : undefined;

            const title = req.body.movietitle;
            const year = req.body.movieyear;
            const myMovie = new Movie({ movietitle: title, movieyear: year, author: user._id, image });
            myMovie.save()
                .then(savedMovie => {
                    console.log(savedMovie);
                    user.movies.push(savedMovie._id);
                    user.save();
                })
                .catch(err => {
                    console.log(err);
                });

           
        })
        .catch(err => {
            console.log("Erreur : ", err);
          });

    return res.status(201).json({ message: "Film ajouté avec succès !" });
};

exports.updateMovie = (req, res) => {
    if (!req.body) {
        console.log('Erreur');
        return res.sendStatus(500);
    }
    else {
        console.log(`movieTitle : ${req.body.movietitle}  -  movieYear: ${req.body.movieyear}`);
        const id = req.params.id;
        Movie.findByIdAndUpdate(id, { $set: { movietitle: req.body.movietitle, movieyear: req.body.movieyear } }, { new: true })
            .then(movie => {
                console.log(movie);
                // res.json(movie);
                // res.redirect('/movies')
            })
            .catch(err => {
                console.log(err);
                res.send('Erreur de mise à jour ');
            });
            return res.status(201).json({ message: "suppression successfully" });
    }
};
exports.deleteMovie = (req, res) => {
    if (!req.params) {
        console.log('Erreur');
        return res.sendStatus(500);
    }
    else {
        const id = req.params.id;
        Movie.findByIdAndDelete(id)
            .then(console.log("suppression successfully"))
            .catch(err => console.log(err));
        return res.status(201).json({ message: "suppression successfully" });
        
    }
};

// function parseJwt() {
//     var tokenFromStorage = localStorage.getItem('token');
//     if (tokenFromStorage) {
//         var base64encoded = tokenFromStorage.split('.')[1];
//         return JSON.parse(window.atob(base64encoded));
//     }
// }
