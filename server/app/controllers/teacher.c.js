const teacherModel = require("../models/teacher.m");
const { v4: uuidv4 } = require("uuid");
const formidable = require("formidable");
const classModel = require("../models/class.m");
const fs = require("fs");
const xlsx = require("xlsx");

module.exports = {
  getTemplateStudentList: async (req, res) => {
    const { classId } = req.query;
    if (classId === undefined) {
      return res.status(400).json({
        status: "failed",
        error: "Missing required input data (classId)",
      });
    }

    if (typeof classId !== "string") {
      return res.status(400).json({
        status: "failed",
        error: "Invalid data types for input (classId should be string)",
      });
    }

    try {
      const csvData = await teacherModel.getTemplateStudentList(classId);
      res.json({
        status: "success",
        csvData,
      });
    } catch (err) {
      res.json({
        status: "failed",
        err: err,
      });
    }
  },

  postStudentList: async (req, res) => {
    let form = new formidable.IncomingForm();
    let data = [];
    form.parse(req, async (err, fields, files) => {
      files.grades.forEach((file) => {
        const filePath = file.filepath;
        // Read the XLSX file
        const workbook = xlsx.readFile(filePath);
        const sheets = workbook.SheetNames;

        for (let i = 0; i < sheets.length; i++) {
          const temp = xlsx.utils.sheet_to_json(
            workbook.Sheets[workbook.SheetNames[i]]
          );
          temp.forEach((res) => {
            data.push(res);
          });
        }
      });
      const student_id_arr = data?.map((item) => item.StudentId);
      const full_name_arr = data?.map((item) => item.FullName);
      try {
        const data = {
          class_id: fields.classId.toLocaleString(),
          student_id_arr,
          composition_id: fields.compositionId.toLocaleString(),
          full_name_arr,
        };

        const postStudentList = await teacherModel.postStudentList(data);

        return res.status(200).json(postStudentList);
      } catch (err) {
        return res.json({
          status: "failed",
          err: err,
        });
      }
    });

    // try {
    //   const { student_id, full_name, id_class } = req.body;
    //   if (student_id === undefined || full_name === undefined || id_class === undefined) {
    //     return res.status(400).json({
    //       status: 'failed',
    //       error: 'Missing required input data (student_id, full_name, id_class)',
    //     });
    //   }

    //   if (typeof student_id !== 'string' || typeof full_name !== 'string' || typeof id_class !== 'string') {
    //     return res.status(400).json({
    //       status: 'failed',
    //       error: 'Invalid data types for input (student_id should be string, full_name should be string, id_class should be string)',
    //     });
    //   }
    //   var csvData = student_id.map(function (id_student, index) {
    //     return { student_id: id_student, full_name: full_name[index] };
    //   });
    //   const updateList = await teacherModel.postStudentList(csvData, id_class);

    //   res.json({ updateList: updateList });
    // } catch (err) {
    //   res.json({
    //     status: "failed",
    //     err: err,
    //   });
    // }
  },

  getClassGradeBoard: async (req, res) => {
    try {
      const { id_class } = req.query;
      if (id_class === undefined) {
        return res.status(400).json({
          status: "failed",
          error: "Missing required input data (id_class)",
        });
      }

      if (typeof id_class !== "string") {
        return res.status(400).json({
          status: "failed",
          error: "Invalid data types for input (id_class should be string)",
        });
      }
      const gradeBoardData = await teacherModel.getClassGradeBoard(id_class);

      res.json({
        status: "success",
        data: gradeBoardData,
      });
    } catch (err) {
      res.json({
        status: "failed",
        err: err,
      });
    }
  },

  postSingleGradeAssignment: async (req, res) => {
    const { classId, studentId, compositionId, grade } = req.body;
    if (
      classId === undefined ||
      studentId === undefined ||
      compositionId === undefined ||
      grade === undefined
    ) {
      return res.status(400).json({
        status: "failed",
        error:
          "Missing required input data (classId, studentId, compositionId, grade)",
      });
    }

    if (
      typeof classId !== "string" ||
      typeof studentId !== "string" ||
      typeof compositionId !== "string" ||
      typeof grade !== "number"
    ) {
      return res.status(400).json({
        status: "failed",
        error:
          "Invalid data types for input (classId should be string, studentId should be string, compositionId should be string, grade should be number)",
      });
    }

    try {
      const updatedGrade = await teacherModel.postSingleGradeAssignment(
        classId,
        studentId,
        compositionId,
        grade
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
      if (id_class === undefined || compositionId === undefined) {
        return res.status(400).json({
          status: "failed",
          error: "Missing required input data (id_class, compositionId)",
        });
      }

      if (typeof id_class !== "string" || typeof compositionId !== "string") {
        return res.status(400).json({
          status: "failed",
          error:
            "Invalid data types for input (id_class should be string, compositionId should be string)",
        });
      }

      const csvData = await teacherModel.getGradingTemplate(
        id_class,
        compositionId
      );
      res.json({
        status: "success",
        csvData,
      });
    } catch (err) {
      res.json({
        status: "failed",
        err: err,
      });
    }
  },

  postAllGradesAssignment: async (req, res) => {
    let form = new formidable.IncomingForm();
    let data = [];
    form.parse(req, async (err, fields, files) => {
      files.grades.forEach((file) => {
        const filePath = file.filepath;
        // Read the XLSX file
        const workbook = xlsx.readFile(filePath);
        const sheets = workbook.SheetNames;

        for (let i = 0; i < sheets.length; i++) {
          const temp = xlsx.utils.sheet_to_json(
            workbook.Sheets[workbook.SheetNames[i]]
          );
          temp.forEach((res) => {
            data.push(res);
          });
        }
      });
      const student_id_arr = data?.map((item) => item.StudentId);
      const grade_arr = data?.map((item) => item.Grade);
      try {
        const data = {
          class_id: fields.classId.toLocaleString(),
          student_id_arr,
          composition_id: fields.compositionId.toLocaleString(),
          grade_arr,
        };

        const updatedGradingList = await teacherModel.postAllGradesAssignment(
          data.class_id,
          data.student_id_arr,
          data.composition_id,
          data.grade_arr
        );

        return res.status(200).json(updatedGradingList);
      } catch (err) {
        return res.json({
          status: "failed",
          err: err,
        });
      }
    });
  },

  postFinalizedComposition: async (req, res) => {
    const { compositionId, isPublic } = req.body;
    if (isPublic === undefined || compositionId === undefined) {
      return res.status(400).json({
        status: "failed",
        error: "Missing required input data (isPublic, compositionId)",
      });
    }

    if (typeof isPublic !== "boolean" || typeof compositionId !== "string") {
      return res.status(400).json({
        status: "failed",
        error:
          "Invalid data types for input (isPublic should be boolean, compositionId should be string)",
      });
    }

    try {
      // get class id and class name
      const classDb = await classModel.getIdClassByComposition(compositionId);
      const className = await classModel.getClass(classDb.class_id);
      const content = `Teacher posted grade composition ${classDb.name} for class ${className.name}`;
      const link = `http://localhost:3000/c/${classDb.class_id}?tab=2`;
      const rs = await teacherModel.postFinalizedComposition(
        compositionId,
        isPublic,
        content,
        link
      );
      const finalizedComposition = rs.finalizedComposition;
      const studentList = rs.studentList;

      // socket.io
      // for (const student of studentList) {
      //   if (req.body.activeClient.has(student.id)) {
      //     const clientId = req.body.activeClient.get(student.id);
      //     req.body.io.to(clientId).emit("notification", compositionId);
      //   }
      // }

      res.status(200).json({
        status: "success",
        finalizedComposition,
      });
    } catch (err) {
      res.json({
        status: "failed",
        err: err,
      });
    }
  },

  getGradeDataOfClass: async (req, res) => {
    const { class_id } = req.query;
    if (class_id === undefined) {
      return res.status(400).json({
        status: "failed",
        error: "Missing required input data (class_id)",
      });
    }

    if (typeof class_id !== "string") {
      return res.status(400).json({
        status: "failed",
        error: "Invalid data types for input (class_id should be string)",
      });
    }
    try {
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
    const { listGrade, classId } = req.body;
    if (listGrade === undefined || classId === undefined) {
      return res.status(400).json({
        status: "failed",
        error: "Missing required input data (listGrade, classId)",
      });
    }

    if (typeof listGrade !== "object" || typeof classId !== "string") {
      return res.status(400).json({
        status: "failed",
        error:
          "Invalid data types for input (listGrade should be array, classId should be string)",
      });
    }

    try {
      // handle order of list grade from client
      for (let i = 0; i < listGrade.length; i++) {
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

        // list grade from client has not this grade composition
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
    const { classId } = req.query;
    if (classId === undefined) {
      return res.status(400).json({
        status: "failed",
        error: "Missing required input data (classId)",
      });
    }

    if (typeof classId !== "string") {
      return res.status(400).json({
        status: "failed",
        error: "Invalid data types for input (classId should be string)",
      });
    }

    try {
      const csvData = await teacherModel.getGradeBoard(classId);
      res.json({
        status: "success",
        csvData,
      });
    } catch (err) {
      res.json({
        status: "failed",
        err: err,
      });
    }
  },

  mapStudentId: async (req, res) => {
    const { classId, userId, studentId, oldStudentId } = req.body;
    if (
      classId === undefined ||
      userId === undefined ||
      studentId === undefined ||
      oldStudentId === undefined
    ) {
      return res.status(400).json({
        status: "failed",
        error:
          "Missing required input data (classId, userId, studentId, oldStudentId)",
      });
    }

    if (
      typeof classId !== "string" ||
      typeof userId !== "string" ||
      typeof studentId !== "string" ||
      typeof oldStudentId !== "string"
    ) {
      return res.status(400).json({
        status: "failed",
        error:
          "Invalid data types for input (classId should be string, userId should be string, studentId should be string, oldStudentId should be string)",
      });
    }

    try {
      const rs = await teacherModel.mapStudentIdWithStudentAccount(
        classId,
        studentId,
        userId,
        oldStudentId
      );
      res.json({
        status: "success",
        data: rs,
      });
    } catch (err) {
      res.json({
        status: "failed",
        err: err,
      });
    }
  },

  postFinalized: async (req, res) => {
    const composition_id = req.body.compositionId;
    if (composition_id === undefined) {
      return res.status(400).json({
        status: "failed",
        error: "Missing required input data (compositionId)",
      });
    }

    if (typeof composition_id !== "string") {
      return res.status(400).json({
        status: "failed",
        error: "Invalid data types for input (compositionId should be string)",
      });
    }

    try {
      const rs = await teacherModel.postFinalizedComposition(composition_id);
      res.json({
        status: "success",
        data: rs,
      });
    } catch (err) {
      res.json({
        status: "failed",
        err: err,
      });
    }
  },

  getListGradeReview: async (req, res) => {
    try {
      const teacher_user_id = req.query.userId;
      if (teacher_user_id === undefined) {
        return res.status(400).json({
          status: "failed",
          error: "Missing required input data (user_id)",
        });
      }

      if (typeof teacher_user_id !== "string") {
        return res.status(400).json({
          status: "failed",
          error: "Invalid data types for input (user_id should be string)",
        });
      }

      const listGradeReview = await teacherModel.getListGradeReview(
        teacher_user_id
      );
      return res.send(listGradeReview);
    } catch (error) {
      return res.json({
        status: "failed",
        err: error,
      });
    }
  },

  getDetailGradeReview: async (req, res) => {
    const { review_id } = req.query;
    if (review_id === undefined) {
      return res.status(400).json({
        status: "failed",
        error: "Missing required input data (review_id)",
      });
    }

    if (typeof review_id !== "string") {
      return res.status(400).json({
        status: "failed",
        error: "Invalid data types for input (review_id should be string)",
      });
    }

    try {
      const reviewDetail = await teacherModel.getDetailGradeReview(review_id);

      return res.send(reviewDetail);
    } catch (error) {
      return res.json({
        status: "failed",
        err: error,
      });
    }
  },

  postFeedbackOnReview: async (req, res) => {
    const { review_id, user_id, feedback, fullName, role } = req.body;

    if (
      review_id === undefined ||
      user_id === undefined ||
      feedback === undefined
    ) {
      return res.status(400).json({
        status: "failed",
        error: "Missing required input data (review_id, user_id, feedback)",
      });
    }

    if (
      typeof review_id !== "string" ||
      typeof user_id !== "string" ||
      typeof feedback !== "string"
    ) {
      return res.status(400).json({
        status: "failed",
        error:
          "Invalid data types for input (review_id should be string, user_id should be string, feedback should be string)",
      });
    }
    try {
      const storeFeedback = {
        user_id: user_id,
        full_name: fullName,
        role: role,
        comment_content: feedback,
        create_at: new Date().toLocaleString("en-US", {
          timeZone: "Asia/Bangkok",
        }),
      };
      // get composition id
      const reviewDb = await teacherModel.getReviewById(review_id);
      // get class id and class name
      const classDb = await classModel.getIdClassByComposition(
        reviewDb[0].composition_id
      );

      const className = await classModel.getClass(classDb.class_id);
      const content = `You have a response from review grade ${classDb.name} from teacher for class ${className.name}`;
      const link = `http://localhost:3000/c/${classDb.class_id}?tab=2`;

      const rs = await teacherModel.postFeedbackOnReview(
        review_id,
        storeFeedback,
        content,
        link
      );

      if (rs != null) {
        // socket.io
        // if (req.body.activeClient.has(rs.studentId.id)) {
        //   const clientId = req.body.activeClient.get(rs.studentId.id);
        //   req.body.io.to(clientId).emit('notification', 'have new notification on review feedback.');
        // }
        res.send(rs.status);
      } else {
        res.json({
          status: "failed",
        });
      }
    } catch (error) {
      res.json({
        status: "failed",
        err: error,
      });
    }
  },

  postFinalizedGradeReview: async (req, res) => {
    const { review_id, accepted, newGrade } = req.body;
    if (review_id === undefined || accepted === undefined) {
      return res.status(400).json({
        status: "failed",
        error: "Missing required input data (review_id, accepted)",
      });
    }

    if (typeof review_id !== "string" || typeof accepted !== "boolean") {
      return res.status(400).json({
        status: "failed",
        error:
          "Invalid data types for input (review_id should be string, accepted should be boolean)",
      });
    }

    try {
      const rs = await teacherModel.postFinalizedGradeReview(
        review_id,
        accepted,
        newGrade
      );
      if (rs != null) {
        // socket.io
        if (req.body.activeClient.has(rs.studentId.id)) {
          const clientId = req.body.activeClient.get(rs.studentId.id);
          req.body.io
            .to(clientId)
            .emit("notification", "have new notification in grade review.");
        }
        res.json(rs.studentGrade);
      } else {
        res.json({
          status: "failed",
        });
      }
    } catch (error) {
      res.json({
        status: "failed",
        err: error,
      });
    }
  },

  getAllNotificationsByTeacherId: async (req, res) => {
    const { teacherId } = req.body;
    // console.log("Teacher id: ", teacherId);
    if (teacherId === undefined) {
      return res.status(400).json({
        status: "failed",
        error: "Missing required input data teacherId",
      });
    }

    if (typeof teacherId !== "string") {
      return res.status(400).json({
        status: "failed",
        error: "Invalid data types for input (teacherId should be string)",
      });
    }

    try {
      const rs = await teacherModel.getAllNotificationsByTeacherId(teacherId);
      res.json(rs);
    } catch (error) {}
  },
};
