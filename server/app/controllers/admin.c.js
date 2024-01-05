const adminM = require("../models/admin.m");

const adminController = {
    addUser: async (req, res) => {
        const user = req.body;
        try {
            const rs = await adminM.addUser(user);
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
        try {
            const rs = await adminM.updateUser(user);
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
        try {
            const rs = await adminM.deleteUser(userId);
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
        const {userId, banned} = req.body;
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
        const {active, classId} = req.body;
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
