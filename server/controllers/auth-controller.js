const auth = require('../auth')
const User = require('../models/user-model')
const bcrypt = require('bcryptjs')


getLoggedIn = async (req, res) => {
    try {
        let userId = auth.verifyUser(req);
        if (!userId) {
            return res.status(200).json({
                loggedIn: false,
                user: null,
                errorMessage: "?"
            })
        }

        const loggedInUser = await User.findOne({ _id: userId });
        console.log("loggedInUser: " + loggedInUser);

        const dateJoined = new Date(loggedInUser.createdAt).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });

        return res.status(200).json({
            loggedIn: true,
            user: {
                firstName: loggedInUser.firstName,
                lastName: loggedInUser.lastName,
                email: loggedInUser.email,
                username: loggedInUser.username,
                maps: loggedInUser.maps,
                likedMaps: loggedInUser.likedMaps,
                bio: loggedInUser.bio,
                numPosts: loggedInUser.numPosts,
                dateJoined: dateJoined,
                id: loggedInUser._id,
                numLikes: loggedInUser.numLikes,
            }
        })
    } catch (err) {
        console.log("err: " + err);
        res.json(false);
    }
}

loginUser = async (req, res) => {
    console.log("loginUser");
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res
                .status(400)
                .json({ errorMessage: "Please enter all required fields." });
        }

        const existingUser = await User.findOne({ email: email });
        console.log("existingUser: " + existingUser);
        if (!existingUser) {
            return res
                .status(401)
                .json({
                    errorMessage: "Wrong email or password provided."
                })
        }

        console.log("provided password: " + password);
        const passwordCorrect = await bcrypt.compare(password, existingUser.passwordHash);
        if (!passwordCorrect) {
            console.log("Incorrect password");
            return res
                .status(401)
                .json({
                    errorMessage: "Wrong email or password provided."
                })
        }

        // LOGIN THE USER
        const token = auth.signToken(existingUser._id);
        console.log(token);

        const dateJoined = new Date(existingUser.createdAt).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });

        res.cookie("token", token, {
            httpOnly: true,
            secure: true,
            sameSite: true
        }).status(200).json({
            success: true,
            user: {
                firstName: existingUser.firstName,
                lastName: existingUser.lastName,  
                email: existingUser.email,
                username: existingUser.username,
                maps: existingUser.maps,
                likedMaps: existingUser.likedMaps,
                bio: existingUser.bio,
                numPosts: existingUser.numPosts,
                dateJoined: dateJoined,
                id: existingUser._id,   
                numLikes: existingUser.numLikes,
            }
        })

    } catch (err) {
        console.error(err);
        res.status(500).send();
    }
}

logoutUser = async (req, res) => {
    res.cookie("token", "", {
        httpOnly: true,
        expires: new Date(0),
        secure: true,
        sameSite: "none"
    }).send();
}

registerUser = async (req, res) => {
    try {
        const { firstName, lastName, email, username, password, passwordVerify } = req.body;
        console.log("create user: " + username + " "+ firstName + " " + lastName + " " + email + " " + password + " " + passwordVerify);
        if (!firstName || !lastName || !username || !email || !password || !passwordVerify) {
            return res
                .status(400)
                .json({ errorMessage: "Please enter all required fields." });
        }
        console.log("all fields provided");
        if (!validateEmail(email)) {
            return res
                .status(400)
                .json({
                    errorMessage: "Please enter a valid email address."
                });
        }
        console.log("email address is valid");
        if (password.length < 8) {
            return res
                .status(400)
                .json({
                    errorMessage: "Please enter a password of at least 8 characters."
                });
        }
        if (password !== passwordVerify) {
            return res
                .status(400)
                .json({
                    errorMessage: "Please enter the same password twice."
                })
        }
        console.log("password and password verify match");
        const existingUserName = await User.findOne({ username: username });
        console.log("existingUserName: " + existingUserName);
        if (existingUserName) {
            return res
                .status(400)
                .json({
                    success: false,
                    errorMessage: "An account with this username already exists."
                })
        }
        const existingUser = await User.findOne({ email: email });
        console.log("existingUser: " + existingUser);
        if (existingUser) {
            return res
                .status(400)
                .json({
                    success: false,
                    errorMessage: "An account with this email address already exists."
                })
        }

        const saltRounds = 10;
        const salt = await bcrypt.genSalt(saltRounds);
        const passwordHash = await bcrypt.hash(password, salt);
        console.log("passwordHash: " + passwordHash);

        const numPosts = 0;
        const numLikes = 0;
        const bio = "I love TerraTrove!";
        const newUser = new User({
            firstName, lastName, email, username, passwordHash, numPosts, numLikes, bio
        });
        const savedUser = await newUser.save();
        console.log("new user saved: " + savedUser._id);

        return res.status(200).json({success: true});

    } catch (err) {
        console.error(err);
        res.status(500).send();
    }
}

