import { Result, Button } from 'antd';
import { useLocation } from 'react-router-dom';
import { Link } from 'react-router-dom';

const NotFound = () => {
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const status = searchParams.get('status');
  const subTitle = searchParams.get('subTitle');
  const path = decodeURIComponent(subTitle).split(' ')[0].toLowerCase();

  return (
    <Result
      status={status}
      title={status}
      subTitle={subTitle}
      extra={
        <Button>
          <Link to={`/${path}/list`}>Back To Previous</Link>
        </Button>
      }
    />
  );
};

export default NotFound;
