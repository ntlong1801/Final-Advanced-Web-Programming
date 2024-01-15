import TextInput from 'components/FormControl/TextInput';
import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import { Toast } from 'primereact/toast';

import { forwardRef, useImperativeHandle, useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { useMutation } from 'react-query';
import { createClass, addUserToClass } from 'apis/class.api';
import { yupResolver } from '@hookform/resolvers/yup';
import { checkClassName } from 'pages/validation';
import Loading from 'components/Loading';

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
  } = useForm({ mode: 'onChange', resolver: yupResolver(checkClassName) });
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
      open: (_createClassControl) => {
        setCreateClassControl(_createClassControl);
        reset();
        setVisible(true);
      },

    }),
    []
  );

  const { mutate: createClassMutate, isLoading: isCreateClassLoading } = useMutation(createClass);
  const { mutate: addUserToClassMutate,
    isLoading: isAddUserToClassLoading } = useMutation(addUserToClass);

  const handleCreateClass = async () => {
    const isValidTrigger = await trigger();
    if (!isValidTrigger) {
      showError(t('error.validationErrorMessage'));
      return;
    }

    const data = getValues();
    const { userId, refetch } = createClassControl;
    const dataSender = { ...data, userId };
    createClassMutate(dataSender, {
      onSuccess: (res) => {
        if (res?.data?.id) {
          const userClass = { id_class: res?.data?.id,
            id_user: userId,
            role: 'teacher' };
          addUserToClassMutate(userClass, {
            onSuccess: (res1) => {
              if (res1?.data?.id_class) {
                showSuccess('Tạo lớp học thành công');
                refetch();
                setVisible(false);
              } else {
                showError('Có lỗi xảy ra, vui lòng thử lại!');
              }
            },
            onError: () => {
              showError('Có lỗi xảy ra');
            }
          });
        }
      }
    });
  };

  // #endregion Event

  return (
    <>
      {(isCreateClassLoading || isAddUserToClassLoading) && <Loading />}
      <Dialog
        header={t('dashBoard.components.createClass.createClass')}
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
              label={t('dashBoard.components.createClass.name')}
              isRequired
              control={control}
              errors={errors}
            />
          </div>
          <div className="col-12">
            <TextInput
              name="description"
              label={t('dashBoard.components.createClass.description')}
              control={control}
              errors={errors}
            />
          </div>

        </div>

        <div className="flex justify-content-end mt-4">
          <Button
            label={t('dashBoard.components.createClass.create')}
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
