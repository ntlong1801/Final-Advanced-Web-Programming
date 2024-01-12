import TextInput from 'components/FormControl/TextInput';
import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import { Toast } from 'primereact/toast';

import { forwardRef, useImperativeHandle, useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import Loading from 'components/Loading';
import { useMutation } from 'react-query';
import { inviteByEmail } from 'apis/class.api';

const InviteTeacher = forwardRef((props, ref) => {
  // #region Data
  const { t } = useTranslation();
  const toast = useRef(null);

  const [inviteTeacherControl, setInviteTeacherControl] = useState();
  const [visible, setVisible] = useState(false);

  const {
    control,
    getValues,
    trigger,
    reset,
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

  const { mutate, isLoading } = useMutation(inviteByEmail);

  useImperativeHandle(
    ref,
    () => ({
      open: (_inviteTeacherControl) => {
        setInviteTeacherControl(_inviteTeacherControl);
        reset();
        setVisible(true);
      },

    }),
    []
  );

  const handleInviteTeacher = async () => {
    const isValidTrigger = await trigger();
    if (!isValidTrigger) {
      showError(t('errorMessage.validationErrorMessage'));
      return;
    }

    const data = getValues();
    const { email, classId } = inviteTeacherControl;
    const dataSender = {
      emailReciver: data?.email,
      emailSend: email,
      classId,
      roleUser: 'teacher',
    };
    // invite user by email
    mutate(dataSender, {
      onSuccess: (response) => {
        if (response.data.status === 'failed') {
          showError(response.data.message);
        } else {
          showSuccess('Gửi email tới giáo viên thành công');
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
        header={t('detail.components.inviteTeacher.inviteTeacher')}
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
              name="email"
              label="Email"
              isRequired
              control={control}
              errors={errors}
            />
          </div>

        </div>

        <div className="flex justify-content-end mt-4">
          <Button
            label={t('detail.components.inviteTeacher.invite')}
            type="submit"
            severity="info"
            onClick={handleInviteTeacher}
            className="w-8rem"
            disabled={!Object.keys(dirtyFields)?.length}
          />
        </div>
      </Dialog>
      <Toast ref={toast} />
    </>
  );
});

export default InviteTeacher;
