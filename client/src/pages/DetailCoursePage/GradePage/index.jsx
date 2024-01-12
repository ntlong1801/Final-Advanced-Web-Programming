import { useQuery } from 'react-query';
import { useMemo, useRef, useState } from 'react';
import { getClassGradeBoard,
  getTemplateStudentList,
  getGradeTemplate,
  getGradeBoard } from 'apis/grade.api';
import { getGradeStructure } from 'apis/class.api';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';
import { ConfirmDialog, confirmDialog } from 'primereact/confirmdialog';
import { Toast } from 'primereact/toast';
import { useParams } from 'react-router';
import DownloadExcelFile from 'components/DownloadExcelFile';
import UploadExcelFile from 'components/UploadExcelFile';
import SwitchInput from 'pages/DetailCoursePage/components/SwitchInput';
import InputGrade from '../components/InputGrade';
import MapStudentId from '../components/MapStudentId';

export default function GradePage() {
  const { classId } = useParams();
  const toast = useRef(null);
  const inputGrade = useRef(null);
  const mapStudentId = useRef(null);
  const uploadFile = useRef(null);
  const dt = useRef(null);
  const [link, setLink] = useState('');

  const accept = () => {
    toast.current.show({ severity: 'info', summary: 'Confirmed', detail: 'You have accepted', life: 3000 });
  };

  const reject = () => {
    toast.current.show({ severity: 'warn', summary: 'Rejected', detail: 'You have rejected', life: 3000 });
  };

  const {
    data: _data,
    isLoading,
    refetch
  } = useQuery({
    queryKey: ['allUsers'],
    queryFn: () => getClassGradeBoard(classId)
  });
  const data = useMemo(() => _data?.data ?? null, [_data]);

  const {
    data: gradeStructureData,
    isLoading: gradeStructureLoading,
    refetch: gradeStructureRefetch
  } = useQuery({
    queryKey: ['gradeStructure'],
    queryFn: () => getGradeStructure(classId)
  });
  const classcompositions = useMemo(() =>
    gradeStructureData?.data?.result.sort(
      (a, b) =>
        a.order_id - b.order_id) ?? null,
  [gradeStructureData]
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
      classId,
    });
  };

  const openModalMapStudentId = (info) => {
    mapStudentId.current.open({
      userId: info.id_user,
      classId,
      oldSID: info.student_id
    });
  };

  const handleOpenUploadFile = (compositionId) => {
    uploadFile.current.open({
      classId,
      compositionId
    });
  };

  const formatStudentId = (value) => (
    <span className="cursor-pointer text-primary" onClick={() => openModalMapStudentId(value)}>
      {value?.student_id || 'Map studentId'}
    </span>
  );

  const formatGrade = (value, index) => {
    const idx = parseInt(index.field.split('_')[1], 10) - 2;
    const gradeArray = value.gradeArray.sort((a, b) => a.order_id - b.order_id);
    return (
      <div>
        <span className="cursor-pointer text-primary" onClick={() => openModalInputGrade(value, idx)}>{gradeArray[idx]?.grade || '__'}</span>
        /10
      </div>
    );
  };

  const formatColHeader = (classcomposition) => (
    <div className="text-center">
      <div className="flex justify-content-center mt-1">

        <DownloadExcelFile
          downloadFunc={getGradeTemplate}
          classId={classId}
          compositionId={classcomposition.id}
          isButton={false}
          tooltip="Download grade template"
        />
        <i
          className="pi pi-fw pi-file-import cursor-pointer mr-1"
          style={{ fontSize: '2rem' }}
          onClick={() => {
            setLink('/teacher/postAllGradesAssignment');
            handleOpenUploadFile(classcomposition.id);
          }}
        />
        <SwitchInput
          compositionId={classcomposition.id}
          isPublic={classcomposition.public_grade}
          refetch={gradeStructureRefetch}
        />
      </div>
      <span>
        {classcomposition.name}
      </span>
      <div>
        <span style={{ fontSize: '0.8rem' }}>({classcomposition.grade_scale} %)</span>
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
      <div className="flex justify-content-end gap-2">
        <DownloadExcelFile
          downloadFunc={getTemplateStudentList}
          classId={classId}
          tooltip="Download student list"
        />
        <Button
          type="button"
          icon="pi pi-upload"
          severity="success"
          rounded
          onClick={() => {
            setLink('/teacher/postStudentList');
            handleOpenUploadFile(null);
          }}
          data-pr-tooltip="XLS"
        />
        <DownloadExcelFile
          downloadFunc={getGradeBoard}
          classId={classId}
          tooltip="Download grade board"
          severity="info"
        />

      </div>
      <DataTable
        ref={dt}
        value={data?.data}
        showGridlines
        tableStyle={{ minWidth: '50rem' }}
        className="p-2"
        loading={isLoading || gradeStructureLoading}
      >
        <Column field="student_id" body={formatStudentId} header="StudentId" />
        <Column field="full_name" header="Full name" />
        {classcompositions?.map((classcomposition) =>
          <Column body={formatGrade} header={() => formatColHeader(classcomposition)} className="text-center" />
        )}
        <Column field="totalGrade" header="Total grade" className="text-center" />
        <Column body={formatAction} header="Actions" />
      </DataTable>
      <UploadExcelFile ref={uploadFile} link={link} refetch={refetch} />
      <InputGrade ref={inputGrade} refetch={refetch} oldGrade={0} />
      <MapStudentId ref={mapStudentId} refetch={refetch} />
      <Toast ref={toast} />
      <ConfirmDialog />
    </div>
  );
}
