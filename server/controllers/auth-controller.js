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
                numFollowers: loggedInUser.followers.length,
                numFollowing: loggedInUser.following.length,
                numPosts: loggedInUser.numPosts,
                dateJoined: dateJoined,
                id: loggedInUser._id,
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
                userName: existingUser.username,
                numFollowers: existingUser.followers.length,
                numFollowing: existingUser.following.length,
                numPosts: existingUser.numPosts,
                dateJoined: dateJoined,
                id: existingUser._id              
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

        const newUser = new User({
            firstName, lastName, email, username, passwordHash, numPosts
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
        const { userId, newEmail, newUsername} = req.body;
        console.log("edit user: " + newEmail + " "+ newUsername + " " + userId);
        const existingEmail = await User.findOne({ email: newEmail, _id: {'$ne': userId} });
        console.log(existingEmail);
        if (newEmail && (!validateEmail(newEmail) || existingEmail)) {
            return res
                .status(400)
                .json({
                    errorMessage: "This email address is unavailable."
                });
        } else if (newEmail) {
            console.log("email address is changed and valid");
            await User.findByIdAndUpdate(userId, {email: newEmail});
        }
        const existingUserName = await User.findOne({ username: newUsername, _id: {'$ne': userId} });
        console.log("existingUserName: " + existingUserName);
        if (newUsername && existingUserName) {
            return res
                .status(400)
                .json({
                    success: false,
                    errorMessage: "An account with this username already exists."
                })
        } else if (newUsername){
            await User.findByIdAndUpdate(userId, {username: newUsername});
        }
        const loggedInUser = await User.findOne({ _id: userId });
        return res.status(200).json({user: {
            firstName: loggedInUser.firstName,
            lastName: loggedInUser.lastName,
            email: loggedInUser.email,
            username: loggedInUser.username,
            numFollowers: loggedInUser.followers.length,
            numFollowing: loggedInUser.following.length,
            numPosts: loggedInUser.numPosts,
            dateJoined: loggedInUser.dateJoined,
            id: loggedInUser._id,}});
    } catch (error) {
        console.log(error);
        res.status(500).json({user: {
            firstName: loggedInUser.firstName,
            lastName: loggedInUser.lastName,
            email: loggedInUser.email,
            username: loggedInUser.username,
            numFollowers: loggedInUser.followers.length,
            numFollowing: loggedInUser.following.length,
            numPosts: loggedInUser.numPosts,
            dateJoined: loggedInUser.dateJoined,
            id: loggedInUser._id,}});
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



module.exports = {
    getLoggedIn,
    registerUser,
    loginUser,
    logoutUser,
    editUser
}