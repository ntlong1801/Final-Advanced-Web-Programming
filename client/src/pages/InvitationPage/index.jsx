import Header from 'layout/header';
import { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router';
import { Toast } from 'primereact/toast';
import { useQuery } from 'react-query';
import { joinClassByLink } from 'apis/class.api';
import Loading from 'components/Loading';

export default function InvitationPage() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user_profile'));
  const link = window.location.href;
  const toast = useRef(null);

  const showSuccess = (msg) => {
    toast.current.show({ severity: 'success', summary: 'Success', detail: msg, life: 3000 });
  };

  const showError = (msg) => {
    toast.current.show({ severity: 'error', summary: 'Fail', detail: msg, life: 3000 });
  };

  const { data: _data, isLoading } = useQuery({
    queryKey: [link],
    queryFn: () => joinClassByLink(user?.email, link)
  });

  if (_data?.data?.status === 'failed') {
    showError(_data?.data?.message);
    setTimeout(() => navigate('/dashboard'), 3000);
  }
  if (_data?.data?.status === 'success') {
    showSuccess(_data?.data?.message);
    setTimeout(() => navigate('/dashboard'), 3000);
  }

  useEffect(() => {
    if (!user) {
      navigate('/signin', { state: link });
    }
  }, []);
  return (
    <div>
      <Header />
      <Toast ref={toast} />
      <div className="text-center mb-5">

        <div className="text-900 text-3xl font-medium my-3">
          Bạn sẽ quay lại trang chủ trong vài giây tới...
        </div>
      </div>
      {isLoading && <Loading />}
    </div>
  );
}
