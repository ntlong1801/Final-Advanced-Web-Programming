import TextInput from 'components/FormControl/TextInput';
import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import { Toast } from 'primereact/toast';

import { forwardRef, useImperativeHandle, useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import instance from 'config';
import Loading from 'components/Loading';

const InviteStudent = forwardRef((props, ref) => {
  // #region Data
  const { t } = useTranslation();
  const toast = useRef(null);

  const [inviteStudentControl, setInviteStudentControl] = useState();
  const [isLoading, setIsLoading] = useState(false);
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

  useImperativeHandle(
    ref,
    () => ({
      open: (_inviteStudentControl) => {
        setInviteStudentControl(_inviteStudentControl);
        reset();
        setVisible(true);
      },

    }),
    []
  );

  const handleInviteStudent = async () => {
    const isValidTrigger = await trigger();
    if (!isValidTrigger) {
      showError(t('errorMessage.validationErrorMessage'));
      return;
    }

    const data = getValues();
    const { email, classId } = inviteStudentControl;
    const dataSender = {
      emailReciver: data?.email,
      emailSend: email,
      classId,
      roleUser: 'student',
    };
    // invite user by email
    try {
      setIsLoading(true); // Thêm setIsLoading(true) khi bắt đầu request
      const response = await instance.post('/class/inviteByMail', dataSender);
      setIsLoading(false);
      if (response.data.status === 'failed') {
        showError(response.data.message);
      } else {
        showSuccess('Gửi email tới học sinh thành công');
      }
    } catch (error) {
      setIsLoading(false);
    }

    setVisible(false);
  };

  // #endregion Event

  return (
    <>
      {isLoading && <Loading />}
      <Dialog
        header="Mời học sinh"
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
            label="Mời"
            type="submit"
            severity="info"
            onClick={handleInviteStudent}
            className="w-8rem"
            disabled={!Object.keys(dirtyFields)?.length}
          />
        </div>
      </Dialog>
      <Toast ref={toast} />
    </>
  );
});

export default InviteStudent;
