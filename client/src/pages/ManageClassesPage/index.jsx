import Header from 'layout/header';
import { useQuery, useMutation } from 'react-query';
import { useMemo, useRef, useState, useEffect } from 'react';
import { getAllClass } from 'apis/class.api';
import { activeClass } from 'apis/admin.api';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';
import { ConfirmDialog, confirmDialog } from 'primereact/confirmdialog';
import { Toast } from 'primereact/toast';
import { InputText } from 'primereact/inputtext';
import { FilterMatchMode } from 'primereact/api';
import { Dropdown } from 'primereact/dropdown';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router';

export default function ManageClassesPage() {
  const user = JSON.parse(localStorage.getItem('user_profile'));
  const { t } = useTranslation();
  const navigate = useNavigate();
  const toast = useRef(null);
  const [filters, setFilters] = useState({
    global: { value: null, matchMode: FilterMatchMode.CONTAINS },
    name: { value: null, matchMode: FilterMatchMode.STARTS_WITH },
    description: { value: null, matchMode: FilterMatchMode.STARTS_WITH },
    inactive: { value: null, matchMode: FilterMatchMode.EQUALS },
  });
  const [globalFilterValue, setGlobalFilterValue] = useState('');

  const onGlobalFilterChange = (e) => {
    const { value } = e.target;
    // eslint-disable-next-line no-underscore-dangle
    const _filters = { ...filters };

    _filters.global.value = value;

    setFilters(_filters);
    setGlobalFilterValue(value);
  };

  const {
    data: _data,
    isLoading,
    refetch
  } = useQuery({
    queryKey: ['allClasses'],
    queryFn: () => getAllClass()
  });
  const data = useMemo(() => _data?.data ?? null, [_data]);

  const { mutate, isLoading: isActiveClassLoading } = useMutation(activeClass);

  const acceptActive = (value) => {
    const dataSender = {
      active: !value.inactive,
      classId: value.id
    };
    mutate(dataSender, {
      onSuccess: (res) => {
        refetch();
        toast.current.show({ severity: 'success', summary: t('success.name'), detail: res.data.message, life: 3000 });
      }
    });
  };

  const reject = () => {
    toast.current.show({ severity: 'warn', summary: t('warn.name'), detail: t('warn.detail'), life: 3000 });
  };

  const confirmActive = (value) => {
    confirmDialog({
      message: !value.inactive ? t('admin.class.lock') : t('admin.class.unlock'),
      header: t('admin.class.confirm'),
      icon: 'pi pi-exclamation-triangle',
      accept: () => acceptActive(value),
      reject
    });
  };

  const formatAction = (value) => (
    <div className="flex justify-content-center">
      <Button
        type="button"
        tooltip={!value.inactive ? t('manageClassPage.inactive') : t('manageClassPage.active')}
        tooltipOptions={{ position: 'left' }}
        icon={!value.inactive ? 'pi pi-lock' : 'pi pi-lock-open'}
        onClick={() => confirmActive(value)}
      />
    </div>
  );

  const renderHeader = () => (
    <div className="flex justify-content-end">
      <span className="p-input-icon-left">
        <i className="pi pi-search" />
        <InputText value={globalFilterValue} onChange={onGlobalFilterChange} placeholder={t('admin.class.keyword')} />
      </span>
    </div>
  );

  const inactiveRowFilterTemplate = (options) => (
    <Dropdown
      value={options.value}
      options={['true', 'false']}
      onChange={(e) => options.filterApplyCallback(e.value)}
      placeholder={t('admin.class.selectOne')}
      className="p-column-filter"
      showClear
      style={{ minWidth: '12rem' }}
    />
  );

  useEffect(() => {
    if (!user) {
      navigate('/signin');
    }
    if (user?.role !== 'admin') {
      navigate('/dashboard');
    }
  }, []);

  return (
    <div>
      <Header />
      <div className="overflow-y-scroll" style={{ height: '90vh' }}>
        <DataTable
          value={data}
          dataKey="id"
          paginator
          rows={5}
          filters={filters}
          filterDisplay="row"
          globalFilterFields={['name', 'description']}
          emptyMessage={t('admin.class.emptyMessage')}
          header={renderHeader}
          tableStyle={{ minWidth: '50rem' }}
          className="p-4"
          loading={isLoading || isActiveClassLoading}
          removableSort
          showGridlines
        >
          <Column
            field="name"
            header={t('manageClassPage.name')}
            sortable
            filter
            filterPlaceholder={t('admin.class.byName')}
            headerStyle={{ textAlign: 'center' }}
          />
          <Column
            field="description"
            header={t('manageClassPage.description')}
            sortable
            filter
            filterPlaceholder={t('admin.class.byDescription')}
            headerStyle={{ textAlign: 'center' }}
          />
          <Column
            field="inactive"
            header={t('manageClassPage.inactive')}
            sortable
            filter
            filterElement={inactiveRowFilterTemplate}
            headerStyle={{ textAlign: 'center' }}
            style={{ minWidth: 160, width: 160 }}
          />
          <Column
            body={formatAction}
            header={t('manageClassPage.actions')}
            style={{ minWidth: 160, width: 160 }}
            headerStyle={{ textAlign: 'center' }}
          />
        </DataTable>
      </div>
      <Toast ref={toast} />
      <ConfirmDialog />
    </div>
  );
}
