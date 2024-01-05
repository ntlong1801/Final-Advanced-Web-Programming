const userM = require('./user.m')
const db = require("../../config/connect_db");
require('dotenv').config();

module.exports = {
    addAccount: async (user) => {
        try {
           const rs = await userM.addUser(user);
           return rs;
        } catch (err) {
            console.error('Error in addAccount', err);;
            return null;
        }
    },

    updateAccount: async (user) => { 
        try {
            const rs = await userM.updateUserByEmail(user);
            return rs;
         } catch (err) {
             console.error('Error in updateAccount', err);;
             return null;
         }
    },

    deleteAccount: async (userId) => { 
        try {
            const rs = await db.one(`
            DELETE FROM users 
            WHERE userId = $1;
            `, [userId]);
            return rs;
        } catch (err) {
            console.error('Error in deleteAccount', err);
            return null;
        }
    },

    banAccount: async (banned, userId) => {
        try {
            const rs = await db.one(`
            UPDATE users SET banned = $1
            WHERE id = $2 RETURNING*;
            `, [banned, userId]);
            return rs;
        } catch (err) {
            console.error('Error in banAccount', err);;
            return null;
        }
    },

    activeClass: async (active, classId) => {
        try {
            const rs = await db.one(`
            UPDATE classes SET inactive = $1
            WHERE id = $2 RETURNING*;
            `, [active, classId]);
            return rs;
        } catch (err) {
            console.error('Error in banAccount', err);;
            return null;
        }
    },


 }