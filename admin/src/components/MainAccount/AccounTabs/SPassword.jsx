import React, { useState } from 'react';
import { useEffect } from 'react';
import { toast } from 'react-toastify';
import AuthRequest from '../../../utils/axiosinstance';

export default function SPassword() {
  const [password, setPassword] = useState({});
  const [showPassword, setShowPassword] = useState({});
  const [loading, setLoading] = useState(false);
  const [updates, setUpdates] = useState(false);
  const [superpassword, setsuperpassword] = useState();

  useEffect(() => {
    const GetSpassword = async () => {
      try {
        const res = await AuthRequest().get('/spassword/get');
        setsuperpassword(res.data);
      } catch (error) {
        console.log(error);
      }
    };
    GetSpassword();
  }, [updates]);

  const HandleUpdatePassword = async () => {
    if (!password.password) {
      toast.error('Plaese Enter New Password');
    } else if (!password.cpassword) {
      toast.error('Plaese Confirm New Password');
    } else if (password.password !== password.cpassword) {
      toast.error('Password & confirm Password must be same');
    } else {
      try {
        setLoading(!loading);
        const res = await AuthRequest().post(`/spassword/create`, {
          password: password.password,
        });
        toast.success(res.data);
        setPassword({});
        setShowPassword({});
        setUpdates(!updates);
        setLoading(false);
      } catch (err) {
        toast.error(err?.response.data);
        setLoading(false);
      }
    }
  };

  const HandlePassword = (e) => {
    setPassword((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const ShowHidePass = (e) => {
    setShowPassword({ ...showPassword, ...e });
  };

  const CopyToClipboard = () => {
    navigator.clipboard.writeText(superpassword);
    toast.success('Copied to Clipboard');
  };

  return (
    <div className="main_box_container_account">
      <div className="heading_box_container">
        <h2>Super Password</h2>
        <p>This password for every account login</p>
      </div>

      <div className="display_super_password">
        <div className="input_bx">
          <input
            type="text"
            placeholder="You Super Password"
            value={superpassword || 'No Super Password Added'}
            readOnly
          />
          <i
            className={`fa-regular fa-copy ${!superpassword && 'disabled'}`}
            onClick={CopyToClipboard}
          ></i>
        </div>
      </div>

      <>
        <div className="account_box_data_settings">
          <div className="input_bx">
            <div className="label_inputs">
              <label htmlFor="">New Super Password</label>
            </div>
            <div className="inputs_pass_container_box">
              <input
                type={showPassword?.password ? 'text' : 'password'}
                name="password"
                placeholder="*********"
                value={password?.password || ''}
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
              <label htmlFor="">Confirm Super Password</label>
            </div>
            <div className="inputs_pass_container_box">
              <input
                type={showPassword?.cpassword ? 'text' : 'password'}
                name="cpassword"
                placeholder="*********"
                value={password?.cpassword || ''}
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
          <button onClick={HandleUpdatePassword}>
            {loading ? (
              <i className="fa fa-spinner fa-spin"></i>
            ) : (
              'Update Password'
            )}
          </button>
        </div>
      </>
    </div>
  );
}
