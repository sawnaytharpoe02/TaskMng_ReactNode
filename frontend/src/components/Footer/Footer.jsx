import { Layout } from 'antd';

const Footer = () => {
  const { Footer } = Layout;
  return (
    <Footer style={{ marginTop: 'auto', textAlign: 'center', backgroundColor: '#fff' }}>
      <p>
        <span style={{ fontWeight: 'bold', color: '#5468ff' }}>TASKITO</span> &copy;2023 All
        right reserved.
      </p>
    </Footer>
  );
};

export default Footer;
