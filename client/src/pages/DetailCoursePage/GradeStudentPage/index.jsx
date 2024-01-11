import { useQuery } from 'react-query';
import { useMemo, useRef } from 'react';
import { getGradeStructure } from 'apis/student.api';
import { useParams } from 'react-router';
import { getStudentId } from 'apis/user.api';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import RequestGrade from '../components/RequestGrade';

export default function GradeStudentPage() {
  const userId = JSON.parse(localStorage.getItem('user_profile')).id;
  const { classId } = useParams();

  const requestRef = useRef(null);

  const { data: _stuedntId } = useQuery({
    queryKey: ['studentId', userId],
    queryFn: () => getStudentId(userId)

  });
  const studentId = useMemo(() => _stuedntId?.data.studentId.student_id ?? null, [_stuedntId]);
  const { data,
    isLoading } = useQuery({
    queryKey: ['gradeStructureOfStudent', classId],
    queryFn: () => getGradeStructure(studentId, classId),
    enabled: !!studentId
  });
  const gradeStructureOfStudent = useMemo(() => data?.data?.grade ?? null, [data]);
  const classcompositions = useMemo(() => data?.data?.classComposition ?? null, [data]);

  const handleOpenRequest = (compositionId) => {
    requestRef.current.open({
      studentId,
      compositionId
    });
  };

  const formatColHeader = (classcomposition) => (
    <div className="text-center">
      <span>
        {classcomposition.name}
      </span>
      <div>
        <span style={{ fontSize: '0.8rem' }}>({classcomposition.grade_scale} %)</span>
      </div>

    </div>
  );
  const formatGrade = (value, classComposition) => {
    let grade = null;
    const gradeTemp = value[classComposition];
    if (gradeTemp === null) {
      grade = 0;
    } else if (gradeTemp === undefined) {
      grade = 'Chưa công bố';
    } else {
      grade = gradeTemp.grade;
    }
    return (
      <div>
        <span className="text-primary mr-2">{grade}</span>
        <i className="pi pi-pencil cursor-pointer" onClick={() => handleOpenRequest(classComposition)} />
      </div>
    );
  };

  return (
    <>
      <DataTable
        value={gradeStructureOfStudent}
        showGridlines
        tableStyle={{ minWidth: '50rem' }}
        className="p-2"
        loading={isLoading}
      >
        <Column field="student_id" header="StudentId" style={{ minWidth: 140, width: 140 }} />
        {classcompositions?.map((classcomposition) => (
          <Column
            body={(value) => formatGrade(value, classcomposition.id)}
            header={() => formatColHeader(classcomposition)}
            className="text-center"
          />
        )
        )}
        <Column field="totalGrade" header="Total grade" style={{ minWidth: 110, width: 110 }} className="text-center" />
      </DataTable>
      <RequestGrade ref={requestRef} />
    </>
  );
}
