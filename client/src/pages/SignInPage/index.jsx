import './style.scss';

import TextInput from 'components/FormControl/TextInput';
// eslint-disable-next-line import/no-extraneous-dependencies
import { useForm } from 'react-hook-form';
import { Button } from 'primereact/button';
import { Link, useNavigate } from 'react-router-dom';
import instance from 'config';
import { useState } from 'react';
import Loading from 'components/Loading';

export default function SignInPage() {
  // eslint-disable-next-line no-unused-vars
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const {
    handleSubmit,
    control,
    formState: {
      errors
    }
  } = useForm({ mode: 'onChange' });

  const onSubmit = async (data) => {
    setIsLoading(true);
    const response = await instance.post('auth/login', data);
    setIsLoading(false);
    if (response.data?.msg) {
      setErrorMessage(response.data?.msg);
    } else {
      localStorage.setItem('access_token', response.data.access_token);
      localStorage.setItem('user_profile', JSON.stringify(response.data.user));
      navigate('/dashboard');
    }
  };
  return (

    <div className="flex align-items-center justify-content-center background">
      <div
        className="surface-card p-4 shadow-2 border-round w-full lg:w-6"
        style={{ maxWidth: '400px' }}
      >
        <Link to="/">
          <i className="pi pi-home" style={{ fontSize: '2rem' }} />
        </Link>
        <h1 className="text-center text-primary">Sign In</h1>
        <form autoComplete="off" onSubmit={handleSubmit(onSubmit)} className="p-fluid justify-content-center">
          <TextInput
            type="text"
            name="username"
            autoFocus
            control={control}
            errors={errors}
            label="Username"
            isRequired
          />
          <TextInput
            type="password"
            name="password"
            control={control}
            errors={errors}
            label="Password"
            isRequired
          />
          <span className="text-red-500">{errorMessage}</span>
          <div className="text-center mt-4">
            <Button label="Sign In" type="submit" style={{ minWidth: '100px', width: '160px' }} />
          </div>
        </form>

        <div className="mt-2">
          Don&apos;t have an account yet? <Link to="/signup"> Sign up now</Link>
        </div>
        {isLoading && <Loading />}
      </div>
    </div>

  );
}
