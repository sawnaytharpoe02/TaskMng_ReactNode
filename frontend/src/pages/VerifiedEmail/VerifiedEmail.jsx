import { useEffect, useState, useRef, useContext } from 'react';
import { useNavigate } from 'react-router';
import { useSearchParams } from 'react-router-dom';
import Lottie from 'lottie-react';
import { Button, Result, message } from 'antd';
import authService from '../../services/authServices';
import VerifyContext from '../../context/verifyContext';
import animationData from '../../assets/validating_email_animate.json';
import './verifiedEmail.scss';
import { useNetworkError } from '../../context/networkErrContext';

const VerifiedEmail = () => {
  const { setVerifyEmail } = useContext(VerifyContext);
  const emailVerifyRef = useRef(null);
  const [animationComplete, setAnimationComplete] = useState(false);
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');
  const { handleNetworkError } = useNetworkError();

  const handleAnimationComplete = () => {
    if (emailVerifyRef.current) {
      emailVerifyRef.current.pause();
    }
    setAnimationComplete(true);
  };

  const handleGoToLogin = () => {
    navigate('/login');
  };

  useEffect(() => {
    setVerifyEmail(true);
    const verifyEmail = async () => {
      try {
        await authService.verifyEmail(token);
      } catch (error) {
        const { data } = error.response;
        message.error(data?.message);

        if (error?.code === 'ERR_NETWORK') {
          handleNetworkError();
        }
      }
    };

    verifyEmail();
  }, [token]);

  const style = {
    height: 300,
  };

  return (
    <>
      <Lottie
        onComplete={handleAnimationComplete}
        lottieRef={emailVerifyRef}
        animationData={animationData}
        style={style}
        loop={false}
      />

      <div className={`mail-verify-result ${animationComplete ? 'result-visible' : ''}`}>
        <Result
          status="success"
          title="Email Verified Successfully!"
          subTitle="You have successfully verified your email address. Thank you for completing the verification process."
          extra={[
            <Button type="primary" key="/login" onClick={handleGoToLogin}>
              Go to Login
            </Button>,
          ]}
        />
      </div>
    </>
  );
};

export default VerifiedEmail;
