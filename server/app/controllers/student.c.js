const studentModel = require("../models/student.m");
const classModel = require("../models/class.m");
const teacherModel = require("../models/teacher.m");

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
};
