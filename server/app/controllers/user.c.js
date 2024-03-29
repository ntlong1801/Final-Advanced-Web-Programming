const userModel = require("../models/user.m");
const crypto = require("crypto");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");
const userM = require("../models/user.m");

const URLClient = process.env.URL_CLIENT;

const userController = {
  // [GET] /profile?id={id_user}
  getProfile: async (req, res) => {
    try {
      const { id } = req.query;
      if (id === undefined) {
        return res.status(400).json({
          status: 'failed',
          error: 'Missing required input data (id)',
        });
      }

      if (typeof id !== 'string') {
        return res.status(400).json({
          status: 'failed',
          error: 'Invalid data types for input (id should be string)',
        });
      }
      const infoUser = await userModel.getUserByID(id);

      const { password, ...others } = infoUser;

      res.json(others);
    } catch (error) {
      res.json(error);
    }
  },

  // [POST] /updateProfile
  updateProfile: async (req, res) => {
    const { id, fullName, address, phoneNumber } = req.body;
    if (id === undefined || fullName === undefined || address === undefined || phoneNumber === undefined) {
      return res.status(400).json({
        status: 'failed',
        error: 'Missing required input data (id, fullName, address, phoneNumber)',
      });
    }

    if (typeof id !== 'string' || typeof fullName !== 'string' || typeof address !== 'string' || typeof phoneNumber !== 'string') {
      return res.status(400).json({
        status: 'failed',
        error: 'Invalid data types for input (id should be string, fullName should be string, address should be string, phoneNumber should be string)',
      });
    }
    try {
      const infoUser = {
        id: id,
        full_name: fullName,
        address: address,
        phone_number: phoneNumber
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
    const { email, oldPassword, newPassword } = req.body;
    if (email === undefined || oldPassword === undefined || newPassword === undefined) {
      return res.status(400).json({
        status: 'failed',
        error: 'Missing required input data (email, oldPassword, newPassword)',
      });
    }

    if (typeof email !== 'string' || typeof oldPassword !== 'string' || typeof newPassword !== 'string') {
      return res.status(400).json({
        status: 'failed',
        error: 'Invalid data types for input (email should be string, oldPassword should be string, newPassword should be string)',
      });
    }

    try {
      // check old password
      const user = await userModel.getUserByEmail(email);
      const validPassword = await bcrypt.compare(
        oldPassword,
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
        const hashedNewPass = await bcrypt.hash(newPassword, salt);

        // create user with new password
        const infoUser = {
          email: email,
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

  // [POST] /forgot-password
  forgotPasswordEmail: async (req, res) => {
    const { email } = req.body;
    if (email === undefined) {
      return res.status(400).json({
        status: 'failed',
        error: 'Missing required input data (email)',
      });
    }

    if (typeof email !== 'string') {
      return res.status(400).json({
        status: 'failed',
        error: 'Invalid data types for input (email should be string)',
      });
    }

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

  // [POST] /user/renew-password-by-forgot-email/:token
  renewPasswordByForgotEmail: async (req, res) => {
    const { token } = req.params;
    const { newPassword } = req.body;
    if (newPassword === undefined) {
      return res.status(400).json({
        status: 'failed',
        error: 'Missing required input data (newPassword)',
      });
    }

    if (typeof newPassword !== 'string') {
      return res.status(400).json({
        status: 'failed',
        error: 'Invalid data types for input (newPassword should be string)',
      });
    }

    jwt.verify(token, process.env.JWT_SECRETKEY_MAIL, async (err, decoded) => {
      if (!err) {
        // token is correct => update password for user by email.
        // hash password
        const salt = await bcrypt.genSalt(11);

        const newPasswordHashed = await bcrypt.hash(newPassword, salt);

        // create new user

        const user = {
          email: decoded.email,
          password: newPasswordHashed,
        };

        try {
          // save user to database
          await userModel.changePassword(user);
          // send new password to user's email

          return res.json({
            status: "success",
            message: "Change password successfully",
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

  // [GET] /user/allUsers
  getAllUsers: async (req, res) => {
    const rs = await userM.getUsers();
    return res.json({
      users: rs,
      status: "success",
    })
  },

  // [POST] /user/studentId
  postStudentId: async (req, res) => { 
    const {userId, studentId} = req.body;
    const rs = await userM.postStudentId(userId, studentId);
    return res.json({ 
      studentId: rs,
      status: "success",
    })
  },

  // [GET] /user/studentId
  getStudentId: async (req, res) => { 
    const {userId} = req.query;
    const rs = await userM.getStudentId(userId);
    return res.json({ 
      studentId: rs,
      status: "success",
    });
  }
};

module.exports = userController;
