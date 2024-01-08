const studentModel = require("../models/student.m");
const classModel = require("../models/class.m");
const teacherModel = require("../models/teacher.m");
const {v4 : uuidv4 } = require('uuid');

module.exports = {
  getGradeCompositionByStudent: async (req, res) => {
    const class_id = req.body.classId || "";
    const student_id = req.body.studenId || "";

    try {
      let dataGrade = [];
      // check grade composition of has been made public
      const compositionDb = await teacherModel.getGradeCompositionByID(
        class_id
      );

      for (let grade of compositionDb) {
        if (grade.public_grade) {
          let dataGradeDb = await studentModel.getGradeComposition(
            class_id,
            student_id,
            grade.id
          );
          dataGrade.push(dataGradeDb);
        }
      }

      res.json(dataGrade);
    } catch (error) {
      res.json(error);
    }
  },

  postRequestReviewComposition: async (req, res) => {
    const student_id = req.body.studentId;
    const composition_id = req.body.compositionId;
    const {student_explain, student_expected_grade} = req.body;

    try {
      const rsRequest = await studentModel.postRequestCompositionReview(student_id, composition_id, student_expected_grade, student_explain);

      res.json(rsRequest);
    } catch (error) {
      res.json(error);
    }
  },

  commentGradeReview: async (req, res) => {
    const user_id = req.body.userId;
    const composition_id = req.body.compositionId;
    const comment_content = req.body.comment_content;

    const feedback = {
      orderId: uuidv4(),
      user_id,
      comment_content
    }

    try {
      const rs = await studentModel.commentGradeReview(composition_id, feedback);

      res.json(rs);
    } catch (error) {
      res.json(error);
    }
  },

  getCommentReview: async (req, res) => {
    const {review_id} = req.body;

    try {
      const rs = await studentModel.getCommentReview(review_id);

      res.json(rs[0].feedback);
    } catch (error) {
      res.json(error);
    }
  },

};
