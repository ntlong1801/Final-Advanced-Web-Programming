import { FileUpload } from 'primereact/fileupload';
import PropTypes from 'prop-types';

export default function UploadExcelFile({ link }) {
  return (
    <div className="card">
      <FileUpload
        name="demo[]"
        url={`${process.env.REACT_APP_API_URL}${link}`}
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
      />
    </div>
  );
}

UploadExcelFile.propTypes = {
  link: PropTypes.string
};

UploadExcelFile.defaultProps = {
  link: ''
};
