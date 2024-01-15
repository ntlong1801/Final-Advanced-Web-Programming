import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import { Toast } from 'primereact/toast';

import { forwardRef, useImperativeHandle, useRef, useState, useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import Loading from 'components/Loading';
import { useMutation, useQuery } from 'react-query';
import { postFinalizedDecision, getDetailGradeReviews } from 'apis/grade.api';
import PropTypes from 'prop-types';
import NumberInput from 'components/FormControl/NumberInput';

const Decision = forwardRef((props, ref) => {
  // #region Data
  const { t } = useTranslation();
  const toast = useRef(null);

  const [decisionControl, setDecisionControl] = useState();
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
    queryKey: ['Decision', info?.id],
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

  const { mutate, isLoading } = useMutation(postFinalizedDecision);

  useImperativeHandle(
    ref,
    () => ({
      open: (_decisionControl) => {
        setDecisionControl(_decisionControl);
        setInfo(_decisionControl.value);
        reset();
        setVisible(true);
      },

    }),
    []
  );

  const handleDecision = async () => {
    const isValidTrigger = await trigger();
    if (!isValidTrigger) {
      showError(t('errorMessage.validationErrorMessage'));
      return;
    }

    const { value, refetch } = decisionControl;

    const newGrade = getValues('newGrade');
    const dataSender = {
      review_id: value.id,
      accepted: true,
      newGrade
    };

    mutate(dataSender, {
      onSuccess: (response) => {
        if (response.data.status === 'failed') {
          showError(response.data.message);
        } else {
          refetch();
          refetchComment();
          showSuccess('Cập nhật điểm thành công');
          setVisible(false);
        }
      }
    });
  };

  // #endregion Event

  return (
    <>
      {(isLoading || isDataLoading) && <Loading />}
      <Dialog
        header={t('detail.components.decision.decision')}
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

          <div className="p-fluid">
            <NumberInput
              label={t('detail.components.decision.finalGrade')}
              name="newGrade"
              control={control}
              errors={errors}
              defaultValue={detailComment?.student_expected_grade}
            />
          </div>
        </div>

        <div className="flex justify-content-end mt-4">
          <Button
            label={detailComment?.review_success ? t('detail.components.decision.success') : t('detail.components.decision.send')}
            type="submit"
            severity="info"
            onClick={handleDecision}
            className={detailComment?.review_success ? 'w-12rem' : 'w-10rem'}
            disabled={detailComment?.review_success}
          />
        </div>
      </Dialog>
      <Toast ref={toast} />
    </>
  );
});

export default Decision;

Decision.propTypes = {
  // eslint-disable-next-line react/no-unused-prop-types
  refetch: PropTypes.func,
};

Decision.defaultProps = {
  refetch: () => null
};
