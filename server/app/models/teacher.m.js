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
                const addStudentID = await db.any(`
                UPDATE class_user 
                SET student_id = $3 
                WHERE id_class = $1 AND id_user = $2 
                RETURNING *;
                `, [id_class, index.id_user, index.student_id]);
                updateListStudent.push(addStudentID);
            }
            return updateListStudent;

        } catch (error) {
            console.error("Error posting csv of student list:", error);
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
                SELECT cc.name , cc.grade_scale, cg.grade
                FROM classes_grades cg
                JOIN classes_composition cc ON cg.composition_id = cc.id
                WHERE cg.class_id = $1 AND cg.student_id = $2`, [id_class, student.student_id]);

                const compositionNameArr = studentGrades.map(obj => obj.name);
                const gradeScaleArr = studentGrades.map(obj => obj.grade_scale);
                const gradeArray = studentGrades.map(obj => obj.grade);

                classGradesData.push({
                    student_id: student.student_id,
                    id_user: student.id_user,
                    full_name: student.full_name,
                    compositionNameArr: compositionNameArr,
                    gradeScaleArr: gradeScaleArr,
                    gradeArray: gradeArray,
                });
            }
            return classGradesData;
        } catch (error) {
            console.error("Error getting grade board:", error);
            throw error;
        }
    },

    postSingleGradeAssignment: async (class_id, student_id, composition_id, grade) => {
        try {
            const updatedGrade = await db.one(`
            INSERT INTO classes_grades (class_id, student_id, composition_id, grade)
            VALUES ($1, $2, $3, $4)
            ON CONFLICT (class_id, student_id, composition_id)
            DO UPDATE SET grade = $4
            RETURNING *
        `, [class_id, student_id, composition_id, grade])
            return updatedGrade;
        } catch (error) {
            console.error("Error updating grade:", error);
            throw error;
        }
    },

    getGradingTemplate: async (id_class) => {
        try {
            const listStudent = await db.any(`
            SELECT student_id
            FROM class_user
            WHERE id_class = $1 AND role = 'student';`, [id_class]);

            const studentIdArr = listStudent.map(item => parseInt(item.student_id));
            studentIdArr.sort((a, b) => a - b);

            let csvData = "StudentId,Grade\n";
            for (const student of studentIdArr) {
                csvData += `${student},\n`;
            }
            return csvData;
        } catch (error) {
            console.error("Error getting grading template:", error);
            throw error;
        }
    },

    postAllGradesAssignment: async (class_id, student_id_arr, composition_id, grade_arr) => {
        try {
            const arr_length = student_id_arr.length;
            const updatedGradingList = [];
            for (let i = 0; i < arr_length; i++) {
                const updatedGrade = await db.one(`
                INSERT INTO classes_grades (class_id, student_id, composition_id, grade)
                VALUES ($1, $2, $3, $4)
                ON CONFLICT (class_id, student_id, composition_id)
                DO UPDATE SET grade = $4
                RETURNING *
            `, [class_id, student_id_arr[i], composition_id, grade_arr[i]])
                updatedGradingList.push(updatedGrade);
            }
            return updatedGradingList;
        } catch (error) {
            console.error("Error posting grades of all students for a specific assignment:", error);
            throw error;
        }
    }

}