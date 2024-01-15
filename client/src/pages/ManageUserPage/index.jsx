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
import MapStudentId from './components/MapStudentId';

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
    isLoading,
    refetch
  } = useQuery({
    queryKey: ['allUsers'],
    queryFn: () => getAllUsers(user?.id)
  });
  const data = useMemo(() => _data?.data ?? null, [_data]);

  const { mutate: mutateBanUser, isLoading: isBanUserLoading } = useMutation(banUser);
  const { mutate: mutateDeleteUser, isLoading: isDeleteUserLoading } = useMutation(deleteUser);

  const acceptBan = (value) => {
    const dataSender = {
      userId: value.id,
      banned: !value.banned
    };
    mutateBanUser(dataSender, {
      onSuccess: (res) => {
        toast.current.show({ severity: 'success', summary: t('success.name'), detail: res?.data?.message, life: 3000 });
        refetch();
      },
      onError: (err) => {
        toast.current.show({ severity: 'error', summary: t('error.name'), detail: err, life: 3000 });
      }
    });
  };

  const acceptDel = (value) => {
    const dataSender = {
      id: value.id,
    };
    mutateDeleteUser(dataSender, {
      onSuccess: (res) => {
        toast.current.show({ severity: 'success', summary: t('success.name'), detail: res?.data?.message, life: 3000 });
        refetch();
      },
      onError: (err) => {
        toast.current.show({ severity: 'danger', summary: t('error.name'), detail: err, life: 3000 });
      }
    });
  };

  const reject = () => {
    toast.current.show({ severity: 'warn', summary: t('warn.name'), detail: t('warn.detail'), life: 3000 });
  };

  const confirmBan = (value) => {
    confirmDialog({
      message: !value.banned ? t('admin.user.ban') : t('admin.user.unban'),
      header: t('admin.user.confirm'),
      icon: 'pi pi-exclamation-triangle',
      accept: () => acceptBan(value),
      reject
    });
  };

  const confirmDel = (value) => {
    confirmDialog({
      message: t('admin.user.delConfirm'),
      header: t('admin.user.confirm'),
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
        tooltip={t('admin.user.addUser')}
        onClick={() => handleOpenAddUserModal()}
        tooltipOptions={{ position: 'left' }}
      />
      <DownloadExcelFile
        tooltip={t('admin.user.downloadStudentList')}
        downloadFunc={getStudentListIdTemplate}
        userId={user.id}
        isButton
      />
      <Button
        icon="pi pi-upload"
        tooltip={t('admin.user.uploadStudentList')}
        tooltipOptions={{ position: 'left' }}
        onClick={() => handleOpenUploadExcelFile()}
        severity="info"
      />
    </div>
  );

  const formatActive = (value) => (
    value.activation ?
      <i className="pi pi-check-circle" />
      : <i className="pi pi-clock" />
  );

  const formatBan = (value) => (
    value.banned ?
      <i className="pi pi-ban" />
      : <i className="pi" />
  );

  const formatAction = (value) => (
    <div className="flex justify-content-center flex-wrap gap-2">
      <Button
        icon="pi pi-user-edit"
        tooltip={t('admin.user.edit')}
        tooltipOptions={{ position: 'left' }}
        onClick={() => handleOpenEditUserModal(value)}
        severity="help"
      />
      <Button
        icon="pi pi-map-marker"
        tooltip={t('admin.user.mapStudentId')}
        onClick={() => handleOpenMapStudentIdModal(value)}
        tooltipOptions={{ position: 'left' }}
      />
      <Button
        icon="pi pi-ban"
        tooltip={!value.banned ? t('manageUserPage.ban') : t('manageUserPage.unban')}
        onClick={() => confirmBan(value)}
        tooltipOptions={{ position: 'left' }}
        severity="warning"
      />
      <Button
        icon="pi pi-times"
        tooltip={t('admin.user.del')}
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
    if (user.role !== 'admin') {
      navigate('/dashboard');
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
        loading={isLoading || isBanUserLoading || isDeleteUserLoading}
      >
        <Column field="email" header="Email" headerStyle={{ textAlign: 'center' }} sortable />
        <Column field="student_id" header={t('manageUserPage.studentId')} headerStyle={{ textAlign: 'center' }} />
        <Column field="full_name" header={t('manageUserPage.fullName')} headerStyle={{ textAlign: 'center' }} />
        <Column field="address" header={t('manageUserPage.address')} headerStyle={{ textAlign: 'center' }} />
        <Column field="phone_number" header={t('manageUserPage.phoneNumber')} headerStyle={{ textAlign: 'center' }} />
        <Column body={formatActive} header={t('manageUserPage.activation')} className="text-center" headerStyle={{ textAlign: 'center' }} />
        <Column body={formatBan} header={t('manageUserPage.banned')} className="text-center" headerStyle={{ textAlign: 'center' }} />
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
