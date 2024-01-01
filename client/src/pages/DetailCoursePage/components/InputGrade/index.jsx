import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import { Toast } from 'primereact/toast';

import { forwardRef, useImperativeHandle, useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import Loading from 'components/Loading';
import { useMutation } from 'react-query';
import { postSingleGradeAssignment } from 'apis/grade.api';
import { InputNumber } from 'primereact/inputnumber';
import PropTypes from 'prop-types';

const InputGrade = forwardRef((props, ref) => {
  // #region Data
  const { t } = useTranslation();
  const toast = useRef(null);

  const [inputGradeControl, setInputGradeControl] = useState();
  const [visible, setVisible] = useState(false);
  const [grade, setGrade] = useState(0);

  const {
    control,
    trigger,
    reset,
    // eslint-disable-next-line no-unused-vars
    formState: { errors, dirtyFields },
  } = useForm({ mode: 'onChange' });
  // #endregion Data

  // #region Event
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

  const { mutate, isLoading } = useMutation(postSingleGradeAssignment);

  useImperativeHandle(
    ref,
    () => ({
      open: (_inputGradeControl) => {
        setInputGradeControl(_inputGradeControl);
        reset();
        setVisible(true);
      },

    }),
    []
  );

  const handleInputGrade = async () => {
    const isValidTrigger = await trigger();
    if (!isValidTrigger) {
      showError(t('errorMessage.validationErrorMessage'));
      return;
    }

    const { idx, info, classId } = inputGradeControl;
    const dataSender = {
      studentId: info.student_id,
      compositionId: info.gradeArray[idx].id,
      classId,
      grade,
    };

    mutate(dataSender, {
      onSuccess: (response) => {
        if (response.data.status === 'failed') {
          showError(response.data.message);
        } else {
          props.refetch();
          showSuccess('Cập nhật điểm thành công');
        }
      }
    });
    setVisible(false);
  };

  // #endregion Event

  return (
    <>
      {isLoading && <Loading />}
      <Dialog
        header="Nhập điểm"
        visible={visible}
        onHide={() => {
          setVisible(false);
        }}
        draggable={false}
        className="w-full sm:w-7 md:w-6 lg:w-5"
      >
        <div className="grid p-fluid">
          <div className="col-12">
            <InputNumber
              inputId="grade"
              value={grade}
              onValueChange={(e) => setGrade(e.value)}
              control={control}
              errors={errors}
            />
          </div>
        </div>

        <div className="flex justify-content-end mt-4">
          <Button
            label="Cập nhật"
            type="submit"
            severity="info"
            onClick={handleInputGrade}
            className="w-8rem"
            // disabled={!Object.keys(dirtyFields)?.length}
          />
        </div>
      </Dialog>
      <Toast ref={toast} />
    </>
  );
});

export default InputGrade;

InputGrade.propTypes = {
  refetch: PropTypes.func.isRequired,
};
