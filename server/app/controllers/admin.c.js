const adminM = require("../models/admin.m");
const bcrypt = require("bcrypt");


const adminController = {
    getAllAccount: async (req, res) => {
        const rs = await adminM.getAllAccount();
        return res.status(200).json(rs);
    },

    addUser: async (req, res) => {
        try {
            // hash password
            const salt = await bcrypt.genSalt(11);
            const hashed = await bcrypt.hash(req.body.password, salt);

            // create new user
            const user = {
                email: req.body.email,
                password: hashed,
                full_name: req.body.fullName,
                address: req.body.address,
                phone_number: req.body.phoneNumber,
                activation: true,
            };
            const rs = await adminM.addAccount(user);
            return res.json({
                status: 'success',
                data: rs,
                message: 'Add user successfully'
            })

        } catch (err) {
            console.log(err);
            return res.json({
                status: 'failed',
                message: err
            })
        }
    },

    updateUser: async (req, res) => {
        try {
             

 
             // create new user
             const user = {
                 email: req.body.email,
                 full_name: req.body.fullName,
                 address: req.body.address,
                 phone_number: req.body.phoneNumber,
                 activation: true,
             };
             // hash password
             if (req.body.password !== '') {
                const salt = await bcrypt.genSalt(11);
                const hashed = await bcrypt.hash(req.body.password, salt);
                user.password = hashed;
             } else {
                user.password = null;
             }
            const rs = await adminM.updateAccount(user);
            return res.json({
                status: 'success',
                data: rs,
                message: 'Update user successfully'
            })

        } catch (err) {
            return res.json({
                status: 'failed',
                message: err
            })
        }
    },

    deleteUser: async (req, res) => {
        const userId = req.query.userId;
        if (userId === undefined) {
            return res.status(400).json({
                status: 'failed',
                error: 'Missing required input data',
            });
        }

        if (typeof userId !== 'string') {
            return res.status(400).json({
                status: 'failed',
                error: 'Invalid data types for input (userId should be string)',
            });
        }

        try {
            const rs = await adminM.deleteAccount(userId);
            return res.json({
                status: 'success',
                data: rs,
                message: 'Delete user successfully'
            })

        } catch (err) {
            return res.json({
                status: 'failed',
                message: err
            })
        }
    },

    banUser: async (req, res) => {
        const { userId, banned } = req.body;
        if (userId === undefined || banned === undefined) {
            return res.status(400).json({
                status: 'failed',
                error: 'Missing required input data',
            });
        }

        if (typeof userId !== 'string' || typeof banned !== 'boolean') {
            return res.status(400).json({
                status: 'failed',
                error: 'Invalid data types for input (userId should be string, banned should be boolean)',
            });
        }

        try {
            const rs = await adminM.banAccount(banned, userId);

            return res.json({
                status: 'success',
                data: rs,
                message: 'Ban user successfully'
            })

        } catch (err) {
            return res.json({
                status: 'failed',
                message: err
            })
        }
    },

    inactiveClass: async (req, res) => {
        const { active, classId } = req.body;
        if (active === undefined || classId === undefined) {
            return res.status(400).json({
                status: 'failed',
                error: 'Missing required input data',
            });
        }

        if (typeof active !== 'boolean' || typeof classId !== 'string') {
            return res.status(400).json({
                status: 'failed',
                error: 'Invalid data types for input (active should be boolean, classId should be string)',
            });
        }
        try {
            const rs = await adminM.activeClass(active, classId);
            return res.json({
                status: 'success',
                data: rs,
                message: 'Active class successfully'
            })

        } catch (err) {
            return res.json({
                status: 'failed',
                message: err
            })
        }
    },

    mapStudentId: async (req, res) => {
        const {userId, studentId} = req.body;
        console.log(userId, studentId);
        try {
            const rs = await adminM.mapStudenId(userId, studentId);
            if (rs === null) {
                return res.json({
                    status: 'failed',
                    message: 'Student id already exists' 
                })
            }
            return res.json({
                status: 'success',
                data: rs,
            })
        } catch (err) {
            return res.json({
                status: 'failed',
                message: err 
            })
        }
    }



};

module.exports = adminController;
