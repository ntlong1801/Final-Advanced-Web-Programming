const userModel = require("../models/user.m");

const bcrypt = require("bcrypt");
const nodemailer = require("nodemailer");
const jwt = require("jsonwebtoken");

const URLSever = process.env.URLSEVER;

require("dotenv").config();

let refreshTokens = [];

const authController = {
  // generate JWT_ACCESS_TOKEN
  generateAccessToken: (user) => {
    return jwt.sign(
      {
        userId: user.id,
      },
      process.env.JWT_ACCESS_KEY,
      { expiresIn: "1d" }
    );
  },

  // generate JWT_REFRESH_TOKEN
  generateRefreshToken: (user) => {
    return jwt.sign(
      {
        userId: user.id,
      },
      process.env.JWT_REFRESH_KEY,
      { expiresIn: "2d" }
    );
  },

  // [POST] /register
  registerUser: async (req, res) => {
    try {
      // check if email exists
      const checkEmail = await userModel.getUserByEmail(req.body.email);
      if (checkEmail != null) {
        return res.status(404).json("Email already exists!");
      }

      // hash password
      const salt = await bcrypt.genSalt(11);
      const hashed = await bcrypt.hash(req.body.password, salt);

      // create new user
      const user = {
        email: req.body.email,
        password: hashed,
        fullName: req.body.fullName,
      };

      // save user to database
      const { password, ...others } = await userModel.addUser(user);

      res.status(200).json(others);
    } catch (error) {
      res.status(500).json(error);
    }
  },

  // [POST] /register-email
  registerUserByEmail: async (req, res) => {
    // check if email exists
    const checkEmail = await userModel.getUserByEmail(req.body.email);
    const { email, password, fullName } = req.body;
    if (checkEmail != null) {
      return res.status(404).json("Email already exists!");
    }

    // email does not exist yet
    const token = jwt.sign(
      { email, password, fullName },
      process.env.JWT_SECRETKEY_MAIL,
      {
        expiresIn: "10m",
      }
    );

    const mailConfigurations = {
      from: process.env.EMAIL_ADDRESS || "webnangcao.final@gmail.com",
      to: email,
      subject: "Email Verification - Localhost Website",
      text: `Hi! There, You have recently visited 
     our website and entered your email.
     Please follow the given link to verify your email
     ${URLSever}/auth/verify-email/${token}
     Thanks`,
    };

    const transporter = nodemailer.createTransport({
      service: process.env.EMAIL_SERVICE,
      auth: {
        user: process.env.EMAIL_ADDRESS,
        pass: process.env.EMAIL_PASSWORD,
      },
    });

    transporter.sendMail(mailConfigurations, function (error) {
      if (error) {
        return res.status(400).send({
          status: "failed",
          message: "Server is error now",
        });
      } else {
        return res.status(200).send({
          status: "success",
          message: "Check verify code in your email.",
        });
      }
    });
  },

  // [GET] /verify-email/token
  verifyLoginTokenFromMail: async (req, res) => {
    const { token } = req.params;

    jwt.verify(token, process.env.JWT_SECRETKEY_MAIL, async (err, decoded) => {
      if (!err) {
        // token is correct => save data to db.
        // hash password
        const salt = await bcrypt.genSalt(11);
        const passwordHashed = await bcrypt.hash(decoded.password, salt);

        // create new user
        const user = {
          email: decoded.email,
          password: passwordHashed,
          fullName: decoded.fullName,
        };

        // save user to database
        try {
          await userModel.addUser(user);
          return res.status(200).json(others);
        } catch (error) {
          return res.status(401).send({
            status: "failed",
            message: "Error register, please check information again.",
          });
        }
      }
      // token is incorrect
      return res.status(401).send({
        status: "failed",
        message: "Token is not valid or expired",
      });
    });
  },

  // [POST] /login
  loginUser: async (req, res) => {
    try {
      // get user from database
      const user = await userModel.getUserByEmail(req.body.email);
      if (user == null) {
        return res.status(404).json("Account doesn't exist!");
      }

      const validPassword = await bcrypt.compare(
        req.body.password,
        user.password
      );
      if (!validPassword) {
        res.status(404).json("Wrong password!");
      } else {
        const accessToken = authController.generateAccessToken(user);
        const refreshToken = authController.generateRefreshToken(user);

        refreshTokens.push(refreshToken);

        res.cookie("refreshToken", refreshToken, {
          httpOnly: true,
          secure: true,
          path: "/",
          sameSite: "none",
        });

        const { password, ...others } = user;
        res.status(200).json({ ...others, accessToken });
      }
    } catch (error) {
      res.status(500).json(error);
    }
  },

  // [POST] /refresh
  requestRefreshToken: async (req, res) => {
    // take refresh token from user
    const refreshToken = req.cookies.refreshToken;

    if (!refreshToken) return res.status(401).json("401 Unauthorized!");

    // check if we have a refresh token but it isn't our refresh token
    if (!refreshTokens.includes(refreshToken)) {
      return res.status(403).json("403 Forbidden!");
    }

    jwt.verify(refreshToken, process.env.JWT_REFRESH_KEY, (err, user) => {
      if (err) {
        console.log(err);
      }

      // delete old refresh token
      refreshTokens = refreshTokens.filter((token) => token !== refreshToken);

      // create new JWT_ACCESS_TOKEN and JWT_REFRESH_TOKEN
      const newAccessToken = authController.generateAccessToken(user);
      const newRefreshToken = authController.generateRefreshToken(user);
      refreshTokens.push(newRefreshToken);

      res.cookie("refreshToken", newRefreshToken, {
        httpOnly: true,
        secure: true,
        path: "/",
        sameSite: "none",
      });

      res.status(200).json({ accessToken: newAccessToken });
    });
  },

  // [POST] /logout
  logoutUser: async (req, res) => {
    refreshTokens = refreshTokens.filter(
      (token) => token !== req.cookies.refreshToken
    );
    res.clearCookie("refreshToken");
    res.status(200).json("Logged out successfully!");
  },
};

module.exports = authController;
