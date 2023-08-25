import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Table, Col, Row, Form, Input, Button, DatePicker } from 'antd';
import { SearchOutlined, CloseOutlined, PlusOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';
import { reportApi } from '../../services/apiServices';
import { useNetworkError } from '../../context/networkErrContext';
import { ExcelDownloadButton } from './ReportExcelDownload';

const ReportList = () => {
  const [reportLists, setReportLists] = useState([]);
  const [isFetchingData, setIsFetchingData] = useState(false);
  const [data, setData] = useState([]);
  const { handleNetworkError } = useNetworkError();

  const statusOptions = [
    { value: '0', label: 'Open' },
    { value: '1', label: 'In Progress' },
    { value: '2', label: 'Finish' },
    { value: '3', label: 'Close' },
  ];

  const onSearch = (values) => {
    const { date, reportedBy, reportedTo } = values;

    const filteredResult = data.filter((report) => {
      const formattedDate = date?.toISOString().slice(0, 10);

      const matchesDate = !date || report.date.includes(formattedDate);
      const matchesReportedBy =
        !reportedBy || report.reportedBy.toLowerCase().trim().includes(reportedBy.toLowerCase().trim());
      const matchesReportedTo =
        !reportedTo || report.reportedTo.toLowerCase().trim().includes(reportedTo.toLowerCase().trim());

      return matchesDate && matchesReportedBy && matchesReportedTo;
    });

    setReportLists(filteredResult);
  };

  const fetchReport = async () => {
    try {
      let temp = 1;
      setIsFetchingData(true);

      const res = await reportApi.getAll();
      const reports = res.data.result.map((row) => ({
        ...row,
        reportId: temp++,
        key: row._id,
        date: dayjs(row.createdAt).format('YYYY-MM-DD'),
        desc: `${row.reportTo}, ${row.task?.project?.projectName}, ${row.task?.title}, ${row.percentage}, ${row.types}, ${row.status}, ${row.hour} ${row.problem_feeling}`,
        reportedTo: row.reportTo,
        reportedBy: row.reportBy,
      }));

      setReportLists(reports);
      setData(reports);
    } catch (error) {
      if (error?.code === 'ERR_NETWORK') {
        handleNetworkError();
      }
    } finally {
      setIsFetchingData(false);
    }
  };

  useEffect(() => {
    fetchReport();
  }, []);

  const columns = [
    {
      title: 'Report ID',
      dataIndex: 'reportId',
      defaultSortOrder: 'ascend',
      sorter: (a, b) => a.reportId - b.reportId,
    },
    {
      title: 'Date',
      dataIndex: 'date',
      sorter: (a, b) => a.date.localeCompare(b.date),
    },
    {
      title: 'Description',
      dataIndex: 'desc',
      render: (_, record) => {
        return (
          <>
            <p>Report To: {record.reportTo}</p>
            <p>Project: {record.task?.project?.projectName}</p>
            <p>【実績】</p>
            <p>
              - {record.task?.title}, &lt; {record.percentage}% &gt;, &lt; {record.types} &gt;, &lt;{' '}
              {statusOptions.find((status) => status.value === record.status.toString())?.label} &gt;, &lt;{' '}
              {record.hour}
              hr &gt;
            </p>
            <p>【所感】</p>
            <p>Problem: {record.problem_feeling ? record.problem_feeling : '- Nothing'}</p>
          </>
        );
      },
    },
    {
      title: 'Reported To',
      dataIndex: 'reportedTo',
    },
    {
      title: 'Reported By',
      dataIndex: 'reportedBy',
    },
  ];

  return (
    <>
      <Form layout="horizontal" onFinish={onSearch} style={{ marginBottom: '20px' }}>
        <Row gutter={[16, 16]} align="middle">
          <Col xs={24} sm={24} md={24} lg={24} xl={12}>
            <Row gutter={16}>
              <Col xs={24} sm={24} md={8} lg={8} xl={8}>
                <Form.Item name="date">
                  <DatePicker className="search-input" placeholder="yyyy-mm-dd" style={{ width: '100%' }} />
                </Form.Item>
              </Col>

              <Col xs={24} sm={24} md={8} lg={8} xl={8}>
                <Form.Item name="reportedTo">
                  <Input className="search-input" placeholder="Reported To" />
                </Form.Item>
              </Col>

              <Col xs={24} sm={24} md={8} lg={8} xl={8}>
                <Form.Item name="reportedBy">
                  <Input className="search-input" placeholder="Reported By" />
                </Form.Item>
              </Col>
            </Row>
          </Col>

          <Col xs={24} sm={24} md={24} lg={24} xl={12}>
            <Row style={{ justifyContent: 'space-between' }}>
              <Col style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                <Form.Item>
                  <Button className="custom-primary-btn" htmlType="submit" icon={<SearchOutlined />}>
                    Search
                  </Button>
                </Form.Item>

                <Form.Item>
                  <Button
                    className="custom-danger-btn"
                    htmlType="reset"
                    icon={<CloseOutlined />}
                    onClick={() => setReportLists(data)}
                  >
                    Clear
                  </Button>
                </Form.Item>
              </Col>

              <Col style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                <ExcelDownloadButton data={reportLists} fileName="report-list" />

                <Link to="/report/add">
                  <Button className="custom-primary-btn" icon={<PlusOutlined />}>
                    Add New Report
                  </Button>
                </Link>
              </Col>
            </Row>
          </Col>
        </Row>
      </Form>

      <Table
        columns={columns}
        dataSource={reportLists}
        loading={isFetchingData}
        scroll={{
          x: 1300,
        }}
        pagination={{
          pageSize: 5,
        }}
      />
    </>
  );
};

export default ReportList;
