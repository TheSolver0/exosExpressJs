const Movie = require('../models/Movie');

exports.getMovies = (req,res) => {
    
    Movie.find({})
    .then(users => {
        frenchMovies = users;
        res.render('movies', {frenchMovies});
    })
    .catch(err => {
        console.error(err);
    });
    
};

exports.getMovieDetails = (req,res) => {
    const id = req.params.id;
    Movie.findById(id)
        .then(movie => {
            res.render('movie-details', {movie: movie});
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
    Movie.find({movietitle: title})
        .then(movie => {
            frenchMovies = movie;
            // res.send(movie);
            res.render('movies-search', {frenchMovies});
        })
        .catch(err => {
            console.error(err);
            alert('err');
        })
};

exports.postMovie = (req, res) => {
    if(!req.body)
        return res.sendStatus(500);

    const formData = req.body;
    console.log('formData: ', formData);

    const title = req.body.movietitle;
    const year = req.body.movieyear;
    const myMovie = new Movie({ movietitle: title, movieyear: year});
    myMovie.save()
            .then(savedMovie => {
                console.log(savedMovie);
            })
            .catch(err => {
                console.log(err);
            });
    res.sendStatus(201);
};

exports.updateMovie = (req,res) => {
    if(!req.body)
    {
        console.log('Erreur');
        return res.sendStatus(500);
    }
    else 
    {
        console.log(`movieTitle : ${req.body.movietitle}  -  movieYear: ${req.body.movieyear}`);
        const id = req.params.id;
        Movie.findByIdAndUpdate(id, {$set: {movietitle: req.body.movietitle, movieyear: req.body.movieyear}}, { new: true })
                .then(movie => {
                    console.log(movie);
                    res.json(movie);
                    // res.redirect('/movies')
                })
                .catch(err => {
                    console.log(err);
                    res.send('Erreur de mise à jour ');
                });
    }
};
exports.deleteMovie =  (req,res) => {
    if(!req.params)
    {
        console.log('Erreur');
        return res.sendStatus(500);
    }
    else 
    {
        const id = req.params.id;
        Movie.findByIdAndDelete(id)
                .then(console.log("suppression successfully"))
                .catch(err => console.log(err));
    }
};


