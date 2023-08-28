import { useEffect, useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router';
import { Form, Input, DatePicker, Row, Col, Button, Select, Card, InputNumber, message, Spin } from 'antd';
import { RollbackOutlined, SaveOutlined, EditOutlined, DiffOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';
import localeDate from 'dayjs/plugin/localeData';
import weeekday from 'dayjs/plugin/weekday';
import { employeeApi, projectApi, taskApi, notificationApi } from '../../services/apiServices';
import { socket } from '../../socket';
import { MESSAGE } from '../../constants/validate';
import { useNetworkError } from '../../context/networkErrContext';
import { getUser } from '../../utils/storage';
import './taskCommon.scss';

dayjs.extend(weeekday);
dayjs.extend(localeDate);

const TaskCommon = () => {
  const { id } = useParams();
  const [form] = Form.useForm();
  const [pageName, setPageName] = useState(null);
  const [employeeOptions, setEmployeeOptions] = useState([]);
  const [projectOptions, setProjectOptions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isFetchingDetail, setIsFetchingDetail] = useState(false);
  const navigate = useNavigate();
  let { pathname } = useLocation();
  const { handleNetworkError } = useNetworkError();
  const currentUser = getUser();

  useEffect(() => {
    if (pathname.includes('add')) {
      setPageName('Add');
      form.resetFields();
    } else if (pathname.includes('edit')) {
      setPageName('Edit');
    }
  }, [pathname]);

  const statusOptions = [
    { value: 0, label: 'OPEN' },
    { value: 1, label: 'IN PROGRESS' },
    { value: 2, label: 'FINISHED' },
    { value: 3, label: 'CLOSED' },
  ];

  const permissionStatusOptions = statusOptions.map((row) =>
    row.value === 3 ? { ...row, disabled: true } : row
  );

  // custom validate hour
  const validateHour = (_, value) => {
    if (value < 0) {
      return Promise.reject(new Error(MESSAGE.HOUR_NUMBER_VALIDATE));
    }
    if (value > 50) {
      return Promise.reject(new Error(MESSAGE.HOUR_MAX_LENGTH_VALIDATE));
    }
    return Promise.resolve();
  };

  // custom validate for estimate end date
  const validateEstimateEndDate = (_, value) => {
    const eStartDate = form.getFieldValue('estimateStartDate');

    if (value && eStartDate && value.isBefore(eStartDate)) {
      return Promise.reject('Estimate End date cannot be less than estimate start date');
    }

    return Promise.resolve();
  };

  // custom validate for actual end date
  const validateActualEndDate = (_, value) => {
    const aStartDate = form.getFieldValue('actualStartDate');

    if (aStartDate && value && value.isBefore(aStartDate)) {
      return Promise.reject('Actual End date must be greater than start date');
    }

    return Promise.resolve();
  };

  const fetchEmployees = async () => {
    try {
      const res = await employeeApi.getAll();
      const employeeData = res.data.result.map((employee) => ({
        value: employee._id,
        label: employee.employeeName,
      }));
      setEmployeeOptions(employeeData);
    } catch (error) {
      if (error?.code === 'ERR_NETWORK') {
        handleNetworkError();
      }
    }
  };

  const fetchProjects = async () => {
    try {
      const res = await projectApi.getAll();
      const projectData = res.data.result.map((project) => ({
        value: project._id,
        label: project.projectName,
      }));
      setProjectOptions(projectData);
    } catch (error) {
      if (error?.code === 'ERR_NETWORK') {
        handleNetworkError();
      }
    }
  };

  useEffect(() => {
    if (id) {
      setIsFetchingDetail(true);
      taskApi
        .getOne(id)
        .then((res) => {
          const task = res.data.result;
          form.setFieldsValue({
            project: task.project?._id,
            title: task.title,
            description: task.description,
            employee: task.employee?._id,
            estimateHour: task.estimateHour,
            estimateStartDate: task.estimateStartDate !== null ? dayjs(task.estimateStartDate) : '',
            estimateEndDate: task.estimateEndDate !== null ? dayjs(task.estimateEndDate) : '',
            actualHour: task.actualHour,
            status: statusOptions.find((option) => option.value === task.status)?.value,
            actualStartDate: task.actualStartDate !== null ? dayjs(task.actualStartDate) : '',
            actualEndDate: task.actualEndDate !== null ? dayjs(task.actualEndDate) : '',
          });
        })
        .catch((err) => {
          const { data } = err.response;
          if (data?.message) {
            if (data?.message) {
              navigate(`/404?status=404&subTitle=Task%20Not%20Found`);
            }
          }
        })
        .finally(() => setIsFetchingDetail(false));
    }
  }, [id]);

  useEffect(() => {
    if (pageName === 'Add') {
      setIsFetchingDetail(false);
    }
  }, []);

  useEffect(() => {
    fetchEmployees();
    fetchProjects();
  }, []);

  const onSubmit = async (values) => {
    try {
      const isFormValid = await form.validateFields();

      if (isFormValid) {
        form.setFieldsValue({ submitButtonDisabled: true });
        setLoading(true);

        const payload = {
          ...values,
          estimateStartDate: values.estimateStartDate
            ? dayjs(values.estimateStartDate).format('YYYY-MM-DD')
            : null,
          estimateEndDate: values.estimateEndDate ? dayjs(values.estimateEndDate).format('YYYY-MM-DD') : null,
          actualStartDate: values.actualStartDate ? dayjs(values.actualStartDate).format('YYYY-MM-DD') : null,
          actualEndDate: values.actualEndDate ? dayjs(values.actualEndDate).format('YYYY-MM-DD') : null,
        };

        const tag = 'TASK';
        if (!id) {
          const taskResponse = await taskApi.add(payload);
          message.success(taskResponse.data?.message);

          const notiTask = taskResponse.data?.result;
          const employeeName = employeeOptions.find((option) => option.value === notiTask.employee).label;

          const notificationPayload = {
            tag,
            createdByWhom: currentUser._id,
            profile: currentUser?.profilePhoto,
            sendTo: notiTask.employee,
            message: `
            A <span class='task-name'>${notiTask.title}</span> task has been created and assigned for
            <span>${employeeName} </span>
           `,
          };

          const notificationResponse = await notificationApi.add(notificationPayload);
          socket.emit('taskCreated', notificationResponse.data?.result);
        } else {
          const taskUpdateResponse = await taskApi.update(id, payload);
          message.success('Update task successfully.');

          const notiUpdateTask = taskUpdateResponse.data?.result;
          const employeeName = employeeOptions.find(
            (option) => option.value === notiUpdateTask.employee
          ).label;

          const notificationPayload = {
            tag,
            createdByWhom: currentUser._id,
            profile: currentUser?.profilePhoto,
            sendTo: notiUpdateTask.employee,
            message: `
            A <span class="task-name">${notiUpdateTask.title}</span> task assigned for
            <span>${employeeName} </span> has been updated.
           `,
          };

          const notificationResponse = await notificationApi.add(notificationPayload);
          socket.emit('taskUpdated', notificationResponse.data?.result);
        }

        navigate('/task/list');
      }
    } catch (error) {
      const { data } = error.response;
      message.error(data?.message);

      if (error?.code === 'ERR_NETWORK') {
        handleNetworkError();
      }
    } finally {
      setLoading(false);
      form.setFieldsValue({ submitButtonDisabled: false });
    }
  };

  return (
    <Row align="center">
      <Col xs={24} sm={24} md={20} lg={14} xl={12}>
        <Card
          className="my-form"
          title={
            <p style={{ fontSize: '1.1rem', textAlign: 'center' }}>
              {pageName === 'Add' && (
                <span>
                  <DiffOutlined className="form-icon" />
                  Add New Task
                </span>
              )}
              {pageName === 'Edit' && (
                <span>
                  <EditOutlined className="form-icon" />
                  Edit Task
                </span>
              )}
            </p>
          }
        >
          <Form
            form={form}
            onFinish={onSubmit}
            labelAlign="left"
            layout="horizontal"
            labelCol={{ span: 8 }}
            wrapperCol={{ span: 17 }}
          >
            {isFetchingDetail ? (
              <div
                style={{ minHeight: '60vh', display: 'flex', justifyContent: 'center', alignItems: 'center' }}
              >
                <Spin />
              </div>
            ) : (
              <>
                <Form.Item
                  label={
                    <span>
                      Project
                      <span className="error-sign">*</span>
                    </span>
                  }
                  justify="space-between"
                  name="project"
                  rules={[{ required: true, message: 'Please select a project!' }]}
                >
                  <Select
                    showSearch
                    optionFilterProp="children"
                    filterOption={(input, option) =>
                      (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
                    }
                    options={projectOptions}
                    disabled={pageName === 'Edit' && currentUser.position !== 0}
                  />
                </Form.Item>

                <Form.Item
                  label={
                    <span>
                      Title
                      <span className="error-sign">*</span>
                    </span>
                  }
                  justify="space-between"
                  name="title"
                  rules={[{ required: true, message: 'Please input task title!' }]}
                >
                  <Input
                    style={{ maxWidth: '100%' }}
                    disabled={pageName === 'Edit' && currentUser.position !== 0}
                  />
                </Form.Item>

                <Form.Item
                  label={
                    <span>
                      Description
                      <span className="error-sign">*</span>
                    </span>
                  }
                  justify="space-between"
                  name="description"
                  rules={[{ required: true, message: 'Please input description!' }]}
                >
                  <Input
                    style={{ maxWidth: '100%' }}
                    disabled={pageName === 'Edit' && currentUser.position !== 0}
                  />
                </Form.Item>

                <Form.Item
                  label={
                    <span>
                      Employee
                      <span className="error-sign">*</span>
                    </span>
                  }
                  justify="space-between"
                  name="employee"
                  rules={[{ required: true, message: 'Please select employee name!' }]}
                >
                  <Select
                    showSearch
                    optionFilterProp="children"
                    filterOption={(input, option) =>
                      (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
                    }
                    options={employeeOptions}
                    disabled={pageName === 'Edit' && currentUser.position !== 0}
                  />
                </Form.Item>

                <Form.Item
                  label={
                    <span>
                      Estimate Hour
                      <span className="error-sign">*</span>
                    </span>
                  }
                  justify="space-between"
                  name="estimateHour"
                  rules={[
                    { required: true, message: 'Please input estimate hour!' },
                    { validator: validateHour },
                  ]}
                >
                  <InputNumber
                    style={{ width: '100%' }}
                    disabled={pageName === 'Edit' && currentUser.position !== 0}
                  />
                </Form.Item>

                <Form.Item
                  label={<span>Estimate Start</span>}
                  justify="space-between"
                  name="estimateStartDate"
                >
                  <DatePicker
                    style={{ width: '100%' }}
                    placeholder="yyyy-mm-dd"
                    disabled={pageName === 'Edit' && currentUser.position !== 0}
                  />
                </Form.Item>

                <Form.Item
                  label={<span>Estimate End</span>}
                  justify="space-between"
                  name="estimateEndDate"
                  dependencies={['estimateStartDate']}
                  rules={[{ validator: validateEstimateEndDate }]}
                >
                  <DatePicker
                    style={{ width: '100%' }}
                    placeholder="yyyy-mm-dd"
                    disabled={pageName === 'Edit' && currentUser.position !== 0}
                  />
                </Form.Item>

                {pageName === 'Edit' && (
                  <>
                    <Form.Item
                      label={
                        <span>
                          Status
                          <span className="error-sign">*</span>
                        </span>
                      }
                      justify="space-between"
                      name="status"
                      rules={[{ required: true, message: 'Please select status!' }]}
                    >
                      <Select
                        options={currentUser.position !== 0 ? permissionStatusOptions : statusOptions}
                      />
                    </Form.Item>

                    <Form.Item
                      label={
                        <span>
                          Actual Hour
                          <span className="error-sign">*</span>
                        </span>
                      }
                      justify="space-between"
                      name="actualHour"
                      rules={[
                        { required: true, message: 'Please input actual hour!' },
                        { validator: validateHour },
                      ]}
                    >
                      <InputNumber style={{ width: '100%' }} />
                    </Form.Item>

                    <Form.Item
                      label={<span>Actual Start</span>}
                      justify="space-between"
                      name="actualStartDate"
                    >
                      <DatePicker style={{ width: '100%' }} placeholder="yyyy-mm-dd" />
                    </Form.Item>

                    <Form.Item
                      label={<span>Actual End</span>}
                      justify="space-between"
                      name="actualEndDate"
                      dependencies={['actualStartDate']}
                      rules={[{ validator: validateActualEndDate }]}
                    >
                      <DatePicker style={{ width: '100%' }} placeholder="yyyy-mm-dd" />
                    </Form.Item>
                  </>
                )}

                <Row justify="center" gutter={[16, 16]}>
                  <Col xs={24} sm={12} md={12}>
                    <Button
                      disabled={false}
                      className="custom-danger-btn"
                      block
                      icon={<RollbackOutlined />}
                      onClick={() => navigate(-1)}
                    >
                      Cancel
                    </Button>
                  </Col>

                  <Col xs={24} sm={12} md={12}>
                    {pageName === 'Add' && (
                      <Button
                        className="custom-primary-btn"
                        htmlType="submit"
                        block
                        icon={<SaveOutlined />}
                        loading={loading}
                        disabled={form.getFieldValue('submitButtonDisabled')}
                      >
                        Save
                      </Button>
                    )}
                    {pageName === 'Edit' && (
                      <Button
                        className="custom-edit-btn"
                        htmlType="submit"
                        block
                        icon={<EditOutlined />}
                        loading={loading}
                        disabled={form.getFieldValue('submitButtonDisabled')}
                      >
                        Edit
                      </Button>
                    )}
                  </Col>
                </Row>
              </>
            )}
          </Form>
        </Card>
      </Col>
    </Row>
  );
};

export default TaskCommon;
