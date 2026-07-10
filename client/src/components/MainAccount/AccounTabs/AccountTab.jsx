import React, { useState } from "react";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import { phoneinput_options } from "../../Options";
import { useSelector, useDispatch } from "react-redux";
import { UploadImage } from "../../../utils/ImageUpload";
import { auth } from "../../../utils/firebase";
import { RecaptchaVerifier, signInWithPhoneNumber } from "firebase/auth";
import OtpPopup from "./OtpPopup";
import { toast } from "react-toastify";
import AuthRequest from "../../../utils/axiosinstance";
import { Login } from "../../../redux/UserSlice";
import DeleteAccount from "./DeleteAccount";

export default function AccountTab() {
  const User = useSelector((state) => state.user.user);
  const [ProfilePic, setProfilePic] = useState();
  const [values, setvalues] = useState();
  const [showPassword, setShowPassword] = useState({});
  const [loading, setLoading] = useState(false);
  const [otppopup, setotppopup] = useState(false);

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

  // Send Otp to Mobile number -----------------------------------------------

  const SendOtp = async () => {
    if (values?.password && values?.password !== values?.cpassword) {
      toast.error("Password & Confirm Password must be same");
      return;
    } else if (values?.email && !values.email.includes("@")) {
      toast.error("Invalid Email");
      return;
    } else {
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
    }
  };

  console.log(values);

  // if isVerified than Call Handle Update Function --------------------------------------
  const isVerified = () => {
    HandleUpdate();
    setotppopup(false);
  };

  // if There is Image Than upload and onSuccess Update User else Just Update User
  const HandleUpdate = async () => {
    if (ProfilePic) {
      setLoading(true);
      UploadImage({ Image: ProfilePic, OnSuccess, GetProgress });
    } else {
      setLoading(true);
      UpdateUser();
    }
  };

  // Update user on image upload ------------------------------------------
  const OnSuccess = (ProfilePic) => {
    UpdateUser(ProfilePic);
  };

  // Update User Template -------------------------------------------------
  const UpdateUser = async (ProfilePic) => {
    try {
      const res = await AuthRequest().put(
        "/user/update/profile",
        ProfilePic
          ? { ...values, ProfilePic, userId: User?._id }
          : { ...values, userId: User?._id }
      );
      toast.success(res.data.message);
      dispatch(Login({ ...res.data.item, accesstoken: User?.accesstoken }));
      setLoading(false);
      setvalues();
    } catch (err) {
      toast.error(err?.response.data);
      setLoading(false);
    }
  };

  // Get Progress of Image upload --------------------------------------
  const GetProgress = () => {};

  // Handle Form Values --------------------------------------------------------------
  const HandleValues = (e) => {
    if (typeof e === "string") {
      setvalues((prev) => ({ ...prev, mobileno: e }));
    } else {
      setvalues((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    }
  };

  const ShowHidePass = (e) => {
    setShowPassword({ ...showPassword, ...e });
  };

  const OnCloseOtp = () => {
    setotppopup(!otppopup);
  };

  return (
    <>
      <div className="main_box_container_account">
        {otppopup && (
          <OtpPopup isVerified={isVerified} OnCloseOtp={OnCloseOtp} />
        )}
        <div className="heading_box_container">
          <h2>Account</h2>
        </div>
        <h4 className="avatar_heading">Edit your profile picture</h4>
        <div className="avatar_account_box">
          <div className="main_account_pImg">
            <img
              src={
                ProfilePic ? URL.createObjectURL(ProfilePic) : User?.ProfilePic
              }
              alt=""
            />
          </div>
          <div className="profile_account_img_cta">
            <label className="active" htmlFor="ProfilePic">
              Upload New Image
            </label>
            <input
              type="file"
              id="ProfilePic"
              accept="image/png, image/jpeg"
              onChange={(e) => {
                const validImageTypes = ["image/jpeg", "image/png"];
                if (e.target.files[0].size > 500000) {
                  toast.error("Image must be less than 500 Kbs");
                } else if (
                  !validImageTypes.includes(e.target.files[0]["type"])
                ) {
                  toast.error("Only Png & Jpg will be accepted");
                } else {
                  setProfilePic(e.target.files[0]);
                }
              }}
            />
          </div>
        </div>
        <div className="account_box_data_settings">
          <div className="input_bx">
            <div className="label_inputs">
              <label htmlFor="">Name</label>
            </div>
            <input
              type="text"
              name="name"
              defaultValue={User?.name}
              placeholder="Enter your name"
              onChange={HandleValues}
            />
          </div>
          <div className="input_bx">
            <div className="label_inputs">
              <label htmlFor="">Surname</label>
            </div>
            <input
              type="text"
              name="surname"
              defaultValue={User?.surname}
              placeholder="Enter your name"
              onChange={HandleValues}
            />
          </div>
          <div className="input_bx">
            <div className="label_inputs">
              <label htmlFor="">Email</label>
            </div>
            <input
              type="email"
              name="email"
              defaultValue={User?.email}
              placeholder="Enter your email ID"
              onChange={HandleValues}
            />
          </div>
          <div className="input_bx">
            <div className="label_inputs">
              <label htmlFor="">Phone Number</label>
            </div>
            <PhoneInput
              {...phoneinput_options}
              value={User?.mobileno}
              onChange={HandleValues}
            />
          </div>
          <div className="input_bx">
            <div className="label_inputs">
              <label htmlFor="">Enter Password</label>
            </div>
            <div className="inputs_pass_container_box">
              <input
                type={showPassword?.password ? "text" : "password"}
                defaultValue={values?.password || ""}
                name="password"
                placeholder="**********"
                onChange={HandleValues}
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
                type={showPassword?.cpassword ? "text" : "password"}
                name="cpassword"
                placeholder="**********"
                defaultValue={values?.cpassword || ""}
                onChange={HandleValues}
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

        <DeleteAccount />

        <div className="save_changes_box_container">
          <button
            onClick={SendOtp}
            disabled={((!values && !ProfilePic) || loading) && true}
            id="send-otp"
          >
            {loading ? (
              <i className="fa fa-spinner fa-spin"></i>
            ) : (
              "Save changes"
            )}
          </button>
        </div>
      </div>
    </>
  );
}
