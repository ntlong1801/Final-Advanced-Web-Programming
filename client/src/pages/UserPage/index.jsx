import TextInput from 'components/FormControl/TextInput';
import { useForm } from 'react-hook-form';
import Header from 'layout/header';
import { Button } from 'primereact/button';
import { useState, useRef, useEffect } from 'react';
import { checkChangeProfile } from 'pages/validation';
import { yupResolver } from '@hookform/resolvers/yup';
import { Link } from 'react-router-dom';
import { Toast } from 'primereact/toast';
import { useNavigate } from 'react-router';
import Loading from 'components/Loading';
import { useTranslation } from 'react-i18next';
import { useMutation } from 'react-query';
import { updateProfile } from 'apis/user.api';

export default function UserPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [user, setUser] = useState(JSON.parse(localStorage.getItem('user_profile')));
  const toast = useRef(null);

  const {
    handleSubmit,
    control,
    formState: {
      errors
    }
  } = useForm({ mode: 'onChange', resolver: yupResolver(checkChangeProfile) });

  const showSuccess = (msg) => {
    toast.current.show({ severity: 'success', summary: 'Success', detail: msg, life: 3000 });
  };

  const { mutate, isLoading } = useMutation(updateProfile);

  const onSubmit = async (data) => {
    mutate({
      id: user?.id,
      ...data
    }, {
      onSuccess: (response) => {
        localStorage.setItem('user_profile', JSON.stringify(response.data));
        setUser(response.data);
        showSuccess('Change Profile Success');
      },
      onError: (error) => {
        if (error.response?.data?.message === 'Unauthorized') {
          navigate('/signin');
        }
      }
    });
  };

  useEffect(() => {
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
              type="text"
              name="fullName"
              autoFocus
              control={control}
              errors={errors}
              label={t('user.fullName')}
              defaultValue={user?.full_name}
            />
            <TextInput
              type="text"
              name="address"
              control={control}
              errors={errors}
              label={t('user.address')}
              defaultValue={user?.address}
              errorMessage={errors?.email?.message || ''}
            />
            <TextInput
              type="text"
              name="phoneNumber"
              control={control}
              errors={errors}
              label={t('user.phoneNumber')}
              defaultValue={user?.phone_number}
              errorMessage={errors?.email?.message || ''}
            />
            <div className="flex justify-content-end">
              <Link to="/changepassword">
                {t('user.changePassword')}
              </Link>
            </div>

            <div className="text-center mt-4">
              <Button
                label={t('user.update')}
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
