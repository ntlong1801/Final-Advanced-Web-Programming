import './style.scss';

import TextInput from 'components/FormControl/TextInput';
import { useForm } from 'react-hook-form';
import { Button } from 'primereact/button';
import { Link } from 'react-router-dom';
import { Toast } from 'primereact/toast';
import { useRef } from 'react';
import Loading from 'components/Loading';
import { useMutation } from 'react-query';
import { forgotPassword } from 'apis/user.api';
import { useTranslation } from 'react-i18next';

export default function ForgotPassword() {
  const { t } = useTranslation();
  const toast = useRef(null);

  const {
    handleSubmit,
    control,
    formState: {
      errors
    }
  } = useForm({ mode: 'onChange' });

  const showSuccess = (msg) => {
    toast.current.show({ severity: 'success', summary: 'Success', detail: msg, life: 3000 });
  };

  const showError = (msg) => {
    toast.current.show({ severity: 'error', summary: 'Fail', detail: msg, life: 3000 });
  };

  const { mutate, isLoading } = useMutation(forgotPassword);

  const onSubmit = async (data) => {
    mutate(data, {
      onSuccess: (response) => {
        if (response.data.status === 'failed') {
          showError(response.data.message);
        } else {
          showSuccess(response.data.message);
        }
      }
    });
  };
  return (
    <div className="flex align-items-center justify-content-center background">
      <Toast ref={toast} />
      <div
        className="surface-card p-4 shadow-2 border-round w-full lg:w-6"
        style={{ maxWidth: '400px' }}
      >
        <Link to="/">
          <i className="pi pi-home" style={{ fontSize: '2rem' }} />
        </Link>
        <h1 className="text-center text-primary">Renew password</h1>
        <form autoComplete="off" onSubmit={handleSubmit(onSubmit)} className="p-fluid justify-content-center">
          <TextInput
            type="text"
            name="email"
            control={control}
            errors={errors}
            label="Email"
            errorMessage={errors.email?.message || ''}
          />
          <div className="text-center mt-4">
            <Button label={t('forgotPw.renew')} type="submit" />
          </div>
        </form>

        <div className="mt-2">
          Want to singin? <Link to="/signin"> Sign in here</Link>
        </div>
        {isLoading && <Loading />}
      </div>
    </div>
  );
}
