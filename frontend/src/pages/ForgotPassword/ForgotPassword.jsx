import { useState } from 'react';
import { Form, Col, Card, Button, Input, Row, message } from 'antd';
import { UserOutlined, QuestionCircleOutlined } from '@ant-design/icons';
import authService from '../../services/authServices';
import { MESSAGE } from '../../constants/validate';
import { VALIDATE } from '../../constants/validate';

const ForgotPassword = () => {
  const [loading, setLoading] = useState(false);

  const onSubmit = async (values) => {
    setLoading(true);
    const payload = { email: values.email };
    try {
      const res = await authService.forgetPassword(payload);
      message.success(res.data?.message);
    } catch (err) {
      const { data } = err.response;
      message.error(data?.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Row style={{ justifyContent: 'center' }}>
      <Col xs={24} sm={24} md={20} lg={14} xl={10}>
        <Card
          title={
            <p style={{ fontSize: '1.1rem', textAlign: 'center' }}>
              <QuestionCircleOutlined style={{ marginRight: 8, fontSize: '20px' }} /> Forgot Password Page
            </p>
          }
          bordered={false}
        >
          <Form
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
              <Input prefix={<UserOutlined />} placeholder="Enter your email" />
            </Form.Item>

            <Form.Item>
              <Button
                block
                htmlType="submit"
                loading={loading}
                className="login-form-button custom-primary-btn"
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

export default ForgotPassword;
