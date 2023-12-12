import './style.scss';

import Layout from 'layout/layout';
import { Card } from 'primereact/card';
import instance from 'config';

import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import Loading from 'components/Loading';

export default function DashBoardPage() {
  const user = JSON.parse(localStorage.getItem('user_profile'));

  const navigate = useNavigate();
  const [classes, setClasses] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefetch, setIsRefetch] = useState(false);
  const [isRegisterClass, setISRegisterClass] = useState(false);
  const [isHasClass, setIsHasClass] = useState(false);

  const fetchData = async () => {
    if (user) {
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
    }
  };

  useEffect(() => {
    if (user) {
      fetchData();
      setIsRefetch(false);
    } else {
      navigate('/signin');
    }
  }, [isRefetch]);

  return (
    <div>
      <Layout isDashBoard setRefetch={setIsRefetch} isRefetch={isRefetch}>
        {isLoading ? (
          <Loading />
        ) : (
          <div>
            {isHasClass && <div className="text-center text-primary-color mt-5" style={{ fontSize: '2rem' }}>Lớp học giảng dạy</div> }
            <div className="card flex flex-wrap">

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
            <div className="card flex flex-wrap">
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

          </div>
        )}
      </Layout>
    </div>
  );
}
