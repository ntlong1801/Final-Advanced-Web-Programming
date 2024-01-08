const db = require("../../config/connect_db");
const {v4 : uuidv4 } = require('uuid');

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

  postRequestCompositionReview: async (student_id, composition_id, student_expected_grade, student_explain) => {
    try {
      const rs = await db.one(
        "INSERT INTO grades_reviews (id, student_id, composition_id, student_expected_grade, student_explain) VALUES ($1, $2, $3, $4, $5) RETURNING *",
        [uuidv4(), student_id, composition_id, student_expected_grade, student_explain]
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

  commentGradeReview: async (composition_id, feedback) => {
    try {
      const rs = await db.one(
        "UPDATE grades_reviews SET feedback = feedback || $2::jsonb WHERE composition_id = $1 RETURNING *",
        [composition_id, feedback]
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
  

  getCommentReview: async (id) => {
    try {
      const rs = await db.any(
        "SELECT feedback FROM grades_reviews WHERE id = $1;",
        [id]
      );
      return rs;
    } catch (err) {
      if (err.code === 0) {
        return null;
      } else {
        throw err;
      }
    }
  }

};
