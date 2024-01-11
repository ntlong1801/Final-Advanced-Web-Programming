const adminM = require("../models/admin.m");

const adminController = {
    addUser: async (req, res) => {
        const user = req.body;
        if (user.email === undefined || user.password === undefined || user.fullName === undefined) {
            return res.status(400).json({
                status: 'failed',
                error: 'Missing required input data',
            });
        }

        if (typeof user.email !== 'string' || typeof user.password !== 'string' || typeof user.fullName !== 'string') {
            return res.status(400).json({
                status: 'failed',
                error: 'Invalid data types for input (email should be string, password should be string, fullName should be string)',
            });
        }
        try {
            const rs = await adminM.addAccount(user);
            return res.json({
                status: 'success',
                data: rs,
                message: 'Add user successfully'
            })

        } catch (err) {
            return res.json({
                status: 'failed',
                message: err
            })
        }
    },

    updateUser: async (req, res) => {
        const user = req.body;
        if (user.email === undefined || user.password === undefined || user.fullName === undefined) {
            return res.status(400).json({
                status: 'failed',
                error: 'Missing required input data',
            });
        }

        if (typeof user.email !== 'string' || typeof user.password !== 'string' || typeof user.fullName !== 'string') {
            return res.status(400).json({
                status: 'failed',
                error: 'Invalid data types for input (email should be string, password should be string, fullName should be string)',
            });
        }
        try {
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
        const userId = req.body.userId;
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
    }



};

module.exports = adminController;
