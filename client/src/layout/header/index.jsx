import './style.scss';

import { Button } from 'primereact/button';
import { Link, useNavigate } from 'react-router-dom';
import { OverlayPanel } from 'primereact/overlaypanel';
import { useRef, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import LanguageSelect from 'components/LanguageSelect';
import CreateClass from 'pages/DashBoardPage/components/CreateClass';
import JoinClass from 'pages/DashBoardPage/components/JoinClass';
import { PropTypes } from 'prop-types';
import { logout } from 'apis/auth.api';
import { useMutation, useQuery } from 'react-query';

import { getStudentId } from 'apis/user.api';
import Loading from 'components/Loading';
import ConnectNotification from './ConnectNotification';

export default function Header({ isDashBoard, refetch }) {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const user = JSON.parse(localStorage.getItem('user_profile'));

  const profileRef = useRef(null);
  const settingRef = useRef(null);
  const classRef = useRef(null);
  const createClassRef = useRef(null);
  const joinClassRef = useRef(null);
  const manageRef = useRef(null);

  const { data, refetch: refetchStudentId } = useQuery({
    queryKey: ['studentId', user?.id],
    queryFn: () => getStudentId(user?.id),
  });

  const studentId = useMemo(() => data?.data?.studentId ?? null, [data]);

  const showSettingModal = (event) => {
    settingRef.current.toggle(event);
  };
  const showProfileModal = (event) => {
    profileRef.current.toggle(event);
  };
  const showClassModal = (event) => {
    classRef.current.toggle(event);
  };
  const showManageModal = (event) => {
    manageRef.current.toggle(event);
  };
  const showCreateClassModal = () => {
    createClassRef.current.open({
      userId: user?.id,
      refetch,
    });
  };

  const showJoinClassModal = () => {
    joinClassRef.current.open({
      userId: user?.id,
      refetchStudentId,
      studentId,
      refetch,
    });
  };

  const { mutate, isLoading } = useMutation(logout);

  const handleLogout = async () => {
    mutate(
      { id: user?.id },
      {
        onSuccess: () => {
          localStorage.removeItem('access_token');
          localStorage.removeItem('user_profile');
          navigate('/signin');
        },
      }
    );
  };
  const handleGoHome = () => {
    if (!user) return '/';
    return '/dashboard';
  };
  return (
    <div className="z-2 relative" style={{ height: '10vh' }}>
      <div className="flex justify-content-between p-2 bg-header fixed top-0 left-0 w-full">
        <div className="flex align-items-center p-2 ml-2">
          <Link to={handleGoHome()}>
            <i className="pi pi-home text-white" style={{ fontSize: '2rem' }}>
              {t('home')}
            </i>
          </Link>
        </div>
        <div className="flex gap-2 align-items-center">
          {!user ? (
            <>
              <Link to="/signin">
                <Button label={t('signIn.name')} severity="primary" type="button" />
              </Link>
              <Link to="/signup">
                <Button label={t('signUp.name')} severity="help" type="button" />
              </Link>
              <button
                type="button"
                className="p-link layout-topbar-button mr-2"
                onClick={showSettingModal}
              >
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
              {isDashBoard && user.role !== 'admin' && (
                <Button
                  icon="pi pi-plus"
                  severity="help"
                  aria-label="User"
                  rounded
                  onClick={showClassModal}
                >
                  <OverlayPanel
                    ref={classRef}
                    appendTo={typeof window !== 'undefined' ? document.body : null}
                    showCloseIcon={false}
                    id="overlay_panel_class"
                  >
                    <ul className="profile-menu list-none p-0 m-0">
                      <div onClick={showJoinClassModal}>
                        <li className="hover:surface-200 p-2 span-button">
                          <span>
                            {t('header.joinClass')}
                          </span>
                        </li>
                      </div>

                      <hr />
                      <div onClick={showCreateClassModal}>
                        <li className="hover:surface-200 p-2 span-button">
                          <span>
                            {t('header.createClass')}
                          </span>
                        </li>
                      </div>
                    </ul>
                  </OverlayPanel>
                </Button>
              )}
              {user.role !== 'admin' &&
              <ConnectNotification />}
              {user.role === 'admin' && (
                <Button
                  label="Quản lý"
                  severity="help"
                  type="button"
                  onClick={showManageModal}
                >
                  <OverlayPanel
                    ref={manageRef}
                    appendTo={typeof window !== 'undefined' ? document.body : null}
                    showCloseIcon={false}
                    id="overlay_panel_manage"
                  >
                    <ul className="profile-menu list-none p-0 m-0">
                      <Link to="/admin/manageUser" className="text-color">
                        <li className="hover:surface-200 p-2">
                          <i className="pi pi-users mr-3" />
                          Quản lý người dùng
                        </li>
                      </Link>

                      <hr />
                      <Link to="/admin/manageClasses" className="text-color">
                        <li className="hover:surface-200 p-2">
                          <i className="pi pi-book mr-3" />
                          Quản lý lớp học
                        </li>
                      </Link>
                    </ul>
                  </OverlayPanel>
                </Button>
              )}
              <Button
                icon="pi pi-user"
                severity="help"
                aria-label="User"
                rounded
                onClick={showProfileModal}
              >
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
                      <p>{user.full_name}</p>
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
              <button
                type="button"
                className="p-link layout-topbar-button mr-2"
                onClick={showSettingModal}
              >
                <i className="pi pi-cog text-white" style={{ fontSize: '1.5rem' }} />
                {/* <span>{t('settings.name')}</span> */}
              </button>
              <OverlayPanel
                ref={settingRef}
                appendTo={typeof window !== 'undefined' ? document.body : null}
                showCloseIcon={false}
                id="overlay_panel_setting"
                style={{ width: '230px' }}
              >
                <LanguageSelect />
              </OverlayPanel>
            </>
          )}
          <CreateClass ref={createClassRef} />
          <JoinClass ref={joinClassRef} />
        </div>
      </div>
      {isLoading && <Loading />}
    </div>
  );
}

Header.propTypes = {
  isDashBoard: PropTypes.bool,
  refetch: PropTypes.func,
};
Header.defaultProps = {
  isDashBoard: false,
  refetch: () => null,
};
