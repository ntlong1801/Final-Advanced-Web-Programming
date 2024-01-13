import { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useQuery } from 'react-query';
import { googleAuthCallback } from 'apis/auth.api';

function GoogleAuthCallback() {
  // #region Data
  // eslint-disable-next-line no-unused-vars
  const navigate = useNavigate();
  const { search } = useLocation();

  const { data: _data } = useQuery({
    queryKey: [search],
    queryFn: () => googleAuthCallback(search),
    enabled: !!search
  });

  // #endregion Data

  // #region Event
  useEffect(() => {
    if (_data?.data) {
      const data = { ..._data.data };
      localStorage.setItem('access_token', data.accessToken);
      localStorage.setItem('user_profile', JSON.stringify(data.user));
      navigate('/dashboard');
    }
  }, [_data]);
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

export default GoogleAuthCallback;
