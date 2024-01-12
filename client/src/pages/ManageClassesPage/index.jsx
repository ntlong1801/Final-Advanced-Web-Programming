import Header from 'layout/header';
import { useQuery } from 'react-query';
import { useMemo, useRef, useState } from 'react';
import { getAllClass } from 'apis/class.api';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';
import { ConfirmDialog, confirmDialog } from 'primereact/confirmdialog';
import { Toast } from 'primereact/toast';
import { InputText } from 'primereact/inputtext';
import { FilterMatchMode } from 'primereact/api';
import { Dropdown } from 'primereact/dropdown';
import { useTranslation } from 'react-i18next';

export default function ManageClassesPage() {
  const { t } = useTranslation();
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

  const accept = () => {
    toast.current.show({ severity: 'info', summary: 'Confirmed', detail: 'You have accepted', life: 3000 });
  };

  const reject = () => {
    toast.current.show({ severity: 'warn', summary: 'Rejected', detail: 'You have rejected', life: 3000 });
  };

  const {
    data: _data,
    isLoading
  } = useQuery({
    queryKey: ['allClasses'],
    queryFn: () => getAllClass()
  });
  const data = useMemo(() => _data?.data ?? null, [_data]);

  const confirmBan = () => {
    confirmDialog({
      message: 'Are you sure you want to proceed?',
      header: 'Confirmation',
      icon: 'pi pi-exclamation-triangle',
      accept,
      reject
    });
  };

  const formatAction = (value) => (
    <div>
      {value?.inactive ? (
        <Button
          type="button"
          label={t('manageClassPage.active')}
          onClick={confirmBan}
        />
      ) : (
        <Button
          type="button"
          label={t('manageClassPage.inactive')}
          onClick={confirmBan}
        />
      )}

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
          className="p-2"
          loading={isLoading}
          removableSort
        >
          <Column field="name" header={t('manageClassPage.name')} sortable filter filterPlaceholder="Search by name" />
          <Column field="description" header={t('manageClassPage.description')} sortable filter filterPlaceholder="Search by country" />
          <Column field="inactive" header={t('manageClassPage.inactive')} sortable filter filterElement={inactiveRowFilterTemplate} />
          <Column body={formatAction} header={t('manageClassPage.actions')} style={{ minWidth: 160, width: 160 }} />
        </DataTable>
      </div>
      <Toast ref={toast} />
      <ConfirmDialog />
    </div>
  );
}
