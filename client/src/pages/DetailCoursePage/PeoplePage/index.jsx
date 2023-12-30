import { Button } from 'primereact/button';
import { useRef, useMemo } from 'react';
import { Toast } from 'primereact/toast';
import { useParams } from 'react-router';
import { getAllUserOfClass, isTeacherOfClass } from 'apis/class.api';
import { useQuery } from 'react-query';
import Loading from 'components/Loading';
import InviteStudent from '../components/InviteStudent';
import InviteTeacher from '../components/InviteTeacher';

export default function PeoplePage() {
  const user = JSON.parse(localStorage.getItem('user_profile'));
  const { classId } = useParams();
  const toast = useRef(null);
  const inviteStudent = useRef(null);
  const inviteTeacher = useRef(null);

  //   const showSuccess = (msg) => {
  //     toast.current.show({ severity: 'success', summary: 'Success', detail: msg, life: 3000 });
  //   };

  // const showError = (msg) => {
  //   toast.current.show({ severity: 'error', summary: 'Fail', detail: msg, life: 3000 });
  // };

  const { data: _data, isLoading } = useQuery({
    queryKey: ['peopleOfClass', classId],
    queryFn: () => getAllUserOfClass(classId)
  });
  const students = useMemo(() => _data?.data?.students ?? [], [_data]);
  const teachers = useMemo(() => _data?.data?.teachers ?? [], [_data]);

  const { data: checkTeacher,
    isLoading: isCheckLoading } = useQuery({
    queryKey: [classId],
    queryFn: () => isTeacherOfClass(user?.id, classId)
  });
  const isTeacher = useMemo(() => checkTeacher?.data?.status !== 'false', [checkTeacher]);

  const hanldleClickInviteTeacherButton = () => {
    inviteTeacher.current.open({
      email: user?.email,
      classId
    });
  };
  const hanldleClickInviteStudentButton = () => {
    inviteStudent.current.open({
      email: user?.email,
      classId
    });
  };
  if (isCheckLoading || isLoading) {
    return (
      <Loading />
    );
  }
  return (

    <div className="flex flex-column w-full align-items-center">
      <div className="border-round p-2" style={{ width: '75%', minWidth: '20rem' }}>
        <div className="flex align-items-center justify-content-between">
          <div className="align-items-center text-primary-color" style={{ fontSize: '2rem' }}>Giáo viên</div>
          {isTeacher && <Button onClick={hanldleClickInviteTeacherButton} icon="pi pi-fw pi-user-plus" rounded outlined severity="info" aria-label="User" />}
        </div>
        <hr />
        {teachers?.map((teacher) => <div className="p-4"><i className="pi pi-fw pi-user mr-2" />{teacher.full_name}</div>)}
      </div>
      <div className="border-round p-2" style={{ width: '75%', minWidth: '20rem' }}>
        <div className="flex align-items-center justify-content-between">
          <div className="align-items-center text-primary-color" style={{ fontSize: '2rem' }}>Học sinh</div>
          <div className="flex">
            <p className="text-primary-color mr-2 font-bold">{students.length} học sinh</p>
            {isTeacher && <Button onClick={hanldleClickInviteStudentButton} icon="pi pi-fw pi-user-plus" rounded outlined severity="info" aria-label="User" />}
          </div>
        </div>
        <hr />
        {students?.map((student) => <div className="p-4"><i className="pi pi-fw pi-user mr-2" />{student.full_name}</div>)}
      </div>
      <InviteStudent ref={inviteStudent} />
      <InviteTeacher ref={inviteTeacher} />
      <Toast ref={toast} />
    </div>
  );
}
