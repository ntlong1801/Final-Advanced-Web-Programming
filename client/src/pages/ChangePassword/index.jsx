import TextInput from 'components/FormControl/TextInput';
import { useForm } from 'react-hook-form';
import Header from 'layout/header';
import { Button } from 'primereact/button';
import { useState, useRef, useEffect } from 'react';
import { checkChangeProfile } from 'pages/validation';
import { yupResolver } from '@hookform/resolvers/yup';
import { Toast } from 'primereact/toast';
import { useNavigate } from 'react-router';
import Loading from 'components/Loading';
import { useMutation } from 'react-query';
import { changePassword } from 'apis/user.api';
import { useTranslation } from 'react-i18next';

export default function UserPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [user, setUser] = useState(JSON.parse(localStorage.getItem('user_profile')));
  const [errorSamePassword, setErrorSamePassword] = useState(false);
  const toast = useRef(null);

  const {
    handleSubmit,
    control,
    reset,
    formState: {
      errors
    }
  } = useForm({ mode: 'onChange', resolver: yupResolver(checkChangeProfile) });

  const showSuccess = (msg) => {
    toast.current.show({ severity: 'success', summary: 'Success', detail: msg, life: 3000 });
  };

  const showError = (msg) => {
    toast.current.show({ severity: 'error', summary: 'Fail', detail: msg, life: 3000 });
  };

  const { mutate, isLoading } = useMutation(changePassword);
  const onSubmit = async (data) => {
    if (data?.newpassword !== data?.renewpassword) {
      setErrorSamePassword(true);
    } else {
      setErrorSamePassword(false);
      mutate({
        email: user?.email,
        ...data
      }, {
        onSuccess: (response) => {
          if (response.data?.msg) {
            showError(response.data?.msg);
          } else {
            reset({}, { keepValues: false });
            showSuccess('Change password successful');
          }
        },
        onError: (error) => {
          if (error.response?.data?.message === 'Unauthorized') {
            navigate('/signin');
          }
        } }
      );
    }
  };

  useEffect(() => {
    setUser(JSON.parse(localStorage.getItem('user_profile')));
    if (!user) {
      navigate('/signin');
    }
  }, []);

  return (
    <div className="background" style={{ display: 'flex', flexDirection: 'column' }}>
      <Header />
      <Toast ref={toast} />
      <div className="flex align-items-center justify-content-center" style={{ flex: 1 }}>
        <div
          className="surface-card p-4 shadow-2 border-round w-full lg:w-6"
          style={{ maxWidth: '400px' }}
        >
          <form autoComplete="off" onSubmit={handleSubmit(onSubmit)} className="p-fluid justify-content-center">
            <div className="text-center">
              <h3>{user?.username}</h3>
            </div>
            <TextInput
              type="password"
              name="oldPassword"
              autoFocus
              control={control}
              errors={errors}
              label={t('changePassword.oldPassword')}
              defaultValue=""
            />
            <TextInput
              type="password"
              name="newPassword"
              control={control}
              errors={errors}
              label={t('changePassword.newPassword')}
              defaultValue=""
            />
            <TextInput
              type="password"
              name="renewPassword"
              control={control}
              errors={errors}
              label={t('changePassword.renewPassword')}
              defaultValue=""
            />
            {errorSamePassword && <span className="text-red-500">{t('changePassword.errorSamePassword')}</span>}
            <div className="text-center mt-4">
              <Button
                label={t('changePassword.name')}
                type="submit"
              />
            </div>
          </form>
          {isLoading && <Loading />}
        </div>
      </div>

    </div>

  );
}
