import './style.scss';

import { Link, useNavigate } from 'react-router-dom';
import instance from 'config';
import { Toast } from 'primereact/toast';
import { useRef, useState } from 'react';
import Loading from 'components/Loading';
import { useForm, useFormState } from 'react-hook-form';
import TextInput from 'components/FormControl/TextInput';
import { Button } from 'primereact/button';

export default function WaitingConfirmForgotEmail() {
  const { handleSubmit, control } = useForm({ mode: 'onChange' });

  const navigate = useNavigate();
  const { errors } = useFormState({ control });
  const [isLoading, setIsLoading] = useState(false);
  const [errorSamePassword, setErrorSamePassword] = useState(false);
  const toast = useRef(null);

  const showSuccess = (msg) => {
    toast.current.show({ severity: 'success', summary: 'Success', detail: msg, life: 3000 });
  };

  const showError = (msg) => {
    toast.current.show({ severity: 'error', summary: 'Fail', detail: msg, life: 3000 });
  };

  // useEffect(() => {
  //   setIsLoading(true);
  //   const fetchData = async () => {
  //     const token = window.location.href.split('/forgot-password/')[1];
  //     const response = await instance.get(`/user/verify-forgot-password-email/${token}`);
  //     setIsLoading(false);
  //     if (response.data.status === 'failed') {
  //       showError(response.data.message);
  //     } else {
  //       showSuccess(response.data.message);
  //     }
  //   };
  //   fetchData();
  // }, []);

  const onSubmit = async (data) => {
    if (data?.newPassword !== data?.renewPassword) {
      setErrorSamePassword(true);
    } else {
      setErrorSamePassword(false);
      setIsLoading(true);
      try {
        const token = window.location.href.split('/forgot-password/')[1];
        const response = await instance.post(`user/renew-password-by-forgot-email/${token}`, {
          ...data
        });

        if (response.data?.msg) {
          showError(response.data?.msg);
        } else {
          showSuccess('Change password successful, you will redirect to sign in now!');
          setTimeout(() => { navigate('/signin'); }, 2000);
        }
      } catch (error) {
        if (error.response?.data?.message === 'Unauthorized') {
          navigate('/signin');
        }
      }
      setIsLoading(false);
    }
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
        <form autoComplete="off" onSubmit={handleSubmit(onSubmit)} className="p-fluid justify-content-center mt-4">
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
        <div className="mt-2">
          Want to singin? <Link to="/signin"> Sign in here</Link>
        </div>
        {isLoading && <Loading />}
      </div>
    </div>
  );
}
