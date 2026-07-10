import React, { useState } from "react";
import { auth } from "../../../utils/firebase";
import { RecaptchaVerifier, signInWithPhoneNumber } from "firebase/auth";
import OtpPopup from "./OtpPopup";
import { useSelector, useDispatch } from "react-redux";
import { toast } from "react-toastify";
import AuthRequest from "../../../utils/axiosinstance";
import { Logout } from "../../../redux/UserSlice";

export default function DeleteAccount() {
  const User = useSelector((state) => state.user.user);
  const [loading, setLoading] = useState(false);
  const [otppopup, setotppopup] = useState(false);
  const [isdelete, setisdelete] = useState(false);
  const dispatch = useDispatch();

  // RecaptchaVerifier --------------------------------------------------------------
  const VerifyRecaptcha = () => {
    window.recaptchaVerifier = new RecaptchaVerifier(
      "send-otp",
      {
        size: "invisible",
      },
      auth
    );
  };

  const SendOtp = async () => {
    setLoading(true);
    let PhoneNumber = "+" + User?.mobileno;
    VerifyRecaptcha();
    const appVerifier = window.recaptchaVerifier;
    signInWithPhoneNumber(auth, PhoneNumber, appVerifier)
      .then((confirmationResult) => {
        window.confirmationResult = confirmationResult;
        setotppopup(true);
        setLoading(false);
      })
      .catch((error) => {
        toast.error(error?.message);
        setLoading(false);
      });
  };

  const isVerified = () => {
    HandleDelete();
    setotppopup(false);
  };

  const HandleDelete = async () => {
    setLoading(true);
    try {
      const res = await AuthRequest().post(`/user/delete/${User?._id}`, {
        userId: User?._id,
      });
      toast.success(res.data);
      dispatch(Logout());
      setLoading(false);
    } catch (error) {
      toast.error(error?.response.data);
      setLoading(false);
    }
  };

  const OnCloseOtp = () => {
    setotppopup(!otppopup);
  };

  const HandleisDelete = () => {
    SendOtp();
    setisdelete(!isdelete);
  };

  return (
    <div className="account_box_delete">
      {otppopup && <OtpPopup isVerified={isVerified} OnCloseOtp={OnCloseOtp} />}
      <div className="delete_account_details">
        <h2>Delete Your Account</h2>
        <p>By deleting your account you will lose all your data</p>
      </div>
      <button onClick={() => setisdelete(!isdelete)}>
        {loading ? <i className="fa fa-spinner fa-spin"></i> : "Delete account"}
      </button>
      {isdelete && (
        <div className="isdelete_container">
          <div className="inner_isdelete">
            <h2>Are you sure you want to delete your account ?</h2>
            <div className="btns_isdelete">
              <button onClick={() => setisdelete(!isdelete)}>Cancel</button>
              <button onClick={HandleisDelete}>
                {loading ? <i className="fa fa-spin fa-spinner"></i> : "Sure"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
