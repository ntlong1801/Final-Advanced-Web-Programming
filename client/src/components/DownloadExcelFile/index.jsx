import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import { Button } from 'primereact/button';
import PropTypes from 'prop-types';
import { useMutation } from 'react-query';
import { Tooltip } from 'primereact/tooltip';
import Loading from 'components/Loading';

export default function DownloadExcelFile({
  downloadFunc, classId, compositionId, userId, isButton, severity, tooltip
}) {
  const { mutate, isLoading } = useMutation(downloadFunc);
  const dataSender = {
    classId
  };
  if (compositionId) {
    dataSender.compositionId = compositionId;
  }
  if (userId) {
    dataSender.userId = userId;
  }

  const handleDownload = () => {
    mutate(dataSender, {
      onSuccess: (res) => {
        const fileType = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
        const fileExtension = '.xlsx';

        const ws = XLSX.utils.json_to_sheet(res.data.csvData.length !== 0 ?
          res.data.csvData :
          [{ StudentId: null, FullName: null }], { skipHeader: false });
        const wb = { Sheets: { data: ws }, SheetNames: ['data'] };
        const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
        const data = new Blob([excelBuffer], { type: fileType });
        if (compositionId) {
          saveAs(data, `gradeTemplate${fileExtension}`);
        } else {
          saveAs(data, `studentListtemplate${fileExtension}`);
        }
      }
    });
  };

  return (
    <div>
      {isLoading && <Loading />}
      {isButton ? (
        <Button
          type="button"
          icon="pi pi-file-excel"
          severity={severity}
          tooltip={tooltip}
          tooltipOptions={{ position: 'left', at: 'left top' }}
          onClick={handleDownload}
        />
      ) : (
        <i
          className="tooltip-download pi pi-fw pi-file-export cursor-pointer"
          style={{ fontSize: '2rem' }}
          onClick={handleDownload}
          data-pr-tooltip={tooltip}
          data-pr-position="left"
        />
      )}
      <Tooltip target=".tooltip-download" />

    </div>
  );
}

DownloadExcelFile.propTypes = {
  downloadFunc: PropTypes.func,
  classId: PropTypes.string,
  compositionId: PropTypes.string,
  isButton: PropTypes.bool,
  severity: PropTypes.string,
  tooltip: PropTypes.string,
  userId: PropTypes.string,
};

DownloadExcelFile.defaultProps = {
  downloadFunc: () => null,
  classId: '',
  compositionId: null,
  isButton: true,
  severity: 'help',
  tooltip: '',
  userId: null,
};
