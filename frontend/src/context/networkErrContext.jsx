import { useState, useContext, createContext } from 'react';
import NetworkErrorModal from '../components/NetworkErrModal/NetworkErrModal';
import PropTypes from 'prop-types';

const NetworkErrorContext = createContext();

export const useNetworkError = () => {
  return useContext(NetworkErrorContext);
};

export const NetworkErrorProvider = ({ children }) => {
  const [networkError, setNetworkError] = useState();

  const handleNetworkError = () => {
    setNetworkError(true);
  };

  const handleCloseErrorModal = () => {
    setNetworkError(false);
  };

  return (
    <NetworkErrorContext.Provider value={{ handleNetworkError }}>
      {children}
      <NetworkErrorModal visible={networkError} onClose={handleCloseErrorModal} />
    </NetworkErrorContext.Provider>
  );
};

NetworkErrorProvider.propTypes = {
  children: PropTypes.node.isRequired,
};
