import TextInput from 'components/FormControl/TextInput';
import { useForm } from 'react-hook-form';
import Header from 'layout/header';
import { Button } from 'primereact/button';
import { useState, useRef, useEffect } from 'react';
import { checkChangeProfile } from 'pages/validation';
import { yupResolver } from '@hookform/resolvers/yup';
import instance from 'config';
import { Toast } from 'primereact/toast';
import { useNavigate } from 'react-router';
import Loading from 'components/Loading';

export default function UserPage() {
  const navigate = useNavigate();
  const [user, setUser] = useState(JSON.parse(localStorage.getItem('user_profile')));
  const [errorSamePassword, setErrorSamePassword] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
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
  const onSubmit = async (data) => {
    if (data?.newpassword !== data?.renewpassword) {
      setErrorSamePassword(true);
    } else {
      setIsLoading(true);
      setErrorSamePassword(false);
      try {
        const response = await instance.post('user/changePassword', {
          email: user?.email,
          ...data
        });

        if (response.data?.msg) {
          showError(response.data?.msg);
        } else {
          reset({}, { keepValues: false });
          showSuccess('Change password successful');
        }
      } catch (error) {
        if (error.response?.data?.message === 'Unauthorized') {
          navigate('/signin');
        }
      }
      setIsLoading(false);
    }
  };

  useEffect(() => {
    setUser(JSON.parse(localStorage.getItem('user_profile')));
    setIsLoading(false);
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
              label="Old password"
              defaultValue=""
            />
            <TextInput
              type="password"
              name="newPassword"
              control={control}
              errors={errors}
              label="New password"
              defaultValue=""
            />
            <TextInput
              type="password"
              name="renewPassword"
              control={control}
              errors={errors}
              label="Re-New password"
              defaultValue=""
            />
            {errorSamePassword && <span className="text-red-500">Re-new password must be the same as new password</span>}
            <div className="text-center mt-4">
              <Button
                label="Change"
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
