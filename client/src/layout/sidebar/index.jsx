import React, { useState, useMemo } from 'react';
import { PropTypes } from 'prop-types';
import { Avatar } from 'primereact/avatar';
import { Link, useParams } from 'react-router-dom';
import { useQuery } from 'react-query';

import { getAllClassOfUser } from 'apis/class.api';

export default function Sidebar({ isRefetch }) {
  const user = JSON.parse(localStorage.getItem('user_profile'));
  const { classId } = useParams();
  const [isTeachingActive, setIsTeachingActive] = useState(true);
  const [isEnrollActive, setIsEnrollActive] = useState(true);

  const { data: _data } = useQuery({
    queryKey: ['classes', isRefetch],
    queryFn: () => getAllClassOfUser(user?.id)
  });

  const classes = useMemo(() => _data?.data ?? [], [_data]);

  const teachingList = [];
  const enrollList = [];
  classes.forEach((item) => {
    if (item.role === 'teacher') {
      teachingList.push(item);
    }
    if (item.role === 'student') {
      enrollList.push(item);
    }
  });

  return (
    <div className="w-full overflow-y-scroll pt-3" style={{ height: '90vh' }}>
      <div style={{ width: '14rem' }}>
        <span className="p-2 cursor-pointer" style={{ fontSize: '1.5rem' }} onClick={() => setIsTeachingActive(!isTeachingActive)}>
          <i className={!isTeachingActive ? 'pi pi-angle-right' : 'pi pi-angle-down'} />
          <i className="pi pi-fw pi-users mr-2" />
          Giảng dạy
        </span>
        {isTeachingActive && (
          <ul className="overflow-hidden p-0 m-0" style={{ listStyleType: 'none' }}>
            {teachingList?.map((teaching) => (
              <Link to={`/c/${teaching.id}`}>
                <li
                  key={teaching.id}
                  className={classId === teaching.id ? 'overflow-hidden text-overflow-ellipsis white-space-nowrap cursor-pointer py-2 px-3 surface-200' :
                    'overflow-hidden text-overflow-ellipsis white-space-nowrap cursor-pointer py-2 px-3 hover:surface-200'}
                >
                  <Avatar className="mr-2" label={teaching.name[0]} size="medium" style={{ backgroundColor: '#2196F3', color: '#ffffff' }} shape="circle" />
                  {teaching.name}
                </li>
              </Link>
            ))}
          </ul>
        ) }
      </div>
      <div style={{ width: '14rem' }}>
        <span className="p-2 cursor-pointer" style={{ fontSize: '1.5rem' }} onClick={() => setIsEnrollActive(!isEnrollActive)}>
          <i className={!isEnrollActive ? 'pi pi-angle-right' : 'pi pi-angle-down'} />
          <i className="pi pi-fw pi-folder mr-2" />
          Đã đăng ký
        </span>
        {isEnrollActive && (
          <ul className="overflow-hidden p-0 m-0" style={{ listStyleType: 'none' }}>
            {enrollList?.map((enroll) => (
              <Link to={`/c/${enroll.id}`}>
                <li
                  key={enroll.id}
                  className={classId === enroll.id ? 'overflow-hidden text-overflow-ellipsis white-space-nowrap cursor-pointer py-2 px-3 surface-200' :
                    'overflow-hidden text-overflow-ellipsis white-space-nowrap cursor-pointer py-2 px-3 hover:surface-200'}
                >
                  <Avatar className="mr-2" label={enroll.name[0]} size="medium" style={{ backgroundColor: '#2196F3', color: '#ffffff' }} shape="circle" />
                  {enroll.name}
                </li>
              </Link>
            ))}
          </ul>
        ) }
      </div>
    </div>

  );
}

Sidebar.propTypes = {
  isRefetch: PropTypes.bool
};

Sidebar.defaultProps = {
  isRefetch: false
};
