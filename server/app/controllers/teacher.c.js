const teacherModel = require("../models/teacher.m");
const { v4: uuidv4 } = require("uuid");
const formidable = require('formidable');
const fs = require('fs');
const xlsx = require('xlsx');

module.exports = {
  getTemplateStudentList: async (req, res) => {
    const { classId } = req.query;
    try {
      const csvData = await teacherModel.getTemplateStudentList(classId);
      // res.setHeader("Content-Type", "text/csv");
      // res.setHeader(
      //   "Content-Disposition",
      //   "attachment; filename=student_template.csv"
      // );
      res.json(({
        status: 'success',
        csvData
      }))
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


      res.json({
        status: "success",
        data: gradeBoardData
      });
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
        class_id: req.body.classId,
        student_id: req.body.studentId,
        composition_id: req.body.compositionId,
        grade: req.body.grade,
      };
      console.log(data);
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
      const { id_class, compositionId } = req.query;
      console.log(compositionId);
      const csvData = await teacherModel.getGradingTemplate(id_class, compositionId);
      res.json({
        status: 'success',
        csvData
      })
    } catch (err) {
      res.json({
        status: "failed",
        err: err,
      });
    }
  },

  postAllGradesAssignment: async (req, res) => {
    let form = new formidable.IncomingForm();
    let data = []
    form.parse(req, async (err, fields, files) => {
      files.grades.forEach((file) => {
        const filePath = file.filepath;

        // fs.readFile(filePath, 'utf8', (err, data) => {
        //   if (err) {
        //     console.error('Error reading file:', err);
        //     // Handle the error
        //   } else {
        //     // 'data' will contain the contents of the file
        //     console.log('File contents:', data);

        //     // Continue with your logic here, e.g., parsing CSV data, processing, etc.
        //   }
        // }); 
        // Read the XLSX file
        const workbook = xlsx.readFile(filePath);



        const sheets = workbook.SheetNames

        for (let i = 0; i < sheets.length; i++) {
          const temp = xlsx.utils.sheet_to_json(
            workbook.Sheets[workbook.SheetNames[i]])
          temp.forEach((res) => {
            data.push(res)
          })
        }

      })
      const student_id_arr = data?.map((item) => item.StudentId)
      const grade_arr = data?.map((item) => item.Grade)
      try {
        const data = {
          class_id: fields.classId.toLocaleString(),
          student_id_arr,
          composition_id: fields.compositionId.toLocaleString(),
          grade_arr
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
    });


  },

  postFinalizedComposition: async (req, res) => {
    const { compositionId, isPublic } = req.body;
    try {
      const rs = await teacherModel.postFinalizedComposition(
        compositionId, isPublic
      );
      const finalizedComposition = rs.finalizedComposition;
      const studentList = rs.studentList;

      for (const student of studentList) {
        if (req.body.activeClient.has(student.id)) {
          const clientId = req.body.activeClient.get(student.id);
          req.body.io.to(clientId).emit("notificationCompositionFinalized", compositionId);
        }
      }

      res.status(200).json({
        status: "success",
        finalizedComposition
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

      // handle order of list grade from client
      for (let i = 0; i< listGrade.length; i++) {
        listGrade[i].order_id = i + 1; 
      }

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
              grade.grade_scale != gradeDb.grade_scale ||
              grade.order_id != gradeDb.order_id
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

  getGradeBoard: async (req, res) => {
    const classId = req.query.classId;
    try {
      const csvData = await teacherModel.getGradeBoard(classId);
      res.json({
        status: 'success',
        csvData
      })
    }
    catch (err) {
      res.json({
        status: 'failed',
        err: err
      })
    }
  },

  mapStudentId: async (req, res) => {
    const { classId, userId, studentId, oldStudentId } = req.body;
    try {
      const rs = await teacherModel.mapStudentIdWithStudentAccount(classId, studentId, userId, oldStudentId);
      res.json({
        status: 'success',
        data: rs
      })
    } catch (err) {
      res.json({
        status: 'failed',
        err: err
      })
    }
  },

  postFinalized: async (req, res) => {
    const composition_id = req.body.compositionId;
    try {
      const rs = await teacherModel.postFinalizedComposition(composition_id);
      res.json({
        status: 'success',
        data: rs
      })
    } catch (err) {
      res.json({
        status: 'failed',
        err: err
      })
    }
  },

  getListGradeReview: async (req, res) => {
    try {
      const teacher_user_id = req.query.user_id;
      const listGradeReview = await teacherModel.getListGradeReview(teacher_user_id);
      res.send(listGradeReview);
    } catch (error) {
      res.json({
        status: "failed",
        err: error,
      })
    }
  },

  getDetailGradeReview: async (req, res) => {
    try {
      const review_id = req.query.review_id;
      const reviewDetail = await teacherModel.getDetailGradeReview(review_id);

      res.send(reviewDetail);
    } catch (error) {
      res.json({
        status: "failed",
        err: error,
      })
    }
  },

  postFeedbackOnReview: async (req, res) => {
    try {
      const data = {
        review_id: req.body.review_id,
        feedback: req.body.feedback,
      }
      const rs = await teacherModel.postFeedbackOnReview(data.review_id, data.feedback);
      if (rs != null) {
        if (req.body.activeClient.has(rs.studentId.id)) {
          const clientId = req.body.activeClient.get(rs.studentId.id);
          req.body.io.to(clientId).emit('notificationFeedBackOnReview', 'have new notification');
        }
        res.send(rs.status);
      }
      else {
        res.json({
          status: "failed"
        })
      }
    } catch (error) {
      res.json({
        status: "failed",
        err: err,
      });
    }
  },

  postFinalizedGradeReview: async (req, res) => {
    try {
      const data = {
        review_id: req.body.review_id,
        accepted: req.body.accepted,
      };
      const rs = await teacherModel.postFinalizedGradeReview(data.review_id, data.accepted);
      if (rs != null) {
        if (req.body.activeClient.has(rs.studentId.id)) {
          const clientId = req.body.activeClient.get(rs.studentId.id);
          req.body.io.to(clientId).emit('notificationFeedBackOnReview', 'have new notification');
        }
        res.json(rs.studentGrade);
      } else {
        res.json({
          status: 'failed',
        })
      }
    } catch (error) {
      res.json({
        status: "failed",
        err: error,
      });
    }
  }
};
