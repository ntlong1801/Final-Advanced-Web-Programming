import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import { Toast } from 'primereact/toast';

import { forwardRef, useImperativeHandle, useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import Loading from 'components/Loading';
import { useMutation } from 'react-query';
import { addUser } from 'apis/admin.api';
import PropTypes from 'prop-types';
import TextInput from 'components/FormControl/TextInput';
import { yupResolver } from '@hookform/resolvers/yup';
import checkSignUp from 'pages/validation';

const AddUser = forwardRef((props, ref) => {
  // #region Data
  const { t } = useTranslation();
  const toast = useRef(null);

  const [visible, setVisible] = useState(false);

  const {
    control,
    trigger,
    reset,
    handleSubmit,
    // eslint-disable-next-line no-unused-vars
    formState: { errors, dirtyFields },
  } = useForm({ mode: 'onChange', resolver: yupResolver(checkSignUp) });
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

  const { mutate, isLoading } = useMutation(addUser);

  useImperativeHandle(
    ref,
    () => ({
      open: () => {
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
        } else if (response.data.status === 'success') {
          props.refetch();
          setVisible(false);
          showSuccess(t('success.addUser'));
        }
      }
    });
  };

  // #endregion Event

  return (
    <>
      {isLoading && <Loading />}
      <Dialog
        header={t('admin.user.addUser')}
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
                isRequired
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
              />
            </div>
            <div className="col-12">
              <TextInput
                label={t('admin.user.fullName')}
                name="fullName"
                control={control}
                errors={errors}
              />
            </div>
            <div className="col-12">
              <TextInput
                label={t('admin.user.address')}
                name="address"
                control={control}
                errors={errors}
              />
            </div>
            <div className="col-12">
              <TextInput
                label={t('admin.user.phoneNumber')}
                name="phoneNumber"
                control={control}
                errors={errors}
              />
            </div>
          </div>

          <div className="flex justify-content-end mt-4">
            <Button
              label={t('admin.user.add')}
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

export default AddUser;

AddUser.propTypes = {
  refetch: PropTypes.func.isRequired,
};
