import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import { Row, Col, Select, Form, Button, Table, Input, InputNumber, Modal } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import { MdDeleteOutline, MdEditDocument } from 'react-icons/md';
import { AiFillEye } from 'react-icons/ai';
import dayjs from 'dayjs';
import { employeeApi, notificationApi, reportApi, taskApi } from '../../services/apiServices';
import { useNetworkError } from '../../context/networkErrContext';
import { getUser } from '../../utils/storage';
import { socket } from '../../socket';
import './createReport.scss';

const { TextArea } = Input;

const ReportCommon = () => {
  const [dataSource, setDataSource] = useState([]);
  const [count, setCount] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedPerson, setSelectedPerson] = useState('');
  const [errors, setErrors] = useState([]);
  const [open, setOpen] = useState(false);
  const [problem, setProblem] = useState('');
  const [roleOptions, setRoleOptions] = useState([]);
  const [taskOptions, setTaskOptions] = useState([]);
  const [taskData, setTaskData] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { handleNetworkError } = useNetworkError();
  const userData = getUser();
  const curr_userName = userData?.employeeName?.replace(/\b\w/g, (char) => char.toUpperCase());

  const typesOptions = [
    { value: 'CD', label: 'CD' },
    { value: 'Test', label: 'Test' },
    { value: 'Review', label: 'Review' },
    { value: 'Bugfix', label: 'Bugfix' },
    { value: 'Learn', label: 'Learn' },
    { value: 'Meeting', label: 'Meeting' },
  ];

  const statusOptions = [
    { value: '0', label: 'Open' },
    { value: '1', label: 'In Progress' },
    { value: '2', label: 'Finish' },
    { value: '3', label: 'Close' },
  ];

  const columns = [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
    },
    {
      title: (
        <span style={{ fontWeight: '600' }}>
          Task ID
          <span style={{ color: 'red', marginLeft: '5px' }}>*</span>
        </span>
      ),
      dataIndex: 'taskId',
      key: 'taskId',
      render: (_, record) => {
        return (
          <Form>
            <Form.Item
              name="taskId"
              className="report-item"
              validateStatus={getError(record, 'taskId') ? 'error' : 'success'}
              help={getError(record, 'taskId')}
            >
              <Select
                style={{
                  width: '100%',
                }}
                options={taskOptions}
                onChange={(e) => {
                  handleChangeTask(e, record);
                  handleSelectChange(e, 'taskId', record.key);
                  removeError(record, 'taskId');
                }}
                placeholder="Select Task ID"
              />
            </Form.Item>
          </Form>
        );
      },
    },
    {
      title: 'Task Title',
      dataIndex: 'taskTitle',
      key: 'taskTitle',
      render: (_, record) => {
        return (
          <Form>
            <Form.Item className="report-item">
              <Input disabled value={record.taskTitle ? record.taskTitle : ''}></Input>
            </Form.Item>
          </Form>
        );
      },
    },
    {
      title: 'Project',
      dataIndex: 'project',
      key: 'project',
      render: (_, record) => {
        return (
          <Form>
            <Form.Item className="report-item">
              <Input disabled value={record.project ? record.project : ''}></Input>
            </Form.Item>
          </Form>
        );
      },
    },
    {
      title: (
        <span style={{ fontWeight: '600' }}>
          Percentage
          <span style={{ color: 'red', marginLeft: '5px' }}>*</span>
        </span>
      ),
      dataIndex: 'percentage',
      key: 'percentage',
      render: (text, record) => (
        <Form>
          <Form.Item
            className="report-item"
            validateStatus={getError(record, 'percentage') ? 'error' : 'success'}
            help={getError(record, 'percentage')}
          >
            <InputNumber
              addonAfter="%"
              value={text}
              onChange={(e) => {
                handleInputChange(e, 'percentage', record.key);
                removeError(record, 'percentage');
              }}
            />
          </Form.Item>
        </Form>
      ),
    },
    {
      title: (
        <span style={{ fontWeight: '600' }}>
          Types
          <span style={{ color: 'red', marginLeft: '5px' }}>*</span>
        </span>
      ),
      dataIndex: 'types',
      key: 'types',
      width: '12%',
      render: (text, record) => (
        <Form>
          <Form.Item
            name="types"
            className="report-item"
            validateStatus={getError(record, 'types') ? 'error' : 'success'}
            help={getError(record, 'types')}
          >
            <Select
              value={text}
              options={typesOptions}
              onChange={(e) => {
                handleSelectChange(e, 'types', record.key);
                removeError(record, 'types');
              }}
              placeholder="Types"
            ></Select>
          </Form.Item>
        </Form>
      ),
    },
    {
      title: (
        <span style={{ fontWeight: '600' }}>
          Status
          <span style={{ color: 'red', marginLeft: '5px' }}>*</span>
        </span>
      ),
      dataIndex: 'status',
      key: 'status',
      width: '12%',
      render: (text, record) => (
        <Form>
          <Form.Item
            name="status"
            className="report-item"
            validateStatus={getError(record, 'status') ? 'error' : 'success'}
            help={getError(record, 'status')}
          >
            <Select
              value={text}
              options={statusOptions}
              onChange={(e) => {
                handleSelectChange(e, 'status', record.key);
                removeError(record, 'status');
              }}
              placeholder="Status"
            ></Select>
          </Form.Item>
        </Form>
      ),
    },
    {
      title: (
        <span style={{ fontWeight: '600' }}>
          Hour
          <span style={{ color: 'red', marginLeft: '5px' }}>*</span>
        </span>
      ),
      dataIndex: 'hour',
      key: 'hour',
      render: (text, record) => (
        <Form>
          <Form.Item
            className="report-item"
            validateStatus={getError(record, 'hour') ? 'error' : 'success'}
            help={getError(record, 'hour')}
          >
            <InputNumber
              value={text}
              addonAfter="hr"
              onChange={(e) => {
                handleInputChange(e, 'hour', record.key);
                removeError(record, 'hour');
              }}
            />
          </Form.Item>
        </Form>
      ),
    },
    {
      title: 'Actions',
      dataIndex: 'actions',
      key: 'actions',
      render: (_, record) =>
        dataSource.length >= 1 ? (
          <Button className="custom-danger-btn" onClick={() => handleDeleteRow(record.key)}>
            <MdDeleteOutline style={{ marginRight: '.5rem', fontSize: '1rem' }} />
            Remove
          </Button>
        ) : null,
    },
  ];

  const getError = (record, name) => {
    const error = errors.find((item) => {
      return item.key === record.key && item.field === name;
    });
    return error ? error.message : null;
  };

  const removeError = (record, name) => {
    let error;
    !record
      ? (error = errors.find((item) => item.field === name))
      : (error = errors.find((item) => {
          return item.key === record.key && item.field === name;
        }));

    if (error) {
      const index = errors.indexOf(error);
      if (index > -1) {
        errors.splice(index, 1);
      }
    }
  };

  // change title project based on task-id func
  const handleChangeTask = (e, record) => {
    const dataRow = dataSource.find((row) => row.key === record.key);
    const findValue = taskData.find((data) => data.key === e);
    if (findValue) {
      dataRow.taskTitle = findValue.taskTitle;
      dataRow.project = findValue.project;
    }

    const newDataSource = dataSource.map((d) => (d.key === dataRow.key ? dataRow : d));
    setDataSource(newDataSource);
  };

  const handleSelectChange = (value, field, record) => {
    setDataSource((prevData) => {
      const newData = prevData.map((item) => {
        if (item.key === record) {
          return {
            ...item,
            [field]: value,
          };
        }
        return item;
      });

      return newData;
    });
  };

  const handleInputChange = (value, field, record) => {
    const newData = dataSource.map((item) => {
      if (item.key === record) {
        return {
          ...item,
          [field]: String(value),
        };
      }
      return item;
    });

    setDataSource(newData);
  };

  // delete report list row func
  const handleDeleteRow = (key) => {
    const newData = dataSource.filter((item) => item.key !== key);
    setDataSource(newData);
  };

  // add report list row func
  const handleAddRow = () => {
    const newData = {
      key: count,
      id: count,
      taskId: '',
      taskTitle: '',
      project: '',
      percentage: '',
      types: '',
      status: '',
      hour: '',
    };

    setDataSource([...dataSource, newData]);
    setCount(count + 1);
  };

  // show modal func
  const showModal = (type, title, content) => {
    Modal[type]({
      title,
      content,
      centered: true,
      onOk: () => (type === 'success' ? navigate('/report/list') : setIsModalOpen(false)),
    });
  };

  const fetchRoles = async () => {
    try {
      const res = await employeeApi.getAll();
      const employeeData = res.data?.result
        .filter((e) => e.position !== 1)
        .map((employee) => ({
          value: employee._id,
          label: employee.employeeName,
        }));
      setRoleOptions(employeeData);
    } catch (error) {
      if (error?.code === 'ERR_NETWORK') {
        handleNetworkError();
      }
    }
  };

  const fetchTasks = async () => {
    try {
      const res = await taskApi.getAll();
      const taskIdOptionData = res.data.result.map((task, index) => ({
        value: task._id,
        label: index + 1,
      }));

      const taskIdSelectedData = res.data.result.map((task) => ({
        key: task._id,
        taskTitle: task?.title,
        project: task.project?.projectName,
      }));

      setTaskOptions(taskIdOptionData);
      setTaskData(taskIdSelectedData);
    } catch (error) {
      if (error?.code === 'ERR_NETWORK') {
        handleNetworkError();
      }
    }
  };

  useEffect(() => {
    fetchRoles();
    fetchTasks();
  }, []);

  // submit handle func
  const handleSubmit = async () => {
    try {
      const totalHour = dataSource.reduce((acc, row) => acc + Number(row.hour), 0);

      const newErrors = dataSource
        .map((report) => {
          const errors = [];

          if (!selectedPerson) {
            errors.push({ key: 'reportTo', field: 'reportTo', message: 'Select a person.' });
          }
          if (!report.taskId) {
            errors.push({ key: report.key, field: 'taskId', message: 'Task ID is required.' });
          }
          if (report.percentage.length === 0 || report.percentage === 'null') {
            errors.push({ key: report.key, field: 'percentage', message: 'Percentage is required.' });
          }
          if (report.percentage < 0) {
            errors.push({
              key: report.key,
              field: 'percentage',
              message: 'Percentage cannot be less than 0.',
            });
          }
          if (report.percentage > 100) {
            errors.push({
              key: report.key,
              field: 'percentage',
              message: 'Percentage cannot be greater than 100.',
            });
          }
          if (!report.types) {
            errors.push({ key: report.key, field: 'types', message: 'Types is required.' });
          }
          if (!report.status) {
            errors.push({ key: report.key, field: 'status', message: 'Status is required.' });
          }
          if (report.hour === '' || report.hour === 'null') {
            errors.push({ key: report.key, field: 'hour', message: 'Hour is required.' });
          }
          if (report.hour < 0) {
            errors.push({
              key: report.key,
              field: 'hour',
              message: 'Hour must not be less than 0.',
            });
          }

          return errors;
        })
        .flat();

      setErrors(newErrors);
      if (dataSource.length === 0) {
        return showModal('error', 'Error', 'Create report failed.');
      }

      if (newErrors.length > 0) return;

      if (totalHour !== 8) {
        showModal('error', 'Error', 'Total hour must be 8 hours.');
        return;
      }

      const payload = dataSource?.map((row) => ({
        reportTo: roleOptions.find((role) => role.value === selectedPerson)?.label,
        task: row.taskId,
        projectName: row.project,
        taskTitle: row.taskTitle,
        percentage: row.percentage,
        types: row.types,
        status: row.status,
        hour: row.hour,
        problem_feeling: problem ? problem : null,
        reportBy: curr_userName,
      }));

      setLoading(true);
      const reportResponse = await reportApi.add(payload);
      const notificationPayload = reportResponse.data?.result.map((row) => ({
        tag: 'REPORT',
        createdByWhom: userData._id,
        profile: userData?.profilePhoto,
        sendTo: selectedPerson,
        message: `
        <span class="report-by">${row.reportBy}</span> reported on
        <span class="project-name"> ${row.projectName} </span> &
        <span class="task-title">${row.taskTitle} </span>
        <span class="types">(${row.types})</span>
       `,
      }));

      const notificationResponse = await notificationApi.add(notificationPayload);
      socket.emit('reportCreated', notificationResponse.data?.result);

      navigate('/report/list');
    } catch (error) {
      if (error?.code === 'ERR_NETWORK') {
        handleNetworkError();
      }
    } finally {
      setLoading(false);
    }
    showModal('success', 'Success', 'Create report successfully.');
  };

  return (
    <>
      <Form layout="horizontal" style={{ marginBottom: '20px' }}>
        <Row gutter={[16, 16]} style={{ marginBottom: '1.1rem' }}>
          <Col xs={24} sm={12} xl={10}>
            <Form.Item
              label={
                <span>
                  Report To
                  <span style={{ color: 'red', marginLeft: '5px' }}>*</span>
                </span>
              }
              justify="space-between"
              name="admin"
              validateStatus={errors.find((error) => error.field === 'reportTo') ? 'error' : ''}
              help={errors.find((error) => error.field === 'reportTo')?.message}
            >
              <Select
                style={{
                  width: '100%',
                }}
                options={roleOptions}
                placeholder="Select a Person"
                onChange={(e) => {
                  setSelectedPerson(e);
                  removeError(null, 'reportTo');
                }}
              />
            </Form.Item>
          </Col>
          <Col
            xs={24}
            sm={12}
            xl={14}
            style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center' }}
          >
            <Form.Item>
              <Button className="custom-primary-btn" icon={<PlusOutlined />} onClick={handleAddRow}>
                Add Report
              </Button>
            </Form.Item>
          </Col>
        </Row>
      </Form>

      <Table
        bordered
        columns={columns}
        dataSource={dataSource}
        scroll={{
          x: 1400,
        }}
        pagination={{ pageSize: 5 }}
      />

      <Form>
        <Row>
          <Col xs={24} sm={24} md={14} xl={8} style={{ marginBottom: '1rem' }}>
            <Form.Item label="Problem" style={{ marginTop: '2.2rem' }}>
              <TextArea
                placeholder="Problem"
                autoSize={{
                  minRows: 6,
                  maxRows: 6,
                }}
                onChange={(e) => {
                  setProblem(e.target.value);
                }}
              />
            </Form.Item>
          </Col>
        </Row>
        <Row>
          <Col xs={24} style={{ display: 'flex', justifyContent: 'center', gap: '1.2rem' }}>
            <Form.Item>
              <Button
                className="custom-success-btn"
                icon={<AiFillEye style={{ fontSize: '1rem' }} />}
                onClick={() => setOpen(true)}
              >
                Preview
              </Button>
            </Form.Item>

            <Modal
              title="Report Preview"
              centered
              open={open}
              onOk={() => setOpen(false)}
              onCancel={() => setOpen(false)}
              width={400}
              footer={[
                <Button className="custom-danger-btn" key="back" onClick={() => setOpen(false)}>
                  Close
                </Button>,
              ]}
            >
              <br />

              <div style={{ display: 'flex', flexDirection: 'column', gap: '.9rem' }}>
                <p>
                  Report To :{' '}
                  <span className="fw-600">
                    {roleOptions.find((row) => row.value === selectedPerson)?.label || ''}
                  </span>
                </p>
                <p>
                  Date : <span className="fw-600">{dayjs(new Date()).format('YYYY-MM-DD')}</span>
                </p>
                <p>
                  Name : <span className="fw-600">Admin</span>
                </p>

                <p>
                  Projects :{' '}
                  {dataSource?.map((row) => (
                    <span key={row.key} className="fw-600">
                      {row.project},
                    </span>
                  ))}
                </p>

                <p>【実績】</p>
                {dataSource?.map((row) => (
                  <div key={row.key}>
                    <p className="fw-600">
                      - {row.taskTitle}, &lt;{row.percentage}%&gt;, &lt;{row.types}&gt;, &lt;
                      {statusOptions.find((status) => status.value === row.status.toString())?.label}
                      &gt;, &lt;{row.hour}hour&gt;
                    </p>
                  </div>
                ))}
                <p>【実績】</p>
                <p>
                  {' '}
                  Problem, Feeling - <span className="fw-600">{problem || 'Nothing'}</span>
                </p>
              </div>
            </Modal>

            <Form.Item>
              <Button
                className="custom-primary-btn"
                htmlType="submit"
                icon={<MdEditDocument style={{ fontSize: '1rem' }} />}
                onClick={handleSubmit}
                loading={loading}
              >
                Report
              </Button>
            </Form.Item>
          </Col>
        </Row>
      </Form>

      <Modal
        title={dataSource.length === 0 ? 'Error' : 'Success'}
        open={isModalOpen}
        onOk={() => setIsModalOpen(false)}
        onCancel={() => setIsModalOpen(false)}
      >
        {dataSource.length === 0 ? 'Created report failed.' : 'Created report successfully.'}
      </Modal>
    </>
  );
};

export default ReportCommon;
