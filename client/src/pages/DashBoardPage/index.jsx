import Header from 'layout/header';
import './style.scss';

import { Card } from 'primereact/card';
import instance from 'config';

import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';

// import instance from 'config';

export default function DashBoardPage() {
  const user = JSON.parse(localStorage.getItem('user_profile'));

  const navigate = useNavigate();
  const [classes, setClasses] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefetch, setIsRefetch] = useState(false);

  // const [showCreateClassModal, setShowCreateClassModal] = useState(false);

  const fetchData = async () => {
    setIsLoading(true);
    const rs = await instance.get(`/class/classesByUserId?id=${user?.id}`);
    setIsLoading(false);
    if (rs?.data?.length > 0) {
      setClasses(rs.data);
    }
  };

  useEffect(() => {
    fetchData();
    setIsRefetch(false);
  }, [isRefetch]);

  return (
    <div>
      <Header isDashBoard setRefetch={setIsRefetch} />
      {isLoading ? (
        <p>Loading...</p>
      ) : (
        <div className="card flex flex-wrap justify-content-center p-4">

          {classes?.map((item) => (
            <Card
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
        </div>

      )}
    </div>
  );
}
