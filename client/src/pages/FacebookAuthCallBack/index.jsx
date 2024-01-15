import { useEffect } from 'react';

import { useLocation, useNavigate } from 'react-router-dom';
import { facbookAuthCallback } from 'apis/auth.api';
import { useQuery } from 'react-query';
import Loading from 'components/Loading';

function FacebookAuthCallBack() {
  // #region Data
  // eslint-disable-next-line no-unused-vars
  const navigate = useNavigate();
  const { search } = useLocation();

  // #endregion Data
  const { data: _data, isLoading } = useQuery({
    queryKey: [search],
    queryFn: () => facbookAuthCallback(search),
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
      {isLoading && <Loading />}
    </div>
  );
}

export default FacebookAuthCallBack;
