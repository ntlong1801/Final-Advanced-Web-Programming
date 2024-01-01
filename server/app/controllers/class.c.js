const classModel = require("../models/class.m");
const userModel = require("../models/user.m");
const crypto = require("crypto");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");
const classM = require("../models/class.m");

// const URLSever = process.env.URLSEVER;
const URLClient = process.env.URL_CLIENT;

const classController = {
    // [POST] /addClass
    addClass: async (req, res) => {
        try {
            const classInfo = {
                owner_id: req.body.userId,
                name: req.body.name,
                description: req.body.description
            }

      const addedClassInfo = await classModel.addClass(classInfo);

      res.json(addedClassInfo);
    } catch (err) {
      res.json({
        status: "failed",
        err: err,
      });
    }
  },

  // [GET] /getClasses
  getClasses: async (req, res) => {
    try {
      const classList = await classModel.getClasses();

      res.json(classList);
    } catch (err) {
      res.json(err);
    }
  },

  // [GET] /getClass?id={}
  getClass: async (req, res) => {
    try {
      const class_id = req.query.id;
      const classInfo = await classModel.getClass(class_id);

      res.json(classInfo);
    } catch (err) {
      res.json(err);
    }
  },

  // [POST] /updateClassInfo
  updateClassInfo: async (req, res) => {
    try {
      const classInfo = {
        id: req.body.id,
        name: req.body.name,
        description: req.body.description,
        invitation: req.body.invitation,
      };

      const updatedInfo = await classModel.updateClassInfo(classInfo);

      res.json(updatedInfo);
    } catch (err) {
      res.json({
        status: "failed",
      });
    }
  },

  // [POST] /addUserToClass
  addUserToClass: async (req, res) => {
    try {
      const data = {
        id_class: req.body.id_class,
        id_user: req.body.id_user,
        role: req.body.role,
      };

      const rs = await classModel.addUserToClass(
        data.id_class,
        data.id_user,
        data.role
      );

      res.json(rs);
    } catch (err) {
      res.json({
        status: "failed",
        err: err,
      });
    }
  },

  // [GET] /getAllUserFromClass
  getAllUserFromClass: async (req, res) => {
    try {
      const teachers = [];
      const students = [];
      const rawUsers = await classModel.getAllUserFromClass(req.query.id);
      for (const rawUser of rawUsers) {
        const user = await userModel.getUserByID(rawUser.id_user);
        if (rawUser.role === "teacher") {
          teachers.push(user);
        }
        if (rawUser.role === "student") {
          students.push(user);
        }
      }
      res.json({
        teachers,
        students,
      });
    } catch (err) {
      res.json({
        status: "failed",
        err: err,
      });
    }
  },

  // [GET] /classesByUserId
  getClassesByUserId: async (req, res) => {
    try {
      const classList = await classModel.getClassesByUserId(req.query.id);

      res.json(classList);
    } catch (err) {
      res.json(err);
    }
  },

  // [get]/class/join?email=email&link=link
  inviteUserByLink: async (req, res) => {
    const email = req.query.email;
    const linkJoinClass = req.query.link;
    const role = "student";

    try {
      const classInfo = await classModel.getClassByLink(linkJoinClass);
      // find class by link
      // link is invalid
      if (!classInfo) {
        return res.json({
          status: "failed",
          message: "Invalid link of class.",
        });
      }
      // if link is correct => find user by id
      const userDb = await userModel.getUserByEmail(email);

      //if user did not exist
      if (!userDb) {
        return res.json({
          status: "failed",
          message: "Your email is invalid.",
        });
      }

      // check user in class
      const existingUser = await classModel.getUserOfClassById(classInfo[0].id, userDb?.id);
      if (existingUser.length > 0) { 
        return res.json({
          status: 'failed',
          message: 'You already in the class',
        })
      }
      // join user to class
      await classModel.addUserToClass(classInfo[0].id, userDb.id, role);
      return res.json({
        status: "success",
        message: "Join class successfully!",
      });
    } catch (err) {
      return res.json({
        status: "failed",
        err: err,
      });
    }
  },

  checkTeacherOfClassById: async (req, res) => {
    const { user_id, class_id } = req.query;
    const rs = await classModel.checkTeacherOfClassById(class_id, user_id);

    if (rs.length > 0) {
      return res.json({
        status: "true"
      })
    }
    return res.json({
      status: "false"
     })
  },

  inviteUserByEmail: async (req, res) => {
    const { token } = req.params;
    const { userId } = req.query;

    // console.log("verify sigup email: ", token)

    jwt.verify(token, process.env.JWT_SECRETKEY_MAIL, async (err, decoded) => {
      if (!err) {

        const id_class = decoded.id_class;
        const emailUser = decoded.emailReciver;
        const roleUser = decoded.roleUser;

        // find id user
        const userDb = await userModel.getUserByEmail(emailUser);
        if (!userDb) {
          return res.json({ status: 'fail',
          code: '403',
        message: 'You have not register this app'}) }

        if (userId !== userDb.id) { return res.json({
          status: 'fail',
          code: '404',
          message: 'You must sign in with the truth email'
        })}

        // check user in class
        const existingUser = await classModel.getUserOfClassById(id_class, userDb.id);
      if (existingUser.length > 0) { 
        return res.json({
          status: 'failed',
          code: 'existed',
          message: 'You already in the class',
        })
      }
        
        // save user to database
        try {
          await classModel.addUserToClass(id_class, userDb.id, roleUser);
          return res.json({
            status: "success",
            code: '200',
            message: "Active successfully!"
          });
        } catch (error) {
          return res.json({
            status: "failed",
            code: '400',
            message: "Error active, please try agian!",
            err
          });
        }
      }
      // token is incorrect
      return res.send({
        status: "failed",
        code: '400',
        message: "Token is not valid or expired",
      });
    });

  },
  
  sendEmailInvitation: async (req, res) => {
    const emailReciver = req.body.emailReciver;
    const emailSend = req.body.emailSend;
    const id_class = req.body.classId;
    const roleUser = req.body.roleUser;
    const checkEmail = await userModel.getUserByEmail(emailSend);

    if (checkEmail === null) {
      return res.json({
        status: "failed",
        message: "Email does not exist yet."
      });
    }

    // email does not exist yet
    const token = jwt.sign({ emailReciver, emailSend, id_class, roleUser }, process.env.JWT_SECRETKEY_MAIL, {
      expiresIn: "7d",
    });

    const mailConfigurations = {
      from: process.env.EMAIL_ADDRESS || "webnangcao.final@gmail.com",
      to: emailReciver,
      subject: "Email Verification - Localhost Website",
      text: `From ${emailSend} invited you to class. Click on this link to enter this classroom
     ${URLClient}/inviteByEmail?token=${token}.
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
};

module.exports = classController;
