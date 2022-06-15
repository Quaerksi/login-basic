const User = require("../model/user");
var bcrypt = require('bcryptjs');
var jwt = require('jsonwebtoken');

exports.register = async function(req, res) {

    try {
        // Get user input
        const { firstName, lastName, email, password } = req.body;
        console.log(`Post register ${firstName}, ${lastName}, ${email}, ${password}`)

    // Validate user input
        if (!(email && password && firstName && lastName)) {
            res.status(400).send("All input is required");
        }

        const oldUser = await User.findOne({ email }).exec();
        console.log(`await findOne ${oldUser}`)

        if(oldUser == null){
            //Encrypt user password
            encryptedUserPassword = await bcrypt.hash(password, 10);
            // const encryptedUserPassword = bcrypt.hash(password, 10);

        // Create user in our database
        const user = await User.create({
            first_name: firstName,
            last_name: lastName,
            email: email.toLowerCase(), // sanitize
            password: encryptedUserPassword
        });

        // Create token
        const token = jwt.sign(
            { user_id: user._id},
            process.env.TOKEN_KEY,
            // {
            // expiresIn: "5h",
            // }
        );
        // save user token
        user.token = token;

        // return new user
        res.status(201).json(user);
    } else {
        //handle user exists already
        res.status(409).send("User Already Exist. Please Login");
    }
    } catch (err) {
        console.log(err);
    }
}

/*
exports.login = async function(req, res) {

   try {
    // Get user input
    const { email, password } = req.body;

    // Validate user input
    if (!(email && password)) {
        res.status(400).send("All input is required");
    }
    // Validate if user exist in our database
    const user = await User.findOne({ email }).exec();

    if (user && (await bcrypt.compare(password, user.password))) {
        // Create token
        const token = jwt.sign(
          { user_id: user._id, email },
          process.env.TOKEN_KEY,
          {
            expiresIn: "5h",
          }
        );
  
        // save user token
        user.token = token;
  
        // user
        return res.status(200).json(user);
      }
      return res.status(400).send("Invalid Credentials");
    
    }catch(err){
        console.log(err);
    }
}
*/

exports.login = async function(req, res) {

    try {

        // Get user input
        const { email, password } = req.body;

        // Validate user input
        if (!(email && password)) {
            res.status(400).send("All input is required");
        }
        // Validate if user exist in our database
        const user = await User.findOne({ email }).exec();

        if (user && (await bcrypt.compare(password, user.password))) {

            const token = jwt.sign({ email: email },  process.env.TOKEN_KEY);

            return res
            .cookie("access_token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict",
            // secure: true
            })
            .status(200)
            .json({ message: "Logged in successfully 😊 👌" });
        
        }

        return res.status(400).send("Invalid Credentials");
        }catch(err){
            console.log(err);
        }
}

exports.logout = async function (req, res){

    try {
        return res
        .clearCookie("access_token")
        .status(200)
        .json({ message: "Successfully logged out 😏 🍀" });
    }catch(err){
        console.log(err);
    }
}