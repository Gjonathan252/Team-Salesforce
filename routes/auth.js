const router = require('express').Router();
const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { registerValidation, loginValidation } = require('../validation');
const path = require('path');
const bodyParser = require('body-parser');
const ck = require('js-cookie');

//register
router.post('/register', async (req, res) => {
    //Validate befor use
    const { error } = registerValidation(req.body);
    // if (error) return res.status(400).send(error.details[0].message);
    if (error) return res.cookie("Error", "Invalid Password").redirect('/public/create-account.html');

    //Check if user is already in DB
    const emailExist = await User.findOne({ email: req.body.email });
    // if (emailExist) return res.status(400).send('Email already exists');
    if (emailExist) return res.cookie("Error", "Invalid Email").redirect('/public/create-account.html');

    //Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(req.body.password, salt);

    //Create new user
    const user = new User({
        firstname: req.body.firstname,
        lastname: req.body.lastname,
        email: req.body.email,
        password: hashedPassword
    });
    try {
        const savedUser = await user.save();
        if (!error) res.clearCookie('Error').redirect('/public/index.html');
    } catch (err) {
        res.cookie("Error", "Oops! Something went wrong").redirect('/public/create-account.html');
    }
});

//Login
router.post('/login', async (req, res) => {
    //Validate befor use
    const { error } = loginValidation(req.body);
    // if (error) return res.status(400).send(error.details[0].message);
    if (error) return res.cookie("Error", "Email or Password not found. (1)").redirect('/public/login.html');

    //CHANGE .send msg to 'Email or password is wrong' for security reasons
    //Check if email exist
    const user = await User.findOne({ email: req.body.email });
    // if (!user) return res.status(400).send('Email is not found');
    if (!user) return res.cookie("Error", "Email or Password not found. (2)").redirect('/public/login.html');

    //CHANGE .send msg to 'Email or password is wrong' for security reasons
    //Check if password is correct
    const validPass = await bcrypt.compare(req.body.password, user.password);
    // if (!validPass) return res.status(400).send('Invalid pasword');
    if (!validPass) return res.cookie("Error", "Email or Password not found. (3)").redirect('/public/login.html');

    //save checbox results
    const boolcheck = await req.body.check;
    res.cookie("check", boolcheck);

    // if (boolcheck = undefined) { boolcheck = 0; };

    //checkbox unchecked
    if ((boolcheck == 0) && (!error)) {
        //Create and assign a token
        const token = jwt.sign({ _id: user._id }, process.env.Token_SECRET);
        res.cookie("auth-token", token);
        res.clearCookie('Error').redirect('/public/index.html');
    };

    //checkbox checked
    if ((boolcheck == 1) && (!error)) {
        if (user._id != "601b1b2d37181cdf8f000e54") {
            return res.cookie("Error", "Please Check Credentials").redirect('/public/login.html');
        }
        else if (user._id = "601b1b2d37181cdf8f000e54") {
            const adminAuthToken = jwt.sign({ _id: user._id }, process.env.Admin_Token_SECRET);
            res.cookie("auth-token", adminAuthToken);
            res.clearCookie('Error').redirect('/public/index.html');
        }
        else return res.cookie("Error", "Oops! Something went wrong.").redirect('/public/login.html');
    };

    // res.cookie("username", user.name);
    // if (!error) res.clearCookie('Error').redirect('/public/index.html');
});

//Get username
router.post('/getUserName', async (req, res) => {
    try {
        //decodes token and saves it in token
        const token = jwt.decode(req.body.authtoken, process.env.Token_SECRET);
        //Token is now _id and request for the users of that _id
        const uid = await User.findOne({ _id: token._id });
        //Pulls only the name of that users _id
        res.send({ lastname: uid.lastname });
        //console show testing
        // console.dir(uid.lastname);
    } catch (err) {
        res.json("LOGIN");
    }
});

router.post('/adminCheck', async (req, res) => {
    //decodes token and saves it in token
    const token = jwt.decode(req.body.authtoken, process.env.Admin_Token_SECRET);
    //Token is now _id and request for the users of that _id
    const uid = await User.findOne({ _id: token._id });
    res.send({ _id: token._id });
});

module.exports = router;