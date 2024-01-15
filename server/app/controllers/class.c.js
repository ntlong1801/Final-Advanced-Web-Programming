const classModel = require("../models/class.m");
const userModel = require("../models/user.m");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");
const classM = require("../models/class.m");
const userM = require("../models/user.m");

const URLClient = process.env.URL_CLIENT;

const classController = {
  // [POST] /addClass
  addClass: async (req, res) => {
    const { userId, name, description } = req.body;
    if (userId === undefined || name === undefined || description === undefined) {
      return res.status(400).json({
        status: 'failed',
        error: 'Missing required input data (userId, name, description)',
      });
    }

    if (typeof userId !== 'string' || typeof name !== 'string' || typeof description !== 'string') {
      return res.status(400).json({
        status: 'failed',
        error: 'Invalid data types for input (userId should be string, name should be string, description should be string)',
      });
    }
    try {
      const classInfo = {
        owner_id: userId,
        name: name,
        description: description
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
    const class_id = req.query.id;
    if (class_id === undefined) {
      return res.status(400).json({
        status: 'failed',
        error: 'Missing required input data (id)',
      });
    }

    if (typeof class_id !== 'string') {
      return res.status(400).json({
        status: 'failed',
        error: 'Invalid data types for input (id should be string)',
      });
    }

    try {
      const classInfo = await classModel.getClass(class_id);

      res.json(classInfo);
    } catch (err) {
      res.json(err);
    }
  },

  // [POST] /updateClassInfo
  updateClassInfo: async (req, res) => {
    const { id, name, description, invitation } = req.body;
    if (id === undefined || name === undefined || description === undefined || invitation === undefined) {
      return res.status(400).json({
        status: 'failed',
        error: 'Missing required input data (id, name, description, invitation)',
      });
    }

    if (typeof id !== 'string' || typeof name !== 'string' || typeof description !== 'string' || typeof invitation !== 'string') {
      return res.status(400).json({
        status: 'failed',
        error: 'Invalid data types for input (userId should be string, name should be string, description should be string, invitation should be string)',
      });
    }

    try {
      const classInfo = {
        id: id,
        name: name,
        description: description,
        invitation: invitation,
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
    const { id_class, id_user, role } = req.body;
    if (id_class === undefined || id_user === undefined || role === undefined) {
      return res.status(400).json({
        status: 'failed',
        error: 'Missing required input data (id_class, id_user, role)',
      });
    }

    if (typeof id_class !== 'string' || typeof id_user !== 'string' || typeof role !== 'string') {
      return res.status(400).json({
        status: 'failed',
        error: 'Invalid data types for input (id_class should be string, id_user should be string, role should be string)',
      });
    }

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

    try {
      const teachers = [];
      const students = [];
      const rawUsers = await classModel.getAllUserFromClass(id);
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
    try {
      const classList = await classModel.getClassesByUserId(id);

      res.json(classList);
    } catch (err) {
      res.json(err);
    }
  },

  // [post]/class/join?email=email&link=link
  inviteUserByLink: async (req, res) => {
    const {email, link: linkJoinClass, studentId} = req.body;
    if (email === undefined || linkJoinClass === undefined) {
      return res.status(400).json({
        status: 'failed',
        error: 'Missing required input data (email, link)',
      });
    }

    if (typeof email !== 'string' || typeof linkJoinClass !== 'string') {
      return res.status(400).json({
        status: 'failed',
        error: 'Invalid data types for input (email should be string, link should be string)',
      });
    }
    const role = "student";

    try {
      const classInfo = await classModel.getClassByLink(linkJoinClass);
      // find class by link
      // link is invalid
      if (classInfo.length === 0) {
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
      // add studentId
      if (studentId) { 
        const createStudentId = await userM.postStudentId(userDb?.id, studentId);
        const studentIdExist = await userM.getStudentId(userDb.id);
        if (!createStudentId && !studentIdExist) {
          return res.json({
            status: "failed",
            message: "StudentId already exists",
          })
        }
      }
      // join user to class
      const rs = await classModel.addUserToClass(classInfo[0].id, userDb.id, role);
      if (rs) {
        const full_name = await userM.getFullNameOfUser(userDb.id);
        if (studentId) {
          const studentIdExist = await userM.getStudentId(userDb.id);
          if (studentIdExist) {
            await classM.addUserToStudentList(studentId, classByLink[0].id, full_name.full_name, true);
          }
        } 
        return res.json({
          status: "success",
          message: "Join class successfully!",
        });
      }
      return res.json({
        status: "failed",
        message: "Join class failed!",
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
    if (user_id === undefined || class_id === undefined) {
      return res.status(400).json({
        status: 'failed',
        error: 'Missing required input data (user_id, class_id)',
      });
    }

    if (typeof user_id !== 'string' || typeof class_id !== 'string') {
      return res.status(400).json({
        status: 'failed',
        error: 'Invalid data types for input (user_id should be string, class_id should be string)',
      });
    }

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

    if (userId === undefined) {
      return res.status(400).json({
        status: 'failed',
        error: 'Missing required input data (userId)',
      });
    }

    if (typeof userId !== 'string') {
      return res.status(400).json({
        status: 'failed',
        error: 'Invalid data types for input (userId should be string)',
      });
    }
    
    jwt.verify(token, process.env.JWT_SECRETKEY_MAIL, async (err, decoded) => {
      if (!err) {

        const id_class = decoded.id_class;
        const emailUser = decoded.emailReciver;
        const roleUser = decoded.roleUser;

        // find id user
        const userDb = await userModel.getUserByEmail(emailUser);
        if (!userDb) {
          return res.json({
            status: 'failed',
            code: '403',
            message: 'You have not register this app'
          })
        }

        if (userId !== userDb.id) {
          return res.json({
            status: 'failed',
            code: '404',
            message: 'You must sign in with the truth email'
          })
        }

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
    const emailReceiver = req.body.emailReciver;
    const emailSend = req.body.emailSend;
    const id_class = req.body.classId;
    const roleUser = req.body.roleUser;
    if (emailReceiver === undefined || emailSend === undefined || id_class === undefined || roleUser === undefined) {
      return res.status(400).json({
        status: 'failed',
        error: 'Missing required input data (emailReciver, emailSend, classId, roleUser)',
      });
    }

    if (typeof emailReceiver !== 'string' || typeof emailSend !== 'string' || typeof id_class !== 'string' || typeof roleUser !== 'string') {
      return res.status(400).json({
        status: 'failed',
        error: 'Invalid data types for input (emailReciver should be string, emailSend should be string, classId should be string, roleUser should be string)',
      });
    }

    const checkEmail = await userModel.getUserByEmail(emailSend);

    if (checkEmail === null) {
      return res.json({
        status: "failed",
        message: "Email does not exist yet."
      });
    }

    // email does not exist yet
    const token = jwt.sign({ emailReciver: emailReceiver, emailSend, id_class, roleUser }, process.env.JWT_SECRETKEY_MAIL, {
      expiresIn: "7d",
    });

    const mailConfigurations = {
      from: process.env.EMAIL_ADDRESS || "webnangcao.final@gmail.com",
      to: emailReceiver,
      subject: "Email Verification - Localhost Website",
    //   text: `From ${emailSend} invited you to class. Click on this link to enter this classroom.
    //  Thanks`,
     html: `<p>From ${emailSend} invited you to class. Click on this link to enter this classroom</p>
     <a href='${URLClient}/inviteByEmail?token=${token}'>Click here</a>
     <p>Thanks!</p>`
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
        console.log(error);
        return res.json({
          status: "failed",
          message: "Server is error now",
          err: error
        });
      } else {
        return res.json({
          status: "success",
          message: "Check verify code in your email.",
        });
      }
    });
    // return res.json({
    //   status: "success",
    //   message: "Check verify code in your email.",
    // });
  },

  joinClassByCode: async (req, res) => {
    const { userId, studentId, classCode } = req.body;

    if (userId === undefined || classCode === undefined) {
      return res.status(400).json({
        status: 'failed',
        error: 'Missing required input data (userId, classCode)',
      });
    }

    if (typeof userId !== 'string' || typeof classCode !== 'string') {
      return res.status(400).json({
        status: 'failed',
        error: 'Invalid data types for input (userId should be string, classCode should be string)',
      });
    }

    try {
      const link = `${URLClient}/invite/${classCode}`;
      const classByLink = await classM.getClassByLink(link);
      if (classByLink.length === 0) {
        return res.json({
          status: "failed",
          message: "Invalid class code"
        })
      }


      const userDd = await classM.getUserOfClassById(classByLink[0].id, userId);
      if (userDd.length > 0) {
        return res.json({
          status: "failed",
          message: "You already in the class",
        })
      }
      if (studentId) { 
        const createStudentId = await userM.postStudentId(userId, studentId);
        const studentIdExist = await userM.getStudentId(userId);
        if (!createStudentId && !studentIdExist) {
          return res.json({
            status: "failed",
            message: "StudentId already exists",
          })
        }
      }
      const rs = await classM.addUserToClass(classByLink[0].id, userId, "student", studentId);
      if (rs) {
        const full_name = await userM.getFullNameOfUser(userId);
        if (studentId) {
          await classM.addUserToStudentList(studentId, classByLink[0].id, full_name.full_name, true);
        } else {
          const studentIdExist = await userM.getStudentId(userId);
          await classM.addUserToStudentList(studentIdExist.student_id, classByLink[0].id, full_name.full_name, true);
        }
        return res.json({
          status: "success",
          message: "Join class successfully"
        });
      }
    } catch (err) {
      console.log(err);
      return res.json({
        status: "failed",
        message: err
      });
    }
  },

};

module.exports = classController;
