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

export default function SignUpPage() {
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
    showError(data);
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
    <div className="flex align-items-center justify-content-center background">
      <Toast ref={toast} />
      <div
        className="surface-card p-4 shadow-2 border-round w-full lg:w-6"
        style={{ maxWidth: '400px' }}
      >
        <Link to="/">
          <i className="pi pi-home" style={{ fontSize: '2rem' }} />
        </Link>
        <h1 className="text-center text-primary">Sign Up</h1>
        <form autoComplete="off" onSubmit={handleSubmit(onSubmit)} className="p-fluid justify-content-center">
          <TextInput
            type="text"
            name="email"
            control={control}
            errors={errors}
            label="Email"
            errorMessage={errors.email?.message || ''}
          />
          <TextInput
            type="text"
            name="fullName"
            control={control}
            errors={errors}
            label="Full Name"
          />
          <TextInput
            type="password"
            name="password"
            control={control}
            errors={errors}
            label="Password"
            isRequired
            errorMessage={errors.password?.message || ''}
          />
          <TextInput
            type="password"
            name="re-password"
            control={control}
            errors={errors}
            label="Re-password"
            isRequired
            errorMessage={errors.password?.message || ''}
          />
          <div className="text-center mt-4">
            <Button label="Sign up" type="submit" style={{ minWidth: '100px', width: '160px' }} />
          </div>
        </form>

        <div className="mt-2">
          Already have an account? <Link to="/signin"> Sign in here</Link>
        </div>
        {isLoading && <Loading />}
      </div>
    </div>
  );
}
