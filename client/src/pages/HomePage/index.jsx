import Header from 'layout/header';
import { useEffect } from 'react';
import { useNavigate } from 'react-router';

export default function HomePage() {
  const user = JSON.parse(localStorage.getItem('user_profile'));
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      navigate('/dashboard');
    }
  }, []);
  return (
    <div className="background" style={{ display: 'flex', flexDirection: 'column' }}>
      <Header />
      <div className="flex align-items-center justify-content-center" style={{ flex: 1 }} />
      <img
        className="fullscreen-image"
        src=".\homePage2.png"
        alt="Homepage_image"
      />
    </div>
  );
}
