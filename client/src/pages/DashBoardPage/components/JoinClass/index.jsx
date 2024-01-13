import TextInput from 'components/FormControl/TextInput';
import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import { Toast } from 'primereact/toast';

import { forwardRef, useImperativeHandle, useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { useMutation } from 'react-query';
import { joinClassByCode } from 'apis/class.api';
import { yupResolver } from '@hookform/resolvers/yup';
import { checkStudentId } from 'pages/validation';

const JoinClass = forwardRef((props, ref) => {
  // #region Data
  const { t } = useTranslation();
  const toast = useRef(null);

  // eslint-disable-next-line no-unused-vars
  const [joinClassControl, setJoinClassControl] = useState();
  const [visible, setVisible] = useState(false);
  const [studentId, setStudentId] = useState(null);

  const {
    control,
    getValues,
    trigger,
    reset,
    formState: { errors, dirtyFields },
  } = useForm({ mode: 'onChange', resolver: yupResolver(checkStudentId) });
  // #endregion Data

  // #region Event
  const showError = (message) => {
    toast.current.show({
      severity: 'error',
      summary: t('error.name'),
      detail: message,
      life: 4000,
    });
  };

  const showSuccess = (message) => {
    toast.current.show({
      severity: 'success',
      summary: t('success.name'),
      detail: message,
      life: 4000,
    });
  };

  useImperativeHandle(
    ref,
    () => ({
      open: (_joinClassControl) => {
        setJoinClassControl(_joinClassControl);
        setStudentId(_joinClassControl.studentId);
        reset();
        setVisible(true);
      },

    }),
    []
  );

  const { mutate } = useMutation(joinClassByCode);

  const handleJoinClass = async () => {
    const isValidTrigger = await trigger();
    if (!isValidTrigger) {
      showError(t('error.validationErrorMessage'));
      return;
    }
    const { userId, refetch, refetchStudentId } = joinClassControl;
    const classCode = getValues('classCode');
    const studentIdInput = getValues('studentId');
    mutate({ userId, studentId: studentIdInput, classCode }, {
      onSuccess: (res) => {
        if (res?.data.status === 'success') {
          refetch();
          refetchStudentId();
          setVisible(false);
          showSuccess(res?.data.message);
        } else {
          showError(res?.data.message);
        }
      }
    });
  };

  // #endregion Event

  return (
    <>
      <Dialog
        header={t('dashBoard.components.joinClass.joinClass')}
        visible={visible}
        onHide={() => {
          setVisible(false);
        }}
        draggable={false}
        className="w-full sm:w-7 md:w-6 lg:w-5"
      >
        <div className="grid p-fluid">
          <div className="col-12">
            <TextInput
              name="classCode"
              label={t('dashBoard.components.joinClass.classId')}
              isRequired
              control={control}
              errors={errors}
            />
          </div>

          <div className="col-12">
            <TextInput
              name="studentId"
              label={t('dashBoard.components.joinClass.studentId')}
              isRequired
              control={control}
              errors={errors}
              defaultValue={studentId?.student_id}
              disabled={studentId}
            />
          </div>

        </div>

        <div className="flex justify-content-end mt-4">
          <Button
            label={t('dashBoard.components.joinClass.join')}
            type="submit"
            severity="info"
            onClick={handleJoinClass}
            className="w-8rem"
            disabled={!Object.keys(dirtyFields)?.length}
          />
        </div>
      </Dialog>
      <Toast ref={toast} />
    </>
  );
});

export default JoinClass;
