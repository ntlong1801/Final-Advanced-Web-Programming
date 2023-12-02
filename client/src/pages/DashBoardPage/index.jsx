import Header from 'layout/header';
import './style.scss';

export default function DashBoardPage() {
  return (
    <div className="background" style={{ display: 'flex', flexDirection: 'column' }}>
      <Header>
        <div>This is DashBoard Page</div>
      </Header>
      <img
        className="fullscreen-image"
        src=".\dashBoard2.png"
        alt="Dashboardimage"
      />
    </div>
  );
}
