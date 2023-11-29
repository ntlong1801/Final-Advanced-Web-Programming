const db = require("../../config/connect_db");

module.exports = {
  getUsers: async () => {
    const rs = await db.any("SELECT * FROM users");
    return rs;
  },
  addUser: async (user) => {
    const rs = await db.one("INSERT INTO users (email, password, fullName) VALUES ($1, $2, $3) RETURNING *;", [user.email, user.password, user.fullName]);
    return rs;
  },
  getUserByEmail: async (email) => {
    try {
      const rs = await db.one("SELECT * FROM users WHERE email = $1;", [email]);
      return rs;
    } catch (err) {
      if (err.code === 0) {
        return null;
      } else {
        throw err;
      }
    }
  },
  getUserByID: async (id) => {
    try {
      const rs = await db.one("SELECT id, email, password, fullName FROM users WHERE id = $1;", [id]);
      return rs;
    } catch (err) {
      if (err.code === 0) {
        return null;
      } else {
        throw err;
      }
    }
  },
  updateProfile: async (user) => {
    try {
      const rs = await db.one("UPDATE users SET fullName = $2 WHERE id = $1 RETURNING *;", [user.id, user.fullName]);
      return rs;
    } catch (err) {
      console.log("Error in updateProfile in user.m: ", err);
      return null;
    }
  },
  changePassword: async (user) => {
    try {
      const rs = await db.one("UPDATE users SET password = $2 WHERE id = $1 RETURNING *;", [user.id, user.password]);
      return rs;
    } catch (err) {
      console.log("Error in changePassword in user.m: ", err);
      return null;
    }
  },
};
