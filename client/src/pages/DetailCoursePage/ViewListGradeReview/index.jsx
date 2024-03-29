import { useQuery } from 'react-query';
import { useMemo, useRef } from 'react';
import { getListGradeReviews } from 'apis/grade.api';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';
import { useTranslation } from 'react-i18next';
import CommentReview from '../components/CommentReview';
import Decision from '../components/Decision';

export default function ViewListGradeReview() {
  const { t } = useTranslation();
  const userId = JSON.parse(localStorage.getItem('user_profile')).id;
  const fullName = JSON.parse(localStorage.getItem('user_profile')).full_name;
  const commentRef = useRef(null);
  const decisionRef = useRef(null);

  const { data, isLoading, refetch } = useQuery({
    queryKey: ['studentReviews', userId],
    queryFn: () => getListGradeReviews(userId)
  });

  const studentReviews = useMemo(() => data?.data ?? [], [data]);

  const handleOpenModal = (value) => {
    commentRef.current.open({
      value,
      userId,
      refetch,
      fullName,
      role: 'teacher'
    });
  };

  const handleOpenDecisionModal = (value) => {
    decisionRef.current.open({
      value,
      userId,
      refetch,
      fullName
    });
  };

  const formatActions = (value) => (
    <div className="flex justify-content-center gap-2">
      <Button
        icon="pi pi-comments"
        onClick={() => handleOpenModal(value)}
        tooltip="Phản hồi"
        tooltipOptions={{ position: 'left' }}
      />
      <Button
        icon="pi pi-send"
        onClick={() => handleOpenDecisionModal(value)}
        tooltip="Quyết định"
        tooltipOptions={{ position: 'left' }}
        severity="help"
      />
    </div>
  );

  return (
    <>
      <DataTable
        value={studentReviews}
        showGridlines
        loading={isLoading}
      >
        <Column field="student_id" header={t('detail.viewListGradeReview.studentId')} style={{ textAlign: 'center' }} />
        <Column field="composition_name" header={t('detail.viewListGradeReview.gradeComposition')} style={{ textAlign: 'center' }} />
        <Column field="student_expected_grade" header={t('detail.viewListGradeReview.expectedGrade')} style={{ textAlign: 'center' }} />
        <Column header={t('detail.viewListGradeReview.actions')} body={formatActions} style={{ textAlign: 'center' }} />
      </DataTable>
      <CommentReview ref={commentRef} />
      <Decision ref={decisionRef} />
    </>
  );
}
