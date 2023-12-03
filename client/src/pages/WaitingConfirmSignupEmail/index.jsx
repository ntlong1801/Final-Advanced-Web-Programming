import './style.scss';

import { Link } from 'react-router-dom';
import instance from 'config';
import { Toast } from 'primereact/toast';
import { useRef, useState, useEffect } from 'react';
import Loading from 'components/Loading';

export default function WaitingConfirmSignupEmail() {
  const [isLoading, setIsLoading] = useState(false);
  const toast = useRef(null);

  const showSuccess = (msg) => {
    toast.current.show({ severity: 'success', summary: 'Success', detail: msg, life: 3000 });
  };

  const showError = (msg) => {
    toast.current.show({ severity: 'error', summary: 'Fail', detail: msg, life: 3000 });
  };

  // eslint-disable-next-line no-unused-vars
  const fetchData = async () => {
    setIsLoading(true);

    const token = window.location.href.split('/sigup-email')[1];
    const response = await instance.get(`auth/verify-email${token}`);
    if (response.data.status === 'failed') {
      showError(response.data.message);
    } else {
      showSuccess(response.data.message);
    }
    setIsLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, []);

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
        <h1 className="text-center text-primary"> Account activation</h1>
        <div className="mt-2">
          Want to singin? <Link to="/signin"> Sign in here</Link>
        </div>
        {isLoading && <Loading />}
      </div>
    </div>
  );
}
