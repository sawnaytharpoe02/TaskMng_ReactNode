import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button, Checkbox, Form, Input, Col, Card, Row, message } from "antd";
import { LockOutlined, UserOutlined, LoginOutlined } from "@ant-design/icons";
import authService from "../../services/authServices";
import { MESSAGE, VALIDATE } from "../../constants/validate";
import { setToken, setUser } from "../../utils/storage";
import "./login.scss";

const Login = () => {
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const navigate = useNavigate();
  const [form] = Form.useForm();

  const onSubmit = async (values) => {
    try {
      setIsLoggingIn(true);
      form.setFieldsValue({ submitButtonDisabled: true });

      const payload = {
        email: values.email,
        password: values.password,
      };

      const res = await authService.login(payload);
      const { token } = res.data.result;

      message.success(res.data?.message);
      setToken(token);
      setUser(res.data?.result);

      navigate("/");
    } catch (error) {
      const { data } = error.response;
      message.error(data.message);
    } finally {
      setIsLoggingIn(false);
      form.setFieldsValue({ submitButtonDisabled: false });
    }
  };

  return (
    <Row style={{ justifyContent: "center" }}>
      <Col xs={24} sm={24} md={20} lg={14} xl={10}>
        <Card
          title={
            <p style={{ fontSize: "1.1rem", textAlign: "center" }}>
              <LoginOutlined style={{ marginRight: 8, fontSize: "20px" }} />{" "}
              Task Management System
            </p>
          }
          bordered={false}>
          <Form
            form={form}
            className="login-form"
            initialValues={{
              remember: true,
            }}
            onFinish={onSubmit}>
            <Form.Item
              name="email"
              rules={[
                { required: true, message: MESSAGE.EMAIL_REQUIRED },
                {
                  pattern: VALIDATE.EMAIL_REGEX,
                  message: MESSAGE.EMAIL_INVALID_FORMAT,
                },
              ]}>
              <Input prefix={<UserOutlined />} placeholder="Enter your email" />
            </Form.Item>

            <Form.Item
              name="password"
              rules={[{ required: true, message: MESSAGE.PASSWORD_REQUIRED }]}>
              <Input.Password
                prefix={<LockOutlined />}
                type="password"
                placeholder="Enter your password"
                visibilityToggle={{
                  visible: passwordVisible,
                  onVisibleChange: setPasswordVisible,
                }}
              />
            </Form.Item>

            <Form.Item>
              <Form.Item name="remember" valuePropName="checked" noStyle>
                <Checkbox className="login-form-remember">Remember me</Checkbox>
              </Form.Item>

              <Link to="/forgot-password" className="login-form-forgot">
                Forgot password
              </Link>
            </Form.Item>

            <Form.Item>
              <Button
                loading={isLoggingIn}
                block
                className="custom-primary-btn"
                htmlType="submit"
                disabled={form.getFieldValue("submitButtonDisabled")}>
                Log in
              </Button>
            </Form.Item>
          </Form>
        </Card>
      </Col>
    </Row>
  );
};

export default Login;
