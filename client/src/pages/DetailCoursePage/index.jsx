import './style.scss';

import Layout from 'layout/layout';
import { TabPanel, TabView } from 'primereact/tabview';
import { useNavigate } from 'react-router';
import { useSearchParams } from 'react-router-dom';
import NewsPage from './NewsPage';
import PeoplePage from './PeoplePage';

export default function DetailCoursePage() {
  const navigate = useNavigate();

  const [searchParams] = useSearchParams();
  const tab = searchParams.get('tab') || 0;

  return (
    <div>
      <Layout>
        <TabView
          activeIndex={parseInt(tab, 10)}
          onTabChange={(e) => navigate(`.?tab=${e.index}`)}
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

      </Layout>

    </div>

  );
}
