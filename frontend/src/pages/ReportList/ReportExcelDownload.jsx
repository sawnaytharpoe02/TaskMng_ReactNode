import { Button } from 'antd';
import { DownloadOutlined } from '@ant-design/icons';
import * as XLSX from 'xlsx';
import PropTypes from 'prop-types';

const ExcelDownloadButton = ({ data, fileName }) => {
  const handleExcelDownload = () => {
    const workbook = XLSX.utils.book_new();

    const statusOptions = [
      { value: '0', label: 'Open' },
      { value: '1', label: 'In Progress' },
      { value: '2', label: 'Finish' },
      { value: '3', label: 'Close' },
    ];
    const dataWithCorrectHeaders = data.map((item, index) => ({
      ReportID: index + 1,
      Date: item.date,
      Description: `${item.reportedTo}, ${item.projectName}, ${item.taskTitle}, ${item.percentage}, ${
        item.types
      }, ${statusOptions.find((option) => option.value === item.status)?.label}, ${item.hour} hours, ${
        item.problem_feeling === null ? 'Nothing' : item.problem_feeling
      }`,
      ReportTo: item.reportedTo,
      ReportedBy: item.reportedBy,
    }));
    const worksheet = XLSX.utils.json_to_sheet(dataWithCorrectHeaders, {
      header: ['ReportID', 'Date', 'Description', 'ReportTo', 'ReportedBy'],
    });
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Report List');
    const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
    const blob = new Blob([excelBuffer], {
      type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${fileName}.xlsx`;
    a.click();
    URL.revokeObjectURL(url);
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
  fileName: PropTypes.string,
};
