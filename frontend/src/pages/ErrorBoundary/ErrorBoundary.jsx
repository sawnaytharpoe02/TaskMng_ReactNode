import { useRouteError, useLocation, useNavigate } from 'react-router';
import { Row, Result, Button } from 'antd';

const ErrorBoundary = () => {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const error = useRouteError();
  const status = (error && error.status) || '404';
  const subtitle =
    (error && (error.message || error.data)) || `Sorry, the page '${pathname}' does not exist.`;

  return (
    <Row align="middle" justify="center">
      <Result
        status={status}
        title={status}
        subTitle={subtitle}
        extra={<Button onClick={() => navigate(-1)}>Back to previous</Button>}
      />
    </Row>
  );
};

export default ErrorBoundary;
