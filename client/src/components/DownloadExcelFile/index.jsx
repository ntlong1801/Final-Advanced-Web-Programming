import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';

export default function DownloadExcelFile() {
  const handleDownload = () => {
    const csvData = [
      ['Name', 'Age'],
      ['John', 28],
      ['John', 28],
    ];

    // const wb = XLSX.utils.book_new();
    // const ws = XLSX.utils.aoa_to_sheet(data);

    // XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');

    // const blob = XLSX.writeFileXLSX(wb, { bookType: 'xlsx', type: 'blob' });

    // saveAs(blob, 'example.xlsx');

    const fileType = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
    const fileExtension = '.xlsx';

    const ws = XLSX.utils.json_to_sheet(csvData, { skipHeader: true });
    const wb = { Sheets: { data: ws }, SheetNames: ['data'] };
    const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
    const data = new Blob([excelBuffer], { type: fileType });
    saveAs(data, `123${fileExtension}`);
  };

  return (
    <div>
      <button onClick={handleDownload} type="button">Download XLSX</button>
    </div>
  );
}
