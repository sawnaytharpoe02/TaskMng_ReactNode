import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import { Button, Form, Input, Row, Col, Card, message } from 'antd';
import {
  LockOutlined,
  UserOutlined,
  EyeTwoTone,
  EyeInvisibleOutlined,
  FormOutlined,
} from '@ant-design/icons';
import authService from '../../services/authServices';
import { MESSAGE, VALIDATE } from '../../constants/validate';
import { getUser } from '../../utils/storage';

const ChangePassword = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const { email } = getUser();

  // Custom validation function to check if old password and new password are the same
  const validatePasswords = () => {
    const oldPassword = form.getFieldValue('oldPassword');
    const newPassword = form.getFieldValue('newPassword');

    if (newPassword && oldPassword === newPassword) {
      return Promise.reject(new Error(MESSAGE.PASSWORD_OLD_NEW_MISMATCH));
    }
    return Promise.resolve();
  };

  // Custom validation function to check if new password and confirm password match
  const validateConfirmPassword = (_, value) => {
    const newPassword = form.getFieldValue('newPassword');
    if (value && value !== newPassword) {
      return Promise.reject(new Error(MESSAGE.PASSWORD_CONFIRM_MISMATCH));
    }
    return Promise.resolve();
  };

  const onSubmit = async (values) => {
    try {
      setLoading(true);
      form.setFieldsValue({ submitButtonDisabled: true });

      const res = await authService.changePassword({ ...values });
      message.success(res.data?.message);
      navigate('/');
    } catch (error) {
      const { data } = error.response;
      message.error(data?.message);
    } finally {
      setLoading(false);
      form.setFieldsValue({ submitButtonDisabled: false });
    }
  };

  useEffect(() => {
    form.setFieldValue('email', email);
  }, []);

  return (
    <Row align="center">
      <Col xs={24} sm={24} md={20} lg={14} xl={10}>
        <Card
          title={
            <p style={{ fontSize: '1.1rem', textAlign: 'center' }}>
              <FormOutlined style={{ marginRight: 8, fontSize: '20px' }} />
              Change Password Form
            </p>
          }
          bordered={false}
        >
          <Form
            form={form}
            initialValues={{
              remember: true,
            }}
            onFinish={onSubmit}
          >
            <Form.Item
              name="email"
              rules={[
                { required: true, message: MESSAGE.EMAIL_REQUIRED },
                { pattern: VALIDATE.EMAIL_REGEX, message: MESSAGE.EMAIL_INVALID_FORMAT },
              ]}
            >
              <Input prefix={<UserOutlined />} placeholder="Email" disabled />
            </Form.Item>

            <Form.Item
              name="oldPassword"
              rules={[{ required: true, message: MESSAGE.PASSWORD_OLD_REQUIRED }]}
            >
              <Input.Password
                prefix={<LockOutlined />}
                type="password"
                placeholder="Enter your old password"
                iconRender={(visible) => (visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />)}
              />
            </Form.Item>

            <Form.Item
              name="newPassword"
              rules={[
                { required: true, message: MESSAGE.PASSWORD_NEW_REQUIRED },
                { validator: validatePasswords },
              ]}
            >
              <Input.Password
                prefix={<LockOutlined />}
                type="password"
                placeholder="Enter your new password"
                iconRender={(visible) => (visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />)}
              />
            </Form.Item>

            <Form.Item
              name="confirmPassword"
              rules={[
                { required: true, message: MESSAGE.PASSWORD_CONFIRM_REQUIRED },
                { validator: validateConfirmPassword },
              ]}
            >
              <Input.Password
                prefix={<LockOutlined />}
                type="password"
                placeholder="Confirm your password"
                iconRender={(visible) => (visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />)}
              />
            </Form.Item>

            <Form.Item>
              <Button
                block
                loading={loading}
                className="custom-primary-btn"
                htmlType="submit"
                disabled={form.getFieldValue('submitButtonDisabled')}
              >
                Change Password
              </Button>
            </Form.Item>
          </Form>
        </Card>
      </Col>
    </Row>
  );
};

export default ChangePassword;
