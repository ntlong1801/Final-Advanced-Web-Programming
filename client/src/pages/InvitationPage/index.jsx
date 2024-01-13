import Header from 'layout/header';
import { useEffect, useRef, useMemo } from 'react';
import { useNavigate } from 'react-router';
import { Toast } from 'primereact/toast';
import { useQuery, useMutation } from 'react-query';
import { joinClassByLink } from 'apis/class.api';
import Loading from 'components/Loading';
import { getStudentId } from 'apis/user.api';
import { useForm } from 'react-hook-form';
import TextInput from 'components/FormControl/TextInput';

import { Button } from 'primereact/button';
import { useTranslation } from 'react-i18next';

export default function InvitationPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user_profile'));
  const link = window.location.href;
  const toast = useRef(null);

  const { control, formState: { errors } } = useForm({ mode: 'onChange' });

  const { data, isLoading } = useQuery({
    queryKey: ['studentId', user?.id],
    queryFn: () => getStudentId(user?.id)
  });

  const studentId = useMemo(() => data?.data?.studentId ?? null, [data]);

  const { mutate } = useMutation(joinClassByLink);

  const showSuccess = (msg) => {
    toast.current.show({ severity: 'success', summary: 'Success', detail: msg, life: 3000 });
  };

  const showError = (msg) => {
    toast.current.show({ severity: 'error', summary: 'Fail', detail: msg, life: 3000 });
  };

  const handleJoinClass = () => {
    const dataSender = {
      email: user?.email,
      link
    };
    if (studentId) {
      dataSender.studentId = studentId.student_id;
    }
    mutate(dataSender, {
      onSuccess: (res) => {
        if (res?.data?.status === 'failed') {
          showError(res?.data?.message);
          setTimeout(() => navigate('/dashboard'), 3000);
        }
        if (res?.data?.status === 'success') {
          showSuccess(res?.data?.message);
          setTimeout(() => navigate('/dashboard'), 3000);
        }
      }
    });
  };

  useEffect(() => {
    if (!user) {
      navigate('/signin', { state: link });
    }
  }, []);
  return (
    <div>
      <Header />
      <Toast ref={toast} />
      <form autoComplete="false">
        <div className="flex flex-column align-items-center justify-content-center" style={{ height: '90vh' }}>
          {!studentId && (
            <TextInput
              name="studentId"
              label={t('invitationPage.studentId')}
              control={control}
              errors={errors}
              isRequired
            />
          ) }

          <Button
            type="button"
            severity="primary"
            onClick={() => handleJoinClass()}
          >Join class
          </Button>
        </div>
      </form>
      {isLoading && <Loading />}
    </div>
  );
}