editUser = async (req,res) => {
    try {
        const { userId, newEmail, newUsername, newBio, verifyPass} = req.body;
        const loggedInUser = await User.findOne({ _id: userId });
        console.log(loggedInUser);
        if (!verifyPass){
            return res
                .status(401)
                .json({
                    errorMessage: "Please confirm your password."
                })
        }
        const passwordCorrect = await bcrypt.compare(verifyPass, loggedInUser.passwordHash);
        if (!passwordCorrect) {
            return res
                .status(401)
                .json({
                    errorMessage: "Incorrect password provided."
                })
        }
        const existingEmail = await User.findOne({ email: newEmail, _id: {'$ne': userId} });
        const existingUserName = await User.findOne({ username: newUsername, _id: {'$ne': userId} });
        if (newEmail && (!validateEmail(newEmail) || existingEmail)) {
            return res
                .status(400)
                .json({
                    errorMessage: "This email address is unavailable."
                });
        } else if (newUsername && existingUserName) {
            return res
                .status(400)
                .json({
                    success: false,
                    errorMessage: "An account with this username already exists."
                })
        } else if (newBio && newBio.length > 200){
            return res
            .status(400)
            .json({
                success: false,
                errorMessage: "Bio must be at most 200 characters."
            })
        }
        if (newEmail) {
            await User.findByIdAndUpdate(userId, {email: newEmail});
        }
        if (newUsername){
            await User.findByIdAndUpdate(userId, {username: newUsername});
        }
        if (newBio){
            await User.findByIdAndUpdate(userId, {bio: newBio});
        }
        const dateJoined = new Date(loggedInUser.createdAt).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
        const updatedUser = await User.findOne({ _id: userId });
        return res.status(200).json({user: {
            firstName: updatedUser.firstName,
            lastName: updatedUser.lastName,
            email: updatedUser.email,
            username: updatedUser.username,
            maps: updatedUser.maps,
            likedMaps: updatedUser.likedMaps,
            bio: updatedUser.bio,
            numPosts: updatedUser.numPosts,
            dateJoined: dateJoined,
            id: updatedUser._id,
            numLikes: updatedUser.numLikes,
        }});
    } catch (error) {
        console.log(error);
        res.status(500).send();
    }
}

changeUserPassword = async (req,res) => {
    try {
        const { userId, newPassword, verifyPass, confirmNewPassword} = req.body;
        const loggedInUser = await User.findOne({ _id: userId });
        console.log(loggedInUser);
        if (!verifyPass){
            return res
                .status(400)
                .json({
                    errorMessage: "Please input your old password to confirm the change"
                })
        }
        const passwordCorrect = await bcrypt.compare(verifyPass, loggedInUser.passwordHash);
        if (!passwordCorrect) {
            return res
                .status(401)
                .json({
                    errorMessage: "Incorrect old password provided."
                })
        }
        if (newPassword && newPassword.length < 8) {
            return res
                .status(400)
                .json({
                    errorMessage: "Your new password must have at least 8 characters"
                });
        }
        else if (!confirmNewPassword || newPassword != confirmNewPassword){
            return res
                .status(400)
                .json({
                    errorMessage: "Please enter your new password twice."
                })
        }
        else if (newPassword == verifyPass){
            return res
                .status(400)
                .json({
                    errorMessage: "Your new password must be different than your old password."
                })
        }
        const saltRounds = 10;
        const salt = await bcrypt.genSalt(saltRounds);
        const passwordH = await bcrypt.hash(newPassword, salt);
        console.log("passwordHash: " + passwordH);
        await User.findByIdAndUpdate(userId, {passwordHash: passwordH});
        const dateJoined = new Date(loggedInUser.createdAt).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
        const updatedUser = await User.findOne({ _id: userId });
        return res.status(200).json({user: {
            firstName: updatedUser.firstName,
            lastName: updatedUser.lastName,
            email: updatedUser.email,
            username: updatedUser.username,
            bio: updatedUser.bio,
            numPosts: updatedUser.numPosts,
            dateJoined: dateJoined,
            id: updatedUser._id,
            numLikes: updatedUser.numLikes
        }});
    } catch (error) {
        console.log(error);
        res.status(500).send();
    }
}

