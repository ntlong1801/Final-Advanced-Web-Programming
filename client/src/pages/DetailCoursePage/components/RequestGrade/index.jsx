import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import { Toast } from 'primereact/toast';

import { forwardRef, useImperativeHandle, useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import Loading from 'components/Loading';
import { useMutation } from 'react-query';
import { postRequestReview } from 'apis/student.api';
import PropTypes from 'prop-types';
import TextAreaInput from 'components/FormControl/TextAreaInput';
import NumberInput from 'components/FormControl/NumberInput';

const RequestReview = forwardRef((props, ref) => {
  // #region Data
  const { t } = useTranslation();
  const toast = useRef(null);

  const [requestReviewControl, setRequestReviewControl] = useState();
  const [visible, setVisible] = useState(false);

  const {
    control,
    trigger,
    reset,
    getValues,
    formState: { errors },
  } = useForm({ mode: 'onChange' });
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

  const { mutate, isLoading } = useMutation(postRequestReview);

  useImperativeHandle(
    ref,
    () => ({
      open: (_requestReviewControl) => {
        setRequestReviewControl(_requestReviewControl);
        reset();
        setVisible(true);
      },

    }),
    []
  );

  const handleRequestReview = async () => {
    const isValidTrigger = await trigger();
    if (!isValidTrigger) {
      showError(t('errorMessage.validationErrorMessage'));
      return;
    }

    const { studentId, compositionId } = requestReviewControl;
    const studentExpectedGrade = getValues('studentExpectedGrade');
    const studentExplain = getValues('studentExplain');
    const dataSender = {
      student_expected_grade: parseFloat(studentExpectedGrade),
      student_explain: studentExplain,
      studentId,
      compositionId
    };

    mutate(dataSender, {
      onSuccess: (response) => {
        if (response.data.status === 'failed') {
          showError(response.data.message);
        } else {
          showSuccess('Cập nhật điểm thành công');
        }
      }
    });
    setVisible(false);
  };

  // #endregion Event

  return (
    <>
      {isLoading && <Loading />}
      <Dialog
        header={t('detail.components.requestGrade.fillInfo')}
        visible={visible}
        onHide={() => {
          setVisible(false);
        }}
        draggable={false}
        className="w-full sm:w-7 md:w-6 lg:w-5"
      >
        <div className="grid p-fluid">
          <div className="col-12">
            <NumberInput
              label={t('detail.components.requestGrade.expectedGrade')}
              name="studentExpectedGrade"
              control={control}
              errors={errors}
              isRequired
            />
          </div>
          <div className="col-12">
            <TextAreaInput
              label={t('detail.components.requestGrade.explain')}
              name="studentExplain"
              control={control}
              errors={errors}

            />
          </div>
        </div>

        <div className="flex justify-content-end mt-4">
          <Button
            label={t('detail.components.requestGrade.send')}
            type="submit"
            severity="info"
            onClick={handleRequestReview}
            className="w-10rem"
            // disabled={!Object.keys(dirtyFields)?.length}
          />
        </div>
      </Dialog>
      <Toast ref={toast} />
    </>
  );
});

export default RequestReview;

RequestReview.propTypes = {
  // eslint-disable-next-line react/no-unused-prop-types
  refetch: PropTypes.func,
};

RequestReview.defaultProps = {
  refetch: () => null
};
