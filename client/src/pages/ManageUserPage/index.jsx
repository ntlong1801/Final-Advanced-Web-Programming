import Header from 'layout/header';
import { useQuery, useMutation } from 'react-query';
import { useMemo, useRef, useEffect } from 'react';
import { getAllUsers, banUser, deleteUser, getStudentListIdTemplate } from 'apis/admin.api';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';
import { ConfirmDialog, confirmDialog } from 'primereact/confirmdialog';
import { Toast } from 'primereact/toast';
import { useTranslation } from 'react-i18next';
import UploadExcelFile from 'components/UploadExcelFile';
import DownloadExcelFile from 'components/DownloadExcelFile';
import { useNavigate } from 'react-router';
import AddUser from './components/AddUser';
import EditUSer from './components/EditUser';
import MapStudentId from './MapStudentId';

export default function ManageUserPage() {
  const user = JSON.parse(localStorage.getItem('user_profile'));
  const { t } = useTranslation();
  const navigate = useNavigate();
  const toast = useRef(null);
  const addUserRef = useRef(null);
  const editUserRef = useRef(null);
  const mapStudentIdRef = useRef(null);
  const uploadExcelFileRef = useRef(null);

  const {
    data: _data,
    refetch
  } = useQuery({
    queryKey: ['allUsers'],
    queryFn: () => getAllUsers(user?.id)
  });
  const data = useMemo(() => _data?.data ?? null, [_data]);

  const { mutate: mutateBanUser } = useMutation(banUser);
  const { mutate: mutateDeleteUser } = useMutation(deleteUser);

  const acceptBan = (value) => {
    const dataSender = {
      userId: value.id,
      banned: !value.banned
    };
    mutateBanUser(dataSender, {
      onSuccess: (res) => {
        toast.current.show({ severity: 'success', summary: 'Success', detail: res?.data?.message, life: 3000 });
        refetch();
      },
      onError: (err) => {
        toast.current.show({ severity: 'danger', summary: 'Fail', detail: err, life: 3000 });
      }
    });
  };

  const acceptDel = (value) => {
    const dataSender = {
      id: value.id,
    };
    mutateDeleteUser(dataSender, {
      onSuccess: (res) => {
        toast.current.show({ severity: 'success', summary: 'Success', detail: res?.data?.message, life: 3000 });
        refetch();
      },
      onError: (err) => {
        toast.current.show({ severity: 'danger', summary: 'Fail', detail: err, life: 3000 });
      }
    });
  };

  const reject = () => {
    toast.current.show({ severity: 'warn', summary: 'Rejected', detail: 'You have rejected', life: 3000 });
  };

  const confirmBan = (value) => {
    confirmDialog({
      message: 'Are you sure you want to proceed?',
      header: 'Confirmation',
      icon: 'pi pi-exclamation-triangle',
      accept: () => acceptBan(value),
      reject
    });
  };

  const confirmDel = (value) => {
    confirmDialog({
      message: 'Are you sure you want to proceed?',
      header: 'Confirmation',
      icon: 'pi pi-exclamation-triangle',
      accept: () => acceptDel(value),
      reject
    });
  };

  const handleOpenAddUserModal = () => {
    addUserRef.current.open();
  };

  const handleOpenEditUserModal = (value) => {
    editUserRef.current.open({
      info: value
    });
  };

  const handleOpenMapStudentIdModal = (value) => {
    mapStudentIdRef.current.open({
      userId: value.id,
      oldSID: value?.student_id ?? ''
    });
  };

  const handleOpenUploadExcelFile = () => {
    uploadExcelFileRef.current.open({
      classId: null,
      compositionId: null
    });
  };

  const formatHeader = () => (
    <div className="flex justify-content-end gap-2">
      <Button
        icon="pi pi-plus"
        tooltip="Add new user"
        onClick={() => handleOpenAddUserModal()}
        tooltipOptions={{ position: 'left' }}
      />
      <DownloadExcelFile downloadFunc={getStudentListIdTemplate} isButton tooltip="Download student list id template" />
      <Button
        icon="pi pi-upload"
        tooltip="Upload student list"
        tooltipOptions={{ position: 'left' }}
        onClick={() => handleOpenUploadExcelFile()}
        severity="info"
      />
    </div>
  );

  const formatAction = (value) => (
    <div className="flex justify-content-center flex-wrap gap-2">
      <Button
        icon="pi pi-user-edit"
        tooltip="Chỉnh sửa"
        tooltipOptions={{ position: 'left' }}
        onClick={() => handleOpenEditUserModal(value)}
        severity="help"
      />
      <Button
        icon="pi pi-map-marker"
        tooltip="Map student id"
        onClick={() => handleOpenMapStudentIdModal(value)}
        tooltipOptions={{ position: 'left' }}
      />
      <Button
        icon="pi pi-ban"
        tooltip="Ban"
        onClick={() => confirmBan(value)}
        tooltipOptions={{ position: 'left' }}
        severity="warning"
      />
      <Button
        icon="pi pi-times"
        tooltip="Delete user"
        onClick={() => confirmDel(value)}
        tooltipOptions={{ position: 'left' }}
        severity="danger"
      />
    </div>
  );

  useEffect(() => {
    if (!user) {
      navigate('/signin');
    }
  }, []);

  return (
    <div>
      <Header />
      <DataTable
        showGridlines
        value={data}
        tableStyle={{ minWidth: '50rem' }}
        className="p-4"
        header={formatHeader}
        paginator
        rows={5}
      >
        <Column field="email" header="Email" headerStyle={{ textAlign: 'center' }} sortable />
        <Column field="student_id" header="StudentId" headerStyle={{ textAlign: 'center' }} />
        <Column field="full_name" header={t('manageUserPage.fullName')} headerStyle={{ textAlign: 'center' }} />
        <Column field="address" header="Address" headerStyle={{ textAlign: 'center' }} />
        <Column field="phone_number" header={t('manageUserPage.phoneNumber')} headerStyle={{ textAlign: 'center' }} />
        <Column field="activation" header={t('manageUserPage.activation')} className="text-center" headerStyle={{ textAlign: 'center' }} />
        <Column field="banned" header={t('manageUserPage.banned')} className="text-center" headerStyle={{ textAlign: 'center' }} />
        <Column body={formatAction} header={t('manageUserPage.actions')} headerStyle={{ textAlign: 'center' }} style={{ minWidth: 160, width: 160 }} frozen />
      </DataTable>
      <Toast ref={toast} />
      <ConfirmDialog />
      <AddUser ref={addUserRef} refetch={refetch} />
      <EditUSer ref={editUserRef} refetch={refetch} />
      <MapStudentId ref={mapStudentIdRef} refetch={refetch} />
      <UploadExcelFile ref={uploadExcelFileRef} refetch={refetch} link="/admin/postListStudentId" />
    </div>
  );
}
