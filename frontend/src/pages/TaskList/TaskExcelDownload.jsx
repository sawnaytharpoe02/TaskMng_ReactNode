import { Button } from 'antd';
import { DownloadOutlined } from '@ant-design/icons';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import PropTypes from 'prop-types';

const ExcelDownloadButton = ({ data, fileName, statusOptions }) => {
  const handleExcelDownload = () => {
    const dataWithCorrectHeaders = data.map((item, index) => ({
      'Task ID': index + 1,
      Title: item.title,
      Description: item.description,
      'Project Name': item.projectName,
      'Assigned Employee': item.assignedEmployee,
      'Estimate Hour': item.estimateHour,
      'Actual Hour': item.actualHour,
      Status: statusOptions.find((status) => status.value === item.status)?.label,
      'Estimate Start Date': item.estimateStartDate,
      'Estimate End Date': item.estimateEndDate,
      'Actual Start Date': item.actualStartDate,
      'Actual End Date': item.actualEndDate,
    }));

    const ws = XLSX.utils.json_to_sheet(dataWithCorrectHeaders);

    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Task Data');
    const wbout = XLSX.write(wb, { bookType: 'xlsx', bookSST: true, type: 'binary' });
    const buf = new ArrayBuffer(wbout.length);
    const view = new Uint8Array(buf);
    for (let i = 0; i < wbout.length; i++) view[i] = wbout.charCodeAt(i) & 0xff;
    saveAs(new Blob([buf], { type: 'application/octet-stream' }), `${fileName}.xlsx`);
  };

  return (
    <Button className="custom-success-btn" icon={<DownloadOutlined />} onClick={handleExcelDownload}>
      Download Excel
    </Button>
  );
};

export { ExcelDownloadButton };

ExcelDownloadButton.propTypes = {
  data: PropTypes.array,
  headers: PropTypes.array,
  fileName: PropTypes.string,
  statusOptions: PropTypes.array,
};
