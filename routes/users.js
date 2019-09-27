const express = require('express');
const router = express.Router();
const jwt = require("jsonwebtoken");
const passport = require("passport");
const User = require("../models/User");
const config = require("../config/database");

// Register
router.post('/register', (req, res, next) => {
    let newUser = new User(({
        name: req.body.name,
        email: req.body.email,
        username: req.body.username,
        password: req.body.password
    }));

    User.addUser(newUser, (err, user) => {
        // console.log(user);
        if (err)
        {
            res.json( { success: true, msg: "failed to register user" } );
        }
        else{
            res.json( { success: true, msg: "New user registered", data: user } );
        }
    });
});

// Authenticate
router.post('/authenticate', (req, res, next) => {
    const username = req.body.username;
    const password = req.body.password;

    User.getUserByName(username, (err, user) => {
        if(err)
            throw err;
        if(!user)
        {
            return res.json({success: false, msg: "user not found"});
        }

        if(user){
            User.comparePassword(password, user.password, (err, isMatch) => {
                if(err) throw err;
                if(isMatch)
                {
                    const token = jwt.sign({data: user},
                        config.secret,
                        { expiresIn: '2d'  // 1 week
                    } );
                    res.json({
                        success: true,
                        msg: "User loggedin",
                        token: 'JWT '+token,
                        user: {
                            id: user._id,
                            name: user.username,
                            email: user.email
                        }
                    });
                }
                else{
                    return res.json({success: false, msg: "Wrong password entered"});
                }
            });
        }
    });

});

// User Profile
router.get('/profile', passport.authenticate('jwt', { session: false } ), function(req, res, next) {
    res.json( req.user );
});

module.exports = router;