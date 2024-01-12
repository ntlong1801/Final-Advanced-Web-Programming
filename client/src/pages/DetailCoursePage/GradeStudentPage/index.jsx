import { useQuery } from 'react-query';
import { useMemo, useRef } from 'react';
import { getGradeStructure } from 'apis/student.api';
import { useParams } from 'react-router';
import { getStudentId } from 'apis/user.api';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { useTranslation } from 'react-i18next';
import { Badge } from 'primereact/badge';
import RequestGrade from '../components/RequestGrade';
import CommentReview from '../components/CommentReview';

export default function GradeStudentPage() {
  const { t } = useTranslation();
  const userId = JSON.parse(localStorage.getItem('user_profile')).id;
  const fullName = JSON.parse(localStorage.getItem('user_profile')).full_name;
  const { classId } = useParams();

  const requestRef = useRef(null);
  const commentRef = useRef(null);

  const { data: _stuedntId } = useQuery({
    queryKey: ['studentId', userId],
    queryFn: () => getStudentId(userId)

  });
  const studentId = useMemo(() => _stuedntId?.data.studentId.student_id ?? null, [_stuedntId]);
  const { data,
    isLoading,
    refetch } = useQuery({
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

  const handleOpenComment = (value) => {
    commentRef.current.open({
      userId,
      value,
      refetch,
      fullName,
      role: 'student'
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
        <span className="text-primary mr-2 ">{grade}</span>
        {grade !== 'Chưa công bố' && value[classComposition]?.isRequest === undefined &&
          <i className="pi pi-pencil cursor-pointer text-2xl" onClick={() => handleOpenRequest(classComposition)} />}
        {grade !== 'Chưa công bố' && value[classComposition]?.isRequest && (
          <i className="pi pi-comments cursor-pointer text-2xl" onClick={() => handleOpenComment(value[classComposition].isRequest)}>
            {value[classComposition]?.isRequest.review_success && <Badge value="Đã phúc khảo" />}
          </i>
        )}
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
        <Column field="student_id" header={t('detail.gradeStudentPage.studentId')} style={{ minWidth: 140, width: 140 }} />
        {classcompositions?.map((classcomposition) => (
          <Column
            body={(value) => formatGrade(value, classcomposition.id)}
            header={() => formatColHeader(classcomposition)}
            className="text-center"
          />
        )
        )}
        <Column field="totalGrade" header={t('detail.gradeStudentPage.totalGrade')} headerStyle={{ textAlign: 'center' }} style={{ minWidth: 110, width: 110 }} className="text-center" />
      </DataTable>
      <RequestGrade ref={requestRef} />
      <CommentReview ref={commentRef} />
    </>
  );
}
