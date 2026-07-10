import React, { useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
// import OTPInput from "otp-input-react";
import PhoneInput from "react-phone-input-2";
import { toast } from "react-toastify";
import { CircularProgressbar } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import {
  category_options,
  gender_options,
  Height_options,
  languages_options,
  options_styles,
  phoneinput_options,
  subcategory_options,
} from "../Options";
import Select from "react-select";
import "./registerform.scss";
import Ref1 from "../../images/ref-1.jpg";
import Ref2 from "../../images/ref-2.jpg";
import Ref3 from "../../images/ref-3.jpg";
import Ref4 from "../../images/ref-4.jpg";
import Fb from "../../images/fb.jpg";
import Tw from "../../images/twitter.png";
import In from "../../images/in.jpg";
import Yt from "../../images/yt.png";
import { axiosinstance } from "../../utils/axiosinstance";
// import { auth } from "../../utils/firebase";
// import { RecaptchaVerifier, signInWithPhoneNumber } from "firebase/auth";
import { UploadImage } from "../../utils/ImageUpload";
import { CreateNotification } from "../../utils/CreateNotification";
import { useMemo } from "react";

export default function Registerform() {
  const [count, setCount] = useState(60);
  const [images, setImages] = useState({});
  const [values, setValues] = useState();
  const [progress, setProgress] = useState();
  // const [otp, setOtp] = useState(null); // Commented out unused OTP state
  const [slide, setSlide] = useState(1);
  const [portfoliolinks, setPortfoliolinks] = useState([]);
  const [loading, setLoading] = useState(false);
  const DateofBirthRef = useRef();
  const subcategory_ref = useRef();
  const navigate = useNavigate();

  // Commented out Firebase OTP/Recaptcha logic for future use.
  // const VerifyRecaptcha = () => {
  //   window.recaptchaVerifier = new RecaptchaVerifier(
  //     "send-otp",
  //     {
  //       size: "invisible",
  //     },
  //     auth
  //   );
  // };

  // Delete User If Failed To Send Otp ------------------------------------------------------

  // const HandleDeleteUser = async (Id, accesstoken) => {
  //   try {
  //     await AuthRequest().post(
  //       `/user/delete/${Id}`,
  //       {
  //         userId: Id,
  //       },
  //       { headers: { token: `Bearer ${accesstoken}` } }
  //     );
  //   } catch (error) {
  //     console.log(error?.response.data);
  //   }
  // };

  // Main Registration Process -----------------------------------------------------------------

  const HandleRegistration = async () => {
    if (Validation()) {
      setLoading(true);
      try {
        const res = await axiosinstance.post("/user/auth/register", values);
        // Set Date From BackendApi -----------------------------------------------
        setValues({
          mobileno: res.data?.mobileno,
          userId: res.data?._id,
          accesstoken: res.data?.accesstoken,
        });
        // Directly proceed to next slide or update profile, skipping OTP
        setSlide((prev) => prev + 1); // or call HandleUpdate() if that's your flow
        setLoading(false);
      } catch (err) {
        toast.error(err?.response.data);
        setLoading(false);
      }
    }
  };

  // Resend Opt -------------------------------       -----------------------------------

  // const ResendOtp = () => {
  //   let PhoneNumber = "+" + values?.mobileno;
  //   VerifyRecaptcha();
  //   const appVerifier = window.recaptchaVerifier;
  //   signInWithPhoneNumber(auth, PhoneNumber, appVerifier)
  //     .then((confirmationResult) => {
  //       window.confirmationResult = confirmationResult;
  //       setCount(60);
  //     })
  //     .catch((error) => {
  //       toast.error(error?.message);
  //     });
  // };

  // Verify Otp Here --------------------------------------------------------------------------
  // const VerifyOtp = () => {
  //   setLoading(true);
  //   let confirmationResult = window.confirmationResult;
  //   confirmationResult
  //     .confirm(otp)
  //     .then(() => {
  //       setLoading(false);
  //       setSlide((prev) => prev + 1);
  //     })
  //     .catch(() => {
  //       toast.error("Invalid Code");
  //       setLoading(false);
  //     });
  // };

  // Update User and mark profile as completed

  const HandleUpdate = async () => {
    setLoading(true);
    try {
      const { mobileno, ...others } = values;
      mobileno.replace(" ", "");
      const res = await axiosinstance.put(
        "/user/update/profile",
        {
          ...others,
          isCompleted: true,
        },
        { headers: { token: `Bearer ${values?.accesstoken}` } }
      );
      toast.success("Registered Successfully");
      navigate("/login");
      setLoading(false);

      // Notification Templte -----------------------------------------------------

      const notification_tem = {
        data: {
          image: res.data.item?.image1,
          title: `A New User ${
            res.data.item.name + " " + res.data.item.surname
          } Registered `,
          desc: `Users List`,
        },
        link: `/profile/${res.data.item?._id}`,
        forAdmins: true,
      };

      CreateNotification(notification_tem);
    } catch (error) {
      toast.error(error?.response.data);
      setLoading(false);
    }
  };

  // Handle Upload images on change

  const HandleImages = (e) => {
    const validImageTypes = ["image/jpeg", "image/png"];
    if (e.target.files[0].size > 500000) {
      toast.error("You can Upload Image of max 500 Kbs");
    } else if (!validImageTypes.includes(e.target.files[0]["type"])) {
      toast.error("Only Png & Jpg will be accepted");
    } else {
      setImages((prev) => ({ ...prev, [e.target.name]: e.target.files[0] }));
    }
  };

  const OnSuccess = (item) => {
    setValues((prev) => ({ ...prev, ...item }));
    setProgress();
    values.category === "Artist" || values.category === "Anchor"
      ? item.image4 && setSlide((prev) => prev + 1)
      : setSlide((prev) => prev + 1);
  };

  const GetProgress = (item) => {
    setProgress((prev) => ({ ...prev, ...item }));
  };

  const HandleUploadImages = () => {
    const Image1 = images?.image1;
    const Image2 = images?.image2;
    const Image3 = images?.image3;
    const Image4 = images?.image4;

    if (Image1) {
      Image1["id"] = "image1";
      UploadImage({ Image: Image1, OnSuccess, GetProgress });
    }
    if (Image2) {
      Image2["id"] = "image2";
      UploadImage({ Image: Image2, OnSuccess, GetProgress });
    }
    if (Image3) {
      Image3["id"] = "image3";
      UploadImage({ Image: Image3, OnSuccess, GetProgress });
    }
    if (Image4) {
      Image4["id"] = "image4";
      UploadImage({ Image: Image4, OnSuccess, GetProgress });
    }
  };
  // Registration Process Utils -------------------------------------------------------------------

  const HandleValues = (e) => {
    if (typeof e === "string") {
      setValues((prev) => ({ ...prev, ["mobileno"]: e }));
    } else if (e?.name) {
      setValues((prev) => ({ ...prev, [e.name]: e.value }));
    } else if (e?.target.name) {
      setValues((prev) => ({ ...prev, [e?.target.name]: e?.target.value }));
    }
  };

  const HandleMultiValues = (e) => {
    setValues((prev) => ({ ...prev, ["knownlanguages"]: e }));
  };

  const GetAge = () => {
    var today = new Date();
    var birthDate = new Date(values?.dateofbirth);
    var age = today.getFullYear() - birthDate.getFullYear();
    var m = today.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    DateofBirthRef.current.value = `${age} years old`;
  };

  const HandlePortfolioLinks = () => {
    if (!values?.portfoliolink) {
      toast.error("Please Add Portfolio");
    } else {
      if (!portfoliolinks?.includes(values?.portfoliolink)) {
        setPortfoliolinks((prev) => [...prev, values?.portfoliolink]);
        setValues({ ...values, ["portfoliolink"]: "" });
      } else {
        toast.error("Link Already Added");
      }
    }
  };

  const RemovePortfolioLink = (e) => {
    setPortfoliolinks(
      portfoliolinks?.filter((item) => {
        if (item !== e) {
          return item;
        }
      })
    );
  };

  const GoBack = () => {
    setSlide((prev) => prev - 1);
  };

  const NextSlide = () => {
    slide === 3 && CatValidation() && setSlide((prev) => prev + 1);
    slide === 4 && AboutValidation() && setSlide((prev) => prev + 1);

    values.category === "Artist" || values.category === "Anchor"
      ? slide === 5 && ImageValidation() && setSlide((prev) => prev + 1)
      : slide === 5 && setSlide((prev) => prev + 1);
    slide === 6 && setSlide((prev) => prev + 1);
    slide === 7 &&
      (setValues((prev) => ({ ...prev, ["portfolio"]: portfoliolinks })) ||
        setSlide((prev) => prev + 1));
  };

  // Validations ---------------------------------------------------------------------------------

  const Validation = () => {
    if (!values?.name) {
      toast.error("Please Enter Name");
      return false;
    } else if (!values?.surname) {
      toast.error("Please Enter Surname");
      return false;
    } else if (!values?.mobileno) {
      toast.error("Please Enter Mobile no");
      return false;
    } else if (values?.mobileno.length < 6) {
      toast.error("Please Enter a valid Mobile no");
      return false;
    } else if (!values?.password) {
      toast.error("Please Enter Password");
      return false;
    } else if (values?.password.length < 6) {
      toast.error("Password must be atleast 6 Characters Long");
      return false;
    } else if (!values?.cpassword) {
      toast.error("Please Confirm Password");
      return false;
    } else if (values?.password !== values?.cpassword) {
      toast.error("Password & Confirm Password must be same");
      return false;
    } else {
      return true;
    }
  };

  const ImageValidation = () => {
    if (
      !images?.image1 ||
      !images?.image2 ||
      !images?.image3 ||
      !images?.image4
    ) {
      toast.error("Please Upload All Images");
      return false;
    } else {
      return true;
    }
  };

  const CatValidation = () => {
    const subcategories = subcategory_options?.filter(
      (item) => item?.target === values?.category
    );
    if (!values?.category) {
      toast.error("Please Select Category");
      return false;
    } else if (!values?.subcategory && subcategories.length > 0) {
      toast.error("Please Select SubCategory");
      return false;
    } else {
      return true;
    }
  };

  const AboutValidation = () => {
    if (!values?.dateofbirth) {
      toast.error("Please Enter Date of birth");
      return false;
    } else if (!values?.gender) {
      toast.error("Please Select Gender");
      return false;
    } else if (!values?.height) {
      toast.error("Please Select Height");
      return false;
    } else if (!values?.weight) {
      toast.error("Please Enter Weight");
      return false;
    } else if (values?.weight > 200) {
      toast.error("Weight must be less than 200 Kgs");
      return false;
    } else if (!values?.motherlanguage) {
      toast.error("Please Select Mother Language");
      return false;
    } else if (!values?.knownlanguages) {
      toast.error("Please Select Known Languages");
      return false;
    } else if (!values?.state) {
      toast.error("Please Select State");
      return false;
    } else if (!values?.city) {
      toast.error("Please Enter Your City");
      return false;
    } else {
      return true;
    }

    // else if (
    //   (values?.category === "Artist" || values?.category === "Anchor") &&
    //   !values?.chest
    // ) {
    //   toast.error("Please Enter Your Chest");
    //   return false;
    // } else if (
    //   (values?.category === "Artist" || values?.category === "Anchor") &&
    //   !values?.waist
    // ) {
    //   toast.error("Please Enter Your Waist");
    //   return false;
    // } else if (
    //   (values?.category === "Artist" || values?.category === "Anchor") &&
    //   !values?.shoulders
    // ) {
    //   toast.error("Please Enter Your Shoulders");
    //   return false;
    // } else if (
    //   (values?.category === "Artist" || values?.category === "Anchor") &&
    //   !values?.hips
    // ) {
    //   toast.error("Please Enter Your Hips");
    //   return false;
    // }
  };

  useMemo(() => {
    subcategory_ref.current?.setValue(null);
    delete values?.subcategory;
  }, [values?.category]);

  console.log(values);

  useMemo(() => {
    slide === 2 && count > 0 && setTimeout(() => setCount(count - 1), 1000);
  }, [count, slide]);

  return (
    <div className="register_container">
      <div className="inner_register_container">
        <div className="register_body">
          {/*  First Slide --------------------------------------------------------------- */}
          {slide === 1 && (
            <div className="register_box">
              <div className="heading_register_box">
                <h2>Register ETV-Talentapp</h2>
                <p>
                  Your can register with ETV-Talentapp by filling few details
                </p>
              </div>
              <div className="inner_register_box">
                <div className="input_bx">
                  <input
                    type="text"
                    name="name"
                    defaultValue={values?.name}
                    placeholder="Enter Name"
                    onChange={HandleValues}
                  />
                </div>
                <div className="input_bx">
                  <input
                    type="text"
                    name="surname"
                    defaultValue={values?.surname}
                    placeholder="Enter Surname"
                    onChange={HandleValues}
                  />
                </div>
                <div className="input_bx">
                  <input
                    type="email"
                    name="email"
                    placeholder="Enter Email (Optional)"
                    onChange={HandleValues}
                  />
                </div>
                <div className="input_bx">
                  <PhoneInput
                    {...phoneinput_options}
                    onChange={(e) => HandleValues(e)}
                  />
                </div>
                <div className="input_bx">
                  <input
                    type="password"
                    name="password"
                    placeholder="Enter Password"
                    defaultValue={values?.password}
                    onChange={HandleValues}
                  />
                </div>
                <div className="input_bx">
                  <input
                    type="password"
                    name="cpassword"
                    placeholder="Confirm Password"
                    defaultValue={values?.cpassword}
                    onChange={HandleValues}
                  />
                </div>
              </div>
              <div className="inner_register_bx_btns">
                <button
                  id="send-otp"
                  className="black_btn"
                  onClick={HandleRegistration}
                  disabled={loading && true}
                >
                  {loading ? (
                    <i className="fa fa-spinner fa-spin"></i>
                  ) : (
                    "Register"
                  )}
                </button>
              </div>
            </div>
          )}
          {/*  First Slide --------------------------------------------------------------- */}
          {/* Second Slide -------------------------------------------------------------- */}
          {slide === 2 && null}
          {/* <div className="register_box">
            <div className="heading_register_box">
              <h2>Verify OTP *</h2>
              <p>
                Your can register with ETV-Talentapp by filling few details
              </p>
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
            <div className="inner_register_otp_btns">
              <button
                disabled={(count || loading) && true}
                id="send-otp"
              >
                {count
                  ? count > 9
                    ? "00 : " + count
                    : "00 : 0" + count
                  : "Send Again"}
              </button>
              {/* <button
                className="black_btn"
                onClick={VerifyOtp}
                disabled={(otp === null || otp?.length < 6) && true}
              >
                {loading ? (
                  <i className="fa fa-spinner fa-spin"></i>
                ) : (
                  "Verify Otp"
                )}
              </button> */}
          {/* </div>
          </div>
        )} */}
          {/* Second Slide -------------------------------------------------------------- */}

          {/* Third Slide -------------------------------------------------------------- */}
          {slide === 3 && (
            <div className="register_box">
              <div className="heading_register_box">
                <h2>Register ETV-Talentapp *</h2>
                <p>
                  Your can register with ETV-Talentapp by filling few details
                </p>
              </div>
              <div className="inner_register_box category_selection">
                <div className="input_bx">
                  <Select
                    styles={options_styles}
                    options={category_options}
                    defaultInputValue={values?.category}
                    onChange={HandleValues}
                    placeholder="Select Category"
                  />
                </div>
                <div className="input_bx">
                  <Select
                    ref={subcategory_ref}
                    styles={options_styles}
                    isDisabled={!values?.category}
                    defaultInputValue={values?.subcategory || ""}
                    options={subcategory_options.filter((item) => {
                      if (
                        item.target?.toLocaleLowerCase() ===
                        values?.category?.toLocaleLowerCase()
                      ) {
                        return item;
                      }
                    })}
                    onChange={HandleValues}
                    placeholder="Select Sub Category"
                  />
                </div>
              </div>
              <div className="inner_register_btns_lr">
                <p></p>
                <button className="black_btn" onClick={NextSlide}>
                  Next
                </button>
              </div>
            </div>
          )}
          {/* Third Slide -------------------------------------------------------------- */}

          {/* Fourth Slide -------------------------------------------------------------- */}
          {slide === 4 && (
            <div className="register_box">
              <div className="heading_register_box">
                <h2>Tell Us About Your Self *</h2>
                <p>
                  Fill all the required feilds to create a proffessional account
                  on ETV-Talentapp
                </p>
              </div>
              <div className="inner_register_box">
                <div className="register_box_content_grids">
                  <div className="input_bx">
                    <input
                      type="text"
                      ref={DateofBirthRef}
                      defaultValue={values?.dateofbirth}
                      placeholder="Your Date of Birth *"
                      name="dateofbirth"
                      onFocus={(e) => {
                        e.target.setAttribute("type", "date");
                      }}
                      onBlur={(e) => {
                        e.target.setAttribute("type", "text");
                        values?.dateofbirth && GetAge();
                      }}
                      onChange={HandleValues}
                    />
                  </div>
                  <div className="input_bx">
                    <Select
                      styles={options_styles}
                      options={gender_options}
                      defaultInputValue={values?.gender}
                      placeholder="Your Gender *"
                      onChange={HandleValues}
                    />
                  </div>
                  <div className="input_bx">
                    <Select
                      styles={options_styles}
                      options={Height_options}
                      placeholder="Your Height *"
                      defaultInputValue={values?.height}
                      onChange={HandleValues}
                    />
                  </div>
                  <div className="input_bx">
                    <input
                      type="number"
                      name="weight"
                      defaultValue={values?.weight}
                      placeholder="Your Weight (Kg) *"
                      min={1}
                      onInput={(e) => {
                        if (e.target.value < e.target.min) {
                          e.target.value = "";
                        } else if (e.target.value.length > e.target.maxLength) {
                          e.target.value = e.target.value.slice(
                            0,
                            e.target.maxLength
                          );
                        }
                      }}
                      maxLength={3}
                      onChange={HandleValues}
                    />
                  </div>
                  <div className="input_bx">
                    <Select
                      styles={options_styles}
                      options={languages_options}
                      defaultInputValue={values?.motherlanguage}
                      placeholder="Mother Language *"
                      onChange={HandleValues}
                    />
                  </div>
                  <div className="input_bx ismulti">
                    <Select
                      styles={options_styles}
                      options={languages_options}
                      placeholder="Known Languages *"
                      defaultValue={values?.knownlanguages?.map((item) => {
                        return item;
                      })}
                      isMulti={true}
                      onChange={HandleMultiValues}
                    />
                  </div>
                  <div className="input_bx">
                    <Select
                      styles={options_styles}
                      defaultInputValue={values?.state}
                      options={[
                        {
                          label: "Andhra Pradesh",
                          value: "Andhra Pradesh",
                          name: "state",
                        },
                        {
                          label: "Telangana",
                          value: "Telangana",
                          name: "state",
                        },
                        {
                          label: "Arunachal Pradesh",
                          value: "Arunachal Pradesh",
                          name: "state",
                        },
                        { label: "Assam", value: "Assam", name: "state" },
                        { label: "Bihar", value: "Bihar", name: "state" },
                        {
                          label: "Chhattisgarh",
                          value: "Chhattisgarh",
                          name: "state",
                        },
                        { label: "Goa", value: "Goa", name: "state" },
                        { label: "Gujarat", value: "Gujarat", name: "state" },
                        { label: "Haryana", value: "Haryana", name: "state" },
                        {
                          label: "Himachal Pradesh",
                          value: "Himachal Pradesh",
                          name: "state",
                        },
                        {
                          label: "Jharkhand",
                          value: "Jharkhand",
                          name: "state",
                        },
                        {
                          label: "Karnataka",
                          value: "Karnataka",
                          name: "state",
                        },
                        { label: "Kerala", value: "Kerala", name: "state" },
                        {
                          label: "Madhya Pradesh",
                          value: "Madhya Pradesh",
                          name: "state",
                        },
                        {
                          label: "Maharashtra",
                          value: "Maharashtra",
                          name: "state",
                        },
                        { label: "Manipur", value: "Manipur", name: "state" },
                        {
                          label: "Meghalaya",
                          value: "Meghalaya",
                          name: "state",
                        },
                        { label: "Odisha", value: "Odisha", name: "state" },
                        { label: "Punjab", value: "Punjab", name: "state" },
                        {
                          label: "Rajasthan",
                          value: "Rajasthan",
                          name: "state",
                        },
                        { label: "Sikkim", value: "Sikkim", name: "state" },
                        {
                          label: "Tamil Nadu",
                          value: "Tamil Nadu",
                          name: "state",
                        },
                        { label: "Tripura", value: "Tripura", name: "state" },
                        {
                          label: "Uttar Pradesh",
                          value: "Uttar Pradesh",
                          name: "state",
                        },
                        {
                          label: "Uttarakhand",
                          value: "Uttarakhand",
                          name: "state",
                        },
                        {
                          label: "West Bengal",
                          value: "West Bengal",
                          name: "state",
                        },
                        { label: "Delhi", value: "Delhi", name: "state" },
                        { label: "Ladakh", value: "Ladakh", name: "state" },
                        {
                          label: "Lakshadweep",
                          value: "Lakshadweep",
                          name: "state",
                        },
                        {
                          label: "Jammu and Kashmir",
                          value: "Jammu and Kashmir",
                          name: "state",
                        },
                        {
                          label: "Puducherry",
                          value: "Puducherry",
                          name: "state",
                        },
                        {
                          label: "Andaman and Nicobar Island",
                          value: "Andaman and Nicobar Island",
                          name: "state",
                        },
                        {
                          label: "Dadra and Nagar Haveli and Daman and Diu",
                          value: "Dadra and Nagar Haveli and Daman and Diu",
                          name: "state",
                        },
                      ]}
                      onChange={HandleValues}
                      placeholder="Select State *"
                    />
                  </div>
                  <div className="input_bx">
                    <input
                      type="text"
                      name="city"
                      defaultValue={values?.city}
                      placeholder="Enter City *"
                      onChange={HandleValues}
                    />
                  </div>
                </div>
                {(values.category === "Artist" ||
                  values.category === "Anchor") && (
                  <div className="vital_mesurments_container">
                    <p>Vitals Measurements (Inches) (Optional)</p>
                    <div className="vital_mesurments_inner">
                      <div className="input_bx">
                        <input
                          type="number"
                          name="chest"
                          defaultValue={values?.chest}
                          placeholder="Your Chest"
                          onChange={HandleValues}
                          min={1}
                          maxLength={2}
                          onInput={(e) => {
                            if (e.target.value < e.target.min) {
                              e.target.value = "";
                            } else if (
                              e.target.value.length > e.target.maxLength
                            ) {
                              e.target.value = e.target.value.slice(
                                0,
                                e.target.maxLength
                              );
                            }
                          }}
                        />
                      </div>
                      <div className="input_bx">
                        <input
                          type="number"
                          name="waist"
                          defaultValue={values?.waist}
                          placeholder="Your Waist"
                          onChange={HandleValues}
                          min={1}
                          maxLength={2}
                          onInput={(e) => {
                            if (e.target.value < e.target.min) {
                              e.target.value = "";
                            } else if (
                              e.target.value.length > e.target.maxLength
                            ) {
                              e.target.value = e.target.value.slice(
                                0,
                                e.target.maxLength
                              );
                            }
                          }}
                        />
                      </div>
                      <div className="input_bx">
                        <input
                          type="number"
                          name="shoulders"
                          defaultValue={values?.shoulders}
                          placeholder="Your Shoulders"
                          onChange={HandleValues}
                          min={1}
                          maxLength={2}
                          onInput={(e) => {
                            if (e.target.value < e.target.min) {
                              e.target.value = "";
                            } else if (
                              e.target.value.length > e.target.maxLength
                            ) {
                              e.target.value = e.target.value.slice(
                                0,
                                e.target.maxLength
                              );
                            }
                          }}
                        />
                      </div>
                      <div className="input_bx">
                        <input
                          type="number"
                          name="hips"
                          defaultValue={values?.hips}
                          placeholder="Your Hips"
                          onChange={HandleValues}
                          min={1}
                          maxLength={2}
                          onInput={(e) => {
                            if (e.target.value < e.target.min) {
                              e.target.value = "";
                            } else if (
                              e.target.value.length > e.target.maxLength
                            ) {
                              e.target.value = e.target.value.slice(
                                0,
                                e.target.maxLength
                              );
                            }
                          }}
                        />
                      </div>
                    </div>
                  </div>
                )}
              </div>
              <div className="inner_register_btns_lr">
                <button className="back_btn" onClick={GoBack}>
                  Back
                </button>
                <button className="black_btn" onClick={NextSlide}>
                  Next
                </button>
              </div>
            </div>
          )}
          {/* Fourth Slide -------------------------------------------------------------- */}

          {/* Fifth Slide -------------------------------------------------------------- */}
          {slide === 5 && (
            <div className="register_box">
              <div className="heading_register_box">
                <h2>Upload Your Photos *</h2>
                <p>You must upload photos as per the sample shown here</p>
              </div>
              {values.category === "Artist" || values.category === "Anchor" ? (
                <div className="images_container_grid">
                  <div className="image_upload_container">
                    <div className="image_uploader">
                      <label htmlFor="image1">
                        <i className="fa-solid fa-cloud-arrow-up"></i>
                      </label>
                      <input
                        type="file"
                        accept="image/png, image/jpeg"
                        name="image1"
                        id="image1"
                        onChange={HandleImages}
                      />
                    </div>

                    {progress?.image1 !== undefined &&
                      progress?.image1 !== 100 && (
                        <div className="image_loader">
                          <div className="image_inner_loader">
                            <CircularProgressbar
                              value={progress?.image1}
                              text={`${progress?.image1}%`}
                              styles={{ stroke: "2px solid black" }}
                            />
                          </div>
                        </div>
                      )}

                    <div className="main_image_conatiner">
                      <img
                        src={
                          images?.image1
                            ? URL.createObjectURL(images?.image1)
                            : Ref1
                        }
                        alt=""
                      />
                    </div>
                  </div>
                  <div className="image_upload_container">
                    <div className="image_uploader">
                      <label htmlFor="image2">
                        {" "}
                        <i className="fa-solid fa-cloud-arrow-up"></i>
                      </label>
                      <input
                        type="file"
                        name="image2"
                        accept="image/png, image/jpeg"
                        id="image2"
                        onChange={HandleImages}
                      />
                    </div>
                    {progress?.image2 !== undefined &&
                      progress?.image2 !== 100 && (
                        <div className="image_loader">
                          <div className="image_inner_loader">
                            <CircularProgressbar
                              value={progress?.image2}
                              text={`${progress?.image2}%`}
                              styles={{ stroke: "2px solid black" }}
                            />
                          </div>
                        </div>
                      )}

                    <div className="main_image_conatiner">
                      <img
                        src={
                          images?.image2
                            ? URL.createObjectURL(images?.image2)
                            : Ref2
                        }
                        alt=""
                      />
                    </div>
                  </div>
                  <div className="image_upload_container">
                    <div className="image_uploader">
                      <label htmlFor="image3">
                        {" "}
                        <i className="fa-solid fa-cloud-arrow-up"></i>
                      </label>
                      <input
                        type="file"
                        name="image3"
                        accept="image/png, image/jpeg"
                        id="image3"
                        onChange={HandleImages}
                      />
                    </div>

                    {progress?.image3 !== undefined &&
                      progress?.image3 !== 100 && (
                        <div className="image_loader">
                          <div className="image_inner_loader">
                            <CircularProgressbar
                              value={progress?.image3}
                              text={`${progress?.image3}%`}
                              styles={{ stroke: "2px solid black" }}
                            />
                          </div>
                        </div>
                      )}

                    <div className="main_image_conatiner">
                      <img
                        src={
                          images?.image3
                            ? URL.createObjectURL(images?.image3)
                            : Ref3
                        }
                        alt=""
                      />
                    </div>
                  </div>
                  <div className="image_upload_container">
                    <div className="image_uploader">
                      <label htmlFor="image4">
                        <i className="fa-solid fa-cloud-arrow-up"></i>
                      </label>
                      <input
                        type="file"
                        name="image4"
                        accept="image/png, image/jpeg"
                        id="image4"
                        onChange={HandleImages}
                      />
                    </div>

                    {progress?.image4 !== undefined &&
                      progress?.image4 !== 100 && (
                        <div className="image_loader">
                          <div className="image_inner_loader">
                            <CircularProgressbar
                              value={progress?.image4}
                              text={`${progress?.image4}%`}
                              styles={{ stroke: "2px solid black" }}
                            />
                          </div>
                        </div>
                      )}

                    <div className="main_image_conatiner">
                      <img
                        src={
                          images?.image4
                            ? URL.createObjectURL(images?.image4)
                            : Ref4
                        }
                        alt=""
                      />
                    </div>
                  </div>
                </div>
              ) : (
                <div className="ProfilePic_registration">
                  <div className="image_upload_container">
                    <div className="image_uploader">
                      <label htmlFor="image1">
                        <i className="fa-solid fa-cloud-arrow-up"></i>
                      </label>
                      <input
                        type="file"
                        name="image1"
                        accept="image/png, image/jpeg"
                        id="image1"
                        onChange={HandleImages}
                      />
                    </div>

                    {progress?.image1 !== undefined &&
                      progress?.image1 !== 100 && (
                        <div className="image_loader">
                          <div className="image_inner_loader">
                            <CircularProgressbar
                              value={progress?.image1}
                              text={`${progress?.image1}%`}
                              styles={{ stroke: "2px solid black" }}
                            />
                          </div>
                        </div>
                      )}

                    <div className="main_image_conatiner">
                      <img
                        src={
                          images?.image1
                            ? URL.createObjectURL(images?.image1)
                            : Ref1
                        }
                        alt=""
                      />
                    </div>
                  </div>
                </div>
              )}
              <div className="inner_register_btns_lr">
                <button className="back_btn" onClick={GoBack}>
                  Back
                </button>
                <button
                  className="black_btn"
                  disabled={progress && true}
                  onClick={HandleUploadImages}
                >
                  {progress ? (
                    <i className="fa fa-spinner fa-spin"></i>
                  ) : (
                    "Next"
                  )}
                </button>
              </div>
            </div>
          )}
          {/* Fifth Slide -------------------------------------------------------------- */}

          {/* Sixth Slide -------------------------------------------------------------- */}
          {slide === 6 && (
            <div className="register_box">
              <div className="heading_register_box">
                <h2>Add your social media links</h2>
                <p>Share your social media profiles.</p>
              </div>
              <div className="add_social_media_links">
                <div className="social_media_input">
                  <input
                    type="text"
                    defaultValue={values?.facebook}
                    name="facebook"
                    placeholder="Your facebook account link"
                    onChange={HandleValues}
                  />
                  <label>
                    <img src={Fb} alt="" />
                  </label>
                </div>
                <div className="social_media_input">
                  <input
                    type="text"
                    defaultValue={values?.twitter}
                    name="twitter"
                    placeholder="Your twitter account link"
                    onChange={HandleValues}
                  />
                  <label>
                    <img src={Tw} alt="" />
                  </label>
                </div>
                <div className="social_media_input">
                  <input
                    type="text"
                    defaultValue={values?.instagram}
                    name="instagram"
                    placeholder="Your instagram account link"
                    onChange={HandleValues}
                  />
                  <label>
                    <img src={In} alt="" />
                  </label>
                </div>
                <div className="social_media_input">
                  <input
                    type="text"
                    defaultValue={values?.youtube}
                    name="youtube"
                    placeholder="Your youtube account link"
                    onChange={HandleValues}
                  />
                  <label>
                    <img src={Yt} alt="" />
                  </label>
                </div>
              </div>
              <div className="inner_register_btns_lr">
                <button className="back_btn" onClick={GoBack}>
                  Back
                </button>
                <button className="black_btn" onClick={NextSlide}>
                  Next
                </button>
              </div>
            </div>
          )}
          {/* Sixth Slide -------------------------------------------------------------- */}

          {/* Seventh Slide -------------------------------------------------------------- */}
          {slide === 7 && (
            <div className="register_box">
              <div className="heading_register_box">
                <h2>Add your previous films history</h2>
                <p>
                  Previous acted films name or short films or any external links
                  to show your acting skills.
                </p>
              </div>
              <div className="add_protfolio_links">
                <div className="portfolio_adder">
                  <input
                    type="text"
                    name="portfoliolink"
                    value={values?.portfoliolink ? values?.portfoliolink : ""}
                    placeholder="Type film name here"
                    onChange={HandleValues}
                  />
                  <button onClick={HandlePortfolioLinks}>Add</button>
                </div>
                {portfoliolinks?.length > 0 && (
                  <div className="body_portfolio">
                    {portfoliolinks
                      ?.map((item) => {
                        return (
                          <div className="portfolio_displayer" key={item}>
                            <h2>{item}</h2>
                            <i
                              className="fa-solid fa-circle-xmark"
                              onClick={() => {
                                RemovePortfolioLink(item);
                              }}
                            ></i>
                          </div>
                        );
                      })
                      .reverse()}
                  </div>
                )}
              </div>
              <div className="inner_register_btns_lr">
                <button className="back_btn" onClick={GoBack}>
                  Back
                </button>
                <button className="black_btn" onClick={NextSlide}>
                  Next
                </button>
              </div>
            </div>
          )}
          {/* Seventh Slide -------------------------------------------------------------- */}

          {/* Eighth Slide -------------------------------------------------------------- */}
          {slide === 8 && (
            <div className="register_box">
              <div className="heading_register_box">
                <h2>Communication Address</h2>
                <p>Enter your communication details.</p>
              </div>
              <div className="inner_register_box">
                <div className="input_bx">
                  <input
                    type="text"
                    defaultValue={values?.house}
                    name="house"
                    onChange={HandleValues}
                    placeholder="House / Flat / Apartment Name"
                  />
                </div>
                <div className="input_bx">
                  <input
                    type="text"
                    name="street"
                    defaultValue={values?.street}
                    onChange={HandleValues}
                    placeholder="Street / Landmark"
                  />
                </div>
                <div className="input_bx">
                  <input
                    type="text"
                    defaultValue={values?.colony}
                    name="colony"
                    onChange={HandleValues}
                    placeholder="Colony Name"
                  />
                </div>
                <div className="input_bx">
                  <input
                    type="number"
                    defaultValue={values?.zip}
                    name="zip"
                    min={0}
                    onInput={(e) => {
                      if (e.target.value.length > e.target.maxLength) {
                        e.target.value = e.target.value.slice(
                          0,
                          e.target.maxLength
                        );
                      } else {
                        e.target.value = Math.abs(e.target.value);
                      }
                    }}
                    maxLength="6"
                    onChange={HandleValues}
                    placeholder="Zip Code"
                  />
                </div>
              </div>
              <div className="inner_register_btns_lr">
                <button
                  className="back_btn"
                  onClick={GoBack}
                  disabled={loading && true}
                >
                  {loading ? <i className="fa fa-spinner fa-spin"></i> : "Back"}
                </button>
                <button
                  className="black_btn"
                  onClick={HandleUpdate}
                  disabled={loading && true}
                >
                  {loading ? <i className="fa fa-spinner fa-spin"></i> : "DONE"}
                </button>
              </div>
            </div>
          )}
          {/* Eighth Slide -------------------------------------------------------------- */}
        </div>
        <div className="footer_register_form">
          <p>
            Already a user? <Link to="/login">Login Here</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
