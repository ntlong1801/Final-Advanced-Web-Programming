import { useEffect } from 'react';
import instance from 'config';

import { useLocation, useNavigate } from 'react-router-dom';

function FacebookAuthCallBack() {
  // #region Data
  // eslint-disable-next-line no-unused-vars
  const navigate = useNavigate();
  const { search } = useLocation();

  // #endregion Data

  // #region Event
  useEffect(() => {
    function getUser() {
      instance.get(`/auth/facebook/callback${search}`).then((response) => {
        const data = { ...response.data };
        localStorage.setItem('access_token', data.accessToken);
        localStorage.setItem('user_profile', JSON.stringify(data.user));
        navigate('/dashboard');
      }).catch(() => { });
    }
    if (search) {
      getUser();
    }
  }, [search]);
  // #endregion Event

  return (
    <div className="flex align-items-center justify-content-center" style={{ height: '80vh' }}>
      <div
        className="surface-card p-4 shadow-2 border-round w-full lg:w-6"
        style={{ maxWidth: '400px' }}
      >
        <div className="text-center mb-5">

          <div className="text-900 text-3xl font-medium my-3">
            Waiting a few seconds...
          </div>
        </div>
      </div>
    </div>
  );
}

export default FacebookAuthCallBack;
