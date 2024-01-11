import { useParams } from 'react-router';
import { useRef, useMemo } from 'react';

import { getClassByID } from 'apis/class.api';
import { useQuery } from 'react-query';
import Loading from 'components/Loading';
import PropTypes from 'prop-types';
import getClassCode from 'utils/func';

import { Toast } from 'primereact/toast';
import GradeStucture from '../GradeStructure';

export default function NewsPage({ isTeacher }) {
  const { classId } = useParams();
  const toast = useRef(null);
  const showSuccess = (msg) => {
    toast.current.show({ severity: 'info', summary: 'Success', detail: msg, life: 3000 });
  };

  const showError = (msg) => {
    toast.current.show({ severity: 'error', summary: 'Fail', detail: msg, life: 3000 });
  };
  const handleCopyClick = async (link) => {
    try {
      await navigator.clipboard.writeText(link);
      showSuccess('Sao chép thành công!');
    } catch (err) {
      showError('Không thể copy');
    }
  };

  const { data: _data,
    isLoading } = useQuery({
    queryKey: ['class', classId],
    queryFn: () => getClassByID(classId)
  });
  const infoClass = useMemo(() => _data?.data ?? [], [_data]);

  if (isLoading) {
    return (
      <Loading />
    );
  }

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
        <div className="col-2 mt-4">
          {isTeacher ? (
            <div className="p-3 border-round-md border-1 font-bold ">
              Mã lớp
              <p>{getClassCode(infoClass?.invitation)}<i
                className="pi pi-fw pi-copy cursor-pointer"
                onClick={() => {
                  handleCopyClick(getClassCode(infoClass?.invitation));
                }}
              />
              </p>
            </div>
          )
            : (
              <div className="p-3 border-round-md border-1 font-bold ">
                <span>Chưa có gì sắp xảy ra</span>

              </div>
            )}

        </div>
        <div className="col-10 mt-4">
          <div className="p-3 border-round-md border-1 cursor-pointer">
            <i className="pi pi-fw pi-user mr-2" />
            Thông báo nội dung nào đó cho lớp học của bạn
          </div>
        </div>
        <div className="col-9 mt-4">
          <GradeStucture />
        </div>
        <Toast ref={toast} />
      </div>
    </div>

  );
}

NewsPage.propTypes = {
  isTeacher: PropTypes.bool
};

NewsPage.defaultProps = {
  isTeacher: false,
};
