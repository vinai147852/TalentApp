import './forgotpassword.scss';
import PhoneInput from 'react-phone-input-2';
import { Link, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { phoneinput_options } from '../Options';
import OTPInput from 'otp-input-react';
import { axiosinstance } from '../../utils/axiosinstance';
import { toast } from 'react-toastify';
import { auth } from '../../utils/firebase';
import { RecaptchaVerifier, signInWithPhoneNumber } from 'firebase/auth';
import { useEffect } from 'react';

export default function ForgotPassword() {
  const [loading, setloading] = useState(false);
  const [count, setCount] = useState(0);
  const [userId, setUserId] = useState();
  const [response, setresponse] = useState();
  const [Tabs, setTabs] = useState(1);
  const [SelectInfo, setSelectInfo] = useState(1);
  const [Auth, setAuth] = useState();
  const [otp, setOtp] = useState();
  const [password, setpassword] = useState();
  const navigate = useNavigate();

  const VerifyRecaptcha = () => {
    window.recaptchaVerifier = new RecaptchaVerifier(
      'send-otp',
      {
        size: 'invisible',
      },
      auth
    );
  };

  const HandleConfirm = async () => {
    setloading(true);
    try {
      const res = await axiosinstance.post('/forgot/password/confirm', {
        Auth,
      });
      if (res.data.isMobile) {
        let PhoneNumber = '+' + res.data?.mobileno;
        setUserId(res.data?.userId);
        setresponse(res.data);
        // Send Otp to registered Mobile number -----------------------------------------------
        VerifyRecaptcha();
        const appVerifier = window.recaptchaVerifier;
        signInWithPhoneNumber(auth, PhoneNumber, appVerifier)
          .then((confirmationResult) => {
            window.confirmationResult = confirmationResult;
            setTabs((prev) => prev + 1);
            setCount(60);
            setloading(false);
          })
          .catch((error) => {
            toast.error(error?.message);
            setloading(false);
          });
      } else {
        setTabs((prev) => prev + 1);
        setCount(60);
        setUserId(res.data?.userId);
        setresponse(res.data);
        setloading(false);
      }
    } catch (error) {
      toast.error(error?.response.data);
      setloading(false);
    }
  };

  // Resend Otp ------------------------------------------------------------------------------
  const ResendMobileOtp = () => {
    let PhoneNumber = '+' + response?.mobileno;
    // Send Otp to registered Mobile number -----------------------------------------------
    VerifyRecaptcha();
    const appVerifier = window.recaptchaVerifier;
    signInWithPhoneNumber(auth, PhoneNumber, appVerifier)
      .then((confirmationResult) => {
        window.confirmationResult = confirmationResult;
        toast.success('Otp Sent Successfully');
        setCount(60);
      })
      .catch((error) => {
        toast.error(error?.message);
      });
  };

  // Verify Otp Here --------------------------------------------------------------------------
  const VerifyMobileOtp = () => {
    setloading(true);
    let confirmationResult = window.confirmationResult;
    confirmationResult
      .confirm(otp)
      .then(() => {
        setTabs((prev) => prev + 1);
        setloading(false);
      })
      .catch(() => {
        toast.error('Invalid Code');
        setloading(false);
      });
  };

  // Verify Email Otp ------------------------------  -----------------------------------
  const VerifyEmailOtp = async () => {
    setloading(true);
    try {
      const res = await axiosinstance.post('/forgot/password/verify', {
        otp,
        userId,
      });
      if (res.data.Verified) {
        setTabs((prev) => prev + 1);
        setloading(false);
      }
    } catch (error) {
      toast.error(error?.response.data);
      setloading(false);
    }
  };

  const ResetPassword = async () => {
    if (Validation()) {
      setloading(true);
      try {
        const res = await axiosinstance.post(`/forgot/password/set/${userId}`, {
          password: password?.password,
        });
        toast.success(res.data);
        navigate('/login');
        setloading(false);
      } catch (error) {
        toast.error(error?.response.data);
        setloading(false);
      }
    }
  };

  const ResendEmailOtp = async () => {
    try {
      await axiosinstance.post('/forgot/password/resend', {
        email: Auth,
        userId: response?.userId,
      });
      toast.success('Otp Sent Successfully');
      setCount(60);
    } catch (error) {
      toast.error(error?.response.data);
    }
  };

  const Validation = () => {
    if (!password?.password) {
      toast.error('Please Enter Password');
      return false;
    } else if (!password?.cpassword) {
      toast.error('Please Confirm Password');
      return false;
    } else if (password?.password !== password?.cpassword) {
      toast.error('Password & Confirm Password must be same');
      return false;
    } else {
      return true;
    }
  };

  const HashAuth = ({ val, source }) => {
    let auth;
    let hashedval;
    if (source === '1') {
      auth = val.split('');
      hashedval = auth?.map((item, index) => {
        if (index > 1 && index < 10) {
          return '*';
        } else {
          return item;
        }
      });
      hashedval.unshift('+');
    } else {
      auth = val.split('@');
      hashedval = auth[0].split('')?.map((item, index) => {
        if (index > 1 && index < auth[0]?.length - 2) {
          return '*';
        } else {
          return item;
        }
      });
      hashedval.push('@');
      hashedval.push(auth[1]);
    }

    return hashedval;
  };

  useEffect(() => {
    count > 0 && setTimeout(() => setCount(count - 1), 1000);
  }, [count]);

  return (
    <div className="main_login_form">
      <div className="inner_login_form">
        {Tabs === 1 && (
          <div className="login_form_bx">
            <h2>Reset Your Password</h2>
            <div className="login_cta_btns">
              <button
                className={
                  SelectInfo === 1
                    ? 'Login_Btns_cta active_Login_Btns_cta'
                    : 'Login_Btns_cta'
                }
                onClick={() => setSelectInfo(1)}
              >
                Mobile No
              </button>
              <button
                className={
                  SelectInfo === 2
                    ? 'Login_Btns_cta active_Login_Btns_cta'
                    : 'Login_Btns_cta'
                }
                onClick={() => setSelectInfo(2)}
              >
                Email
              </button>
            </div>
            <div className="login_input_feilds">
              {SelectInfo === 2 ? (
                <input
                  type="email"
                  placeholder="Your email"
                  onChange={(e) => setAuth(e.target.value)}
                />
              ) : (
                <PhoneInput
                  {...phoneinput_options}
                  inputStyle={{ padding: '0px 15px 0px 50px' }}
                  onChange={(e) => setAuth(e)}
                />
              )}
            </div>
            <div className="login_btn">
              <button
                onClick={HandleConfirm}
                id="send-otp"
                disabled={loading && true}
              >
                {loading ? <i className="fa fa-spinner fa-spin"></i> : 'SUBMIT'}
              </button>
            </div>
            <div className="goto_register">
              <p>
                Already have an account ?{' '}
                <span>
                  <Link to="/login">Login Here</Link>{' '}
                </span>
              </p>
            </div>
          </div>
        )}

        {/* FLow 2    */}
        {Tabs === 2 && (
          <div className="login_form_bx verify_otp">
            <h2>Verify Otp</h2>
            <label>
              Please Enter Otp Sent on{' '}
              {Auth &&
                HashAuth({ val: Auth, source: response?.isMobile ? '1' : '2' })}
            </label>
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
            <div className="forgot_pass_btns">
              <button
                disabled={count && true}
                onClick={
                  (response?.isMobile && ResendMobileOtp) ||
                  (response?.isEmail && ResendEmailOtp)
                }
                className="resend_otp"
                id="send-otp"
              >
                {count
                  ? count > 9
                    ? '00 : ' + count
                    : '00 : 0' + count
                  : 'Resend Otp'}
              </button>
              <button
                disabled={(!otp || loading) && true}
                onClick={
                  (response?.isMobile && VerifyMobileOtp) ||
                  (response?.isEmail && VerifyEmailOtp)
                }
              >
                {loading ? <i className="fa fa-spinner fa-spin"></i> : 'Verify'}
              </button>
            </div>
            <div className="goto_register">
              <p>
                Already have an account ?{' '}
                <span>
                  <Link to="/login">Login Here</Link>{' '}
                </span>
              </p>
            </div>
          </div>
        )}

        {/* FLow 3  */}
        {Tabs === 3 && (
          <div className="login_form_bx">
            <h2>Reset Password</h2>
            <div className="login_input_feilds">
              <input
                type="password"
                name="password"
                placeholder="Enter new password"
                onChange={(e) =>
                  setpassword((prev) => ({
                    ...prev,
                    [e.target.name]: e.target.value,
                  }))
                }
              />
              <input
                type="password"
                name="cpassword"
                placeholder="Confirm new password"
                onChange={(e) =>
                  setpassword((prev) => ({
                    ...prev,
                    [e.target.name]: e.target.value,
                  }))
                }
              />
            </div>
            <div className="login_btn">
              <button onClick={ResetPassword} disabled={loading && true}>
                {loading ? <i className="fa fa-spinner fa-spin"></i> : 'Reset'}
              </button>
            </div>
            <div className="goto_register">
              <p>
                Already have an account ?{' '}
                <span>
                  <Link to="/login">Login Here</Link>{' '}
                </span>
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
