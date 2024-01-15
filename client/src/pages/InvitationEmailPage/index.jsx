import Header from 'layout/header';
import { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router';
import { Toast } from 'primereact/toast';
import Loading from 'components/Loading';
import { useQuery, useMutation } from 'react-query';
import { joinClassByEmail } from 'apis/class.api';
import { logout } from 'apis/auth.api';

export default function InvitationEmailPage() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user_profile'));
  const link = window.location.href;
  const tokenFromMail = window.location.href.split('?token=')[1] || '';
  const toast = useRef(null);

  const showSuccess = (msg) => {
    toast.current.show({ severity: 'success', summary: 'Success', detail: msg, life: 3000 });
  };

  const showError = (msg) => {
    toast.current.show({ severity: 'error', summary: 'Fail', detail: msg, life: 3000 });
  };

  const showWarning = (msg) => {
    toast.current.show({ severity: 'warn', summary: 'Warning', detail: msg, life: 3000 });
  };

  const { mutate } = useMutation(logout);

  const { data: _data, isLoading } = useQuery({
    queryKey: [link],
    queryFn: () => joinClassByEmail(tokenFromMail, user.id)
  });

  useEffect(() => {
    if (!user) {
      navigate('/signin', { state: link });
    }
    if (_data?.data?.code === '200') {
      showSuccess(_data.data.message);
      setTimeout(() => navigate('/dashboard'), 3000);
    }
    if (_data?.data?.code === 'existed') {
      showError(_data.data.message);
      setTimeout(() => navigate('/dashboard'), 3000);
    }
    if (_data?.data?.code === '404') {
      showWarning('Bạn vui lòng đăng nhập vào đúng tài khoản nhận email');
      mutate({}, {
        onSuccess: () => {
          localStorage.removeItem('access_token');
          localStorage.removeItem('user_profile');
          setTimeout(() => {
            navigate('/signin', { state: link });
          }, 3000);
        }
      });
    }
  }, [_data]);
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