sendEmail = async (req, res) => {
    const { email } = req.body;
    console.log(req.body);
    console.log(email);
    console.log('SEND EMAIL')

    try {
        var existingUser = false;
        try {
            existingUser = await User.findOne({ email: email });
        } catch (error) {
            console.log(error);
        }
        if (!existingUser) {
            return res
                .status(401)
                .json({
                    errorMessage: "Email is not in database"
                })
        }
        console.log('existingUser: ' + existingUser);
        const nodemailer = require('nodemailer');
        //insert oauth2

        const generatedPassword = 'bwnz vlgl vwob krbv'; //get from google accounts, security sign-in 2-step verification, app-password
        var transporter = nodemailer.createTransport({ //sender email
            host: "smtp.gmail.com",
            port: 465,
            secure: true,
            auth: {
                user: 'dylan.lai@stonybrook.edu',
                pass: generatedPassword
            }
        });

        const baseURL = process.env.NODE_ENV === 'production'
            ? 'https://terratrove-df08dd7fc1f7.herokuapp.com/reset'
            : 'http://localhost:3000/reset';
        console.log(existingUser.passwordHash)
        const hashPass = existingUser.passwordHash;
        console.log(hashPass)
        var mailOptions = { //email contents
            from: { name: 'TerraTrove', address: 'dylan.lai@stonybrook.edu' },
            to: email,
            subject: 'Forgot Password',
            text: 'Link to make new password ' + baseURL + '?' + email + '//' + hashPass + '.   '
        };
        transporter.sendMail(mailOptions, function (error, info) {//function to send email
            try {
                console.log('Email sent: ' + info);
                res.status(200).send();
            } catch (error) {
                console.log(error);
                res.status(500).send()
            }
        })


        /* const { google } = require("googleapis");
        const OAuth2 = google.auth.OAuth2;
        const oauth2Client = new OAuth2(
            "686887097191-v8ouubp0eslnvoq5j8ot14lc6725geoj.apps.googleusercontent.com", // ClientID
            "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", // Client Secret
            "https://developers.google.com/oauthplayground" // Redirect URL
        );
        oauth2Client.setCredentials({
            refresh_token: "1//04tjbcUOAy7kwCgYIARAAGAQSNwF-L9Irn5yyaEc2fJ2XDMNXDU4GYgELXB-NCUfigyy3A5KGuoxbEJeu_dsA0ypNvykNASZw65o"
        });
        const accessToken = await oauth2Client.getAccessToken();
        const generatedPassword = 'bwnz vlgl vwob krbv';
        let transporter = nodemailer.createTransport({ //sender email
            service: "gmail",
            host : "smtp.gmail.com",
            port: 465,
            secure: true,
            auth: {
                type: "OAuth2",
                clientId: "686887097191-v8ouubp0eslnvoq5j8ot14lc6725geoj.apps.googleusercontent.com", // ClientID
                clientSecret: "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", // Client Secret
                refresh_token: "1//04tjbcUOAy7kwCgYIARAAGAQSNwF-L9Irn5yyaEc2fJ2XDMNXDU4GYgELXB-NCUfigyy3A5KGuoxbEJeu_dsA0ypNvykNASZw65o", //refresh token
                user: 'dylan.lai@stonybrook.edu',
                accessToken: accessToken
            },
            tls: {
                rejectUnauthorized: false
            }
        });
        console.log(transporter);
        const baseURL = process.env.NODE_ENV === 'production'
            ? 'https://terratrove-df08dd7fc1f7.herokuapp.com/reset'
            : 'http://localhost:3000/reset';
        console.log(existingUser.passwordHash)
        const hashPass = existingUser.passwordHash;
        console.log(hashPass)
        let mailOptions = { //email contents
            from: 'dillypily888@gmail.com',
            to: email,
            subject: 'Forgot Password',
            text: 'Link to make new password ' + baseURL + '?' + email + '//' + hashPass + '   ',
        };
        transporter.sendMail(mailOptions, function(error, info){//function to send email
            try{
                console.log('Email sent: ' + info);
                console.log(info);
                res.status(200);
            } catch(error){
                console.log(error);
                res.status(500).send()
            }
        }) */
    } catch (error) {
        console.log(error);
        res.status(500).send();
    }
}
resetPassword = async (req, res) => {
    //temp Reseter
    try {
        const { email, verifyPass, newPassword, confirmNewPassword } = req.body;
        console.log(req.body)
        console.log(email)
        const thisUser = await User.findOne({ email: email });
        console.log(thisUser);
        console.log(verifyPass)
        if (!verifyPass) {
            return res
                .status(400)
                .json({
                    errorMessage: "Illegal Actions taken"
                })
        }
        const passwordCorrect = (verifyPass === thisUser.passwordHash);
        if (!passwordCorrect) {
            return res
                .status(401)
                .json({
                    errorMessage: "Illegal Actions taken"
                })
        }
        if (newPassword && newPassword.length < 8) {
            return res
                .status(400)
                .json({
                    errorMessage: "Your new password must have at least 8 characters"
                });
        }
        else if (!confirmNewPassword || newPassword != confirmNewPassword) {
            return res
                .status(400)
                .json({
                    errorMessage: "Please enter your new password twice."
                })
        }
        const saltRounds = 10;
        const salt = await bcrypt.genSalt(saltRounds);
        const passwordH = await bcrypt.hash(newPassword, salt);
        console.log("passwordHash: " + passwordH);
        await User.findByIdAndUpdate(thisUser._id, { passwordHash: passwordH });
        const dateJoined = new Date(thisUser.createdAt).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
        const updatedUser = await User.findOne({ _id: thisUser._id });
        return res.status(200).json({
            user: {
                firstName: updatedUser.firstName,
                lastName: updatedUser.lastName,
                email: updatedUser.email,
                username: updatedUser.username,
                bio: updatedUser.bio,
                numPosts: updatedUser.numPosts,
                dateJoined: dateJoined,
                id: updatedUser._id,
                numLikes: updatedUser.numLikes
            }
        });
    } catch (error) {
        console.log(error);
        res.status(500).send();
    }
}

