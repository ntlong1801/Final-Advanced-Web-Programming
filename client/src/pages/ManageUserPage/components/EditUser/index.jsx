import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import { Toast } from 'primereact/toast';

import { forwardRef, useImperativeHandle, useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import Loading from 'components/Loading';
import { useMutation } from 'react-query';
import { updateUser } from 'apis/admin.api';
import PropTypes from 'prop-types';
import TextInput from 'components/FormControl/TextInput';
import { yupResolver } from '@hookform/resolvers/yup';
import { checkPhoneNumber } from 'pages/validation';

const EditUSer = forwardRef((props, ref) => {
  // #region Data
  const { t } = useTranslation();
  const toast = useRef(null);

  const [visible, setVisible] = useState(false);
  const [info, setInfo] = useState({});
  const [disablePassword, setDisablePassword] = useState(true);

  const {
    control,
    trigger,
    reset,
    handleSubmit,
    // eslint-disable-next-line no-unused-vars
    formState: { errors, dirtyFields },
  } = useForm({ mode: 'onChange', resolver: yupResolver(checkPhoneNumber) });
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

  const { mutate, isLoading } = useMutation(updateUser);

  useImperativeHandle(
    ref,
    () => ({
      open: (_editUserControl) => {
        setDisablePassword(true);
        setInfo(_editUserControl.info);
        reset();
        setVisible(true);
      },
    }),
    []
  );

  const obSubmit = async (data) => {
    const isValidTrigger = await trigger();
    if (!isValidTrigger) {
      showError(t('errorMessage.validationErrorMessage'));
      return;
    }

    mutate(data, {
      onSuccess: (response) => {
        if (response.data.status === 'failed') {
          showError(response.data.message);
        } else {
          props.refetch();
          showSuccess('Cập nhật người dùng thành công');
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
        header={t('admin.user.editUser')}
        visible={visible}
        onHide={() => {
          setVisible(false);
        }}
        draggable={false}
        className="w-full sm:w-7 md:w-6 lg:w-5"
      >
        <form autoComplete="false" onSubmit={handleSubmit(obSubmit)}>
          <div className="grid p-fluid">
            <div className="col-12">
              <TextInput
                label="Email"
                name="email"
                control={control}
                errors={errors}
                defaultValue={info?.email}
                disabled
              />
            </div>
            <div className="col-12">
              <TextInput
                label={t('admin.user.password')}
                name="password"
                type="password"
                control={control}
                errors={errors}
                isRequired
                disabled={disablePassword}
                setDisablePassword={setDisablePassword}
                hasPen
              />
            </div>
            <div className="col-12">
              <TextInput
                label={t('admin.user.fullName')}
                name="fullName"
                control={control}
                errors={errors}
                defaultValue={info?.full_name}
              />
            </div>
            <div className="col-12">
              <TextInput
                label={t('admin.user.address')}
                name="address"
                control={control}
                errors={errors}
                defaultValue={info?.address}
              />
            </div>
            <div className="col-12">
              <TextInput
                label={t('admin.user.phoneNumber')}
                name="phoneNumber"
                control={control}
                errors={errors}
                defaultValue={info?.phone_number}
              />
            </div>
          </div>

          <div className="flex justify-content-end mt-4">
            <Button
              label={t('admin.user.edit')}
              type="submit"
              severity="info"
              className="w-8rem"
            // disabled={!Object.keys(dirtyFields)?.length}
            />
          </div>
        </form>
      </Dialog>
      <Toast ref={toast} />
    </>
  );
});

export default EditUSer;

EditUSer.propTypes = {
  refetch: PropTypes.func.isRequired,
};
