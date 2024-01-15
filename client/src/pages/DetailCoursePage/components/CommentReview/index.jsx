import './style.scss';

import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import { Toast } from 'primereact/toast';

import { forwardRef, useImperativeHandle, useRef, useState, useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import Loading from 'components/Loading';
import { useMutation, useQuery } from 'react-query';
import { postFeedbackOnReview, getDetailGradeReviews } from 'apis/grade.api';
import PropTypes from 'prop-types';
import TextAreaInput from 'components/FormControl/TextAreaInput';
import { Card } from 'primereact/card';

const CommentReview = forwardRef((props, ref) => {
  // #region Data
  const { t } = useTranslation();
  const toast = useRef(null);

  const [commentReviewControl, setCommentReviewControl] = useState();
  const [visible, setVisible] = useState(false);
  const [info, setInfo] = useState({});

  const {
    control,
    trigger,
    reset,
    getValues,
    formState: { errors },
  } = useForm({ mode: 'onChange' });

  const { data, isLoading: isDataLoading, refetch: refetchComment } = useQuery({
    queryKey: ['commentReview', info?.id],
    queryFn: () => getDetailGradeReviews(info?.id),
    enabled: !!info?.id
  });
  const detailComment = useMemo(() => data?.data ?? null, [data]);
  // #endregion Data

  // #region Event
  const showError = (message) => {
    toast.current.show({
      severity: 'error',
      summary: 'Thất bại',
      detail: message,
      life: 4000,
    });
  };

  const showSuccess = (message) => {
    toast.current.show({
      severity: 'success',
      summary: 'Thành công',
      detail: message,
      life: 4000,
    });
  };

  const { mutate, isLoading } = useMutation(postFeedbackOnReview);

  useImperativeHandle(
    ref,
    () => ({
      open: (_commentReviewControl) => {
        setCommentReviewControl(_commentReviewControl);
        setInfo(_commentReviewControl.value);
        reset();
        setVisible(true);
      },

    }),
    []
  );

  const handleCommentReview = async () => {
    const isValidTrigger = await trigger();
    if (!isValidTrigger) {
      showError(t('errorMessage.validationErrorMessage'));
      return;
    }

    const { value, userId, refetch, fullName, role } = commentReviewControl;

    const feedback = getValues('feedback');
    const dataSender = {
      review_id: value.id,
      user_id: userId,
      feedback,
      fullName,
      role
    };

    mutate(dataSender, {
      onSuccess: (response) => {
        if (response.data.status === 'failed') {
          showError(response.data.message);
        } else {
          refetch();
          refetchComment();
          reset();
          showSuccess('Phản hồi thành công');
        }
      }
    });
  };

  // #endregion Event

  return (
    <>
      {(isLoading || isDataLoading) && <Loading />}
      <Dialog
        header={t('detail.components.commentReview.comment')}
        visible={visible}
        style={{ width: '50vw' }}
        maximizable
        onHide={() => {
          setVisible(false);
        }}
        draggable={false}
      >
        <div className="">
          <div className="sticky top-0 bg-header p-2 text-white border-round-lg mb-2">
            <p className="my-1">Tên học sinh: {detailComment?.student_name}</p>
            <p>Thành phần điểm: &nbsp;
              {detailComment?.composition_name} ({detailComment?.grade_scale}%)
            </p>
            <p>Điểm hiện tại: {detailComment?.current_grade}</p>
            <p>Điểm mong muốn: {detailComment?.student_expected_grade}</p>
            <p>Lý do: {detailComment?.student_explain}</p>

          </div>
          {detailComment?.feedback?.map((feedback) => (
            <div className="card p-2">
              <Card>
                <p className={feedback?.role === 'teacher' ? 'm-0 font-semibold text-right' : 'm-0 font-semibold'}>
                  {feedback?.full_name}
                </p>
                <p className={feedback?.role === 'teacher' ? 'mt-2 text-right' : 'mt-2'} style={{ overflowWrap: 'break-word' }}>
                  {feedback?.comment_content}
                </p>
                <div className={feedback?.role === 'teacher' ? 'text-right' : ''}>
                  <span className="mt-2 text-xs">{feedback?.create_at}</span>
                </div>
              </Card>
            </div>
          ))}

          <div className="p-fluid">
            <TextAreaInput
              label={t('detail.components.commentReview.feedback')}
              name="feedback"
              control={control}
              errors={errors}
            />
          </div>
        </div>

        <div className="flex justify-content-end mt-4">
          <Button
            label={t('detail.components.commentReview.submit')}
            type="submit"
            severity="info"
            onClick={handleCommentReview}
            className="w-10rem"
            // disabled={!Object.keys(dirtyFields)?.length}
          />
        </div>
      </Dialog>
      <Toast ref={toast} />
    </>
  );
});

export default CommentReview;

CommentReview.propTypes = {
  // eslint-disable-next-line react/no-unused-prop-types
  refetch: PropTypes.func,
};

CommentReview.defaultProps = {
  refetch: () => null
};
