import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import { Toast } from 'primereact/toast';

import { forwardRef, useImperativeHandle, useRef, useState, useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import Loading from 'components/Loading';
import { useMutation, useQuery } from 'react-query';
import { mapStudentId, getStudentNotMapStudentId } from 'apis/grade.api';
import PropTypes from 'prop-types';
import Select from 'components/FormControl/Select';

import { useParams } from 'react-router';

const MapStudentIdByTeacher = forwardRef((props, ref) => {
  // #region Data
  const { t } = useTranslation();
  const toast = useRef(null);
  const { classId } = useParams();

  const [visible, setVisible] = useState(false);
  const [studentId, setStudentId] = useState('');

  const {
    trigger,
    reset,
    control,
    getValues,
    // eslint-disable-next-line no-unused-vars
    formState: { errors, dirtyFields },
  } = useForm({ mode: 'onChange' });

  const { data: _data } = useQuery({
    queryKey: [classId],
    queryFn: () => getStudentNotMapStudentId(classId)
  });

  const data = useMemo(() => _data?.data ?? [], [_data]);
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

  const { mutate, isLoading } = useMutation(mapStudentId);

  useImperativeHandle(
    ref,
    () => ({
      open: (_mapStudentIdByTeacherControl) => {
        setStudentId(_mapStudentIdByTeacherControl.studentId);
        reset();
        setVisible(true);
      },

    }),
    []
  );

  const handleMapStudentIdByTeacher = async () => {
    const isValidTrigger = await trigger();
    if (!isValidTrigger) {
      showError(t('errorMessage.validationErrorMessage'));
      return;
    }
    const userId = getValues('id');

    const dataSender = {
      classId,
      studentId,
      userId,
    };

    mutate(dataSender, {
      onSuccess: (response) => {
        if (response.data.status === 'failed') {
          showError(response.data.message);
        } else {
          props.refetch();
          showSuccess('Cập nhật mã số sinh viên thành công');
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
        header={`Map student id for ${studentId}`}
        visible={visible}
        onHide={() => {
          setVisible(false);
        }}
        draggable={false}
        className="w-full sm:w-7 md:w-6 lg:w-5"
      >
        <div className="grid p-fluid">
          <div className="col-12 text-center">
            <Select
              name="id"
              control={control}
              errors={errors}
              options={data}
              placeholder="Chọn email"
            />
          </div>
        </div>

        <div className="flex justify-content-end mt-4">
          <Button
            label={t('detail.components.inputStudentId.update')}
            type="submit"
            severity="info"
            onClick={handleMapStudentIdByTeacher}
            className="w-8rem"
            disabled={!Object.keys(dirtyFields)?.length}
          />
        </div>
      </Dialog>
      <Toast ref={toast} />
    </>
  );
});

export default MapStudentIdByTeacher;

MapStudentIdByTeacher.propTypes = {
  refetch: PropTypes.func.isRequired,
};
