const teacherModel = require("../models/teacher.m");
const { v4: uuidv4 } = require("uuid");

module.exports = {
  getTemplateStudentList: (req, res) => {
    try {
      const csvData = teacherModel.getTemplateStudentList();
      res.setHeader("Content-Type", "text/csv");
      res.setHeader(
        "Content-Disposition",
        "attachment; filename=student_template.csv"
      );
      res.send(csvData);
    } catch (err) {
      res.json({
        status: "failed",
        err: err,
      });
    }
  },

  postStudentList: async (req, res) => {
    try {
      const student_id = req.body.student_id;
      const full_name = req.body.full_name;
      const id_class = req.body.id_class;
      var csvData = student_id.map(function (id_student, index) {
        return { student_id: id_student, full_name: full_name[index] };
      });
      const updateList = await teacherModel.postStudentList(csvData, id_class);

      res.json({ updateList: updateList });
    } catch (err) {
      res.json({
        status: "failed",
        err: err,
      });
    }
  },

  getClassGradeBoard: async (req, res) => {
    try {
      const id_class = req.query.id_class;
      const gradeBoardData = await teacherModel.getClassGradeBoard(id_class);

      res.send(gradeBoardData);
    } catch (err) {
      res.json({
        status: "failed",
        err: err,
      });
    }
  },

  postSingleGradeAssignment: async (req, res) => {
    try {
      const data = {
        class_id: req.body.class_id,
        student_id: req.body.student_id,
        composition_id: req.body.composition_id,
        grade: req.body.grade,
      };
      const updatedGrade = await teacherModel.postSingleGradeAssignment(
        data.class_id,
        data.student_id,
        data.composition_id,
        data.grade
      );

      res.status(200).json(updatedGrade);
    } catch (err) {
      res.json({
        status: "failed",
        err: err,
      });
    }
  },

  getGradingTemplate: async (req, res) => {
    try {
      const id_class = req.query.id_class;
      const csvData = await teacherModel.getGradingTemplate(id_class);
      res.setHeader("Content-Type", "text/csv");
      res.setHeader(
        "Content-Disposition",
        "attachment; filename=grading_template.csv"
      );
      res.send(csvData);
    } catch (err) {
      res.json({
        status: "failed",
        err: err,
      });
    }
  },

  postAllGradesAssignment: async (req, res) => {
    try {
      const data = {
        class_id: req.body.class_id,
        student_id_arr: req.body.student_id_arr,
        composition_id: req.body.composition_id,
        grade_arr: req.body.grade_arr,
      };
      const updatedGradingList = await teacherModel.postAllGradesAssignment(
        data.class_id,
        data.student_id_arr,
        data.composition_id,
        data.grade_arr
      );

      res.status(200).json(updatedGradingList);
    } catch (err) {
      res.json({
        status: "failed",
        err: err,
      });
    }
  },

  postFinalizedComposition: async (req, res) => {
    try {
      const composition_id = req.body.composition_id;
      const finalizedComposition = await teacherModel.postFinalizedComposition(
        composition_id
      );

      res.status(200).json({
        status: "succeed",
      });
    } catch (err) {
      res.json({
        status: "failed",
        err: err,
      });
    }
  },

  getGradeDataOfClass: async (req, res) => {
    try {
      const class_id = req.query.class_id;
      const rs = await teacherModel.getAllGradeStructureForClass(class_id);

      return res.json({ result: rs });
    } catch (error) {
      return res.json({
        status: "failed",
        err: "Can not get all grade structure.",
      });
    }
  },

  handleGradeStructure: async (req, res) => {
    try {
      const { listGrade, classId } = req.body;

      // get grade structure from db by class_id
      const listGradeFromDb = await teacherModel.getAllGradeStructureForClass(
        classId
      );
      //compare result from db with new grade of list from client
      for (let grade of listGrade) {
        // if this grade has not id => add new grade
        if (!grade.id) {
          grade.id = uuidv4();
          await teacherModel.addNewGradeCompositionForClass(grade);
          continue;
        }
        // update new information or keep old value
        for (let gradeDb of listGradeFromDb) {
          if (grade.id === gradeDb.id) {
            // changed name or grade_scale
            if (
              grade.name != gradeDb.name ||
              grade.grade_scale != gradeDb.grade_scale
            ) {
              // update new value for this grade of list grade
              await teacherModel.updateGradeCompositionForClass(grade);
            }
          }
        }
      }

      // check grade composition is removed
      for (let gradeDb of listGradeFromDb) {
        let isLived = false;

        for (let grade of listGrade) {
          if (gradeDb.id === grade.id) {
            isLived = true;
            break;
          }
        }

        // listgrade from client has not this grade composition
        if (!isLived) {
          // remove this grade composition in db
          await teacherModel.deleteGradeCompositionById(gradeDb.id);
        }
      }

      res.json({ result: "Update grade composition successfully!" });
    } catch (error) {
      res.json({
        status: "failed",
        err: "Update grade composition for class failed.",
      });
    }
  },
};
