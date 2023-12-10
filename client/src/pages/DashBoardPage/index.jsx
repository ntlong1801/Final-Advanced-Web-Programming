import Header from 'layout/header';
import Sidebar from 'layout/sidebar';
import './style.scss';

export default function DashBoardPage() {
  const fakeData = [
    {
      title: 'ABC',
      des: 'def'
    },
    {
      title: 'ABC',
      des: 'def'
    },
    {
      title: 'ABC',
      des: 'def'
    },
    {
      title: 'ABC',
      des: 'def'
    },
  ];
  return (
    <div>
      <Header />
      <div className="flex justify-content-start">
        <Sidebar />
        <div className="flex justify-content-center flex-row">
          <div className="grid" style={{ marginLeft: '16rem' }}>
            {fakeData.map((item) => (
              <div className="col-3 border-round border-1 m-4">
                <h6>{item.title}</h6>
                <p>{item.des}</p>
                <img src="https://img.vn/uploads/thuvien/singa-png-20220719150401Tdj1WAJFQr.png" alt="" style={{ width: '16rem' }} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
