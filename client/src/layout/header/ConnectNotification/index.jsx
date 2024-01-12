import './style.scss';

import { useEffect, useState, useMemo, useRef } from 'react';
import io from 'socket.io-client';
import { useParams } from 'react-router';
import { useQuery, useMutation } from 'react-query';
import { Toast } from 'primereact/toast';
import { OverlayPanel } from 'primereact/overlaypanel';
import { Button } from 'primereact/button';
import { Link } from 'react-router-dom';

import { getNotificationStudent, getNotificationTeacher } from 'apis/user.api';

import { isTeacherOfClass, getClassByID } from 'apis/class.api';

const socket = io('http://localhost:5000'); // Replace with your server URL
function ConnectNotification() {
  const toast = useRef(null);
  const overlayPanelRef = useRef(null);
  const [notifications, setNotifications] = useState([]);
  const [isShowNotification, setIsShowNotification] = useState(false);
  const { classId } = useParams();
  const user = JSON.parse(localStorage.getItem('user_profile'));
  const userId = user.email;

  const { mutate: muateNotiStudent } = useMutation(getNotificationStudent);
  const { mutate: mutateNotiTeacher } = useMutation(getNotificationTeacher);

  const showNotification = (message) => {
    if (toast.current) {
      toast.current.show({
        severity: 'info',
        summary: 'Notification',
        detail: message,
        life: 20000,
      });
    }
  };

  const { data: _data } = useQuery({
    queryKey: ['class', classId],
    queryFn: () => getClassByID(classId),
  });
  useMemo(() => _data?.data ?? [], [_data]);
  const { data: checkTeacher } = useQuery({
    queryKey: [classId],
    queryFn: () => isTeacherOfClass(user?.id, classId),
  });
  const isTeacher = useMemo(() => checkTeacher?.data?.status !== 'false', [checkTeacher]);

  useEffect(() => {
    socket.on('connect');

    socket.emit('joinClass', classId, userId);
    socket.on('notification', (message) => {
      showNotification(message);
    });
    socket.on('publicGradeFromTeacher', ({ message }) => {
      showNotification(message);
    });
    // socket.on(request);
  }, []);

  useEffect(() => {
    // get data from be
    if (isTeacher) {
      const dataSender = {
        teacherId: user?.id,
      };
      // get notification of teacher
      mutateNotiTeacher(dataSender, {
        onSuccess: (response) => {
          setNotifications(response.data);
        },
      });
    } else {
      const dataSender = {
        studentId: user?.id,
      };
      // get notification of teacher
      muateNotiStudent(dataSender, {
        onSuccess: (response) => {
          setNotifications(response.data);
        },
      });
    }
  }, []);

  const handleShowNotification = (event) => {
    setIsShowNotification(!isShowNotification);
    overlayPanelRef.current.show(event);
  };

  return (
    <div>
      <Button
        icon="pi pi-bell"
        severity="help"
        aria-label="Notification"
        rounded
        onClick={handleShowNotification}
      />
      <OverlayPanel
        ref={overlayPanelRef}
        appendTo={typeof window !== 'undefined' ? document.body : null}
        showCloseIcon={false}
        style={{ width: '300px' }}
      >
        {isShowNotification &&
          notifications.map((noti) => (
            <Link to={noti.ref}>
              <p className="notification-item">{noti.notification_type}</p>
            </Link>
          ))}
      </OverlayPanel>
      <Toast ref={toast} />
    </div>
  );
}

export default ConnectNotification;
