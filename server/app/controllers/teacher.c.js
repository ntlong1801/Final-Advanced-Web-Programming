const teacherModel = require('../models/teacher.m');

module.exports = {
    getTemplateStudentList: (req, res) => {
        try {
            const csvData = teacherModel.getTemplateStudentList();
            res.setHeader('Content-Type', 'text/csv');
            res.setHeader('Content-Disposition', 'attachment; filename=student_template.csv');
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
                return { 'student_id': id_student, 'full_name': full_name[index] };
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
            }
            const updatedGrade = await teacherModel.postSingleGradeAssignment(data.class_id, data.student_id, data.composition_id, data.grade);

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
            res.setHeader('Content-Type', 'text/csv');
            res.setHeader('Content-Disposition', 'attachment; filename=grading_template.csv');
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
            }
            const updatedGradingList = await teacherModel.postAllGradesAssignment(data.class_id, data.student_id_arr, data.composition_id, data.grade_arr);

            res.status(200).json(updatedGradingList);
        } catch (err) {
            res.json({
                status: "failed",
                err: err,
            });
        }
    }
}