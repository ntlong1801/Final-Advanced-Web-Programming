import './style.scss';

import Layout from 'layout/layout';
import { Card } from 'primereact/card';
import { useTranslation } from 'react-i18next';
import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router';
import Loading from 'components/Loading';
import { ScrollTop } from 'primereact/scrolltop';
import { useQuery } from 'react-query';
import { getAllClassOfUser } from 'apis/class.api';

export default function DashBoardPage() {
  const userId = JSON.parse(localStorage.getItem('user_profile')).id;

  const { t } = useTranslation();
  const navigate = useNavigate();
  const [isRegisterClass, setISRegisterClass] = useState(false);
  const [isHasClass, setIsHasClass] = useState(false);

  const { data, isLoading, refetch, isFetching } = useQuery({
    queryKey: ['dashBoard',],
    queryFn: () => getAllClassOfUser(userId)
  });
  const classes = useMemo(() => {
    if (data?.data?.length > 0) {
      // eslint-disable-next-line no-restricted-syntax
      for (const item of data.data) {
        if (item.role === 'teacher') {
          setIsHasClass(true);
        }

        if (item.role === 'student') {
          setISRegisterClass(true);
        }
      }
      return data?.data;
    }
    return [];
  }, [data]);

  const header = (
    <img alt="Card" src="https://www.gstatic.com/classroom/themes/img_graduation.jpg" />
  );

  return (
    <div>
      <Layout isDashBoard refetch={refetch} isRefetch={isFetching}>
        {isLoading ? (
          <Loading />
        ) : (
          <div>
            {isHasClass && <div className="text-center text-primary-color mt-5" style={{ fontSize: '2rem' }}>{t('dashBoard.teachingClass')}</div> }
            <div className="card flex flex-wrap">

              {classes?.map((item) => (item?.role === 'teacher' && (
                <Card
                  id={item?.id}
                  header={header}
                  title={item?.name}
                  subTitle={item.description || '.'}
                  className="md:w-25rem m-wml-4 cursor-pointer ml-4 mt-4"
                  onClick={() => {
                    navigate(`/c/${item?.id}`);
                  }}
                />
              )
              )
              )}
            </div>
            {isHasClass && isRegisterClass && <hr className="mt-4 ml-2" />}
            {isRegisterClass && <div className="text-center text-primary-color mt-5" style={{ fontSize: '2rem' }}>{t('dashBoard.enrolledClass')}</div>}
            <div className="card flex flex-wrap">
              {classes?.map((item) => (item?.role === 'student' && (
                <Card
                  id={item?.id}
                  header={header}
                  title={item?.name}
                  subTitle={item.description || '.'}
                  className="md:w-25rem m-wml-4 cursor-pointer ml-4 mt-4"
                  onClick={() => {
                    navigate(`/c/${item?.id}`);
                  }}
                />
              )
              )
              )}
            </div>
            <ScrollTop />

          </div>
        )}
      </Layout>
    </div>
  );
}
