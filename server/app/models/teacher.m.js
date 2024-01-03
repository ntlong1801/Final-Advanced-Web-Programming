const db = require("../../config/connect_db");

require("dotenv").config();

module.exports = {
  getTemplateStudentList: async (class_id) => {
    try {
      const csvData = await db.any(
        `
        SELECT cu.student_id as StudentId, u.full_name as FullName
        FROM class_user cu
        JOIN users u ON cu.id_user = u.id
        WHERE cu.id_class = $1 AND cu.role = 'student';
        `, [class_id]
      )
      return csvData;
    } catch (err) {
      console.error('Error template student list', err);
      return null;
    }

  },

  postStudentList: async (csvData, id_class) => {
    try {
      const listStudent = await db.any(
        `
            SELECT id_user, full_name
            FROM class_user cu
            JOIN users u ON cu.id_user = u.id
            WHERE cu.id_class = $1 AND cu.role = 'student';`,
        [id_class]
      );
      const mapListStudent = listStudent.reduce((map, user) => {
        map[user.full_name] = user.id_user;
        return map;
      }, {});

      const mergedData = csvData.map((student) => ({
        student_id: student.student_id,
        id_user: mapListStudent[student.full_name],
      }));

      const updateListStudent = [];
      for (const index of mergedData) {
        const addStudentID = await db.any(
          `
                UPDATE class_user 
                SET student_id = $3 
                WHERE id_class = $1 AND id_user = $2 
                RETURNING *;
                `,
          [id_class, index.id_user, index.student_id]
        );
        updateListStudent.push(addStudentID);
      }
      return updateListStudent;
    } catch (error) {
      console.error("Error posting csv of student list:", error);
      return null;
    }
  },

  getClassGradeBoard: async (id_class) => {
    try {
      const listStudent = await db.any(
        `
            SELECT id_user, full_name, student_id
            FROM class_user cu
            JOIN users u ON cu.id_user = u.id
            WHERE cu.id_class = $1 AND cu.role = 'student';`,
        [id_class]
      );

      const gradeArr = await db.any(`
      SELECT * 
      FROM classes_composition 
      WHERE class_id = $1`, [id_class]);

      const classGradesData = [];
      for (const student of listStudent) {
        const studentGrades = await db.any(
          `
                SELECT *
                FROM classes_grades
                WHERE class_id = $1 AND student_id = $2`,
          [id_class, student.student_id]
        );

        const gradeOfStudent = gradeArr.map((item) => {
          const matchingGrade = studentGrades.find((studentGrade) => studentGrade.composition_id === item.id);

          if (matchingGrade) {
            return { ...item, grade: matchingGrade.grade };
          }

          return item;
        });

        totalGrade = gradeOfStudent.reduce((grade, cur) => grade + ((cur?.grade || 0) * cur.grade_scale/100), 0 ).toFixed(2);

        classGradesData.push({
          student_id: student.student_id,
          id_user: student.id_user,
          full_name: student.full_name,
          gradeArray: gradeOfStudent,
          totalGrade: parseFloat(totalGrade)
        });
      }
      return classGradesData;
    } catch (error) {
      console.error("Error getting grade board:", error);
      return null;
    }
  },

  postSingleGradeAssignment: async (
    class_id,
    student_id,
    composition_id,
    grade
  ) => {
    try {
      const updatedGrade = await db.one(
        `
            INSERT INTO classes_grades (class_id, student_id, composition_id, grade)
            VALUES ($1, $2, $3, $4)
            ON CONFLICT (class_id, student_id, composition_id)
            DO UPDATE SET grade = $4
            RETURNING *
        `,
        [class_id, student_id, composition_id, grade]
      );
      return updatedGrade;
    } catch (error) {
      console.error("Error updating grade:", error);
      return null;
    }
  },

  getGradingTemplate: async (id_class, composition_id) => {
    try {
      const listStudent = await db.any(
        `
            SELECT id_user, full_name, student_id
            FROM class_user cu
            JOIN users u ON cu.id_user = u.id
            WHERE cu.id_class = $1 AND cu.role = 'student';`,
        [id_class]
      );

      const gradeArr = await db.one(`
      SELECT * 
      FROM classes_composition 
      WHERE class_id = $1 AND id = $2`, [id_class, composition_id]);
      console.log(gradeArr);

      const classGradesData = [];
      for (const student of listStudent) {
        const studentGrades = await db.any(
          `
                SELECT *
                FROM classes_grades
                WHERE class_id = $1 AND student_id = $2`,
          [id_class, student.student_id]
        );


        const matchingGrade = studentGrades.find((studentGrade) => studentGrade.composition_id === gradeArr.id);
        
        
        classGradesData.push({
          StudentId: student.student_id,
          Grade: matchingGrade?.grade || null,
        });
      }
      return classGradesData;
    } catch (error) {
      console.error("Error getting grading template:", error);
      return null;
    }
  },

  postAllGradesAssignment: async (
    class_id,
    student_id_arr,
    composition_id,
    grade_arr
  ) => {
    try {
      const arr_length = student_id_arr.length;
      const updatedGradingList = [];
      for (let i = 0; i < arr_length; i++) {
        const updatedGrade = await db.one(
          `
                INSERT INTO classes_grades (class_id, student_id, composition_id, grade)
                VALUES ($1, $2, $3, $4)
                ON CONFLICT (class_id, student_id, composition_id)
                DO UPDATE SET grade = $4
                RETURNING *
            `,
          [class_id, student_id_arr[i], composition_id, grade_arr[i]]
        );
        updatedGradingList.push(updatedGrade);
      }
      return updatedGradingList;
    } catch (error) {
      console.error(
        "Error posting grades of all students for a specific assignment:",
        error
      );
      return null;
    }
  },

  postFinalizedComposition: async (composition_id, isPublic) => {
    try {
      const finalizedComposition = await db.one(
        `
            UPDATE classes_composition
            SET public_grade = $2
            WHERE id = $1
            RETURNING *;
            `,
        [composition_id, !isPublic]
      );

      return finalizedComposition;
    } catch (error) {
      console.error("Error mark a grade composition as finalized:", error);
      return null;
    }
  },

  getAllGradeStructureForClass: async (class_id) => {
    try {
      const rs = await db.any(
        "SELECT * FROM classes_composition WHERE class_id = $1;",
        [class_id]
      );
      return rs;
    } catch (error) {
      if (error.code === 0) {
        return null;
      } else {
        throw error;
      }
    }
  },

  addNewGradeCompositionForClass: async (grade_composition) => {
    const rs = await db.one("INSERT INTO classes_composition (id, class_id, name, grade_scale) VALUES ($1, $2, $3, $4) RETURNING *;", [grade_composition.id, grade_composition.class_id, grade_composition.name, grade_composition.grade_scale]);
    return rs;
  },

  updateGradeCompositionForClass: async (new_composition) => {
    try {
      const rs = await db.one("UPDATE classes_composition SET name = $2, grade_scale = $3 WHERE id = $1 RETURNING *;",
        [new_composition.id, new_composition.name, new_composition.grade_scale]);
      return rs;
    } catch (err) {
      console.log("Error in update grade structure for class: ", err);
      return null;
    }
  },

  deleteGradeCompositionById: async (composition_id) => {
    try {
      const rs = await db.one("DELETE FROM classes_composition WHERE id = $1 RETURNING *;",
        [composition_id]);
      return rs;
    } catch (err) {
      console.log("Error in delete grade composition for class: ", err);
      return null;
    }
  },

  getGradeBoard: async (class_id) => {
    try {
      const listStudent = await db.any(
        `
            SELECT id_user, full_name, student_id
            FROM class_user cu
            JOIN users u ON cu.id_user = u.id
            WHERE cu.id_class = $1 AND cu.role = 'student';`,
        [class_id]
      );

      const gradeArr = await db.any(`
      SELECT * 
      FROM classes_composition 
      WHERE class_id = $1`, [class_id]);

      const classGradesData = [];
      for (const student of listStudent) {
        const studentGrades = await db.any(
          `
                SELECT *
                FROM classes_grades
                WHERE class_id = $1 AND student_id = $2`,
          [class_id, student.student_id]
        );


        const gradeOfStudent = gradeArr.map((item) => {
          const matchingGrade = studentGrades.find((studentGrade) => studentGrade.composition_id === item.id);
        
          if (matchingGrade) {
            return { ...item, grade: matchingGrade.grade };
          }
        
          return item;
        });

        totalGrade = gradeOfStudent.reduce((grade, cur) => grade + ((cur?.grade || 0) * cur.grade_scale/100), 0 );
        
        classGradesData.push({
          StudentId: student.student_id,
          FullName: student.full_name,
          ...Object.fromEntries(gradeOfStudent.map((grade) => [grade.name.toLocaleString(), parseFloat(grade.grade || 0)])),
          totalGrade
        });
      }
      return classGradesData;
    } catch (error) {
      console.error("Error getting grading template:", error);
      throw error;
    }
  },

  mapStudentIdWithStudentAccount: async (class_id, student_id, user_id, old_student_id) => {
    try {
      const rs = db.one(
        `
        UPDATE class_user 
        SET student_id = $1
        WHERE id_class = $2 AND id_user = $3 RETURNING*;
        `,
        [student_id, class_id, user_id]
      );
      if (old_student_id) {
        const rs1 = db.any( 
          `
          UPDATE classes_grades
          SET student_id = $1
          WHERE student_id = $2 RETURNING*;
          `,
          [student_id, old_student_id]
      )
      return rs1;
      }
      return rs;
    }
    catch (err) {
      console.error("Error in mapStudentIdWithStudentAccount", err);
      throw err;
    }
  },

  getListGradeReview: async (teacher_user_id) => {
    try {
      const listGradeReview = await db.any(`
      SELECT gr.*, cc.name AS composition_name
      FROM grades_reviews gr
      JOIN classes_composition cc ON gr.composition_id = cc.id
      JOIN class_user cu ON cc.class_id = cu.id_class
      WHERE cu.id_user = $1 AND cu.role = 'teacher';
      `, [teacher_user_id]);

      return listGradeReview;
    } catch (err) {
      console.log("Error getting grade reviews list: ", err);
      return null;
    }
  },

  getDetailGradeReview: async (review_id) => {
    try {
      const detailReview = await db.one(`
      SELECT
        gr.*,
        us.full_name AS student_name,
        cc.class_id,
        cc.name AS composition_name,
        cc.grade_scale
      FROM
        grades_reviews gr
      JOIN
          classes_composition cc ON gr.composition_id = cc.id
      JOIN
          class_user cu ON cc.class_id = cu.id_class AND gr.student_id = cu.student_id
      JOIN
          users us ON cu.id_user = us.id
      WHERE
          gr.id = $1;

      `, [review_id]);

      return detailReview;
    } catch (error) {
      console.log("Error getting a grade review detail: ", err);
      return null;
    }
  },

  postFeedbackOnReview: async (review_id, feedback) => {
    try {
      const rs = await db.none(`
      UPDATE grades_reviews
      SET feedback = $2
      WHERE id = $1;
      `, [review_id, feedback]);

      return {
        status: "success"
      }
    } catch (error) {
      console.log('Error updating feedback on grade review: ', error);
      return null;
    }
  },

  postFinalizedGradeReview: async (review_id, accepted, data) => {
    try {
      const closeReview = await db.none(`
      UPDATE grades_reviews
      SET review_success = true
      WHERE id = $1;
      `, [review_id]);

      if (accepted) {
        const reviewDetail = await db.one(`
        SELECT * 
        FROM grades_reviews
        WHERE id = $1;
        `, [review_id]);
        
        const studentGrade = await db.one(`
        UPDATE classes_grades
        SET grade = $3
        WHERE composition_id = $1 AND student_id = $2
        RETURNING *;
        `, [reviewDetail.composition_id, reviewDetail.student_id, reviewDetail.student_expected_grade]);

        return studentGrade;
      }
      return { status: "success" };
    } catch (error) {
      console.log(`Error finalizing grade review: `, error);
      return null;
    }
  },

};
