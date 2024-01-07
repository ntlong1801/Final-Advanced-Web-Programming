const db = require("../../config/connect_db");

require("dotenv").config();

module.exports = {
  getGradeComposition: async (class_id, student_id, composition_id) => {
    try {
      const rs = await db.one(
        "SELECT * FROM classes_grades WHERE class_id = $1 AND student_id = $2 AND composition_id = $3;",
        [class_id, student_id, composition_id]
      );
      return rs;
    } catch (err) {
      if (err.code === 0) {
        return null;
      } else {
        throw err;
      }
    }
  },

  

};
