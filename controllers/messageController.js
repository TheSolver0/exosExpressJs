const User = require('../models/User');
const Message = require('../models/Message');

exports.getMessages = (req, res) => {

    // var payload = parseJwt();
    const {auth, dest} = req.body;
    Message.find({author: auth, dest: dest})
        .sort({ _id: -1 })
        .then(users => {
            frenchMovies = users;
            res.render('movies', { frenchMovies });
        })
        .catch(err => {
            console.error(err);
        });

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

            const title = req.body.movietitle;
            const year = req.body.movieyear;
            const myMovie = new Movie({ movietitle: title, movieyear: year, author: user._id });
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
