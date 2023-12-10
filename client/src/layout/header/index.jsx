import './style.scss';

import { Button } from 'primereact/button';
import { Link, useNavigate } from 'react-router-dom';
import { OverlayPanel } from 'primereact/overlaypanel';
import { useRef } from 'react';
import instance from 'config';
import { useTranslation } from 'react-i18next';
import LanguageSelect from 'components/LanguageSelect';

export default function Header() {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const profileRef = useRef(null);
  const settingRef = useRef(null);
  const user = JSON.parse(localStorage.getItem('user_profile'));

  const showSettingModal = (event) => {
    settingRef.current.toggle(event);
  };
  const showProfileModal = (event) => {
    profileRef.current.toggle(event);
  };
  const handleLogout = async () => {
    await instance.post('/auth/logout');
    localStorage.removeItem('access_token');
    localStorage.removeItem('user_profile');
    navigate('/signin');
  };
  const handleGoHome = () => {
    if (!user) return '/';
    return '/dashboard';
  };
  return (
    <div className="flex justify-content-between p-2 bg-header sticky top-0" style={{ height: '10vh' }}>
      <div className="flex align-items-center p-2 ml-2">
        <Link to={handleGoHome()}>
          <i className="pi pi-home text-white" style={{ fontSize: '2rem' }}>{t('home')}</i>
        </Link>
      </div>
      <div className="flex gap-2 align-items-center">
        {!user ? (
          <>
            <Link to="/signin">
              <Button
                label={t('signIn.name')}
                severity="primary"
                type="button"

              />
            </Link>
            <Link to="/signup">
              <Button
                label={t('signUp.name')}
                severity="help"
                type="button"
              />
            </Link>
            <button type="button" className="p-link layout-topbar-button mr-2" onClick={showSettingModal}>
              <i className="pi pi-cog text-white" style={{ fontSize: '1.5rem' }} />
              {/* <span>{t('settings.name')}</span> */}
            </button>
            <OverlayPanel
              ref={settingRef}
              appendTo={typeof window !== 'undefined' ? document.body : null}
              showCloseIcon={false}
              id="overlay_panel_setting"
              style={{ width: '210px' }}
            >
              <LanguageSelect />
            </OverlayPanel>
          </>
        ) : (
          <>
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
                    <h6 className="m-0">{user.email}</h6>
                    <p>
                      {user.full_name}
                    </p>
                  </div>
                </div>
                <hr className="my-2" />
                <ul className="profile-menu list-none p-0 m-0">

                  <Link to="/me" className="text-color">
                    <li className="hover:surface-200 p-2">
                      <i className="pi pi-user mr-3" />
                      {t('settings.profile')}
                    </li>
                  </Link>

                  <hr />
                  <div onClick={handleLogout}>
                    <li className="hover:surface-200 p-2 span-button">

                      <span>
                        <i className="pi pi-sign-out mr-3" />
                        {t('settings.logout')}
                      </span>
                    </li>
                  </div>

                </ul>
              </OverlayPanel>
            </Button>
            <button type="button" className="p-link layout-topbar-button mr-2" onClick={showSettingModal}>
              <i className="pi pi-cog text-white" style={{ fontSize: '1.5rem' }} />
              {/* <span>{t('settings.name')}</span> */}
            </button>
            <OverlayPanel
              ref={settingRef}
              appendTo={typeof window !== 'undefined' ? document.body : null}
              showCloseIcon={false}
              id="overlay_panel_setting"
              style={{ width: '210px' }}
            >
              <LanguageSelect />
            </OverlayPanel>
          </>
        )}
      </div>
    </div>
  );
}
