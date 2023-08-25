import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Button, Form, Input, Row, Col, Card, message } from 'antd';
import { LockOutlined, EyeTwoTone, EyeInvisibleOutlined, FormOutlined } from '@ant-design/icons';
import authService from '../../services/authServices';
import { MESSAGE } from '../../constants/validate';
import { removeToken, removeUser } from '../../utils/storage';

const ResetPassword = () => {
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm();
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');
  const navigate = useNavigate();

  // Custom validation function to check if new password and confirm password match
  const validateConfirmPassword = (_, value) => {
    const newPassword = form.getFieldValue('newPassword');

    if (value === undefined) {
      return Promise.reject(new Error(MESSAGE.PASSWORD_CONFIRM_REQUIRED));
    } else if (newPassword && value !== newPassword) {
      return Promise.reject(new Error(MESSAGE.PASSWORD_CONFIRM_MISMATCH));
    }
    return Promise.resolve();
  };

  const onSubmit = async (values) => {
    try {
      setLoading(true);
      form.setFieldsValue({ submitButtonDisabled: true });

      const res = await authService.resetPassword({ ...values }, token);
      message.success(res.data?.message);
      navigate('/login');
    } catch (error) {
      const { data } = error.response;
      message.error(data?.message);
    } finally {
      setLoading(false);
      form.setFieldsValue({ submitButtonDisabled: false });
    }
  };

  useEffect(() => {
    removeToken();
    removeUser();
  }, []);

  return (
    <Row align="center">
      <Col xs={24} sm={24} md={20} lg={14} xl={10}>
        <Card
          title={
            <p style={{ fontSize: '1.1rem', textAlign: 'center' }}>
              <FormOutlined style={{ marginRight: 8, fontSize: '20px' }} />
              Reset Password Form
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
              name="newPassword"
              rules={[{ required: true, message: MESSAGE.PASSWORD_NEW_REQUIRED }]}
            >
              <Input.Password
                prefix={<LockOutlined />}
                type="password"
                placeholder="Enter your new password"
                iconRender={(visible) => (visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />)}
              />
            </Form.Item>

            <Form.Item name="confirmPassword" rules={[{ validator: validateConfirmPassword }]}>
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
                Reset Your Password
              </Button>
            </Form.Item>
          </Form>
        </Card>
      </Col>
    </Row>
  );
};

export default ResetPassword;
