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
    if (response.data.status === 'failed') {
      setErrorMessage(response.data.message);
    } else {
      localStorage.setItem('access_token', response.data.accessToken);
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
        <h1 className="text-center text-primary mb-2">Sign In</h1>
        <div className="my-2 flex justify-content-center">
          Don&apos;t have an account yet? <Link to="/signup">&nbsp;Sign up now</Link>
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
            label="Password"
            isRequired
          />
          <span className="text-red-500">{errorMessage}</span>
          <div className="mt-2 flex justify-content-end">
            <Link to="/forgot-password-email"> Forgot password?</Link>
          </div>
          <div className="text-center mt-4">
            <Button label="Sign In" type="submit" severity="info" />

          </div>
        </form>
        <div className="flex flex-column align-items-center">
          <p className="m-1 pl-4 font-semibold">OR</p>
          <a
            href={`${process.env.REACT_APP_API_URL}/auth/google`}
            className="flex p-button w-full justify-content-between bg-red-600"
          >
            <i className="pi pi-google" />
            <span className="flex flex-1 justify-content-center font-bold">
              Sign in with google
            </span>
          </a>
          <a
            href={`${process.env.REACT_APP_API_URL}/auth/facebook`}
            className="flex p-button w-full justify-content-between mt-2"
          >
            <i className="pi pi-facebook" />
            <span className="flex flex-1 justify-content-center font-bold">
              Sign in with facebook
            </span>
          </a>
        </div>

        {isLoading && <Loading />}
      </div>
    </div>

  );
}
