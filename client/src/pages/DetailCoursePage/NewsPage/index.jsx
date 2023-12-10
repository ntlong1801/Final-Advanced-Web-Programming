import { useParams } from 'react-router';
import { useRef, useEffect, useState } from 'react';
import instance from 'config';

export default function NewsPage() {
  const { classId } = useParams();
  const toast = useRef(null);
  const [infoClass, setInfoClass] = useState([]);
  //   const showSuccess = (msg) => {
  //     toast.current.show({ severity: 'success', summary: 'Success', detail: msg, life: 3000 });
  //   };

  const showError = (msg) => {
    toast.current.show({ severity: 'error', summary: 'Fail', detail: msg, life: 3000 });
  };
  const fetchData = async () => {
    try {
      const rs = await instance.get(`/class/class?id=${classId}`);
      setInfoClass(rs?.data);
      console.log(infoClass);
    } catch (err) {
      showError('Loi');
    }
  };
  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div className="flex flex-column w-full">
      <div className="flex flex-column justify-content-end background-primary-color border-round p-2" style={{ width: '62.5rem', minHeight: '30vh' }}>
        <p className="text-white mb-0" style={{ fontSize: '2rem' }}>{infoClass?.name}</p>
        <p className="text-white">{infoClass?.description}</p>
      </div>
      <div className="grid">
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
    </div>
  );
}
