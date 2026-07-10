import React, { useState, useRef, useMemo } from 'react';
import './createaudition.scss';
import { DatePickerComponent } from '@syncfusion/ej2-react-calendars';
import { TimePickerComponent } from '@syncfusion/ej2-react-calendars';
import { CircularProgressbar } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
import { useQuill } from 'react-quilljs';
import 'quill/dist/quill.snow.css';
import Select from 'react-select';
import { autition_types, options_styles } from '../Options';
import { UploadImage } from '../../utils/ImageUpload';
import { toast } from 'react-toastify';
import AuthRequest from '../../utils/axiosinstance';
import { useSelector } from 'react-redux';
import { CreateNotification } from '../../utils/CreateNotification';

export default function CreateAudition({
  onCloseAudition,
  isedit,
  GetUpdates,
}) {
  const Currentuser = useSelector((state) => state.admin.admin);
  const { quill, quillRef } = useQuill({
    placeholder: 'Enter Audition Description',
  });
  const [Image, setImage] = useState();
  const [progress, setprogress] = useState(null);
  const [formvalues, setFormValues] = useState({});
  const [loading, setLoading] = useState(false);
  const FormRef = useRef();
  const enddate_ref = useRef();

  const HandleFormValues = (e) => {
    if (e.target === undefined) {
      setFormValues({ ...formvalues, [e.name]: e.value });
    } else {
      setFormValues({ ...formvalues, [e.target.name]: e.target.value });
    }
  };

  useMemo(() => {
    if (quill) {
      quill.on('text-change', () => {
        setFormValues((prev) => ({ ...prev, desc: quill.root.innerHTML }));
      });
      if (isedit) {
        quill.root.innerHTML = isedit?.descp;
      }
    }
  }, [quill]);

  const FormReset = () => {
    FormRef.current.reset();
    setFormValues({});
    setImage();
    quill.setContents(null);
  };

  const GetProgress = (prog) => {
    setprogress(prog);
  };

  const CreateTemplate = async (image) => {
    try {
      const res = await AuthRequest().post('/audition/create', {
        ...formvalues,
        userId: Currentuser?._id,
        image,
      });
      toast.success(res.data);
      setLoading(false);
      FormReset();
      onCloseAudition();
      GetUpdates();

      // Notification Templte -----------------------------------------------------

      const notification_tem = {
        data: {
          image: res.data?.image,
          title: `New ${
            res.data?.status === 1 ? 'Opened' : 'Upcoming'
          } Audition ${res.data?.title}`,
          desc: `Audition List`,
        },
        link: `/audition/${res.data?._id}`,
        forAll: true,
      };

      CreateNotification(notification_tem);
    } catch (err) {
      console.log(err);
      setLoading(false);
    }
  };

  const UpdateTemplate = async (image) => {
    try {
      const res = await AuthRequest().put(
        `/audition/update/${isedit?._id}`,
        image
          ? {
              ...formvalues,
              userId: Currentuser?._id,
              image,
            }
          : { ...formvalues, userId: Currentuser?._id }
      );
      toast.success(res.data);
      setLoading(false);
      FormReset();
      onCloseAudition();
      GetUpdates();
    } catch (err) {
      console.log(err);
      setLoading(false);
    }
  };

  const OnSuccess = (image) => {
    isedit ? UpdateTemplate(image) : CreateTemplate(image);
  };

  const HandleCreate = async () => {
    if (Validation()) {
      setLoading(true);
      if (Image) {
        UploadImage({ Image, OnSuccess, GetProgress });
      } else {
        CreateTemplate();
      }
    }
  };

  const HandleUpdate = () => {
    if (Image) {
      setLoading(true);
      UploadImage({ Image, OnSuccess, GetProgress });
    } else {
      setLoading(true);
      UpdateTemplate();
    }
  };

  useMemo(() => {
    const ClearEnddate = () => {
      const { enddate, ...others } = formvalues;
      setFormValues(others);
      enddate_ref.current.value = null;
      console.log(enddate);
    };

    enddate_ref?.current && ClearEnddate();
  }, [formvalues?.startdate, enddate_ref]);

  const Validation = () => {
    if (!formvalues.type) {
      toast.error('Please Select Audition Type');
      return false;
    } else if (!formvalues.title) {
      toast.error('Please Enter Title');
      return false;
    } else if (!formvalues.desc) {
      toast.error('Please Enter Description');
      return false;
    } else if (formvalues.type === 2 && !formvalues.location) {
      toast.error('Please Enter Location');
      return false;
    } else if (formvalues.type === 2 && !formvalues.contactperson) {
      toast.error('Please Enter Contact Person Name');
      return false;
    } else if (formvalues.type === 2 && !formvalues.contactnumber) {
      toast.error('Please Enter Contact Number');
      return false;
    } else if (formvalues.type === 2 && !formvalues.timefrom) {
      toast.error('Please Enter Time from');
      return false;
    } else if (formvalues.type === 2 && !formvalues.timeto) {
      toast.error('Please Enter Time to');
      return false;
    } else if (formvalues.type === 2 && !formvalues.applydate) {
      toast.error('Please Enter Apply Date');
      return false;
    } else if (!formvalues.startdate) {
      toast.error('Please Enter Start date');
      return false;
    } else if (!formvalues.enddate) {
      toast.error('Please Enter End date');
      return false;
    } else {
      return true;
    }
  };
  return (
    <div className="popup_container_auditions">
      <div className="inner_popup_audition">
        <i
          className="fa-solid fa-circle-xmark"
          onClick={() => onCloseAudition()}
        ></i>
        <form className="inner_popup_container_auditions" ref={FormRef}>
          <div className="left_popup_audition_container">
            <div className="popup_audition_upload_image">
              <label
                className={
                  ((Image || isedit?.image) && !progress) || progress === 100
                    ? 'active'
                    : ''
                }
                htmlFor="audition_img"
              >
                <i className="fa-solid fa-cloud-arrow-up"></i>
                Upload Audition Image
              </label>
              <input
                type="file"
                id="audition_img"
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
              {(Image || isedit?.image) && (
                <div className="popup_audition_uploaded_img">
                  <img
                    src={Image ? URL.createObjectURL(Image) : isedit.image}
                  />
                </div>
              )}
              {progress !== null && progress !== 100 && (
                <div className="popup_audition_loader">
                  <div className="inner_popup_loader">
                    <CircularProgressbar
                      value={progress}
                      text={`${progress}%`}
                      styles={{ stroke: '2px solid black' }}
                    />
                  </div>
                </div>
              )}
            </div>

            <div className="popup_audition_inputs_grid">
              {!isedit && (
                <div className="popup_audition_inputs">
                  <Select
                    placeholder="Audition Type"
                    styles={options_styles}
                    options={autition_types}
                    onChange={HandleFormValues}
                  />
                </div>
              )}
              <div className="popup_audition_inputs">
                <input
                  type="text"
                  name="title"
                  defaultValue={isedit && isedit?.title}
                  placeholder="Audition Title"
                  onChange={HandleFormValues}
                />
              </div>
              {(formvalues?.type === 2 || isedit?.type === 2) && (
                <>
                  <div className="popup_audition_inputs">
                    <input
                      type="text"
                      name="location"
                      defaultValue={isedit && isedit?.location}
                      placeholder="Location"
                      onChange={HandleFormValues}
                    />
                  </div>
                  <div className="popup_audition_inputs">
                    <input
                      type="text"
                      name="contactperson"
                      defaultValue={isedit && isedit?.contactperson}
                      placeholder="Contact Person"
                      onChange={HandleFormValues}
                    />
                  </div>
                  <div className="popup_audition_inputs">
                    <input
                      type="text"
                      name="contactnumber"
                      placeholder="Contact Number"
                      defaultValue={isedit && isedit?.contactnumber}
                      onChange={HandleFormValues}
                    />
                  </div>
                  <div className="popup_audtions_inputs_time_grid">
                    <div className="time_inputs_grid">
                      <TimePickerComponent
                        name="timefrom"
                        placeholder="From"
                        value={isedit && isedit?.timefrom}
                        onChange={HandleFormValues}
                      />
                    </div>
                    <div className="time_inputs_grid">
                      <TimePickerComponent
                        name="timeto"
                        value={isedit && isedit?.timeto}
                        placeholder="To"
                        onChange={HandleFormValues}
                      />
                    </div>
                  </div>
                  <div className="popup_audition_inputs">
                    <DatePickerComponent
                      name="applydate"
                      placeholder="Audition Apply Date"
                      value={isedit && isedit?.applydate}
                      format="dd-MM-yyyy"
                      min={new Date(new Date())}
                      onChange={HandleFormValues}
                    />
                  </div>
                </>
              )}
              <div className="popup_audition_inputs">
                <DatePickerComponent
                  name="startdate"
                  placeholder="Audition Start Date"
                  min={new Date(new Date())}
                  value={isedit && isedit?.startdate}
                  format="dd-MM-yyyy"
                  onChange={HandleFormValues}
                />
              </div>
              {(formvalues?.startdate || isedit?.startdate) && (
                <div className="popup_audition_inputs">
                  <DatePickerComponent
                    ref={enddate_ref}
                    name="enddate"
                    placeholder="Audition End Date"
                    min={
                      new Date(
                        formvalues?.startdate
                          ? formvalues?.startdate
                          : isedit?.startdate
                      )
                    }
                    value={isedit && isedit?.enddate}
                    format="dd-MM-yyyy"
                    onChange={HandleFormValues}
                  />
                </div>
              )}
            </div>
          </div>
          <div className="right_popup_audition_container">
            <div className="right_popup_audition_description_editor">
              <div ref={quillRef} />
            </div>
          </div>
        </form>
        <div className="popup_audition_cta_btns">
          <button onClick={FormReset}>Reset</button>
          {isedit ? (
            <button className="upload" onClick={HandleUpdate}>
              {loading ? <i className="fa fa-spinner fa-spin"></i> : 'Update'}
            </button>
          ) : (
            <button className="upload" onClick={HandleCreate}>
              {loading ? <i className="fa fa-spinner fa-spin"></i> : 'Create'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
