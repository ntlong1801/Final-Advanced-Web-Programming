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

  const { mutate } = useMutation(activeClass);

  const acceptActive = (value) => {
    const dataSender = {
      active: !value.inactive,
      classId: value.id
    };
    mutate(dataSender, {
      onSuccess: (res) => {
        refetch();
        toast.current.show({ severity: 'success', summary: 'Success', detail: res.data.message, life: 3000 });
      }
    });
  };

  const reject = () => {
    toast.current.show({ severity: 'warn', summary: 'Rejected', detail: 'You have rejected', life: 3000 });
  };

  const confirmActive = (value) => {
    confirmDialog({
      message: 'Are you sure you want to proceed?',
      header: 'Confirmation',
      icon: 'pi pi-exclamation-triangle',
      accept: () => acceptActive(value),
      reject
    });
  };

  const acceptGoToHome = () => {
    navigate('/dashboard');
  };

  const confirmGoToHome = () => {
    confirmDialog({
      message: 'Are you sure you want to proceed?',
      header: 'Go home',
      icon: 'pi pi-exclamation-triangle',
      accept: () => acceptGoToHome(),
    });
  };

  const formatAction = (value) => (
    <div className="flex justify-content-center">
      <Button
        type="button"
        tooltip={t('manageClassPage.inactive')}
        tooltipOptions={{ position: 'left' }}
        icon="pi pi-lock"
        onClick={() => confirmActive(value)}
      />
    </div>
  );

  const renderHeader = () => (
    <div className="flex justify-content-end">
      <span className="p-input-icon-left">
        <i className="pi pi-search" />
        <InputText value={globalFilterValue} onChange={onGlobalFilterChange} placeholder="Keyword Search" />
      </span>
    </div>
  );

  const inactiveRowFilterTemplate = (options) => (
    <Dropdown value={options.value} options={['true', 'false']} onChange={(e) => options.filterApplyCallback(e.value)} placeholder="Select One" className="p-column-filter" showClear style={{ minWidth: '12rem' }} />
  );

  useEffect(() => {
    if (!user) {
      navigate('/signin');
    }
    if (user?.role !== 'admin') {
      confirmGoToHome();
    }
    console.log(user);
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
          emptyMessage="No customers found."
          header={renderHeader}
          tableStyle={{ minWidth: '50rem' }}
          className="p-4"
          loading={isLoading}
          removableSort
          showGridlines
        >
          <Column
            field="name"
            header={t('manageClassPage.name')}
            sortable
            filter
            filterPlaceholder="Search by name"
            headerStyle={{ textAlign: 'center' }}
          />
          <Column
            field="description"
            header={t('manageClassPage.description')}
            sortable
            filter
            filterPlaceholder="Search by description"
            headerStyle={{ textAlign: 'center' }}
          />
          <Column
            field="inactive"
            header={t('manageClassPage.inactive')}
            sortable
            filter
            filterElement={inactiveRowFilterTemplate}
            headerStyle={{ textAlign: 'center' }}
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
