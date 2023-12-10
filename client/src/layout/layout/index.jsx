import Header from 'layout/header';
import Sidebar from 'layout/sidebar';

export default function Layout() {
  return (
    <>
      <Header />
      <div className="layout-sidebar-cyan layout-sidebar">
        <Sidebar />
      </div>
    </>
  );
}
