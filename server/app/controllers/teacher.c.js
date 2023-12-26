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
            })
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
        } catch (error) {
            res.json({
                status: "failed",
                err: err,
            })
        }
    },

    getClassGradeBoard: async (req, res) => {
        try {
            const id_class = req.query.id_class;
            const gradeBoardData = await teacherModel.getClassGradeBoard(id_class);

            res.send(gradeBoardData);
        } catch (error) {
            res.json({
                status: "failed",
                err: err,
            })
        }
    }
}