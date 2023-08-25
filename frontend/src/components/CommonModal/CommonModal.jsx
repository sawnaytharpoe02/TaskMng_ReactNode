import { Modal, Button } from 'antd';
import { CloseCircleFilled } from '@ant-design/icons';
import PropTypes from 'prop-types';

const CommonModal = ({ open, title, message, onClose }) => {
  return (
    <Modal
      centered
      width={350}
      open={open}
      title={title}
      style={{ textAlign: 'center' }}
      onOk={onClose}
      onCancel={onClose}
      footer={[
        <Button key="back" className="custom-primary-btn" onClick={onClose}>
          OK
        </Button>,
      ]}
    >
      <div style={{ fontSize: '30px', color: 'red' }}>
        <CloseCircleFilled />
      </div>
      <p style={{ color: 'red' }}>{message}</p>
    </Modal>
  );
};

CommonModal.propTypes = {
  open: PropTypes.bool.isRequired,
  title: PropTypes.string.isRequired,
  message: PropTypes.string.isRequired,
  onClose: PropTypes.func.isRequired,
};

export default CommonModal;
