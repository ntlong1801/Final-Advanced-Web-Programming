const studentModel = require("../models/student.m");
const classModel = require("../models/class.m");
const teacherModel = require("../models/teacher.m");
const { v4: uuidv4 } = require('uuid');

module.exports = {
  getGradeCompositionByStudent: async (req, res) => {
    const class_id = req.body.classId;
    const student_id = req.body.studentId;
    if (class_id === undefined || student_id === undefined) {
      return res.status(400).json({
        status: 'failed',
        error: 'Missing required input data (classId, studentId)',
      });
    }

    if (typeof class_id !== 'string' || typeof student_id !== 'string') {
      return res.status(400).json({
        status: 'failed',
        error: 'Invalid data types for input (classId should be string, studentId should be string)',
      });
    }

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
    const { student_explain, student_expected_grade } = req.body;

    if (student_id === undefined || composition_id === undefined || student_explain === undefined || student_expected_grade === undefined) {
      return res.status(400).json({
        status: 'failed',
        error: 'Missing required input data (studentId, compositionId, student_explain, student_expected_grade)',
      });
    }

    if (typeof student_id !== 'string' || typeof composition_id !== 'string' || typeof student_explain !== 'string' || typeof student_expected_grade !== 'number') {
      return res.status(400).json({
        status: 'failed',
        error: 'Invalid data types for input (studentId should be string, compositionId should be string, student_explain should be string, student_expected_grade should be number)',
      });
    }

    try {
      const { rs, teacherList } = await studentModel.postRequestCompositionReview(student_id, composition_id, student_expected_grade, student_explain);

      for (const teacher of teacherList) {
        if (req.body.activeClient.has(teacher.id)) {
          const clientId = req.body.activeClient.get(teacher.id);
          req.body.io.to(clientId).emit("notification", "have new notification!");
        }
      }

      res.json(rs);
    } catch (error) {
      res.json(error);
    }
  },

  commentGradeReview: async (req, res) => {
    const user_id = req.body.userId;
    const composition_id = req.body.compositionId;
    const comment_content = req.body.comment_content;

    if (user_id === undefined || composition_id === undefined || comment_content === undefined) {
      return res.status(400).json({
        status: 'failed',
        error: 'Missing required input data (userId, compositionId, comment_content)',
      });
    }

    if (typeof user_id !== 'string' || typeof composition_id !== 'string' || typeof comment_content !== 'string') {
      return res.status(400).json({
        status: 'failed',
        error: 'Invalid data types for input (userId should be string, compositionId should be string, comment_content should be string)',
      });
    }

    const feedback = {
      orderId: uuidv4(),
      user_id,
      comment_content
    }

    try {
      const { rs, teacherList } = await studentModel.commentGradeReview(composition_id, feedback);

      for (const teacher of teacherList) {
        if (req.body.activeClient.has(teacher.id)) {
          const clientId = req.body.activeClient.get(teacher.id);
          req.body.io.to(clientId).emit("notification", "have new notification!");
        }
      }
      res.json(rs);
    } catch (error) {
      res.json(error);
    }
  },

  getCommentReview: async (req, res) => {
    const { review_id } = req.body;
    if (review_id === undefined) {
      return res.status(400).json({
        status: 'failed',
        error: 'Missing required input data (review_id)',
      });
    }

    if (typeof review_id !== 'string') {
      return res.status(400).json({
        status: 'failed',
        error: 'Invalid data types for input (review_id should be string)',
      });
    }

    try {
      const rs = await studentModel.getCommentReview(review_id);

      res.json(rs[0].feedback);
    } catch (error) {
      res.json(error);
    }
  },

  getAllNotificationsByStudentId: async (req, res) => {
    const { studentId } = req.body;
    if (studentId === undefined) {
      return res.status(400).json({
        status: 'failed',
        error: 'Missing required input data studentId',
      });
    }

    if (typeof studentId !== 'string') {
      return res.status(400).json({
        status: 'failed',
        error: 'Invalid data types for input (studentId should be string)',
      });
    }

    try {
      const rs = await teacherModel.getAllNotificationsByTeacherId(studentId);

      res.json(rs);
    } catch (error) {
      
    }
  },

};
