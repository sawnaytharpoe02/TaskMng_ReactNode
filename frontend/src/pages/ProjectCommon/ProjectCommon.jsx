import { useEffect, useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router';
import { Link } from 'react-router-dom';
import { Row, Col, Card, Form, Input, DatePicker, Button, message, Spin } from 'antd';
import { UserAddOutlined, EditOutlined, RollbackOutlined, SaveOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';
import localeDate from 'dayjs/plugin/localeData';
import weeekday from 'dayjs/plugin/weekday';
import { projectApi, notificationApi } from '../../services/apiServices';
import { MESSAGE } from '../../constants/validate';
import { useNetworkError } from '../../context/networkErrContext';
import { getUser } from '../../utils/storage';
import { socket } from '../../socket';
import './projectCommon.scss';

dayjs.extend(weeekday);
dayjs.extend(localeDate);

const ProjectCommon = () => {
  const { id } = useParams();
  const [pageName, setPageName] = useState();
  const { pathname } = useLocation();
  const [loading, setLoading] = useState(false);
  const [isFetchingDetail, setIsFetchingDetail] = useState(false);
  const navigate = useNavigate();
  const { handleNetworkError } = useNetworkError();
  const [form] = Form.useForm();

  useEffect(() => {
    if (pathname.includes('add')) {
      setPageName('Add');
      form.resetFields();
    } else if (pathname.includes('edit')) {
      setPageName('Edit');
    }
  }, [pathname]);

  useEffect(() => {
    setIsFetchingDetail(true);
    if (id) {
      projectApi
        .getOne(id)
        .then((res) => {
          form.setFieldsValue({
            projectName: res.data.result.projectName,
            language: res.data.result.language,
            description: res.data.result.description,
            startDate: dayjs(res.data.result.startDate),
            endDate: dayjs(res.data.result.endDate),
          });
        })
        .catch((err) => {
          const { data } = err.response;
          if (data?.message) {
            if (data?.message) {
              navigate(`/404?status=404&subTitle=Project%20Not%20Found`);
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
  }, [pageName]);

  const onSubmit = async (values) => {
    try {
      const payload = {
        ...values,
        startDate: dayjs(values.startDate, 'YYYY-MM-DD'),
        endDate: dayjs(values.endDate, 'YYYY-MM-DD'),
      };

      form.setFieldsValue({ submitButtonDisabled: true });
      setLoading(true);

      const userData = getUser();
      const tag = 'PROJECT';
      if (id) {
        const projectResponse = await projectApi.update(id, payload);
        message.success(projectResponse.data?.message);

        const notiProject = projectResponse.data?.result;
        const notificationPayload = {
          tag,
          createdByWhom: userData._id,
          profile: userData?.profilePhoto,
          sendTo: '0',
          message: `
          Admin <span>${userData.employeeName}</span> has updated a project <span class='created-user'>${notiProject.projectName}</span>
         `,
        };

        const notificationResponse = await notificationApi.add(notificationPayload);
        socket.emit('projectUpdated', notificationResponse.data?.result);
      } else {
        const projectResponse = await projectApi.add(payload);
        message.success(projectResponse.data?.message);

        const notiProject = projectResponse.data?.result;
        const notificationPayload = {
          tag,
          createdByWhom: userData._id,
          profile: userData?.profilePhoto,
          sendTo: '0',
          message: `
          Admin <span>${userData.employeeName}</span> has created a project <span class='created-user'>${notiProject.projectName}</span>
         `,
        };

        const notificationResponse = await notificationApi.add(notificationPayload);
        socket.emit('projectCreated', notificationResponse.data?.result);
      }

      navigate('/project/list');
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

  const validateEndDate = (_, value) => {
    const startDate = form.getFieldValue('startDate');

    if (value && startDate && value.isBefore(startDate)) {
      return Promise.reject(MESSAGE.END_DATE_VALIDATE);
    }
    return Promise.resolve();
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
                  <UserAddOutlined className="form-icon" />
                  Add New Project
                </span>
              )}
              {pageName === 'Edit' && (
                <span>
                  <EditOutlined className="form-icon" />
                  Edit Project
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
            labelCol={{ span: 6 }}
            wrapperCol={{ span: 17 }}
            initialValues={{ position: 'member' }}
          >
            {isFetchingDetail ? (
              <div
                style={{ minHeight: '40vh', display: 'flex', justifyContent: 'center', alignItems: 'center' }}
              >
                <Spin />
              </div>
            ) : (
              <>
                <Form.Item
                  label={
                    <span>
                      Project Name
                      <span className="error-sign">*</span>
                    </span>
                  }
                  justify="space-between"
                  name="projectName"
                  rules={[{ required: true, message: MESSAGE.PROJECT_NAME_REQUIRED }]}
                >
                  <Input />
                </Form.Item>

                <Form.Item
                  label={
                    <span>
                      Language <span className="error-sign">*</span>
                    </span>
                  }
                  justify="space-between"
                  name="language"
                  rules={[{ required: true, message: MESSAGE.PROJECT_LANGUAGE_REQUIRED }]}
                >
                  <Input />
                </Form.Item>

                <Form.Item label={<span>Description</span>} justify="space-between" name="description">
                  <Input />
                </Form.Item>

                <Form.Item
                  label={
                    <span>
                      Start Date <span className="error-sign">*</span>
                    </span>
                  }
                  justify="space-between"
                  name="startDate"
                  rules={[{ required: true, message: MESSAGE.PROJECT_START_DATE_REQUIRED }]}
                >
                  <DatePicker style={{ width: '100%' }} placeholder="yyyy-mm-dd" />
                </Form.Item>

                <Form.Item
                  label={
                    <span>
                      End Date <span className="error-sign">*</span>
                    </span>
                  }
                  justify="space-between"
                  name="endDate"
                  dependencies={['startDate']}
                  rules={[
                    { required: true, message: MESSAGE.PROJECT_END_DATE_REQUIRED },
                    { validator: validateEndDate },
                  ]}
                >
                  <DatePicker style={{ width: '100%' }} placeholder="yyyy-mm-dd" />
                </Form.Item>

                <Row justify="center" gutter={[16, 16]}>
                  <Col xs={24} sm={12} md={12}>
                    <Link to="/project/list">
                      <Button
                        disabled={false}
                        className="custom-danger-btn"
                        block
                        icon={<RollbackOutlined />}
                      >
                        Cancel
                      </Button>
                    </Link>
                  </Col>

                  <Col xs={24} sm={12} md={12}>
                    {pageName === 'Add' && (
                      <Button
                        className="custom-primary-btn"
                        htmlType="submit"
                        loading={loading}
                        block
                        icon={<SaveOutlined />}
                        disabled={form.getFieldValue('submitButtonDisabled')}
                      >
                        Save
                      </Button>
                    )}
                    {pageName === 'Edit' && (
                      <Button
                        className="custom-edit-btn"
                        htmlType="submit"
                        loading={loading}
                        block
                        icon={<EditOutlined />}
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

export default ProjectCommon;
