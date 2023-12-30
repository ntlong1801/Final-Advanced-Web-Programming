// GradeStructure.jsx

import React, { useEffect, useState } from 'react';
import './style.scss';

function GradeStructure() {
  const [isFormVisible, setIsFormVisible] = useState(false);
  const [isTeacherToEdit, setIsTeacherToEdit] = useState(false);
  const [listGrade, setListGrade] = useState([
    { name: 'Diem danh', grade: '10' },
    { name: 'Thi giữa kì', grade: '40' },
    { name: 'Thi cuối kì', grade: '50' },
  ]);

  useEffect(() => {
    setIsTeacherToEdit(true);
  });

  const showForm = () => {
    setIsFormVisible(true);
  };

  const hideForm = () => {
    setIsFormVisible(false);
  };

  const handleDeleteGrade = (indexToDelete) => {
    // Tạo một bản sao của mảng
    const newList = [...listGrade];

    // Xóa phần tử tại indexToDelete
    newList.splice(indexToDelete, 1);

    // Cập nhật state
    setListGrade(newList);
  };

  const handleChangeValue = (indexChange, typeChange, newValue) => {
    setListGrade((prev) => {
      const updatedInputList = [...prev];
      updatedInputList[indexChange][typeChange] = newValue;
      return updatedInputList;
    });
  };

  const handleAddNewGrade = () => {
    setListGrade((prevList) => [
      ...prevList,
      { name: '', grade: '' }, // Thêm một đối tượng mới với giá trị mặc định
    ]);
  };
  return (
    <div className="grade-structure">
      <button type="button" onClick={showForm}>
        Grade Structure
      </button>

      {isFormVisible && (
        <div className="overlay">
          <div className="form-container">
            {listGrade.map((grade, index) => (
              <form>
                <div className="form-group">
                  <label htmlFor="componentName">Tên:</label>
                  <input
                    type="text"
                    id="componentName"
                    name="componentName"
                    value={grade.name}
                    onChange={(e) => handleChangeValue(index, 'name', e.target.value)}
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="percentage">%:</label>
                  <input
                    type="text"
                    id="percentage"
                    name="percentage"
                    maxLength="5"
                    value={grade.grade}
                    onChange={(e) => handleChangeValue(index, 'grade', e.target.value)}
                  />
                  {isTeacherToEdit && (
                    <button
                      type="button"
                      className="delete-button"
                      onClick={() => handleDeleteGrade(index)}
                    >
                      x
                    </button>
                  )}
                </div>
              </form>
            ))}
            {isTeacherToEdit && (
              <button type="button" className="add-button" onClick={() => handleAddNewGrade()}>
                +
              </button>
            )}

            <div className="form-buttons">
              <button type="button" className="close-button" onClick={hideForm}>
                Close
              </button>
              {isTeacherToEdit && (
                <button type="button" className="submit-button">
                  Save
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default GradeStructure;
