import { Outlet } from 'react-router';
import { Layout } from 'antd';
import { geekblue } from '@ant-design/colors';
import Navbar from '../components/Navbar/Navbar';
import Foot from '../components/Footer/Footer';

const Root = () => {
  const layoutStyled = {
    minHeight: '100vh',
    display: 'flex',
    flexDirection: 'column',
    overflow: 'hidden',
    backgroundColor: geekblue[0],
  };
  const { Content } = Layout;
  return (
    <>
      <Layout style={layoutStyled}>
        <Navbar />
        <Content style={{ padding: '2rem', marginTop: '5.5rem' }}>
          <Outlet />
        </Content>
        <Foot />
      </Layout>
    </>
  );
};

export default Root;
