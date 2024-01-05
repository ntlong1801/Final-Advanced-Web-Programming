import './style.scss';

import Layout from 'layout/layout';
import { TabPanel, TabView } from 'primereact/tabview';
import { useNavigate, useParams } from 'react-router';
import { useSearchParams } from 'react-router-dom';
import { ScrollTop } from 'primereact/scrolltop';
import { isTeacherOfClass } from 'apis/class.api';
import { useQuery } from 'react-query';
import { useMemo } from 'react';
import NewsPage from './NewsPage';
import PeoplePage from './PeoplePage';
import GradePage from './GradePage';

export default function DetailCoursePage() {
  const user = JSON.parse(localStorage.getItem('user_profile'));
  const { classId } = useParams();
  const navigate = useNavigate();

  const [searchParams] = useSearchParams();
  const tab = searchParams.get('tab') || 0;

  const { data } = useQuery({
    queryKey: ['isTeacherOfClass', classId],
    queryFn: () => isTeacherOfClass(user.id, classId)
  });
  const isTeacher = useMemo(() => data?.data?.status !== 'false', [data]);

  return (
    <div>
      <Layout>
        <TabView
          activeIndex={parseInt(tab, 10)}
          onTabChange={(e) => navigate(`.?tab=${e.index}`)}
        >
          <TabPanel header="Bảng tin" leftIcon="pi pi-fw pi-bars">
            <NewsPage isTeacher={isTeacher} />

          </TabPanel>
          {/* <TabPanel header="Bài tập trên lớp" leftIcon="pi pi-fw pi-book">
              abc
            </TabPanel> */}
          <TabPanel header="Mọi người" leftIcon="pi pi-fw pi-users">
            <PeoplePage />
          </TabPanel>
          <TabPanel header="Điểm" leftIcon="pi pi-fw pi-calculator">
            <GradePage />
          </TabPanel>
        </TabView>
        <ScrollTop />
      </Layout>

    </div>

  );
}
