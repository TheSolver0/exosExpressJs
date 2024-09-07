const jwt = require('jsonwebtoken');

const SECRET = 'Akqdosfkdkxlfd7f1d51f85dd1515205ssJNIKq51515602scnbhbfsjkdln';

const fakeUser = {email: 'test@test.com', password: 'test123'};


exports.login = (req,res) => {
    res.render('login', { title: 'Connexion' });
};

exports.postLogin = (req,res) => {
    console.log(req.body);
    if(!req.body) return res.sendStatus(500);
    if(fakeUser.email === req.body.email && fakeUser.password === req.body.password)
    {
        var myToken = jwt.sign({iss: 'd://travail/bull', user: fakeUser, scope: 'admin'} , SECRET);
        res.json(myToken);
    }
    else
    {
        res.sendStatus(401);
    }
};

exports.getMembersOnly = (req, res) => {
    console.log('req.user',req.auth.user);
    res.send(req.auth.user);
};