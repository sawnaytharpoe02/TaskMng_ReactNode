import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button, Col, Form, Input, Row, Table, Space, Tag, message } from 'antd';
import {
  SearchOutlined,
  CloseOutlined,
  PlusOutlined,
  ContactsOutlined,
  FormOutlined,
  DeleteOutlined,
} from '@ant-design/icons';
import dayjs from 'dayjs';
import { employeeApi, taskApi } from '../../services/apiServices';
import { LazyLoadImage } from 'react-lazy-load-image-component';
import { useNetworkError } from '../../context/networkErrContext';
import CommonModal from '../../components/CommonModal/CommonModal';
import showDeleteConfirm from '../../components/CommonDialog/CommonDialog';
import 'react-lazy-load-image-component/src/effects/blur.css';
import './employeeList.scss';
import { getUser } from '../../utils/storage';

const EmployeeList = () => {
  const [employeeLists, setEmployeeLists] = useState([]);
  const [taskLists, setTaskLists] = useState([]);
  const [data, setData] = useState([]);
  const [searchForm] = Form.useForm();
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const { handleNetworkError } = useNetworkError();
  const [currentUser, setCurrentUser] = useState(null);
  const navigate = useNavigate();

  const handleShowModal = () => {
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };

  const fetchEmployees = async () => {
    try {
      let temp = 1;
      setLoading(true);

      const res = await employeeApi.getAll();
      const employees = res.data.result.map((employee) => ({
        ...employee,
        id: temp++,
        key: employee._id,
        phone: employee.phone !== 'null' ? employee.phone : '-',
        address: employee.address !== 'undefined' ? employee.address : '-',
        dob: employee.dateOfBirth !== 'undefined' ? dayjs(employee.dateOfBirth).format('YYYY-MM-DD') : '-',
        position: employee.position === 0 ? 'Admin' : 'Member',
      }));

      setEmployeeLists(employees);
      setData(employees);
    } catch (error) {
      if (error?.code === 'ERR_NETWORK') {
        handleNetworkError();
      }
    } finally {
      setLoading(false);
    }
  };

  const fetchTasks = async () => {
    try {
      const res = await taskApi.getAll();
      setTaskLists(res.data?.result);
    } catch (error) {
      if (error?.code === 'ERR_NETWORK') {
        handleNetworkError();
      }
    }
  };

  useEffect(() => {
    fetchEmployees();
    fetchTasks();
    setCurrentUser(getUser());
  }, []);

  const onSearch = (values) => {
    const { employeeName, employeeEmail } = values;
    let filteredResult = data;

    if (employeeName) {
      filteredResult = filteredResult.filter((employee) =>
        employee.employeeName.toLowerCase().trim().includes(employeeName.toLowerCase().trim())
      );
    }

    if (employeeEmail) {
      filteredResult = filteredResult.filter((employee) =>
        employee.email.toLowerCase().trim().includes(employeeEmail.toLowerCase().trim())
      );
    }
    setEmployeeLists(filteredResult);
  };

  const updateEmployeeList = (updatedList) => {
    setEmployeeLists(updatedList);
  };

  const handleEmployeeEdit = (key) => {
    const employeeToEdit = employeeLists?.find((employee) => employee._id === key);
    if (!employeeToEdit) {
      return;
    }
    if (employeeToEdit.position === 'Admin') {
      if (employeeToEdit._id !== currentUser?._id) {
        return message.error("You are not authorized to edit other admin's information!");
      }
    }
    navigate(`/employee/edit/${key}`);
  };

  const defaultProfile = '';

  const columns = [
    {
      title: 'ID',
      dataIndex: 'id',
      width: '3%',
      SortOrder: 'ascend',
      sorter: (a, b) => a.id - b.id,
    },
    {
      title: 'Employee Name',
      dataIndex: 'employeeName',
      sorter: (a, b) => a.employeeName.localeCompare(b.employeeName),
    },
    {
      title: 'Email',
      dataIndex: 'email',
    },
    {
      title: 'Profile Photo',
      dataIndex: 'profilePhoto',
      render: (profilePhoto) => (
        <LazyLoadImage src={profilePhoto ? profilePhoto : defaultProfile} effect="blur" className="avatar" />
      ),
    },
    {
      title: 'Address',
      dataIndex: 'address',
    },
    {
      title: 'Phone',
      dataIndex: 'phone',
    },
    {
      title: 'Position',
      dataIndex: 'position',
    },
    {
      title: 'Date Of Birth',
      dataIndex: 'dob',
      width: '8%',
      sorter: (a, b) => a.dob.localeCompare(b.dob),
    },
    {
      title: 'Verified',
      dataIndex: 'verified',
      render: (verified) => {
        switch (verified) {
          case true:
            return (
              <Tag color="green" className="verified-tag">
                Verified
              </Tag>
            );
          case false:
            return (
              <Tag color="red" className="verified-tag">
                Not Verified
              </Tag>
            );
        }
      },
    },
    {
      title: 'Action',
      dataIndex: 'action',
      render: (_, record) => (
        <Space size="middle">
          <Link to={`/employee/detail/${record.key}`}>
            <Button className="custom-primary-btn">
              <ContactsOutlined style={{ marginRight: 5 }} />
              Detail
            </Button>
          </Link>

          <Button className="custom-edit-btn" onClick={() => handleEmployeeEdit(record.key)}>
            <FormOutlined style={{ marginRight: 5 }} />
            Edit
          </Button>

          <Link>
            <Button
              className="custom-danger-btn"
              onClick={() =>
                showDeleteConfirm(
                  'employee',
                  employeeApi,
                  'delete',
                  record.key,
                  updateEmployeeList,
                  taskLists,
                  handleShowModal
                )
              }
            >
              <DeleteOutlined style={{ marginRight: 5 }} />
              Delete
            </Button>
          </Link>
        </Space>
      ),
    },
  ];

  return (
    <>
      <Form form={searchForm} layout="horizontal" onFinish={onSearch} style={{ marginBottom: '20px' }}>
        <Row gutter={16} align="middle">
          <Col xs={24} sm={24} md={24} lg={12} xl={10}>
            <Row gutter={16}>
              <Col xs={24} sm={24} md={12} lg={12} xl={12}>
                <Form.Item name="employeeName">
                  <Input className="search-input" placeholder="Employee Name" />
                </Form.Item>
              </Col>

              <Col xs={24} sm={24} md={12} lg={12} xl={12}>
                <Form.Item name="employeeEmail">
                  <Input className="search-input" placeholder="Employee Email" />
                </Form.Item>
              </Col>
            </Row>
          </Col>

          <Col xs={24} sm={24} md={24} lg={12} xl={14}>
            <Row style={{ justifyContent: 'space-between' }}>
              <Space size={'middle'}>
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
                    onClick={() => setEmployeeLists(data)}
                  >
                    Clear
                  </Button>
                </Form.Item>
              </Space>

              <Link to="/employee/add">
                <Button className="custom-primary-btn" htmlType="reset" icon={<PlusOutlined />}>
                  Add New Employee
                </Button>
              </Link>
            </Row>
          </Col>
        </Row>
      </Form>

      <CommonModal
        open={showModal}
        title="Error"
        message="Cannot delete employee. There are tasks assigned to this employee."
        onClose={handleCloseModal}
      />

      <Table
        columns={columns}
        dataSource={employeeLists}
        loading={loading}
        scroll={{
          x: 1600,
        }}
        pagination={{
          pageSize: 5,
        }}
      />
    </>
  );
};

export default EmployeeList;
