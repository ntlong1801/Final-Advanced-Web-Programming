import instance from 'config';
import Header from 'layout/header';
import { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router';
import { Toast } from 'primereact/toast';

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

  const sendLink = async () => {
    const rs = await instance.get(`/class/join?email=${user?.email}&link=${link}`);
    if (rs?.data?.status === 'failed') {
      showError(rs?.data?.message);
      setTimeout(() => navigate('/dashboard'), 3000);
    }
    if (rs?.data?.status === 'success') {
      showSuccess(rs?.data?.message);
      setTimeout(() => navigate('/dashboard'), 3000);
    }
  };
  useEffect(() => {
    if (user) {
      sendLink();
    } else {
      navigate('/signIn', { state: link
      });
    }
  });
  return (
    <div>
      <Header />
      <Toast ref={toast} />
    </div>
  );
}
