import './style.scss';

import TextInput from 'components/FormControl/TextInput';
// eslint-disable-next-line import/no-extraneous-dependencies
import { useForm } from 'react-hook-form';
import { Button } from 'primereact/button';
import { Link } from 'react-router-dom';
import instance from 'config';
import checkSignUp from 'pages/validation';
import { yupResolver } from '@hookform/resolvers/yup';
import { Toast } from 'primereact/toast';
import { useRef, useState } from 'react';
import Loading from 'components/Loading';
import LanguageSelect from 'components/LanguageSelect';
import { useTranslation } from 'react-i18next';

export default function SignUpPage() {
  const { t } = useTranslation();
  const [isLoading, setIsLoading] = useState(false);
  const toast = useRef(null);

  const {
    handleSubmit,
    control,
    formState: {
      errors
    }
  } = useForm({ mode: 'onChange', resolver: yupResolver(checkSignUp) });

  const showSuccess = (msg) => {
    toast.current.show({ severity: 'success', summary: 'Success', detail: msg, life: 3000 });
  };

  const showError = (msg) => {
    toast.current.show({ severity: 'error', summary: 'Fail', detail: msg, life: 3000 });
  };

  const onSubmit = async (data) => {
    setIsLoading(true);
    const response = await instance.post('/auth/register-email', data);
    setIsLoading(false);
    if (response.data.status === 'failed') {
      showError(response.data.message);
    } else {
      showSuccess(response.data.message);
    }
  };
  return (
    <>
      <div className="p-4 fixed right-0">
        <LanguageSelect />
      </div>
      <div className="flex align-items-center justify-content-center background">
        <Toast ref={toast} />
        <div
          className="surface-card p-4 shadow-2 border-round w-full lg:w-6"
          style={{ maxWidth: '400px' }}
        >
          <Link to="/">
            <i className="pi pi-home" style={{ fontSize: '2rem' }} />
          </Link>
          <h1 className="text-center text-primary mb-2">{t('signUp.name')}</h1>
          <div className="my-2 flex justify-content-center">
            {t('signUp.account')}<Link to="/signin">&ensp;{t('signUp.signInNow')}</Link>
          </div>
          <form autoComplete="off" onSubmit={handleSubmit(onSubmit)} className="p-fluid justify-content-center">
            <TextInput
              type="text"
              name="email"
              control={control}
              errors={errors}
              label="Email"
              isRequired
              errorMessage={errors.email?.message || ''}
            />
            <TextInput
              type="password"
              name="password"
              control={control}
              errors={errors}
              label={t('password')}
              isRequired
              errorMessage={errors.password?.message || ''}
            />
            <TextInput
              type="text"
              name="fullName"
              control={control}
              errors={errors}
              label={t('signUp.fullName')}
            />
            <div className="text-center mt-4">
              <Button label={t('signUp.name')} type="submit" />
            </div>
          </form>

          {isLoading && <Loading />}
        </div>
      </div>
    </>
  );
}
