import TextInput from 'components/FormControl/TextInput';
import { useForm } from 'react-hook-form';
import Header from 'layout/header';
import { Button } from 'primereact/button';
import { useState, useRef, useEffect } from 'react';
import { checkChangeProfile } from 'pages/validation';
import { yupResolver } from '@hookform/resolvers/yup';
import instance from 'config';
import { Link } from 'react-router-dom';
import { Toast } from 'primereact/toast';
import { useNavigate } from 'react-router';
import Loading from 'components/Loading';

export default function UserPage() {
  const navigate = useNavigate();
  const [user, setUser] = useState(JSON.parse(localStorage.getItem('user_profile')));
  const [isLoading, setIsLoading] = useState(false);
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

  const onSubmit = async (data) => {
    setIsLoading(true);
    try {
      const response = await instance.post('users/changeProfile', {
        username: user?.username,
        ...data
      });
      localStorage.setItem('user_profile', JSON.stringify(response.data));
      setUser(response.data);
      showSuccess('Change Profile Success');
    } catch (error) {
      if (error.response?.data?.message === 'Unauthorized') {
        navigate('/signin');
      }
    }
    setIsLoading(false);
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
              label="Full name"
              defaultValue={user?.fullName}
            />
            <TextInput
              type="text"
              name="email"
              control={control}
              errors={errors}
              label="Email"
              defaultValue={user?.email}
              errorMessage={errors?.email?.message || ''}
            />
            <Link to="/changepassword">
              Change password
            </Link>
            <div className="text-center mt-4">
              <Button
                label="Change"
                type="submit"
                style={{ minWidth: '100px', width: '160px' }}
              />
            </div>
          </form>
          {isLoading && <Loading />}
        </div>
      </div>

    </div>

  );
}
