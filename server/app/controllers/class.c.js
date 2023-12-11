const classModel = require("../models/class.m");
const userModel = require("../models/user.m");
const crypto = require("crypto");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");

const classController = {
  // [POST] /addClass
  addClass: async (req, res) => {
    try {
      const classInfo = {
        name: req.body.name,
        description: req.body.description,
      };

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

  // [get]/join_class/join?email=email&link=link
  inviteUserByLink: async (req, res) => {
    const email = req.query.email;
    const linkJoinClass = req.query.link;

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
      // join user to class
      await classModel.addUserToClass(classInfo[0].id, userDb.id, userDb.role);
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

  inviteUserByEmail: async (req, res) => {
    

  },
  
  sendEmailInvitation: async (req, res) => {
    const emailReciver = req.body.email;
    const emailSend = req.body.emailSend;
    const checkEmail = await userModel.getUserByEmail(emailReciver);

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
      to: emailReciver,
      subject: "Email Verification - Localhost Website",
      text: `From ${emailSend} invited you. Click on this link to enter this classroom
     ${URLClient}/class/join/${token}.
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
