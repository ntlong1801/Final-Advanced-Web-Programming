import './style.scss';

import { Button } from 'primereact/button';
import { Link, useNavigate } from 'react-router-dom';
import { OverlayPanel } from 'primereact/overlaypanel';
import { useRef } from 'react';

export default function Header() {
  const navigate = useNavigate();
  const profileRef = useRef(null);
  const user = JSON.parse(localStorage.getItem('user_profile'));

  const showProfileModal = (event) => {
    profileRef.current.toggle(event);
  };
  const handleLogout = () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('user_profile');
    navigate('/signin');
  };
  const handleGoHome = () => {
    if (!user) return '/';
    return '/dashboard';
  };
  return (
    <div className="flex justify-content-between p-2 bg-primary sticky top-0" style={{ height: '10vh' }}>
      <div className="flex align-items-center p-2 ml-2">
        <Link to={handleGoHome()}>
          <i className="pi pi-home text-purple-900" style={{ fontSize: '2rem' }}>Home</i>
        </Link>
      </div>
      <div className="flex gap-2 align-items-center">
        {!user ? (
          <>
            <Link to="/signin">
              <Button
                label="Sign in"
                severity="help"
                type="button"
              />
            </Link>
            <Link to="/signup">
              <Button
                label="Sign up"
                severity="help"
                type="button"
              />
            </Link>
          </>
        ) : (
          <Button icon="pi pi-user" severity="help" aria-label="User" rounded onClick={showProfileModal}>
            {/* <i className="pi pi-user mr-2" style={{ fontSize: '2rem' }} /> */}
            <OverlayPanel
              ref={profileRef}
              appendTo={typeof window !== 'undefined' ? document.body : null}
              showCloseIcon={false}
              id="overlay_panel_profile"
            >
              <div className="flex align-items-center p-3">
                <i className="pi pi-user text-2xl" />
                <div className="ml-4">
                  <h6 className="m-0">{user.username}</h6>
                  <p>
                    {user.fullName}
                  </p>
                </div>
              </div>
              <hr className="my-2" />
              <ul className="profile-menu list-none p-0 m-0">

                <Link to="/me" className="text-color">
                  <li className="hover:surface-200 p-2">
                    <i className="pi pi-user mr-3" />
                    Profile
                  </li>
                </Link>

                <hr />

                <li className="hover:surface-200 p-2 span-button">
                  <div onClick={handleLogout}>
                    <span>
                      <i className="pi pi-sign-out mr-3" />
                      Logout
                    </span>
                  </div>
                </li>

              </ul>
            </OverlayPanel>
          </Button>
        )}
      </div>
    </div>
  );
}
