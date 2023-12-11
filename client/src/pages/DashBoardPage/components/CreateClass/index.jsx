import TextInput from 'components/FormControl/TextInput';
import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import { Toast } from 'primereact/toast';

import { forwardRef, useImperativeHandle, useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import instance from 'config';

const CreateClass = forwardRef((props, ref) => {
  // #region Data
  const { t } = useTranslation();
  const toast = useRef(null);

  const [createClassControl, setCreateClassControl] = useState();
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
      open: (_createClassControl) => {
        setCreateClassControl(_createClassControl);
        reset();
        setVisible(true);
      },

    }),
    []
  );

  const handleCreateClass = async () => {
    const isValidTrigger = await trigger();
    if (!isValidTrigger) {
      showError(t('errorMessage.validationErrorMessage'));
      return;
    }

    const data = getValues();
    const { userId, setRefetch } = createClassControl;
    const dataSender = { ...data, userId };
    const createClass = await instance.post('/class/addClass', dataSender);
    if (createClass?.data?.id) {
      const userClass = { id_class: createClass?.data?.id,
        id_user: userId,
        role: 'teacher' };
      const addOwnerToClass = await instance.post('/class/addUserToClass', userClass);
      if (addOwnerToClass?.data?.id_class) {
        showSuccess('Tạo lớp học thành công');
        setRefetch(true);
      } else {
        showError('Có lỗi xảy ra, vui lòng thử lại!');
      }
    } else {
      showError('Có lỗi xảy ra, vui lòng thử lại!');
    }

    setVisible(false);
  };

  // #endregion Event

  return (
    <>
      <Dialog
        header="Tạo lớp học"
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
              name="name"
              label="Tên lớp học"
              isRequired
              control={control}
              errors={errors}
            />
          </div>
          <div className="col-12">
            <TextInput
              name="description"
              label="Mô tả"
              isRequired
              control={control}
              errors={errors}
            />
          </div>

        </div>

        <div className="flex justify-content-end mt-4">
          <Button
            label="Tạo"
            type="submit"
            severity="info"
            onClick={handleCreateClass}
            className="w-8rem"
            disabled={!Object.keys(dirtyFields)?.length}
          />
        </div>
      </Dialog>
      <Toast ref={toast} />
    </>
  );
});

export default CreateClass;
