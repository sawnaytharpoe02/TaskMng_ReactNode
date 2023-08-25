import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Button, Col, Form, Input, Row, Table, Tag, Space, Select } from 'antd';
import { SearchOutlined, CloseOutlined, PlusOutlined, FormOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';
import { taskApi } from '../../services/apiServices';
import { useNetworkError } from '../../context/networkErrContext';
import { ExcelDownloadButton } from './TaskExcelDownload';
import { getUser } from '../../utils/storage';
import './taskList.scss';

const columns = [
  {
    title: 'Task Id',
    dataIndex: 'id',
    width: '5%',
    defaultSortOrder: 'ascend',
    sorter: (a, b) => a.id - b.id,
  },
  {
    title: 'Title',
    dataIndex: 'title',
    sorter: (a, b) => a.title.localeCompare(b.title),
  },
  {
    title: 'Description',
    dataIndex: 'description',
  },
  {
    title: 'Project Name',
    dataIndex: 'projectName',
  },
  {
    title: 'Assigned Employee',
    dataIndex: 'assignedEmployee',
    sorter: (a, b) => a.assignedEmployee.localeCompare(b.assignedEmployee),
  },
  {
    title: 'Estimate Hour',
    dataIndex: 'estimateHour',
    sorter: (a, b) => a.estimateHour - b.estimateHour,
  },
  {
    title: 'Actual Hour',
    dataIndex: 'actualHour',
    sorter: (a, b) => a.actualHour - b.actualHour,
  },
  {
    title: 'Status',
    dataIndex: 'status',
    sorter: (a, b) => a.status - b.status,
    render: (status) => {
      let color;
      let statusString = '';

      if (status === 0) {
        color = 'cyan';
        statusString = 'OPEN';
      } else if (status === 1) {
        color = 'warning';
        statusString = 'IN PROGRESS';
      } else if (status === 2) {
        color = 'success';
        statusString = 'FINISHED';
      } else if (status === 3) {
        color = 'error';
        statusString = 'CLOSE';
      }

      return (
        <Tag color={color} className="tag-status">
          {statusString}
        </Tag>
      );
    },
  },
  {
    title: 'Estimate Start Date',
    dataIndex: 'estimateStartDate',
    sorter: (a, b) => a.estimateStartDate.localeCompare(b.estimateStartDate),
  },
  {
    title: 'Estimate End Date',
    dataIndex: 'estimateEndDate',
    sorter: (a, b) => a.estimateEndDate.localeCompare(b.estimateEndDate),
  },
  {
    title: 'Actual Start Date',
    dataIndex: 'actualStartDate',
    sorter: (a, b) => a.actualStartDate.localeCompare(b.actualStartDate),
  },
  {
    title: 'Actual End Date',
    dataIndex: 'actualEndDate',
    sorter: (a, b) => a.actualEndDate.localeCompare(b.actualEndDate),
  },
  {
    title: 'Action',
    dataIndex: 'action',
    render: (_, record) => (
      <Space size="middle">
        <Link to={`/task/edit/${record.key}`}>
          <Button className="custom-edit-btn">
            <FormOutlined style={{ marginRight: 5 }} />
            Edit
          </Button>
        </Link>
      </Space>
    ),
  },
];

const statusOptions = [
  { value: 0, label: 'OPEN' },
  { value: 1, label: 'IN PROGRESS' },
  { value: 2, label: 'FINISHED' },
  { value: 3, label: 'CLOSED' },
];

const statusMenu = [
  { value: '0', label: 'Open' },
  { value: '1', label: 'In Progress' },
  { value: '2', label: 'Finished' },
  { value: '3', label: 'Close' },
  { value: '4', label: 'All' },
];

const TaskList = () => {
  const [taskLists, setTaskLists] = useState([]);
  const [data, setData] = useState([]);
  const [isFetchingData, setIsFetchingData] = useState(false);
  const { handleNetworkError } = useNetworkError();

  const onSearch = (values) => {
    const { title, projectName, assignedMember, status } = values;

    const lowerCaseTitle = title?.toLowerCase().trim();
    const lowerCaseProjectName = projectName?.toLowerCase().trim();
    const lowerCaseAssignedMember = assignedMember?.toLowerCase().trim();
    const statusString = status?.toString();

    const filteredResult = data.filter((task) => {
      return (
        (!title || task.title.toLowerCase().trim().includes(lowerCaseTitle)) &&
        (!projectName || task.projectName.toLowerCase().trim().includes(lowerCaseProjectName)) &&
        (!assignedMember || task.assignedEmployee.toLowerCase().trim().includes(lowerCaseAssignedMember)) &&
        (!status || statusString === '4' || task.status.toString() === statusString)
      );
    });

    setTaskLists(filteredResult);
  };

  const fetchTasks = async () => {
    try {
      const currentUser = getUser();
      let temp = 1;
      setIsFetchingData(true);

      const res = await taskApi.getAll();
      const tasks = res.data.result.map((task) => ({
        id: temp++,
        key: task._id,
        title: task.title,
        description: task.description,
        assignedEmployee: task.employee?.employeeName || '-',
        projectName: task.project?.projectName || '-',
        estimateHour: task.estimateHour || '-',
        status: statusOptions.find((option) => option.value === task.status)?.value,
        estimateStartDate: task.estimateStartDate ? dayjs(task.estimateStartDate).format('YYYY-MM-DD') : '-',
        estimateEndDate: task.estimateEndDate ? dayjs(task.estimateEndDate).format('YYYY-MM-DD') : '-',
        actualHour: task.actualHour || '-',
        actualStartDate: task.actualStartDate ? dayjs(task.actualStartDate).format('YYYY-MM-DD') : '-',
        actualEndDate: task.actualEndDate ? dayjs(task.actualEndDate).format('YYYY-MM-DD') : '-',
      }));

      if (currentUser.position !== 0) {
        const result = tasks.filter((row) => row.assignedEmployee === currentUser.employeeName);
        setTaskLists(result);
        setData(result);
      } else {
        setTaskLists(tasks);
        setData(tasks);
      }
    } catch (error) {
      if (error?.code === 'ERR_NETWORK') {
        handleNetworkError();
      }
    } finally {
      setIsFetchingData(false);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  return (
    <>
      <Form
        layout="horizontal"
        initialValues={{ status: '4' }}
        onFinish={onSearch}
        style={{ marginBottom: '20px' }}
      >
        <Row gutter={[16, 16]}>
          <Col xs={24}>
            <Form.Item name="status">
              <Select
                className="search-select"
                style={{
                  width: 120,
                }}
                options={statusMenu}
              />
            </Form.Item>
          </Col>
          <Col xs={24}>
            <Row gutter={16} align="middle">
              <Col xs={24} sm={24} md={24} lg={24} xl={12}>
                <Row gutter={16}>
                  <Col xs={24} sm={24} md={8} lg={8} xl={8}>
                    <Form.Item name="title">
                      <Input className="search-input" placeholder="Task Title" />
                    </Form.Item>
                  </Col>

                  <Col xs={24} sm={24} md={8} lg={8} xl={8}>
                    <Form.Item name="projectName">
                      <Input className="search-input" placeholder="Project Name" />
                    </Form.Item>
                  </Col>

                  <Col xs={24} sm={24} md={8} lg={8} xl={8}>
                    <Form.Item name="assignedMember">
                      <Input className="search-input" placeholder="Assigned member" />
                    </Form.Item>
                  </Col>
                </Row>
              </Col>

              <Col xs={24} sm={24} md={24} lg={24} xl={12}>
                <Row style={{ justifyContent: 'space-between' }}>
                  <Col className="flex-col">
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
                        onClick={() => setTaskLists(data)}
                      >
                        Clear
                      </Button>
                    </Form.Item>
                  </Col>

                  <Col className="flex-col">
                    <ExcelDownloadButton
                      data={taskLists}
                      fileName="task-list"
                      statusOptions={statusOptions}
                    />

                    <Link to="/task/add">
                      <Button className="custom-primary-btn" icon={<PlusOutlined />}>
                        Add New Task
                      </Button>
                    </Link>
                  </Col>
                </Row>
              </Col>
            </Row>
          </Col>
        </Row>
      </Form>

      <Table
        columns={columns}
        dataSource={taskLists}
        loading={isFetchingData}
        scroll={{
          x: 2000,
        }}
        pagination={{
          pageSize: 5,
        }}
      />
    </>
  );
};

export default TaskList;
