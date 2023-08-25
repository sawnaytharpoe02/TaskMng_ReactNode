import { Modal, Button } from 'antd';
import { CloseCircleFilled } from '@ant-design/icons';
import PropTypes from 'prop-types';

const NetworkErrorModal = ({ visible, onClose }) => {
  return (
    <Modal
      centered
      width={350}
      open={visible}
      title="Network Error"
      style={{ textAlign: 'center' }}
      onCancel={onClose}
      footer={[
        <Button key="close" className="custom-danger-btn" onClick={onClose}>
          Close
        </Button>,
      ]}
    >
      <div style={{ fontSize: '30px', color: 'red' }}>
        <CloseCircleFilled />
      </div>
      <p>
        Oops! There was a problem connecting to the server. Please check your internet connection and try
        again.
      </p>
    </Modal>
  );
};

NetworkErrorModal.propTypes = {
  visible: PropTypes.bool,
  onClose: PropTypes.func.isRequired,
};
export default NetworkErrorModal;
