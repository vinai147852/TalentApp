import React from "react";
import { useState } from "react";
import { useNavigate } from "react-router";
import PhoneInput from "react-phone-input-2";
import { Link } from "react-router-dom";
import "./loginform.scss";
import { phoneinput_options } from "../Options";
import { axiosinstance } from "../../utils/axiosinstance";
import { toast } from "react-toastify";
import { Login } from "../../redux/UserSlice";
import { useDispatch } from "react-redux";

export default function LoginForm() {
  const [SelectInfo, setSelectInfo] = useState("mobileno");
  const [Auth, setAuth] = useState();
  const [password, setpassword] = useState();
  const [loading, setloading] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const HandleLogin = async () => {
    if (LoginValidation()) {
      setloading(true);
      try {
        const res = await axiosinstance.post("/user/auth/login", {
          Auth,
          password,
        });
        console.log("Login Response:", res.data);
        dispatch(Login(res.data));
        navigate("/");
        setloading(false);
      } catch (err) {
         console.log("Login error:");
        toast.error(err?.response.data);
        setloading(false);
      }
    }
  };

  const LoginValidation = () => {
    if (!setAuth) {
       console.log("Login validation:");
      toast.error("Enter a Valid Email or Mobile No");
      return false;
    } else if (!password) {
      toast.error("Enter a Valid Password");
      return false;
    } else {
      return true;
    }
  };
  return (
    <div className="main_login_form">
      <div className="inner_login_form">
        <div className="login_form_bx">
          <h2>Welcome to ETV TalenTapp</h2>
          <div className="login_cta_btns">
            <button
              className={
                SelectInfo === "mobileno"
                  ? "Login_Btns_cta active_Login_Btns_cta"
                  : "Login_Btns_cta"
              }
              onClick={() => setSelectInfo("mobileno")}
            >
              Mobile No
            </button>
            <button
              className={
                SelectInfo === "email"
                  ? "Login_Btns_cta active_Login_Btns_cta"
                  : "Login_Btns_cta"
              }
              onClick={() => setSelectInfo("email")}
            >
              Email
            </button>
          </div>
          <div className="login_input_feilds">
            {SelectInfo === "email" ? (
              <input
                type="email"
                placeholder="Your email"
                onChange={(e) => setAuth(e.target.value)}
              />
            ) : (
              <PhoneInput
                {...phoneinput_options}
                inputStyle={{ padding: "0px 15px 0px 50px" }}
                onChange={(e) => setAuth(e)}
              />
            )}
            <input
              type="password"
              placeholder="Enter password"
              onChange={(e) => setpassword(e.target.value)}
            />
          </div>
          <div className="login_btn">
            <button onClick={HandleLogin}>
              {loading ? <i className="fa fa-spinner fa-spin"></i> : "LOGIN"}
            </button>
          </div>
          <div className="goto_register">
            <p>
              <Link to="/forgotpassword">Forgot Password ?</Link>
            </p>
            <p>
              Dont have an account ?{" "}
              <span>
                <Link to="/register">Register Here</Link>{" "}
              </span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
