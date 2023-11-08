
const User = require('../models/user-model')



registerUser = async (req, res) => {
    try {
        const { firstName, lastName, email, username, password, passwordVerify } = req.body;
        console.log("create user: " + firstName + " " + lastName + " " + email + " " + password + " " + passwordVerify);
        if (!firstName || !lastName || !username || !email || !password || !passwordVerify) {
            return res
                .status(400)
                .json({ errorMessage: "Please enter all required fields." });
        }
        console.log("all fields provided");
        
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


        const newUser = new User({
            firstName, lastName, email, username, password
        });
        const savedUser = await newUser.save();
        console.log("new user saved: " + savedUser._id);

        return res.status(200).json({success: true});

    } catch (err) {
        console.error(err);
        res.status(500).send();
    }
}


getRegisteredUser = async (req, res) => {

    try {
        const user = await User.findOne({ email: req.params.email });

        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found' });
        } else {
            return res.status(200).json({ success: true, message: 'User is in the database' });
        }
    } catch (err) {
        return res.status(400).json({ success: false, error: err.message });
    }

}


module.exports = {
    registerUser,
    getRegisteredUser
}