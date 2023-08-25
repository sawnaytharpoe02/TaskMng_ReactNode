import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Form, Row, Col, Input, Space, Button, Table } from 'antd';
import { SearchOutlined, CloseOutlined, PlusOutlined, DeleteOutlined, FormOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';
import { projectApi, taskApi } from '../../services/apiServices';
import { useNetworkError } from '../../context/networkErrContext';
import CommonModal from '../../components/CommonModal/CommonModal';
import showDeleteConfirm from '../../components/CommonDialog/CommonDialog';

const ProjectList = () => {
  const [projectLists, setProjectLists] = useState([]);
  const [taskLists, setTaskLists] = useState([]);
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const { handleNetworkError } = useNetworkError();

  const handleShowModal = () => {
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };

  const fetchProjects = async () => {
    try {
      let temp = 1;
      setLoading(true);

      const res = await projectApi.getAll();
      const projects = res.data.result.map((project) => ({
        ...project,
        id: temp++,
        key: project._id,
        description: project.description || '-',
        startDate: dayjs(project.startDate).format('YYYY-MM-DD'),
        endDate: dayjs(project.endDate).format('YYYY-MM-DD'),
      }));

      setProjectLists(projects);
      setData(projects);
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
    fetchProjects();
    fetchTasks();
  }, []);

  const onSearch = (values) => {
    const { projectName, projectLanguage } = values;
    let filteredResult = projectLists;

    if (projectName) {
      filteredResult = filteredResult.filter((project) =>
        project.projectName.toLowerCase().trim().includes(projectName.toLowerCase().trim())
      );
    }

    if (projectLanguage) {
      filteredResult = filteredResult.filter((project) =>
        project.language.toLowerCase().trim().includes(projectLanguage.toLowerCase().trim())
      );
    }

    setProjectLists(filteredResult);
  };

  const updateProjectList = (updatedList) => {
    setProjectLists(updatedList);
  };

  const columns = [
    {
      title: 'ID',
      dataIndex: 'id',
      width: '3%',
      SortOrder: 'ascend',
      sorter: (a, b) => a.id - b.id,
    },
    {
      title: 'Project Name',
      dataIndex: 'projectName',
      sorter: (a, b) => a.projectName.localeCompare(b.projectName),
    },
    {
      title: 'Language',
      dataIndex: 'language',
      sorter: (a, b) => a.language.localeCompare(b.language),
    },
    {
      title: 'Description',
      dataIndex: 'description',
      width: '28%',
    },
    {
      title: 'Start Date',
      dataIndex: 'startDate',
      sorter: (a, b) => a.startDate.localeCompare(b.startDate),
      width: '10%',
    },
    {
      title: 'End Date',
      dataIndex: 'endDate',
      width: '10%',
      sorter: (a, b) => a.endDate.localeCompare(b.endDate),
    },
    {
      title: 'Action',
      dataIndex: 'action',
      render: (_, record) => (
        <Space size="middle">
          <Link to={`/project/edit/${record.key}`}>
            <Button className="custom-edit-btn">
              <FormOutlined style={{ marginRight: 5 }} />
              Edit
            </Button>
          </Link>
          <Link>
            <Button
              className="custom-danger-btn"
              onClick={() =>
                showDeleteConfirm(
                  'project',
                  projectApi,
                  'delete',
                  record.key,
                  updateProjectList,
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
      <Form layout="horizontal" onFinish={onSearch} style={{ marginBottom: '20px' }}>
        <Row gutter={16} align="middle">
          <Col xs={24} sm={24} md={24} lg={12} xl={10}>
            <Row gutter={16}>
              <Col xs={24} sm={24} md={12} lg={12} xl={12}>
                <Form.Item name="projectName">
                  <Input className="search-input" placeholder="Project Name" />
                </Form.Item>
              </Col>

              <Col xs={24} sm={24} md={12} lg={12} xl={12}>
                <Form.Item name="projectLanguage">
                  <Input className="search-input" placeholder="Project Language" />
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
                    onClick={() => setProjectLists(data)}
                  >
                    Clear
                  </Button>
                </Form.Item>
              </Space>

              <Link to="/project/add">
                <Button className="custom-primary-btn" htmlType="reset" icon={<PlusOutlined />}>
                  Add New Project
                </Button>
              </Link>
            </Row>
          </Col>
        </Row>
      </Form>

      <CommonModal
        open={showModal}
        title="Error"
        message="Cannot delete project. There are tasks assigned to this project."
        onClose={handleCloseModal}
      />

      <Table
        columns={columns}
        dataSource={projectLists}
        loading={loading}
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

export default ProjectList;
