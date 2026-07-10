import React, { useState } from 'react';
import './mainlogin.scss';
import Logo from '../../images/Logo.png';
import Proto from '../../images/super-admin-login.jpg';
import { axiosinstance } from '../../utils/axiosinstance';
import { toast } from 'react-toastify';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { Login } from '../../redux/AdminSlice';
import { CreateAdminLogs } from '../../utils/AdminLogs';

export default function MainLogin() {
  const [loading, setloading] = useState(false);
  const [showpass, setshowpass] = useState(false);
  const [formvalues, setFormValues] = useState({});
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const HandleAdmin = async (e) => {
    e.preventDefault();
    if (Validation()) {
      setloading(true);
      try {
        const res = await axiosinstance.post('/auth/admin/login', formvalues);
        //setloading(false);
        //window.location.href = '/';
        dispatch(Login(res.data));
        res.data.role !== 1 &&
          CreateAdminLogs({
            Id: res.data?._id,
            status: 1,
          });
          setloading(false);
        navigate('/');
      } catch (err) {
        toast.error(err?.response.data);
        setloading(false);
      }
    }
  };

  const Handlevalues = (e) => {
    setFormValues({
      ...formvalues,
      [e.target.name]: e.target.value,
    });
  };

  const Validation = () => {
    if (!formvalues.email) {
      toast.error('Please Enter Email');
      return false;
    } else if (
      !formvalues.email.includes('@') ||
      !formvalues.email.includes('.')
    ) {
      toast.error('Please enter a valid Email');
      return false;
    } else if (!formvalues.password) {
      toast.error('Please enter a password');
      return false;
    } else {
      return true;
    }
  };
  return (
    <div className="main_login_admin_form">
      <div className="inner_admin_login_box">
        <div className="left_admin_main_form">
          <div className="main_admin_form_feilds">
            <div className="form_logo_admin_login">
              <img src={Logo} alt="" />
            </div>
            <h2>Login with your account</h2>
            <form>
              <div className="input_bx">
                <label>Email</label>
                <input
                  type="email"
                  name="email"
                  placeholder="example@etv.com"
                  onChange={Handlevalues}
                />
              </div>
              <div className="input_bx">
                <label>Password</label>
                <input
                  name="password"
                  type={!showpass ? 'password' : 'text'}
                  placeholder="********"
                  onChange={Handlevalues}
                />
                {!showpass ? (
                  <i
                    className="fa-solid fa-eye"
                    onClick={() => setshowpass(!showpass)}
                  ></i>
                ) : (
                  <i
                    className="fa-solid fa-eye-slash"
                    onClick={() => setshowpass(!showpass)}
                  ></i>
                )}
              </div>
              <button onClick={HandleAdmin} disabled={loading && true}>
                {loading ? <i className="fa fa-spinner fa-spin"></i> : 'Login'}
              </button>
            </form>
          </div>
        </div>
        <div className="right_admin_main_form">
          <div className="image_right_form">
            <img src={Proto} alt="" />
          </div>
        </div>
      </div>
    </div>
  );
}
