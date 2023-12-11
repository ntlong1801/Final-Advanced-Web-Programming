import { Button } from 'primereact/button';
import instance from 'config';
import { useEffect, useRef, useState } from 'react';
import { Toast } from 'primereact/toast';
import { useParams } from 'react-router';

export default function PeoplePage() {
  const { classId } = useParams();
  const toast = useRef(null);
  const [students, setStudents] = useState([]);
  const [teachers, setTeachers] = useState([]);
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
    } catch (err) {
      showError('Loi');
    }
  };
  useEffect(() => {
    fetchData();
  }, []);
  return (
    <div className="flex flex-column w-full">
      <div className="border-round p-2" style={{ width: '62.5rem' }}>
        <div className="flex align-items-center justify-content-between">
          <div className="align-items-center text-primary-color" style={{ fontSize: '2rem' }}>Giáo viên</div>
          <Button icon="pi pi-fw pi-user-plus" rounded outlined severity="info" aria-label="User" />
        </div>
        <hr />
        {teachers?.map((teacher) => <div className="p-4"><i className="pi pi-fw pi-user mr-2" />{teacher.full_name}</div>)}
      </div>
      <div className="border-round p-2" style={{ width: '62.5rem' }}>
        <div className="flex align-items-center justify-content-between">
          <div className="align-items-center text-primary-color" style={{ fontSize: '2rem' }}>Học sinh</div>
          <Button icon="pi pi-fw pi-user-plus" rounded outlined severity="info" aria-label="User" />
        </div>
        <hr />
        {students?.map((student) => <div className="p-4"><i className="pi pi-fw pi-user mr-2" />{student.full_name}</div>)}
      </div>
      <Toast ref={toast} />
    </div>
  );
}
