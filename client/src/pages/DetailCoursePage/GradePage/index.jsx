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
import { Toast } from 'primereact/toast';
import { useParams } from 'react-router';
import { useTranslation } from 'react-i18next';
import DownloadExcelFile from 'components/DownloadExcelFile';
import UploadExcelFile from 'components/UploadExcelFile';
import SwitchInput from 'pages/DetailCoursePage/components/SwitchInput';
import { Tooltip } from 'primereact/tooltip';
import InputGrade from '../components/InputGrade';
import MapStudentIdByTeacher from '../components/MapStudentIdByTeacher';

export default function GradePage() {
  const { t } = useTranslation();
  const { classId } = useParams();
  const toast = useRef(null);
  const inputGrade = useRef(null);
  const mapStudentId = useRef(null);
  const uploadFile = useRef(null);
  const dt = useRef(null);
  const [link, setLink] = useState('');

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

  const openModalInputGrade = (info, idx) => {
    inputGrade.current.open({
      idx,
      info,
      classId,
    });
  };

  const handleOpenUploadFile = (compositionId, header) => {
    uploadFile.current.open({
      classId,
      compositionId,
      header
    });
  };

  const handleOpenMapStudentId = (studentId) => {
    mapStudentId.current.open({
      studentId
    });
  };

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
          className="pi pi-fw pi-file-import cursor-pointer mr-1 custom-target-icon"
          style={{ fontSize: '2rem' }}
          onClick={() => {
            setLink('/teacher/postAllGradesAssignment');
            handleOpenUploadFile(classcomposition.id, 'Upload grade');
          }}
          data-pr-tooltip="Upload grade"
        />
        <Tooltip target=".custom-target-icon" />
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
    value.is_map ? <span>Đã map</span> : <Button type="button" icon="pi pi-map" onClick={() => handleOpenMapStudentId(value.student_id)} />
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
          tooltip="Upload student list"
          tooltipOptions={{ position: 'left' }}
          rounded
          onClick={() => {
            setLink('/teacher/postStudentList');
            handleOpenUploadFile(null, 'Upload student list');
          }}
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
        <Column field="student_id" header={t('detail.gradePage.studentId')} />
        <Column field="full_name" header={t('detail.gradePage.fullName')} />
        {classcompositions?.map((classcomposition) =>
          <Column body={formatGrade} header={() => formatColHeader(classcomposition)} className="text-center" />
        )}
        <Column field="totalGrade" header={t('detail.gradePage.totalGrade')} />
        <Column body={formatAction} header={t('detail.gradePage.actions')} />
      </DataTable>
      <UploadExcelFile ref={uploadFile} link={link} refetch={refetch} />
      <InputGrade ref={inputGrade} refetch={refetch} oldGrade={0} />
      <MapStudentIdByTeacher ref={mapStudentId} refetch={refetch} />
      <Toast ref={toast} />
    </div>
  );
}
