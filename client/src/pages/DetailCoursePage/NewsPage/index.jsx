import { useParams } from 'react-router';
import { useRef, useEffect, useState } from 'react';
import instance from 'config';
import { Dialog } from 'primereact/dialog';
import { Button } from 'primereact/button';

export default function NewsPage() {
  const user = JSON.parse(localStorage.getItem('user_profile'));
  const { classId } = useParams();
  const toast = useRef(null);
  const [confirmCopyDialog, setConfirmCopyDialog] = useState(false);
  const [infoClass, setInfoClass] = useState([]);
  const [isTeacher, setIsTeacher] = useState(false);
  //   const showSuccess = (msg) => {
  //     toast.current.show({ severity: 'success', summary: 'Success', detail: msg, life: 3000 });
  //   };

  const showError = (msg) => {
    toast.current.show({ severity: 'error', summary: 'Fail', detail: msg, life: 3000 });
  };
  const handleCopyClick = async (link) => {
    try {
      await navigator.clipboard.writeText(link);
      setConfirmCopyDialog(true);
    } catch (err) {
      showError('Không thể copy');
    }
  };
  const fetchData = async () => {
    try {
      const rs = await instance.get(`/class/class?id=${classId}`);
      setInfoClass(rs?.data);
      const checkTeacher = await instance.get(`/class/isTeacher?user_id=${user?.id}&class_id=${classId}`);
      if (checkTeacher?.data?.status === 'true') { setIsTeacher(true); }
    } catch (err) {
      showError('Loi');
    }
  };
  useEffect(() => {
    fetchData();
  }, []);

  return (

    <div className="flex flex-column w-full align-items-center">
      <div className="flex flex-column justify-content-end background-primary-color border-round p-2" style={{ width: '75%', minHeight: '30vh', minWidth: '20rem' }}>
        <p className="text-white mb-0" style={{ fontSize: '2rem' }}>{infoClass?.name}</p>
        <p className="text-white">{infoClass?.description}</p>
        {isTeacher && (
          <p className="text-white">{infoClass?.invitation}<i
            className="pi pi-fw pi-copy cursor-pointer"
            onClick={() => {
              handleCopyClick(infoClass?.invitation);
            }}
          />
          </p>
        )}
      </div>
      <div className="grid w-9">
        <div className="col-3 mt-4">
          <div className="p-3 border-round-md border-1 font-bold ">Mã lớp</div>
        </div>
        <div className="col-9 mt-4">
          <div className="p-3 border-round-md border-1 cursor-pointer">
            <i className="pi pi-fw pi-user mr-2" />
            Thông báo nội dung nào đó cho lớp học của bạn
          </div>

        </div>
      </div>
      <Dialog header="Copy" visible={confirmCopyDialog} style={{ width: '30vw' }} onHide={() => setConfirmCopyDialog(false)}>
        <p className="text-center text-primary-color font-bold" style={{ fontSize: '2rem' }}>Sao chép link thành công</p>
        <div className="flex justify-content-end">
          <Button label="Đồng ý" severity="primary" onClick={() => setConfirmCopyDialog(false)} />
        </div>
      </Dialog>
    </div>

  );
}
