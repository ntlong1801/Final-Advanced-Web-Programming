import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import { Button } from 'primereact/button';
import PropTypes from 'prop-types';
import { useMutation } from 'react-query';

export default function DownloadExcelFile({
  downloadFunc, classId
}) {
  const { mutate } = useMutation(downloadFunc);

  const handleDownload = () => {
    mutate(classId, {
      onSuccess: (res) => {
        const fileType = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
        const fileExtension = '.xlsx';

        const ws = XLSX.utils.json_to_sheet(res.data.csvData, { skipHeader: false });
        const wb = { Sheets: { data: ws }, SheetNames: ['data'] };
        const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
        const data = new Blob([excelBuffer], { type: fileType });
        saveAs(data, `template${fileExtension}`);
      }
    });
  };

  return (
    <div>
      <Button
        type="button"
        label="Download template"
        severity="help"
        tooltip="Download Template for student list (StudentId, FullName)"
        tooltipOptions={{ position: 'left', at: 'left top' }}
        onClick={handleDownload}
      />
    </div>
  );
}

DownloadExcelFile.propTypes = {
  downloadFunc: PropTypes.func.isRequired,
  classId: PropTypes.string.isRequired
};
