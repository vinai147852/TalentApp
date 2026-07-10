import React, { useState } from 'react';
import { toast } from 'react-toastify';
import AuthRequest from '../../../utils/axiosinstance';
import { useSelector } from 'react-redux';

export default function PasswordTab() {
  const User = useSelector((state) => state.admin.admin);
  const [password, setPassword] = useState({});
  const [showPassword, setShowPassword] = useState({});
  const [isConfirmed, setisConfirmed] = useState(false);
  const [loading, setLoading] = useState(false);

  const HandlePassword = (e) => {
    setPassword((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const HandleConfirmPassword = () => {
    if (!password.presentpassword) {
      toast.error('Plaese Enter Present Password');
    } else if (!password.cpresentpassword) {
      toast.error('Plaese Confirm Present Password');
    } else if (password.presentpassword !== password.cpresentpassword) {
      toast.error('Password & confirm Password must be same');
    } else {
      setisConfirmed(!isConfirmed);
    }
  };

  const HandleUpdatePassword = async () => {
    if (!password.newpassword) {
      toast.error('Plaese Enter New Password');
    } else if (!password.cnewpassword) {
      toast.error('Plaese Confirm New Password');
    } else if (password.newpassword !== password.cnewpassword) {
      toast.error('Password & confirm Password must be same');
    } else {
      try {
        setLoading(!loading);
        const res = await AuthRequest().post(
          User?.role === 1 || User?.role === 2
            ? `/admin/change/password/${User?._id}`
            : `/assistant/change/password/${User?._id}`,
          {
            newpassword: password.newpassword,
            presentpassword: password.presentpassword,
            userId: User?._id,
          }
        );
        toast.success(res.data);
        setPassword({});
        setisConfirmed(!isConfirmed);
        setShowPassword({});
        setLoading(false);
      } catch (err) {
        toast.error(err?.response.data);
        setLoading(false);
      }
    }
  };

  const ShowHidePass = (e) => {
    setShowPassword({ ...showPassword, ...e });
  };

  return (
    <div className="main_box_container_account">
      <div className="heading_box_container">
        <h2>Password</h2>
      </div>

      {!isConfirmed ? (
        <>
          <div className="account_box_data_settings">
            <div className="input_bx">
              <div className="label_inputs">
                <label htmlFor="">Current Password</label>
              </div>
              <div className="inputs_pass_container_box">
                <input
                  type={showPassword?.password ? 'text' : 'password'}
                  value={password?.presentpassword || ''}
                  name="presentpassword"
                  placeholder="************"
                  onChange={HandlePassword}
                />
                {showPassword?.password ? (
                  <i
                    className="fa-solid fa-eye-slash"
                    onClick={() => ShowHidePass({ password: false })}
                  ></i>
                ) : (
                  <i
                    className="fa-solid fa-eye"
                    onClick={() => ShowHidePass({ password: true })}
                  ></i>
                )}
              </div>
            </div>
            <div className="input_bx">
              <div className="label_inputs">
                <label htmlFor="">Confirm Current Password</label>
              </div>
              <div className="inputs_pass_container_box">
                <input
                  type={showPassword?.cpassword ? 'text' : 'password'}
                  name="cpresentpassword"
                  placeholder="**********"
                  value={password?.cpresentpassword || ''}
                  onChange={HandlePassword}
                />
                {showPassword?.cpassword ? (
                  <i
                    className="fa-solid fa-eye-slash"
                    onClick={() => ShowHidePass({ cpassword: false })}
                  ></i>
                ) : (
                  <i
                    className="fa-solid fa-eye"
                    onClick={() => ShowHidePass({ cpassword: true })}
                  ></i>
                )}
              </div>
            </div>
          </div>

          <div className="save_changes_box_container">
            <button onClick={HandleConfirmPassword}>Confirm Password</button>
          </div>
        </>
      ) : (
        <>
          <div className="account_box_data_settings">
            <div className="input_bx">
              <div className="label_inputs">
                <label htmlFor="">New Password</label>
              </div>
              <div className="inputs_pass_container_box">
                <input
                  type={showPassword?.password ? 'text' : 'password'}
                  name="newpassword"
                  placeholder="*********"
                  value={password?.newpassword || ''}
                  onChange={HandlePassword}
                />
                {showPassword?.password ? (
                  <i
                    className="fa-solid fa-eye-slash"
                    onClick={() => ShowHidePass({ password: false })}
                  ></i>
                ) : (
                  <i
                    className="fa-solid fa-eye"
                    onClick={() => ShowHidePass({ password: true })}
                  ></i>
                )}
              </div>
            </div>
            <div className="input_bx">
              <div className="label_inputs">
                <label htmlFor="">Confirm Password</label>
              </div>
              <div className="inputs_pass_container_box">
                <input
                  type={showPassword?.cpassword ? 'text' : 'password'}
                  name="cnewpassword"
                  placeholder="*********"
                  value={password?.cnewpassword || ''}
                  onChange={HandlePassword}
                />
                {showPassword?.cpassword ? (
                  <i
                    className="fa-solid fa-eye-slash"
                    onClick={() => ShowHidePass({ cpassword: false })}
                  ></i>
                ) : (
                  <i
                    className="fa-solid fa-eye"
                    onClick={() => ShowHidePass({ cpassword: true })}
                  ></i>
                )}
              </div>
            </div>
          </div>

          <div className="save_changes_box_container">
            <button
              className="back_btn"
              disabled={loading && true}
              onClick={() => {
                setisConfirmed(!isConfirmed);
              }}
            >
              {loading ? <i className="fa fa-spinner fa-spin"></i> : 'Back'}
            </button>
            <button onClick={HandleUpdatePassword} disabled={loading && true}>
              {loading ? (
                <i className="fa fa-spinner fa-spin"></i>
              ) : (
                'Update Password'
              )}
            </button>
          </div>
        </>
      )}
    </div>
  );
}
