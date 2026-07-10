import React, { useState } from 'react';
import PhoneInput from 'react-phone-input-2';
import 'react-phone-input-2/lib/style.css';
import { phoneinput_options } from '../../Options';
import { useDispatch, useSelector } from 'react-redux';
import AuthRequest from '../../../utils/axiosinstance';
import { UploadImage } from '../../../utils/ImageUpload';
import { toast } from 'react-toastify';
import { Login } from '../../../redux/AdminSlice';

export default function AccountTab() {
  const User = useSelector((state) => state.admin.admin);
  const [values, setvalues] = useState({ userId: User?._id });
  const [ProfilePic, setProfilePic] = useState(null);
  const [progress, setprogress] = useState(null);
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();

  const UpdateAccount = async (ProfilePic) => {
    try {
      const res = await AuthRequest().put(
        User?.role === 1 || User?.role === 2
          ? `/admin/update/${User?._id}`
          : `/assistant/update/${User?._id}`,
        ProfilePic ? { ...values, ProfilePic } : values
      );
      toast.success(res.data.message);
      dispatch(Login({ ...res.data.item, accesstoken: User?.accesstoken }));
      setLoading(false);
    } catch (error) {
      toast.error(error?.response.data);
      setLoading(false);
    }
  };

  const OnSuccess = (ProfilePic) => {
    UpdateAccount(ProfilePic);
  };

  const HandleUpdate = () => {
    if (Validate()) {
      setLoading(true);
      if (ProfilePic) {
        UploadImage({ Image: ProfilePic, OnSuccess, GetProgress });
      } else {
        UpdateAccount();
      }
    }
  };

  const HandleValues = (e) => {
    if (typeof e === 'string' && true) {
      setvalues((prev) => ({ ...prev, mobileno: e }));
    } else {
      setvalues((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    }
  };

  const GetProgress = (prog) => {
    setprogress(prog);
  };

  const Validate = () => {
    if (Object.keys(values).length <= 1 && !ProfilePic) {
      toast.error('There is nothing to save');
      return false;
    } else {
      return true;
    }
  };

  return (
    <div className="main_box_container_account">
      <div className="heading_box_container">
        <h2>Account</h2>
      </div>
      <h4 className="avatar_heading">Edit your profile picture</h4>
      {progress !== null && progress !== 100 && (
        <div className="progress_line_bx">
          <div className="progress" style={{ width: `${progress}%` }}></div>
        </div>
      )}
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
            Upload Profile Pic
          </label>
          <p>{progress !== null && progress !== 100 && progress + '%'}</p>
          <input
            type="file"
            accept="image/png, image/jpeg"
            id="ProfilePic"
            style={{ width: '0px' }}
            onChange={(e) => {
              const validImageTypes = ['image/jpeg', 'image/png'];
              if (e.target.files[0].size > 500000) {
                toast.error('Image must be less than 500 Kbs');
              } else if (!validImageTypes.includes(e.target.files[0]['type'])) {
                toast.error('Only Png & Jpg will be accepted');
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
            <label htmlFor="">Display Name</label>
          </div>
          <input
            type="text"
            name="username"
            placeholder="Enter your name"
            defaultValue={User?.username}
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
            onChange={HandleValues}
            value={User?.mobileno}
          />
        </div>
      </div>

      <div className="save_changes_box_container">
        <button disabled={loading && true} onClick={HandleUpdate}>
          {loading ? <i className="fa fa-spinner fa-spin"></i> : 'Save changes'}
        </button>
      </div>
    </div>
  );
}
