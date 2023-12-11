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
  const [scrollTop, setIsScrollTop] = useState(false);
  const contentRef = useRef(null);

  // const [showCreateClassModal, setShowCreateClassModal] = useState(false);

  const fetchData = async () => {
    setIsLoading(true);
    const rs = await instance.get(`/class/classesByUserId?id=${user?.id}`);
    setIsLoading(false);
    if (rs?.data?.length > 0) {
      setClasses(rs.data);
    }
  };

  const handleScrollTop = () => {
    contentRef.current.scrollTop = 0;
  };

  useEffect(() => {
    setIsScrollTop(false);
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
          className="card flex flex-wrap justify-content-center p-4"
          style={{
            maxHeight: '90vh',
            overflowY: 'auto',
            borderRadius: '12px',
            border: '1px solid var(--surface-border)',
            backgroundColor: 'white',
          }}
        >

          {classes?.map((item) => (
            <Card
              id={item?.id}
              title={item?.name}
              subTitle={item.description}
              className="md:w-25rem m-wml-4 cursor-pointer ml-4 mt-4"
              onClick={() => {
                navigate(`/c/${item?.id}`);
              }}
            >
              <img className="m-0 w-full border-round" src="https://www.gstatic.com/classroom/themes/img_graduation.jpg" alt="" />
            </Card>
          )
          )}
          <Button className={scrollTop ? 'hidden' : 'button-scroll-top'} icon="pi pi-arrow-up" severity="info" aria-label="User" onClick={handleScrollTop} rounded />

        </div>
      )}
    </div>
  );
}
