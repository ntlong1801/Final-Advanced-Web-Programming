import Header from 'layout/header';
import './style.scss';

import { Card } from 'primereact/card';
import instance from 'config';

import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router';
import { Button } from 'primereact/button';
import Loading from 'components/Loading';

export default function DashBoardPage() {
  const user = JSON.parse(localStorage.getItem('user_profile'));

  const navigate = useNavigate();
  const [classes, setClasses] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefetch, setIsRefetch] = useState(false);
  const [isRegisterClass, setISRegisterClass] = useState(false);
  const [isHasClass, setIsHasClass] = useState(false);
  const [scrollTop, setIsScrollTop] = useState(false);
  const contentRef = useRef(null);

  // const [showCreateClassModal, setShowCreateClassModal] = useState(false);

  const fetchData = async () => {
    setIsLoading(true);
    const rs = await instance.get(`/class/classesByUserId?id=${user?.id}`);
    setIsLoading(false);
    if (rs?.data?.length > 0) {
      setClasses(rs.data);
      // eslint-disable-next-line no-restricted-syntax
      for (const item of rs.data) {
        if (item.role === 'teacher') {
          setIsHasClass(true);
        }

        if (item.role === 'student') {
          setISRegisterClass(true);
        }
      }
    }
  };

  const fetchInvitation = async () => {
    setIsLoading(true);
    const tokenFromMail = window.location.href.split('?token=')[1] || '';
    if (!tokenFromMail) {
      setIsLoading(false);
    } else {
      await instance.get(`/class/join/${tokenFromMail}`);
      setIsLoading(false);
    }
  };

  const handleScrollTop = () => {
    contentRef.current.scrollTop = 0;
  };

  useEffect(() => {
    setIsScrollTop(false);
    fetchInvitation();
    fetchData();
    setIsRefetch(false);
  }, [isRefetch]);

  return (
    <div>
      <Header isDashBoard setRefetch={setIsRefetch} />
      {isLoading ? (
        <Loading />
      ) : (
        <div
          ref={contentRef}
          style={{
            maxHeight: '90vh',
            overflowY: 'auto',
            borderRadius: '12px',
            border: '1px solid var(--surface-border)',
            backgroundColor: 'white',
          }}
        >
          {isHasClass && <div className="text-center text-primary-color mt-5" style={{ fontSize: '2rem' }}>Lớp học của bạn</div> }
          <div className="card flex flex-wrap justify-content-center">

            {classes?.map((item) => (item?.role === 'teacher' && (
              <Card
                id={item?.id}
                title={item?.name}
                subTitle={item.description || '.'}
                className="md:w-25rem m-wml-4 cursor-pointer ml-4 mt-4"
                onClick={() => {
                  navigate(`/c/${item?.id}`);
                }}
              >
                <img className="m-0 w-full border-round" src="https://www.gstatic.com/classroom/themes/img_graduation.jpg" alt="" />
              </Card>
            )
            )
            )}
          </div>
          {isHasClass && isRegisterClass && <hr className="mt-4" />}
          {isRegisterClass && <div className="text-center text-primary-color mt-5" style={{ fontSize: '2rem' }}>Lớp học đã đăng ký</div>}
          <div className="card flex flex-wrap justify-content-center">
            {classes?.map((item) => (item?.role === 'student' && (
              <Card
                id={item?.id}
                title={item?.name}
                subTitle={item.description || '.'}
                className="md:w-25rem m-wml-4 cursor-pointer ml-4 mt-4"
                onClick={() => {
                  navigate(`/c/${item?.id}`);
                }}
              >
                <img className="m-0 w-full border-round" src="https://www.gstatic.com/classroom/themes/img_graduation.jpg" alt="" />
              </Card>
            )
            )
            )}
          </div>

          <Button className={scrollTop ? 'hidden' : 'button-scroll-top'} icon="pi pi-arrow-up" severity="info" aria-label="User" onClick={handleScrollTop} rounded />

        </div>
      )}
    </div>
  );
}
