import React from 'react';
import { PanelMenu } from 'primereact/panelmenu';

export default function Sidebar() {
  const subItem = [{
    label: 'Left',
    icon: 'pi pi-fw pi-align-left'
  },
  {
    label: 'Right',
    icon: 'pi pi-fw pi-align-right'
  },
  {
    label: 'Center',
    icon: 'pi pi-fw pi-align-center'
  },
  {
    label: 'Justify',
    icon: 'pi pi-fw pi-align-justify'
  }];
  const items = [
    {
      label: 'Giảng dạy',
      icon: 'pi pi-fw pi-users',
      items: [
        {
          label: 'Export',
          icon: 'pi pi-fw pi-external-link',
          url: '/me'
        }
      ]
    },
    {
      label: 'Đã đăng ký',
      icon: 'pi pi-fw pi-folder',
      items: [
        ...subItem
      ]
    },
  ];

  return (
    <PanelMenu model={items} className="w-full md:w-16rem fixed top-10 left-0" />
  );
}
