import { FileUpload } from 'primereact/fileupload';
import PropTypes from 'prop-types';
import { forwardRef, useRef, useState, useImperativeHandle } from 'react';
import { useForm } from 'react-hook-form';
import { Dialog } from 'primereact/dialog';
import { Toast } from 'primereact/toast';

const UploadExcelFile = forwardRef((props, ref) => {
  const toast = useRef(null);

  const [visible, setVisible] = useState(false);
  const [additionalData, setAdditionalData] = useState();

  const {
    reset,
  } = useForm({ mode: 'onChange' });
  // #endregion Data

  // // #region Event
  // const showError = (message) => {
  //   toast.current.show({
  //     severity: 'error',
  //     summary: 'Thất bại',
  //     detail: message,
  //     life: 4000,
  //   });
  // };

  const showSuccess = (message) => {
    toast.current.show({
      severity: 'success',
      summary: 'Thành công',
      detail: message,
      life: 4000,
    });
  };

  useImperativeHandle(
    ref,
    () => ({
      open: (_uploadExcelFileControl) => {
        const { classId, compositionId } = _uploadExcelFileControl;
        setAdditionalData({ classId, compositionId });
        reset();
        setVisible(true);
      },

    }),
    []
  );

  const onBeforeSend = (event) => {
    // Add authorization header
    event.xhr.setRequestHeader('Authorization', `Bearer ${localStorage.getItem('access_token')}`);
    event.formData.append('classId', additionalData.classId);
    event.formData.append('compositionId', additionalData.compositionId);
  };

  const onUpload = () => {
    props.refetch();
    showSuccess();
  };

  return (
    <>
      <Dialog
        header="Tải lên điểm thành phần"
        visible={visible}
        onHide={() => {
          setVisible(false);
        }}
        draggable={false}
        className="w-full sm:w-7 md:w-6 lg:w-5"
      >
        <div className="card">
          <FileUpload
            name="grades"
            url={`${process.env.REACT_APP_API_URL}${props.link}`}
            multiple
            accept=".csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel"
            maxFileSize={1000000000}
            pt={{
              content: { className: 'surface-ground' },
              message: {
                root: {
                  className: 'w-1rem'
                }
              }
            }}
            emptyTemplate={<p className="m-0">Drag and drop files to here to upload.</p>}
            chooseLabel="chọn"
            uploadLabel="tải lên"
            cancelLabel="hủy bỏ"
            onBeforeSend={onBeforeSend}
            onUpload={onUpload}
          />
        </div>
      </Dialog>
      <Toast ref={toast} />
    </>

  );
});

export default UploadExcelFile;

UploadExcelFile.propTypes = {
  link: PropTypes.string,
  refetch: PropTypes.func.isRequired
};

UploadExcelFile.defaultProps = {
  link: ''
};
