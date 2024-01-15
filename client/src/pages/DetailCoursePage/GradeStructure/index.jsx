import { useMutation, useQuery } from 'react-query';
import {
  getGradeStructure,
  editGradeStructure,
  isTeacherOfClass,
  getClassByID,
} from 'apis/class.api';

import React, { useState, useMemo, useEffect, useRef } from 'react';
import { useParams } from 'react-router';
import './style.scss';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { useTranslation } from 'react-i18next';
import { Toast } from 'primereact/toast';
import Loading from 'components/Loading';

function GradeStructure() {
  const user = JSON.parse(localStorage.getItem('user_profile'));
  const { t } = useTranslation();
  const { classId } = useParams();
  const [isFormVisible, setIsFormVisible] = useState(false);
  const [isTeacherToEdit, setIsTeacherToEdit] = useState(false);
  const [listGrade, setListGrade] = useState([]);
  const toast = useRef(null);

  const showError = (message) => {
    toast.current.show({
      severity: 'error',
      summary: 'Thất bại',
      detail: message,
      life: 4000,
    });
  };

  const showSuccess = (message) => {
    toast.current.show({
      severity: 'success',
      summary: 'Thành công',
      detail: message,
      life: 4000,
    });
  };

  const { mutate, isLoading } = useMutation(getGradeStructure);
  const { mutate: mutateHandleSave, isLoading: _isLoading } = useMutation(editGradeStructure);

  const { data: _data, isLoading: isDataLoading } = useQuery({
    queryKey: ['class', classId],
    queryFn: () => getClassByID(classId),
  });
  useMemo(() => _data?.data ?? [], [_data]);
  const { data: checkTeacher, isLoading: isCheckTeacherLoading } = useQuery({
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
      emailSend: user?.email,
      classId,
      listGrade,
    };

    mutateHandleSave(dataSender, {
      onSuccess: (response) => {
        showSuccess(response.data.result);
      },
      onError: () => {
        showError('Có lỗi xảy ra');
      }
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
    <>
      {(isLoading || _isLoading || isDataLoading || isCheckTeacherLoading) && <Loading />}
      <DragDropContext onDragEnd={handleDragEnd}>
        <div className="grade-structure">
          <button type="button" onClick={showForm}>
            {t('detail.gradeStructure.gradeStructure')}
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
                              <form
                                autoComplete="false"
                              >
                                <div className="form-group">
                                  <label htmlFor="componentName">{t('detail.gradeStructure.name')}:
                                  </label>
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
                    {t('detail.gradeStructure.close')}
                  </button>
                  {isTeacherToEdit && (
                    <button type="button" className="submit-button" onClick={handleSave}>
                      {t('detail.gradeStructure.save')}
                    </button>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </DragDropContext>
      <Toast ref={toast} />
    </>
  );
}

export default GradeStructure;
