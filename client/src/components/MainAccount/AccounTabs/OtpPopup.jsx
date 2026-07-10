import React, { useEffect, useState } from 'react';
import OTPInput from 'otp-input-react';
import { toast } from 'react-toastify';
import { useSelector } from 'react-redux';
import { auth } from '../../../utils/firebase';
import { RecaptchaVerifier, signInWithPhoneNumber } from 'firebase/auth';

export default function OtpPopup({ OnCloseOtp }) {
  const User = useSelector((state) => state.user.user);
  const [otp, setOtp] = useState(null);
  const [count, setCount] = useState(60);

  // RecaptchaVerifier --------------------------------------------------------------
  const VerifyRecaptcha = () => {
    window.recaptchaVerifier = new RecaptchaVerifier(
      'send-otp',
      {
        size: 'invisible',
      },
      auth
    );
  };

  const ReSendOtp = async () => {
    let PhoneNumber = '+' + User?.mobileno;
    VerifyRecaptcha();
    const appVerifier = window.recaptchaVerifier;
    signInWithPhoneNumber(auth, PhoneNumber, appVerifier)
      .then((confirmationResult) => {
        window.confirmationResult = confirmationResult;
        setCount(60);
      })
      .catch((error) => {
        toast.error(error?.message);
      });
  };

  useEffect(() => {
    count > 0 && setTimeout(() => setCount(count - 1), 1000);
  }, [count]);

  return (
    <div className="otp_container">
      <div className="inner_otp_container">
        <i className="fa-solid fa-circle-xmark" onClick={OnCloseOtp}></i>
        <div className="otp_heading">
          <h2>Verify Otp</h2>
          <p>Enter the otp sent on your mobile no {'+' + User?.mobileno}</p>
        </div>
        <div className="otp_inputs_container">
          <OTPInput
            className="opt_default_container"
            value={otp}
            onChange={setOtp}
            autoFocus
            OTPLength={6}
            otpType="number"
            disabled={false}
          />
        </div>
        <div className="otp_form_btns OTP_POPUP">
          <button
            disabled={(count) && true}
            onClick={ReSendOtp}
            id="send-otp"
          >
            {' '}
            {count
              ? count > 9
                ? '00 : ' + count
                : '00 : 0' + count
              : 'Send Again'}
          </button>
          <button
            disabled={(otp === null || otp?.length < 6) && true}
          >
            {' '}
            Verify Otp
          </button>
        </div>
      </div>
    </div>
  );
}
