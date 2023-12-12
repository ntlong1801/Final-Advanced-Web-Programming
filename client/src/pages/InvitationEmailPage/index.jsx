import instance from 'config';
import Header from 'layout/header';
import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router';
import { Toast } from 'primereact/toast';
import Loading from 'components/Loading';

export default function InvitationEmailPage() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user_profile'));
  const link = window.location.href;
  const toast = useRef(null);
  const [isLoading, setIsLoading] = useState(false);

  const showSuccess = (msg) => {
    toast.current.show({ severity: 'success', summary: 'Success', detail: msg, life: 3000 });
  };

  const showError = (msg) => {
    toast.current.show({ severity: 'error', summary: 'Fail', detail: msg, life: 3000 });
  };

  const showWarning = (msg) => {
    toast.current.show({ severity: 'warn', summary: 'Warning', detail: msg, life: 3000 });
  };

  const handleLogout = async () => {
    await instance.post('/auth/logout');
    localStorage.removeItem('access_token');
    localStorage.removeItem('user_profile');
  };

  const sendLink = async () => {
    const tokenFromMail = window.location.href.split('?token=')[1] || '';
    if (tokenFromMail) {
      setIsLoading(true);
      const rs = await instance.get(`/class/join/${tokenFromMail}?userId=${user.id}`);
      setIsLoading(false);
      if (rs?.data?.code === '200') {
        showSuccess(rs.data.message);
        setTimeout(() => navigate('/dashboard'), 3000);
      }
      if (rs?.data?.code === 'existed') {
        showError(rs.data.message);
        setTimeout(() => navigate('/dashboard'), 3000);
      }
      if (rs?.data?.code === '404') {
        handleLogout();
        showWarning('Bạn vui lòng đăng nhập vào đúng tài khoản nhận email');
        setTimeout(() => {
          navigate('/signin', { state: link });
        }, 3000);
      }
    }
  };
  useEffect(() => {
    if (user) {
      sendLink();
    } else {
      navigate('/signin', { state: link });
    }
  }, []);
  return (
    <div>
      {isLoading && <Loading />}
      <Header />
      <Toast ref={toast} />
      <div className="text-center mb-5">

        <div className="text-900 text-3xl font-medium my-3">
          Bạn sẽ quay lại trang chủ hoặc đăng nhập trong vài giây tới...
        </div>
      </div>
    </div>
  );
}
