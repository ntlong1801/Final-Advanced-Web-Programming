import './style.scss';

import { Link } from 'react-router-dom';
import { Toast } from 'primereact/toast';
import { useRef, useEffect } from 'react';
import Loading from 'components/Loading';
import { useQuery } from 'react-query';
import { confirmEmail } from 'apis/auth.api';

export default function WaitingConfirmSignupEmail() {
  const token = window.location.href.split('/sigup-email')[1];
  const toast = useRef(null);

  const showSuccess = (msg) => {
    toast.current.show({ severity: 'success', summary: 'Success', detail: msg, life: 3000 });
  };

  const showError = (msg) => {
    toast.current.show({ severity: 'error', summary: 'Fail', detail: msg, life: 3000 });
  };

  const { data: _data, isLoading } = useQuery({
    queryKey: [token],
    queryFn: () => confirmEmail(token)
  });

  useEffect(() => {
    if (!isLoading) {
      if (_data?.data?.status === 'failed') {
        showError(_data?.data?.message);
      }
      if (_data?.data?.status === 'success') {
        showSuccess(_data?.data?.message);
      }
    }
  }, [_data]);

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
