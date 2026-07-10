import React, { useRef, useState } from 'react';
import './createuser.scss';
import { CircularProgressbar } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
import PhoneInput from 'react-phone-input-2';
import 'react-phone-input-2/lib/style.css';
import {
  assistant_options,
  category_options,
  options_styles,
  phoneinput_options,
} from '../Options';
import Select from 'react-select';
import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import AuthRequest from '../../utils/axiosinstance';
import { UploadImage } from '../../utils/ImageUpload';
import { CreateNotification } from '../../utils/CreateNotification';

export default function CreateUser({ onCloseUserPopup, isedit, GetUpdates }) {
  const User = useSelector((state) => state.admin.admin);
  const [Image, setImage] = useState();
  const [formvalues, setformvalues] = useState({});
  const [progress, setprogress] = useState(null);
  const [loading, setLoading] = useState(false);
  const formRef = useRef();

  const CreateUser = async (ProfilePic) => {
    try {
      const res = await AuthRequest().post(
        User?.role === 1 ? '/auth/admin/register' : '/auth/assistant/register',
        User?.role === 2 || ProfilePic
          ? { ...formvalues, ProfilePic, userId: User?._id }
          : formvalues
      );

      toast.success(res.data.message);
      setLoading(false);
      onCloseUserPopup();
      GetUpdates();

      // Notification Templte -----------------------------------------------------

      const notification_tem = {
        data: {
          image: res.data.data?.ProfilePic,
          title: `A New  ${
            res.data?.data.role === 2
              ? 'Admin'
              : res.data.data?.role === 3
              ? 'Line Producer'
              : 'Director'
          } Created By ${User?.username}`,
          desc: `Assistants List`,
        },
        link: `/admins`,
        recieverId: [User?._id],
      };

      CreateNotification(notification_tem);
    } catch (err) {
      toast.error(err?.response.data);
      setLoading(false);
    }
  };

  const UpdateUser = async (ProfilePic) => {
    try {
      const res = await AuthRequest().put(
        User?.role === 1
          ? `/admin/update/${isedit?._id}`
          : `/assistant/update/${isedit?._id}`,
        User?.role === 2 || ProfilePic
          ? { ...formvalues, ProfilePic, userId: User?._id }
          : formvalues
      );
      toast.success(res.data.message);
      setLoading(false);
      onCloseUserPopup();
      GetUpdates();
    } catch (err) {
      toast.error(err?.response.data);
      setLoading(false);
    }
  };

  const OnSuccess = (ProfilePic) => {
    isedit ? UpdateUser(ProfilePic) : CreateUser(ProfilePic);
  };

  const Handlecreate = async (e) => {
    e.preventDefault();
    if (Validation()) {
      setLoading(true);
      if (Image) {
        UploadImage({ Image, OnSuccess, GetProgress });
      } else {
        CreateUser();
      }
    }
  };

  const Handleupdate = async (e) => {
    e.preventDefault();
    setLoading(true);
    if (Image) {
      UploadImage({ Image, OnSuccess, GetProgress });
    } else {
      UpdateUser();
    }
  };

  const HandleValues = (e) => {
    if (!isNaN(e)) {
      setformvalues((prev) => ({ ...prev, ['mobileno']: e }));
    } else if (e.name !== undefined) {
      setformvalues((prev) => ({ ...prev, [e.name]: e.value }));
    } else {
      setformvalues((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    }
  };

  const HandleMultiValues = (e) => {
    setformvalues((prev) => ({ ...prev, ['permissions']: e }));
  };

  const ResetForm = (e) => {
    e.preventDefault();
    formRef.current.reset();
    setImage();
    setformvalues();
    setprogress(null);
  };

  const Validation = () => {
    if (!formvalues?.username) {
      toast.error('Please Enter Username');
      return false;
    } else if (!formvalues?.email) {
      toast.error('Please Enter Email');
      return false;
    } else if (!formvalues?.mobileno) {
      toast.error('Please Enter Phone Number');
      return false;
    } else if (!formvalues?.password) {
      toast.error('Please Enter a password');
      return false;
    } else if (User?.role === 2 && !formvalues?.role) {
      toast.error('Please Select for User');
      return false;
    } else {
      return true;
    }
  };

  const GetProgress = (prog) => {
    setprogress(prog);
  };

  return (
    <div className="main_user_create_popup">
      <form className="inner_user_create_popup" ref={formRef}>
        <div className="header_user_create_popup">
          <h2>
            {isedit ? 'Update' : 'Create'} {User?.role === 1 ? 'Admin' : 'User'}
          </h2>
          <i
            className="fa-solid fa-circle-xmark"
            onClick={onCloseUserPopup}
          ></i>
        </div>
        <div className="main_user_create_popup_body">
          <div className="popup_user_upload_image">
            <label
              className={
                ((isedit && isedit?.ProfilePic) || Image) && !progress
                  ? 'active'
                  : ''
              }
              htmlFor="user_img"
            >
              <i className="fa-solid fa-cloud-arrow-up"></i>
              Upload Image
            </label>
            <input
              type="file"
              id="user_img"
              accept="image/png, image/jpeg"
              onChange={(e) => {
                const validImageTypes = ['image/jpeg', 'image/png'];
                if (e.target.files[0].size > 500000) {
                  toast.error('You can Upload Image of max 500 Kbs');
                } else if (
                  !validImageTypes.includes(e.target.files[0]['type'])
                ) {
                  toast.error('Only Png & Jpg will be accepted');
                } else {
                  setImage(e.target.files[0]);
                }
              }}
            />
            {(Image || isedit?.ProfilePic) && (
              <div className="popup_user_uploaded_img">
                <img
                  src={Image ? URL.createObjectURL(Image) : isedit?.ProfilePic}
                />
              </div>
            )}
            {progress !== null && progress !== 100 && (
              <div className="popup_user_loader">
                <div className="inner_popup_loader">
                  <CircularProgressbar
                    value={progress}
                    text={progress + '%'}
                    styles={{ stroke: '2px solid black' }}
                  />
                </div>
              </div>
            )}
          </div>
          <div className="input_bx">
            <input
              name="username"
              defaultValue={isedit && isedit?.username}
              type="text"
              placeholder="Name"
              onChange={HandleValues}
            />
          </div>
          <div className="input_bx">
            <input
              name="email"
              defaultValue={isedit && isedit?.email}
              type="email"
              placeholder="Email"
              onChange={HandleValues}
            />
          </div>
          <div className="input_bx">
            <PhoneInput
              {...phoneinput_options}
              countryCodeEditable={isedit ? true : false}
              onChange={HandleValues}
              value={isedit && isedit?.mobileno}
            />
          </div>
          {!isedit && (
            <div className="input_bx">
              <input
                type="password"
                name="password"
                placeholder="Password"
                onChange={HandleValues}
              />
            </div>
          )}
          {User?.role === 2 && (
            <>
              {' '}
              {!isedit && (
                <div className="input_bx">
                  <Select
                    styles={options_styles}
                    options={assistant_options}
                    onChange={HandleValues}
                    placeholder="Select Role"
                  />
                </div>
              )}
              {(formvalues?.role === 4 || isedit?.role === 4) && (
                <div className="input_bx">
                  <Select
                    styles={options_styles}
                    options={category_options}
                    onChange={HandleMultiValues}
                    defaultValue={isedit?.permissions?.map((item) => {
                      return item;
                    })}
                    isMulti={true}
                    placeholder="Select Permissions"
                  />
                </div>
              )}
            </>
          )}
        </div>
        <div className="user_popup_cta_btns">
          <button onClick={ResetForm}>Reset</button>
          {isedit ? (
            <button className="upload" onClick={Handleupdate}>
              {loading ? <i className="fa fa-spinner fa-spin"></i> : 'Update'}
            </button>
          ) : (
            <button className="upload" onClick={Handlecreate}>
              {loading ? <i className="fa fa-spinner fa-spin"></i> : 'Create'}
            </button>
          )}
        </div>
      </form>
    </div>
  );
}
