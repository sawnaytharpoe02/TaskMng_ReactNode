import { useContext, useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { Row, Col, Typography, Table, Tag, Button, Form } from 'antd';
import { FormOutlined } from '@ant-design/icons';
import { AiOutlineIdcard, AiOutlineProject } from 'react-icons/ai';
import { GoTasklist } from 'react-icons/go';
import { TbReportAnalytics } from 'react-icons/tb';
import dayjs from 'dayjs';
import { employeeApi, projectApi, reportApi, taskApi } from '../../services/apiServices';
import MenuContext from '../../context/menuContext';
import { useNetworkError } from '../../context/networkErrContext';
import { getUser, removeToken, removeUser } from '../../utils/storage';
import './dashboard.scss';
import VerifyContext from '../../context/verifyContext';

const columns = [
  {
    title: 'ID',
    dataIndex: 'id',
    SortOrder: 'ascend',
    sorter: (a, b) => a.id - b.id,
  },
  {
    title: 'Title',
    dataIndex: 'title',
    width: '14%',
  },
  {
    title: 'Description',
    dataIndex: 'description',
    width: '20%',
  },
  {
    title: 'Project Name',
    dataIndex: 'projectName',
  },
  {
    title: 'Assigned Employee',
    dataIndex: 'assignedEmployee',
  },
  {
    title: 'Estimate Hours',
    dataIndex: 'estimateHours',
  },
  {
    title: 'Actual Hours',
    dataIndex: 'actualHours',
  },
  {
    title: 'Status',
    dataIndex: 'status',
    sorter: (a, b) => a.status - b.status,
    render: (status) => {
      let color;
      let backgroundColor;
      let statusString;
      switch (status) {
        case 0:
          color = '#0958d9';
          backgroundColor = '#0000ff2e';
          statusString = 'OPEN';
          break;
        case 1:
          color = '#faad14';
          backgroundColor = '#f2f21026';
          statusString = 'IN PROGRESS';
          break;
        case 2:
          color = '#52c41a';
          backgroundColor = '#09e0094d';
          statusString = 'FINISH';
          break;
      }
      return (
        <Tag
          style={{
            color: color,
            backgroundColor: backgroundColor,
            minWidth: '6.5rem',
            height: '2rem',
            lineHeight: '2rem',
            textAlign: 'center',
          }}
          bordered={false}
        >
          {statusString}
        </Tag>
      );
    },
  },
  {
    title: 'Estimate Start Date',
    dataIndex: 'estimateStartDate',
    width: '10%',
  },
  {
    title: 'Estimate End Date',
    dataIndex: 'estimateEndDate',
    width: '10%',
  },
  {
    title: 'Actual Start Date',
    dataIndex: 'actualStartDate',
    width: '10%',
  },
  {
    title: 'Actual End Date',
    dataIndex: 'actualEndDate',
    width: '10%',
  },
  {
    title: 'Action',
    dataIndex: 'action',
    render: (_, record) => (
      <Link to={`/task/edit/${record.key}`}>
        <Button className="custom-edit-btn">
          <FormOutlined style={{ marginRight: 5 }} />
          Edit
        </Button>
      </Link>
    ),
  },
];

const statusOptions = [
  { value: 0, label: 'OPEN' },
  { value: 1, label: 'IN PROGRESS' },
  { value: 2, label: 'FINISHED' },
  { value: 3, label: 'CLOSED' },
];

const Dashboard = () => {
  const { id } = useParams();
  const { setCurrentMenuItem } = useContext(MenuContext);
  const { setVerifyEmail } = useContext(VerifyContext);
  const [isGettingTasks, setIsGettingTasks] = useState(false);
  const [taskData, setTaskData] = useState([]);
  const [dataCount, setDataCount] = useState({
    employees: 0,
    projects: 0,
    tasks: 0,
    reports: 0,
  });
  const [form] = Form.useForm();
  const userData = getUser();
  const navigate = useNavigate();

  const { handleNetworkError } = useNetworkError();

  const handleMenuChange = (path) => {
    setCurrentMenuItem(path);
  };

  const fetchTaskLists = async () => {
    try {
      let temp = 1;
      setIsGettingTasks(true);

      const res = await taskApi.getAll();
      const tasks = (res.data?.result || [])
        .filter((task) => task?.status !== 3)
        .map((task) => ({
          ...task,
          id: temp++,
          key: task._id,
          assignedEmployee: task.employee?.employeeName || '-',
          projectName: task.project?.projectName,
          estimateHours: task.estimateHour || '-',
          actualHours: task.actualHour || '-',
          status: statusOptions.find((option) => option.value === task.status)?.value,
          estimateStartDate: task.estimateStartDate
            ? dayjs(task.estimateStartDate).format('YYYY-MM-DD')
            : '-',
          estimateEndDate: task.estimateEndDate ? dayjs(task.estimateEndDate).format('YYYY-MM-DD') : '-',
          actualStartDate: task.actualStartDate ? dayjs(task.actualStartDate).format('YYYY-MM-DD') : '-',
          actualEndDate: task.actualEndDate ? dayjs(task.actualEndDate).format('YYYY-MM-DD') : '-',
        }));

      if (userData.position !== 0) {
        const result = tasks.filter((row) => row.assignedEmployee === userData.employeeName);
        setTaskData(result);
      } else {
        setTaskData(tasks);
      }
      setDataCount((prevDataCount) => ({
        ...prevDataCount,
        tasks: res.data.result.length,
      }));
    } catch (error) {
      const { response, code } = error;
      if (
        response &&
        error.response.status === 500 &&
        error.response.data.message === 'Tokenization error!: jwt expired'
      ) {
        removeToken();
        removeUser();
        navigate('/login');
      } else if (code && code === 'ERR_NETWORK') {
        handleNetworkError();
      }
    } finally {
      setIsGettingTasks(false);
    }
  };

  const fetchDataCounts = async () => {
    try {
      const [employeesRes, projectsRes, reportsRes] = await Promise.all([
        employeeApi.getAll(),
        projectApi.getAll(),
        reportApi.getAll(),
      ]);

      setDataCount((prevDataCount) => ({
        ...prevDataCount,
        employees: employeesRes.data.result.length,
        projects: projectsRes.data.result.length,
        reports: reportsRes.data.result.length,
      }));
    } catch (error) {
      const { response, code } = error;
      if (
        response &&
        error.response.status === 500 &&
        error.response.data.message === 'Tokenization error!: jwt expired'
      ) {
        removeToken();
        removeUser();
        navigate('/login');
      } else if (code && code === 'ERR_NETWORK') {
        handleNetworkError();
      }
    }
  };

  useEffect(() => {
    if (id) {
      taskApi.getOne(id).then((res) => {
        const task = res.data.result;
        form.setFieldsValue({
          project: task.project.projectName,
          title: task.title,
          description: task.description,
          employee: task.employee.employeeName,
          estimateHour: task.estimateHour,
          estimateStartDate: task.estimateStartDate ? dayjs(task.estimateStartDate) : '',
          estimateEndDate: task.estimateEndDate ? dayjs(task.estimateEndDate) : '',
          status: statusOptions.find((option) => option.value === task.status)?.value,
        });
      });
    }
  }, [id]);

  useEffect(() => {
    fetchTaskLists();
    fetchDataCounts();
    setVerifyEmail(false);
  }, []);

  return (
    <>
      <Row className="dashboard" justify="center">
        {userData?.position === 0 && (
          <>
            <Col className="dashboard_col" xs={24} sm={12} md={12} xl={6}>
              <Link to="/employee/list" onClick={() => handleMenuChange('/employee/list')}>
                <div className="dashboard_col-item employee">
                  <AiOutlineIdcard className="icon" />
                  <div className="dashboard_col-content">
                    <p className="title">Employees</p>
                    <div className="badge">{dataCount.employees}</div>
                  </div>
                </div>
              </Link>
            </Col>
            <Col className="dashboard_col" xs={24} sm={12} md={12} xl={6}>
              <Link to="/project/list" onClick={() => handleMenuChange('/project/list')}>
                <div className="dashboard_col-item projects">
                  <AiOutlineProject className="icon" />
                  <div className="dashboard_col-content">
                    <p className="title">Projects</p>
                    <div className="badge">{dataCount.projects}</div>
                  </div>
                </div>
              </Link>
            </Col>
          </>
        )}
        <Col className="dashboard_col" xs={24} sm={12} md={12} xl={6}>
          <Link to="/task/list" onClick={() => handleMenuChange('/task/list')}>
            <div className="dashboard_col-item tasks">
              <GoTasklist className="icon" />
              <div className="dashboard_col-content">
                <p className="title">Tasks</p>
                <div className="badge">{dataCount.tasks}</div>
              </div>
            </div>
          </Link>
        </Col>
        <Col className="dashboard_col" xs={24} sm={12} md={12} xl={6}>
          <Link to="/report/list" onClick={() => handleMenuChange('/report/list')}>
            <div className="dashboard_col-item report">
              <TbReportAnalytics className="icon" />
              <div className="dashboard_col-content">
                <p className="title">Reports</p>
                <div className="badge">{dataCount.reports}</div>
              </div>
            </div>
          </Link>
        </Col>
      </Row>
      <Typography className="table-title">Top Not Closed Tasks</Typography>
      <Table
        columns={columns}
        dataSource={taskData}
        loading={isGettingTasks}
        scroll={{
          x: 1500,
        }}
        pagination={{ pageSize: 5 }}
      />
      <Row justify="center" style={{marginTop: '1.2rem'}}>
        <Link to="task/list">
          <Button className="custom-primary-btn">View All Tasks</Button>
        </Link>
      </Row>
    </>
  );
};

export default Dashboard;
