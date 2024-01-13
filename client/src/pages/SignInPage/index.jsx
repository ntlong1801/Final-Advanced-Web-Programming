import './style.scss';

import TextInput from 'components/FormControl/TextInput';
import { useForm } from 'react-hook-form';
import { Button } from 'primereact/button';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import Loading from 'components/Loading';
import LanguageSelect from 'components/LanguageSelect';
import { useTranslation } from 'react-i18next';
import { login } from 'apis/auth.api';
import { useMutation } from 'react-query';

export default function SignInPage() {
  const location = useLocation();
  const link = location.state;
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [errorMessage, setErrorMessage] = useState('');
  const {
    handleSubmit,
    control,
    formState: {
      errors
    }
  } = useForm({ mode: 'onChange' });

  const { mutate, isLoading } = useMutation(login);

  const onSubmit = async (data) => {
    mutate(data, {
      onSuccess: (response) => {
        if (response.data.status === 'failed') {
          setErrorMessage(response.data.message);
        } else {
          localStorage.setItem('access_token', response.data.accessToken);
          localStorage.setItem('user_profile', JSON.stringify(response.data.user));
          if (link) {
            window.location.href = link;
          } else navigate('/dashboard');
        }
      }
    });
  };

  return (
    <>
      <div className="p-4 fixed right-0 z-3">
        <LanguageSelect />
      </div>
      <div className="flex align-items-center justify-content-center background">
        <div
          className="surface-card p-4 shadow-2 border-round w-full lg:w-6"
          style={{ maxWidth: '400px' }}
        >
          <Link to="/">
            <i className="pi pi-home" style={{ fontSize: '2rem' }} />
          </Link>
          <h1 className="text-center text-primary mb-2">{t('signIn.name')}</h1>
          <div className="my-2 flex justify-content-center">
            {t('signIn.account')} <Link to="/signup">&ensp;{t('signIn.signUpNow')}</Link>
          </div>
          <form autoComplete="off" onSubmit={handleSubmit(onSubmit)} className="p-fluid justify-content-center">
            <TextInput
              type="text"
              name="email"
              autoFocus
              control={control}
              errors={errors}
              label="Email"
              isRequired
            />
            <TextInput
              type="password"
              name="password"
              control={control}
              errors={errors}
              label={t('password')}
              isRequired
            />
            <span className="text-red-500">{errorMessage}</span>
            <div className="mt-2 flex justify-content-end">
              <Link to="/forgot-password-email"> {t('signIn.forgotPassword')}</Link>
            </div>
            <div className="text-center mt-4">
              <Button label={t('signIn.name')} type="submit" severity="info" />

            </div>
          </form>
          <div className="flex flex-column align-items-center">
            <p className="m-1 pl-4 font-semibold">{t('signIn.or')}</p>
            <a
              href={`${process.env.REACT_APP_API_URL}/auth/google`}
              className="flex p-button w-full justify-content-between bg-red-600"
            >
              <i className="pi pi-google" />
              <span className="flex flex-1 justify-content-center font-bold">
                {t('signIn.google')}
              </span>
            </a>
            <a
              href={`${process.env.REACT_APP_API_URL}/auth/facebook`}
              className="flex p-button w-full justify-content-between mt-2"
            >
              <i className="pi pi-facebook" />
              <span className="flex flex-1 justify-content-center font-bold">
                {t('signIn.facebook')}
              </span>
            </a>
          </div>

          {isLoading && <Loading />}
        </div>
      </div>
    </>
  );
}
