import Header from 'layout/header';
import { useQuery } from 'react-query';
import { useMemo, useRef } from 'react';
import { getAllUsers } from 'apis/user.api';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';
import { ConfirmDialog, confirmDialog } from 'primereact/confirmdialog';
import { Toast } from 'primereact/toast';

export default function ManageUserPage() {
  const toast = useRef(null);

  const accept = () => {
    toast.current.show({ severity: 'info', summary: 'Confirmed', detail: 'You have accepted', life: 3000 });
  };

  const reject = () => {
    toast.current.show({ severity: 'warn', summary: 'Rejected', detail: 'You have rejected', life: 3000 });
  };

  const {
    data: _data,
  } = useQuery({
    queryKey: ['allUsers'],
    queryFn: () => getAllUsers()
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
      {value?.banned ? (
        <Button
          type="button"
          label="Unban"
          onClick={confirmBan}
        />
      ) : (
        <Button
          type="button"
          label="Ban"
          onClick={confirmBan}
        />
      )}

    </div>
  );

  return (
    <div>
      <Header />
      <DataTable value={data?.users} tableStyle={{ minWidth: '50rem' }} className="p-2">
        <Column field="email" header="Email" />
        <Column field="full_name" header="Full Name" />
        <Column field="phone_number" header="Phone Number" />
        <Column field="activation" header="Activation" />
        <Column field="banned" header="banned" />
        <Column body={formatAction} header="Actions" style={{ minWidth: 160, width: 160 }} />
      </DataTable>
      <Toast ref={toast} />
      <ConfirmDialog />
    </div>
  );
}
