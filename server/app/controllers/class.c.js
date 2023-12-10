const classModel = require('../models/class.m');
const userModel = require('../models/user.m');

const classController = {
    // [POST] /addClass
    addClass: async (req, res) => {
        try {
            const classInfo = {
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
            }

            const updatedInfo = await classModel.updateClassInfo(classInfo);

            res.json(updatedInfo);
        } catch (err) {
            res.json({
                status: "failed"
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
            }

            const rs = await classModel.addUserToClass(data.id_class, data.id_user, data.role);
            
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
                if (rawUser.role === 'teacher') {
                    teachers.push(user);
                }
                if (rawUser.role === 'student') {
                    students.push(user);
                }
            }    
            res.json({
                teachers,
                students
            });
        } catch(err) {
            res.json({
                status: "failed",
                err: err
            })
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
}

module.exports = classController;