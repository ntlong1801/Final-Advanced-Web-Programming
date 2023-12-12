import React, { useEffect, useState } from 'react';
import { PanelMenu } from 'primereact/panelmenu';
import instance from 'config';
import { PropTypes } from 'prop-types';

export default function Sidebar({ isRefetch }) {
  const user = JSON.parse(localStorage.getItem('user_profile'));
  const [classes, setClasses] = useState([]);

  const fetchData = async () => {
    const rs = await instance.get(`/class/classesByUserId?id=${user?.id}`);
    if (rs?.data?.length > 0) {
      setClasses(rs.data);
    }
  };

  const teachingList = [];
  const enrollList = [];
  classes.forEach((item) => {
    if (item.role === 'teacher') {
      const subItem = {
        label: item.name,
        icon: 'pi pi-fw pi-book',
        url: `/c/${item.id}`
      };
      teachingList.push(subItem);
    }
    if (item.role === 'student') {
      const subItem = {
        label: item.name,
        icon: 'pi pi-fw pi-book',
        url: `/c/${item.id}`
      };
      enrollList.push(subItem);
    }
  });

  const items = [
    {
      label: 'Giảng dạy',
      icon: 'pi pi-fw pi-users',
      items: [
        ...teachingList
      ]
    },
    {
      label: 'Đã đăng ký',
      icon: 'pi pi-fw pi-folder',
      items: [
        ...enrollList
      ]

    }
  ];

  useEffect(() => {
    fetchData();
  }, [isRefetch]);

  return (
    <PanelMenu model={items} className="w-full overflow-y-scroll mr-4" style={{ height: '90vh' }} />
  );
}

Sidebar.propTypes = {
  isRefetch: PropTypes.bool
};

Sidebar.defaultProps = {
  isRefetch: false
};