getAuthorInfo = async (req,res) => {
    try {
        const {username} = req.body;
        const author = await User.findOne({ username: username });
        const dateJoined = new Date(author.createdAt).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
        return res.status(200).json({user: {
            firstName: author.firstName,
            lastName: author.lastName,
            email: author.email,
            username: author.username,
            bio: author.bio,
            numPosts: author.numPosts,
            dateJoined: dateJoined,
            id: author._id,
            numLikes: author.numLikes,
            maps: author.maps,
        }});
    } catch (error) {
        console.log(error);
        return res
            .status(400)
            .json({
                success: false,
                errorMessage: "An error has occurred. Pleas try again later."
            })
    }
}

// simple regex function to check whether the given email is a valid email address
const validateEmail = (email) => {
    return String(email)
        .toLowerCase()
        .match(
            /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
        );
};

findUserByEmail = async (req, res) => {
    try {
        const { email } = req.body;

        if (!email) {
            return res
                .status(400)
                .json({ errorMessage: "Please provide an email address." });
        }

        const foundUser = await User.findOne({ email: email });

        if (!foundUser) {
            return res
                .status(404)
                .json({
                    success: false,
                    errorMessage: "User not found for the provided email address."
                });
        }

        return res.status(200).json({
            success: true,
            user: {
                firstName: foundUser.firstName,
                lastName: foundUser.lastName,
                email: foundUser.email,
                username: foundUser.username,
                maps: foundUser.maps,
                likedMaps: foundUser.likedMaps,
                bio: foundUser.bio,
                numPosts: foundUser.numPosts,
                dateJoined: new Date(foundUser.createdAt).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                }),
                id: foundUser._id,
                numLikes: foundUser.numLikes,
            }
        });
    } catch (error) {
        console.error(error);
        res.status(500).send();
    }
}

findUserById = async (req, res) => {
    try {
        const { id } = req.body;

        console.log("FINDING USER ", id);

        if (!id) {
            return res
                .status(400)
                .json({ errorMessage: "Please provide an email address." });
        }

        const foundUser = await User.findOne({  _id: id });

        if (!foundUser) {
            return res
                .status(404)
                .json({
                    success: false,
                    errorMessage: "User not found for the provided email address."
                });
        }

        return res.status(200).json({
            success: true,
            user: {
                firstName: foundUser.firstName,
                lastName: foundUser.lastName,
                email: foundUser.email,
                username: foundUser.username,
                maps: foundUser.maps,
                likedMaps: foundUser.likedMaps,
                bio: foundUser.bio,
                numPosts: foundUser.numPosts,
                dateJoined: new Date(foundUser.createdAt).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                }),
                id: foundUser._id,
                numLikes: foundUser.numLikes,
            }
        });
    } catch (error) {
        console.error(error);
        res.status(500).send();
    }
}


module.exports = {
    getLoggedIn,
    registerUser,
    loginUser,
    logoutUser,
    editUser,
    changeUserPassword,
    sendEmail,
    resetPassword,
    findUserByEmail,
    findUserById
}