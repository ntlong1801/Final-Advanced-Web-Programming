import React, { useRef, useState } from 'react';
import instance from 'config';
import './style.scss';
import Loading from 'components/Loading';
import { useParams } from 'react-router';

export default function InvitationPage() {
  const { classId } = useParams();
  const [clicked, setClicked] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [email, setEmail] = useState('');
  const toast = useRef(null);

  const showSuccess = (msg) => {
    toast.current.show({
      severity: 'success',
      summary: 'Success',
      detail: msg || 'null', // Sử dụng 'null' thay vì "null"
      life: 3000,
    });
  };

  const showError = (msg) => {
    toast.current.show({
      severity: 'error',
      summary: 'Fail',
      detail: msg || 'null', // Sử dụng 'null' thay vì "null"
      life: 3000,
    });
  };

  const handleTyping = (e) => {
    setEmail(e.target.value);
  };

  const handleClick = async () => {
    setClicked(true);
    setTimeout(() => {
      setClicked(false);
    }, 200);
    const mailLocal = JSON.parse(localStorage.getItem('user_profile')).email || '';
    const data = {
      emailReciver: email,
      emailSend: mailLocal,
      classId,
      roleUser: 'teacher',
    };
    // invite user by email
    try {
      setIsLoading(true); // Thêm setIsLoading(true) khi bắt đầu request
      const response = await instance.post('/class/inviteByMail', data);
      setEmail('');
      setIsLoading(false);
      if (response.data.status === 'failed') {
        showError(response.data.message);
      } else {
        showSuccess(response.data.message);
      }
    } catch (error) {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-column w-full" key="ivitation_student">
      <input
        id="submit-invite-email"
        name="input-email"
        className="input_email_send"
        placeholder="email to send"
        onChange={handleTyping}
        value={email}
      />
      <br />
      <button
        id="submid-invite-email"
        className={`submit-invite ${clicked ? 'clicked' : ''}`}
        onClick={handleClick}
        type="button"
      >
        Invite
      </button>
      {isLoading && <Loading />}
    </div>
  );
}
