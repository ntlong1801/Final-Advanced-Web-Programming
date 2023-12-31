import { useMutation } from 'react-query';
import { getGradeStructure, editGradeStructure } from 'apis/class.api';

import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router';
import './style.scss';

const user = JSON.parse(localStorage.getItem('user_profile'));

function GradeStructure() {
  const { classId } = useParams();
  const [isFormVisible, setIsFormVisible] = useState(false);
  const [isTeacherToEdit, setIsTeacherToEdit] = useState(false);
  const [listGrade, setListGrade] = useState([]);

  const { mutate } = useMutation(getGradeStructure);
  const { mutate: mutateHandleSave } = useMutation(editGradeStructure);

  useEffect(() => {
    setIsTeacherToEdit(true);
  });

  const showForm = () => {
    mutate(classId, {
      onSuccess: (response) => {
        const data = response.data.result;
        setListGrade(data);
      },
    });
    setIsFormVisible(true);
  };

  const hideForm = () => {
    setIsFormVisible(false);
  };

  const handleDeleteGrade = (indexToDelete) => {
    const newList = [...listGrade];

    newList.splice(indexToDelete, 1);

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
    setListGrade((prevList) => [...prevList, { name: '', grade_scale: '', class_id: classId }]);
  };

  const handleSave = () => {
    const dataSender = {
      emailSend: user.email,
      classId,
      listGrade
    };

    mutateHandleSave(dataSender);
    setIsFormVisible(false);
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
                    value={grade.grade_scale}
                    onChange={(e) => handleChangeValue(index, 'grade_scale', e.target.value)}
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
                <button type="button" className="submit-button" onClick={handleSave}>
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
