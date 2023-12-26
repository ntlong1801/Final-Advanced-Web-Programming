const db = require('../../config/connect_db');

require('dotenv').config();

module.exports = {
    getTemplateStudentList: () => {
        const csvData = "StudentId,FullName\n1,\n";
        return csvData;
    },

    postStudentList: async (csvData, id_class) => {
        try {
            const listStudent = await db.any(`
            SELECT id_user, full_name
            FROM class_user cu
            JOIN users u ON cu.id_user = u.id
            WHERE cu.id_class = $1 AND cu.role = 'student';`, [id_class]);
            const mapListStudent = listStudent.reduce((map, user) => {
                map[user.full_name] = user.id_user;
                return map;
            }, {});

            const mergedData = csvData.map(student => ({
                student_id: student.student_id,
                id_user: mapListStudent[student.full_name],
            }));

            const updateListStudent = [];
            for (const index of mergedData) {
                const addStudentID = await db.any("UPDATE class_user SET student_id = $3 WHERE id_class = $1 AND id_user = $2 RETURNING *;", [id_class, index.id_user, index.student_id]);
                updateListStudent.push(addStudentID);
            }
            return updateListStudent;

        } catch (error) {
            throw error;
        }
    },

    getClassGradeBoard: async (id_class) => {
        try {
            const listStudent = await db.any(`
            SELECT id_user, full_name, student_id
            FROM class_user cu
            JOIN users u ON cu.id_user = u.id
            WHERE cu.id_class = $1 AND cu.role = 'student';`, [id_class]);

            const classGradesData = [];
            for (const student of listStudent) {
                const studentGrades = await db.any(`
                SELECT cc.name , cg.grade
                FROM classes_grades cg
                JOIN classes_composition cc ON cg.composition_id = cc.id
                WHERE cg.class_id = $1 AND cg.student_id = $2`, [id_class, student.student_id]);
                
                const compositionNameArr = studentGrades.map(obj => obj.name);
                const gradeArray = studentGrades.map(obj => obj.grade);
                
                classGradesData.push({
                    student_id: student.student_id,
                    id_user: student.id_user,
                    full_name: student.full_name,
                    compositionNameArr: compositionNameArr,
                    gradeArray: gradeArray,
                });
            }
            return classGradesData;
        } catch (error) {
            throw error;
        }
    },

}