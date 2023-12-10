import './style.scss';

import Layout from 'layout/layout';
import { TabPanel, TabView } from 'primereact/tabview';
import { useNavigate, useParams } from 'react-router';
import { useSearchParams } from 'react-router-dom';
import NewsPage from './NewsPage';
import PeoplePage from './PeoplePage';

export default function DetailCoursePage() {
  const navigate = useNavigate();
  const { classId } = useParams();
  console.log(classId);
  // eslint-disable-next-line no-unused-vars
  const fakeData = [
    {
      title: 'ABC',
      des: 'def'
    }
  ];
  const [searchParams] = useSearchParams();
  const tab = searchParams.get('tab') || 0;

  return (
    <div>
      <Layout />
      <div className="flex justify-content-start">
        <div className="flex justify-content-center flex-row">
          <div className="grid" style={{ marginLeft: '18rem' }} />
          <TabView
            activeIndex={parseInt(tab, 10)}
            onTabChange={(e) => navigate(`.?tab=${e.index}`)}
            className="min-h-screen fixed top-10 left-position-20 w-75"
          >
            <TabPanel header="Bảng tin" leftIcon="pi pi-fw pi-bars">
              <NewsPage />
            </TabPanel>
            {/* <TabPanel header="Bài tập trên lớp" leftIcon="pi pi-fw pi-book">
              abc
            </TabPanel> */}
            <TabPanel header="Mọi người" leftIcon="pi pi-fw pi-users">
              <PeoplePage />
            </TabPanel>
          </TabView>
        </div>
      </div>
    </div>
  );
}
