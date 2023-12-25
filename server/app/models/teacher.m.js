const db = require('../../config/connect_db');

require('dotenv').config();

module.exports = {
    getTemplateStudentList: () => {
        const csvData = "StudentId,FullName\n1,\n";
        return csvData;
        // const jsonData = [
        //     { StudentId: 1, FullName: '', },
        // ];
        // csvtojson({ noheader: false, headers: ['StudentId', 'FullName'] })
        //     .from(jsonData)
        //     .then((csvString) => {
        //         console.log(csvString);
        //         return csvData;
        //     })
        //     .catch((error) => {
        //         console.error('Error converting JSON to CSV:', error);
        //     });
    },

    postStudentList: async (csvData, id_class) => {
        try {
            const listStudent = await db.any(`
            SELECT id_user, full_name
            FROM class_user cu
            JOIN users u ON cu.id_user = u.id
            WHERE cu.id_class = $1 AND cu.role = 'student';`, [id_class]);
            console.log('list Student:' + listStudent);
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
            console.log('result: ' + updateListStudent);
            return updateListStudent;
    
        } catch (error) {
            console.error(error);
            throw error; 
        }
    }
    
}