import Header from 'layout/header';

export default function HomePage() {
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
