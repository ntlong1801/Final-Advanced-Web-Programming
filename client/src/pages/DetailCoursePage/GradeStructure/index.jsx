import { useMutation, useQuery } from 'react-query';
import {
  getGradeStructure,
  editGradeStructure,
  isTeacherOfClass,
  getClassByID,
} from 'apis/class.api';

import React, { useState, useMemo, useEffect } from 'react';
import { useParams } from 'react-router';
import './style.scss';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';

const user = JSON.parse(localStorage.getItem('user_profile'));

function GradeStructure() {
  const { classId } = useParams();
  const [isFormVisible, setIsFormVisible] = useState(false);
  const [isTeacherToEdit, setIsTeacherToEdit] = useState(false);
  const [listGrade, setListGrade] = useState([]);

  const { mutate } = useMutation(getGradeStructure);
  const { mutate: mutateHandleSave } = useMutation(editGradeStructure);

  const { data: _data } = useQuery({
    queryKey: ['class', classId],
    queryFn: () => getClassByID(classId),
  });
  useMemo(() => _data?.data ?? [], [_data]);
  const { data: checkTeacher } = useQuery({
    queryKey: [classId],
    queryFn: () => isTeacherOfClass(user?.id, classId),
  });
  const isTeacher = useMemo(() => checkTeacher?.data?.status !== 'false', [checkTeacher]);

  useEffect(() => {
    setIsTeacherToEdit(isTeacher);
  }, [isFormVisible]);

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
    setIsTeacherToEdit(false);
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
      listGrade,
    };

    mutateHandleSave(dataSender, {
      onSuccess: (response) => {
        setIsTeacherToEdit(response.data.role);
      },
    });
    setIsFormVisible(false);
  };

  const handleDragEnd = (result) => {
    if (!result.destination) {
      return; // Item dropped outside the droppable area
    }
    const updatedList = Array.from(listGrade);
    const [movedItem] = updatedList.splice(result.source.index, 1);
    updatedList.splice(result.destination.index, 0, movedItem);
    setListGrade(updatedList);
  };
  return (
    <DragDropContext onDragEnd={handleDragEnd}>
      <div className="grade-structure">
        <button type="button" onClick={showForm}>
          Grade Structure
        </button>

        {isFormVisible && (
          <div className="overlay">
            <div className="form-container">
              <Droppable droppableId="grades">
                {(provided) => (
                  <div
                    /* eslint-disable-next-line react/jsx-props-no-spreading */
                    {...provided.droppableProps}
                    ref={provided.innerRef}
                  >
                    {listGrade.map((grade, index) => (
                      <Draggable draggableId={`grade-${index}`} index={index}>
                        {(provided2) => (
                          <div
                            ref={provided2.innerRef}
                            /* eslint-disable-next-line react/jsx-props-no-spreading */
                            {...provided2.draggableProps}
                            /* eslint-disable-next-line react/jsx-props-no-spreading */
                            {...provided2.dragHandleProps}
                          >
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
                                  onChange={(e) =>
                                    handleChangeValue(index, 'grade_scale', e.target.value)}
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
                          </div>
                        )}
                      </Draggable>
                    ))}
                    {provided.placeholder}
                  </div>
                )}
              </Droppable>

              {isTeacherToEdit && (
                <button type="button" className="add-button" onClick={handleAddNewGrade}>
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
    </DragDropContext>
  );
}

export default GradeStructure;
