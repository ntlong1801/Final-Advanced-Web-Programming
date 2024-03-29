import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import { Toast } from 'primereact/toast';

import { forwardRef, useImperativeHandle, useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import Loading from 'components/Loading';
import { useMutation } from 'react-query';
import { mapStudentId } from 'apis/admin.api';
import PropTypes from 'prop-types';
import TextInput from 'components/FormControl/TextInput';

const MapStudentId = forwardRef((props, ref) => {
  // #region Data
  const { t } = useTranslation();
  const toast = useRef(null);

  const [mapStudentIdControl, setMapStudentIdControl] = useState();
  const [visible, setVisible] = useState(false);
  const [oldStudentId, setOldStudentId] = useState('');

  const {
    control,
    trigger,
    reset,
    getValues,
    // eslint-disable-next-line no-unused-vars
    formState: { errors, dirtyFields },
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

  const { mutate, isLoading } = useMutation(mapStudentId);

  useImperativeHandle(
    ref,
    () => ({
      open: (_mapStudentIdControl) => {
        setMapStudentIdControl(_mapStudentIdControl);
        const { oldSID } = _mapStudentIdControl;
        setOldStudentId(oldSID);
        reset();
        setVisible(true);
      },

    }),
    []
  );

  const handleMapStudentId = async () => {
    const isValidTrigger = await trigger();
    if (!isValidTrigger) {
      showError(t('errorMessage.validationErrorMessage'));
      return;
    }

    const { userId } = mapStudentIdControl;
    const studentId = getValues('studentId');

    const dataSender = {
      userId,
      studentId,
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
        header="Nhập mã số sinh viên"
        visible={visible}
        onHide={() => {
          setVisible(false);
        }}
        draggable={false}
        className="w-full sm:w-7 md:w-6 lg:w-5"
      >
        <div className="grid p-fluid">
          <div className="col-12">
            <TextInput
              name="studentId"
              control={control}
              errors={errors}
              defaultValue={oldStudentId}
            />
          </div>
        </div>

        <div className="flex justify-content-end mt-4">
          <Button
            label="Cập nhật"
            type="submit"
            severity="info"
            onClick={handleMapStudentId}
            className="w-8rem"
            // disabled={!Object.keys(dirtyFields)?.length}
          />
        </div>
      </Dialog>
      <Toast ref={toast} />
    </>
  );
});

export default MapStudentId;

MapStudentId.propTypes = {
  refetch: PropTypes.func.isRequired,
};
