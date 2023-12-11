import { Button } from 'primereact/button';
import instance from 'config';
import { useEffect, useRef, useState } from 'react';
import { Toast } from 'primereact/toast';
import { useParams } from 'react-router';

import InvitationTeacherPage from '../InvitationTeacherPage';
import InvitationStudentPage from '../InvitationStudentPage';

export default function PeoplePage() {
  const user = JSON.parse(localStorage.getItem('user_profile'));
  const { classId } = useParams();
  const toast = useRef(null);
  const [students, setStudents] = useState([]);
  const [teachers, setTeachers] = useState([]);
  const [isInviteTeacher, setIsInviteTeacher] = useState(false);
  const [isInviteStudent, setIsInviteStudent] = useState(false);
  const [isTeacher, setIsTeacher] = useState(false);
  //   const showSuccess = (msg) => {
  //     toast.current.show({ severity: 'success', summary: 'Success', detail: msg, life: 3000 });
  //   };

  const showError = (msg) => {
    toast.current.show({ severity: 'error', summary: 'Fail', detail: msg, life: 3000 });
  };
  const fetchData = async () => {
    try {
      const rs = await instance.get(`/class/all-user?id=${classId}`);
      setStudents(rs?.data?.students);
      setTeachers(rs?.data?.teachers);
      const checkTeacher = await instance.get(`/class/isTeacher?user_id=${user?.id}&class_id=${classId}`);
      if (checkTeacher?.data?.status === 'true') { setIsTeacher(true); }
    } catch (err) {
      showError('Có lỗi xảy ra');
    }
  };
  useEffect(() => {
    fetchData();
  }, []);
  const hanldleClickInviteTeacherButton = () => {
    setIsInviteTeacher(!isInviteTeacher);
  };
  const hanldleClickInviteStudentButton = () => {
    setIsInviteStudent(!isInviteStudent);
  };
  return (
    <div className="flex flex-column w-full">
      <div className="border-round p-2" style={{ width: '62.5rem' }}>
        <div className="flex align-items-center justify-content-between">
          <div className="align-items-center text-primary-color" style={{ fontSize: '2rem' }}>Giáo viên</div>
          {isTeacher && <Button onClick={hanldleClickInviteTeacherButton} icon="pi pi-fw pi-user-plus" rounded outlined severity="info" aria-label="User" />}
        </div>
        <br />
        {isInviteTeacher && <InvitationTeacherPage />}
        <hr />
        {teachers?.map((teacher) => <div className="p-4"><i className="pi pi-fw pi-user mr-2" />{teacher.full_name}</div>)}
      </div>
      <div className="border-round p-2" style={{ width: '62.5rem' }}>
        <div className="flex align-items-center justify-content-between">
          <div className="align-items-center text-primary-color" style={{ fontSize: '2rem' }}>Học sinh</div>
          {isTeacher && <Button onClick={hanldleClickInviteStudentButton} icon="pi pi-fw pi-user-plus" rounded outlined severity="info" aria-label="User" />}
        </div>
        <br />
        {isInviteStudent && <InvitationStudentPage />}
        <hr />
        {students?.map((student) => <div className="p-4"><i className="pi pi-fw pi-user mr-2" />{student.full_name}</div>)}
      </div>
      <Toast ref={toast} />
    </div>
  );
}
