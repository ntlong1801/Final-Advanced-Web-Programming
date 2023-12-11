import { Dropdown } from 'primereact/dropdown';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

function LanguageSelect() {
  const { t, i18n } = useTranslation();

  const dropdownItems = [
    { name: 'English', code: 'en' },
    { name: 'Tiếng Việt', code: 'vi' },
  ];

  const [dropdownItem, setDropdownItem] = useState();
  const handleLanguageChange = (e) => {
    i18n.changeLanguage(e.value.code);
    setDropdownItem(e.value);
  };

  useEffect(() => {
    const lang = localStorage.getItem('i18nextLng');
    if (lang) {
      const langItem = dropdownItems.find((e) => e.code === lang);
      if (langItem) {
        setDropdownItem(langItem);
      }
    }
  }, []);
  return (
    <div className="flex align-items-center">
      <i className="pi pi-fw pi-globe mr-3" style={{ fontSize: '1.4rem' }} />
      <Dropdown
        id="state"
        value={dropdownItem}
        onChange={handleLanguageChange}
        options={dropdownItems}
        optionLabel="name"
        placeholder={t('topbar.language')}
        style={{ width: 180 }}
      />
    </div>
  );
}

export default LanguageSelect;
