import { useQuery } from 'react-query';
import { useMemo, useRef } from 'react';
import { getClassGradeBoard, getTemplateStudentList } from 'apis/grade.api';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';
import { ConfirmDialog, confirmDialog } from 'primereact/confirmdialog';
import { Toast } from 'primereact/toast';
import { useParams } from 'react-router';
import DownloadExcelFile from 'components/DownloadExcelFile';
import InputGrade from '../components/InputGrade';

export default function GradePage() {
  const { classId } = useParams();
  const toast = useRef(null);
  const inputGrade = useRef(null);

  const accept = () => {
    toast.current.show({ severity: 'info', summary: 'Confirmed', detail: 'You have accepted', life: 3000 });
  };

  const reject = () => {
    toast.current.show({ severity: 'warn', summary: 'Rejected', detail: 'You have rejected', life: 3000 });
  };

  const {
    data: _data,
    refetch
  } = useQuery({
    queryKey: ['allUsers'],
    queryFn: () => getClassGradeBoard(classId)
  });
  const data = useMemo(() => _data?.data ?? null, [_data]);
  const classCompotisions = useMemo(() =>
    data?.data?.[0]?.gradeArray ?? null, [data]
  );

  const confirmBan = () => {
    confirmDialog({
      message: 'Are you sure you want to proceed?',
      header: 'Confirmation',
      icon: 'pi pi-exclamation-triangle',
      accept,
      reject
    });
  };

  const openModalInputGrade = (info, idx) => {
    inputGrade.current.open({
      idx,
      info,
      classId
    });
  };

  const formatGrade = (value, index) => {
    const idx = parseInt(index.field.split('_')[1], 10) - 1;
    return (
      <div>
        <span className="cursor-pointer" onClick={() => openModalInputGrade(value, idx)}>{value.gradeArray[idx]?.grade || '__'}</span>
        /10
      </div>
    );
  };

  const formatColHeader = (classCompotision) => (
    <div className="text-center">
      <span>
        {classCompotision.name}
      </span>
      <div>
        <span style={{ fontSize: '0.8rem' }}>({classCompotision.grade_scale} %)</span>
      </div>
      <div className="mt-1">
        <i className="pi pi-fw pi-file-export cursor-pointer" style={{ fontSize: '2rem' }} />
        <i className="pi pi-fw pi-file-import cursor-pointer" style={{ fontSize: '2rem' }} />
      </div>
    </div>
  );

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
      <div className="flex justify-content-end">
        <DownloadExcelFile downloadFunc={getTemplateStudentList} classId={classId} />

      </div>
      <DataTable value={data?.data} showGridlines tableStyle={{ minWidth: '50rem' }} className="p-2">
        <Column field="full_name" header="Full name" style={{ minWidth: 220, width: 220 }} />
        {classCompotisions?.map((classCompotision) =>
          <Column body={formatGrade} header={() => formatColHeader(classCompotision)} />
        )}
        <Column body={formatAction} header="Actions" style={{ minWidth: 160, width: 160 }} />
      </DataTable>
      <InputGrade ref={inputGrade} refetch={refetch} />
      <Toast ref={toast} />
      <ConfirmDialog />
    </div>
  );
}
