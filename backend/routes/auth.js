const router = require("express").Router();
const { User } = require("../models/user");
const Token = require("../models/token");
const crypto = require("crypto");
const sendEmail = require("../utils/sendEmail");
const bcrypt = require("bcrypt");
const Joi = require("joi");
const { OAuth2Client } = require('google-auth-library');
const jwt = require('jsonwebtoken');

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

router.post("/", async (req, res) => {
	try {
		const { error } = validate(req.body);
		if (error)
			return res.status(400).send({ message: error.details[0].message });

		const user = await User.findOne({ email: req.body.email });
		if (!user)
			return res.status(401).send({ message: "Invalid Email or Password" });

		const validPassword = await bcrypt.compare(
			req.body.password,
			user.password
		);
		if (!validPassword)
			return res.status(401).send({ message: "Invalid Email or Password" });

		if (!user.verified) {
			let token = await Token.findOne({ userId: user._id });
			if (!token) {
				token = await new Token({
					userId: user._id,
					token: crypto.randomBytes(32).toString("hex"),
				}).save();
				const url = `${process.env.BASE_URL}users/${user.id}/verify/${token.token}`;
				await sendEmail(user.email, "Verify Email", url);
			}

			return res
				.status(400)
				.send({ message: "An Email sent to your account please verify" });
		}

		const token = user.generateAuthToken();
		res.status(200).send({ data: token, message: "logged in successfully" });
	} catch (error) {
		res.status(500).send({ message: "Internal Server Error" });
	}
});

router.post('/google', async (req, res) => {
	const { token } = req.body;
	const ticket = await client.verifyIdToken({
	  idToken: token,
	  audience: process.env.GOOGLE_CLIENT_ID,
	});
	const payload = ticket.getPayload();
	const userId = payload['sub'];
  
	// Check if the user already exists in your database
	let user = await User.findOne({ email: payload.email });
	if (!user) {
	  // If the user doesn't exist, create a new user
	  user = await new User({
		firstName: payload.given_name,
		lastName: payload.family_name,
		email: payload.email,
		password: '',
		verified: true,
	  }).save();
	}
  
	// Generate a JWT token for the user
	const jwtToken = user.generateAuthToken();
  
	res.status(200).send({ data: jwtToken, message: "Logged in successfully" });
  });
  
  const validate = (data) => {
	const schema = Joi.object({
	  email: Joi.string().email().required().label("Email"),
	  password: Joi.string().required().label("Password"),
	});
	return schema.validate(data);
  };
  
  module.exports = router;