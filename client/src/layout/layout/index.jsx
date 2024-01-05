import './style.scss';

import Header from 'layout/header';
import Sidebar from 'layout/sidebar';
import { PropTypes } from 'prop-types';

// eslint-disable-next-line react/prop-types
export default function Layout({ children, isDashBoard,
  refetch, isRefetch }) {
  return (
    <>
      <Header isDashBoard={isDashBoard} refetch={refetch} />
      <div className="flex justify-content-start">
        <div className="flex-grow-0 flex-shrink-0">
          <div style={{ minWidth: 220, width: 220 }}>
            <div className="fixed z-1 justify-content-start" style={{ height: '90vh' }}>
              <Sidebar isRefetch={isRefetch} />
            </div>
          </div>
        </div>
        <div className="flex-grow-1 flex-shrink-1 flex-basis-0" style={{ height: '90vh' }}>
          <div className="p-2 ml-2">{children}
          </div>
        </div>
      </div>
    </>
  );
}

Layout.propTypes = {
  isDashBoard: PropTypes.bool,
  refetch: PropTypes.func,
  isRefetch: PropTypes.bool
};
Layout.defaultProps = {
  isDashBoard: false,
  refetch: () => null,
  isRefetch: false,
};
