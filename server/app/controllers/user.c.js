const userModel = require("../models/user.m");
const crypto = require("crypto");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");

const URLClient = process.env.URL_CLIENT;

const userController = {
  // [GET] /profile?id={id_user}
  getProfile: async (req, res) => {
    try {
      const infoUser = await userModel.getUserByID(req.query.id);

      const { password, ...others } = infoUser;

      res.json(others);
    } catch (error) {
      res.json(error);
    }
  },

  // [POST] /updateProfile
  updateProfile: async (req, res) => {
    try {
      const infoUser = {
        id: req.body.id,
        name: req.body.fullName,
      };

      const updatedInfoUser = await userModel.updateProfile(infoUser);

      const { password, ...others } = updatedInfoUser;

      res.json(others);
    } catch (error) {
      res.json("Can not update profile.");
    }
  },

  // [POST] /changePassword
  changePassword: async (req, res) => {
    try {
      // check old password
      const user = await userModel.getUserByID(req.body.id);
      const validPassword = await bcrypt.compare(
        req.body.oldPassword,
        user.password
      );
      if (!validPassword) {
        return res.json({
          status: "failed",
          message: "Incorrect Old Password!"
        });
      } else {
        // hash password
        const salt = await bcrypt.genSalt(11);
        const hashedNewPass = await bcrypt.hash(req.body.newPassword, salt);

        // create user with new password
        const infoUser = {
          id: req.body.id,
          password: hashedNewPass,
        };

        await userModel.changePassword(infoUser);
        return res.json({
          status: "success",
          message: "Change Password Successfully!"
        });
      }
    } catch (error) {
      res.json({
        status: "failed",
        message: "Change Password failure."
      });
    }
  },

  // [POST] /forgot-pasword
  forgotPasswordEmail: async (req, res) => {
    const { email } = req.body;
    const checkEmail = await userModel.getUserByEmail(email);

    if (checkEmail === null) {
      return res.json({
        status: "failed",
        message: "Email does not exist yet."
      });
    }

    // email does not exist yet
    const token = jwt.sign({ email }, process.env.JWT_SECRETKEY_MAIL, {
      expiresIn: "10m",
    });

    const mailConfigurations = {
      from: process.env.EMAIL_ADDRESS || "webnangcao.final@gmail.com",
      to: email,
      subject: "Email Verification - Localhost Website",
      text: `Hi! There, please follow the given link to get new password
     ${URLClient}/verify-token-email/forgot-password/${token}. Please dont share
     this link for anyone.
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
        return res.json({
          status: "failed",
          message: "Server is error now",
        });
      } else {
        return res.json({
          status: "success",
          message: "Check verify code in your email.",
        });
      }
    });
    return res.json({
      status: "success",
      message: "Check verify code in your email.",
    });
  },

  // [GET] /user/verify-forgot-password-email/:token
  verifyForgotPasswordTokenFromMail: async (req, res) => {
    const { token } = req.params;

    jwt.verify(token, process.env.JWT_SECRETKEY_MAIL, async (err, decoded) => {
      if (!err) {
        // token is correct => update password for user by email.
        // hash password
        const salt = await bcrypt.genSalt(11);

        //generate new password
        function generateRandomString(length) {
          return crypto
            .randomBytes(Math.ceil(length / 2))
            .toString("hex")
            .slice(0, length);
        }

        const newPasswordGen = generateRandomString(20);
        const newPasswordHashed = await bcrypt.hash(newPasswordGen, salt);

        // create new user

        const user = {
          email: decoded.email,
          password: newPasswordHashed,
        };

        try {
          // save user to database
          await userModel.changePassword(user);
          // send new password to user's email

          const mailConfigurations = {
            from: process.env.EMAIL_ADDRESS || "webnangcao.final@gmail.com",
            to: user.email,
            subject: "Email new password - Localhost Website",
            text: `Hi! There, your new password is ${newPasswordGen}. Please dont share this for anyone. Thanks.`,
          };

          const transporter = nodemailer.createTransport({
            service: process.env.EMAIL_SERVICE,
            auth: {
              user: process.env.EMAIL_ADDRESS,
              pass: process.env.EMAIL_PASSWORD,
            },
          });

          transporter.sendMail(mailConfigurations, function (error) {
            if (!error) {
              return res.json({
                status: "success",
                message: "Check mail to get new password.",
              });
            } else {
              return res.json({
                status: "failed",
                message: "Server is error now, please try again.",
              });
            }
          });
          return res.json({
            status: "success",
            message: "Check mail to get new password.",
          });
        } catch (error) {
          return res.json({
            status: "failed",
            message:
              "Error forgot password, please check information and try again.",
          });
        }
      }
      // token is incorrect
      return res.json({
        status: "failed",
        message: "Token is invalid or expired",
      });
    });
  },
};

module.exports = userController;
