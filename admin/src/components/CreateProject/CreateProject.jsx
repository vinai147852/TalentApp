import React, { useEffect, useState } from 'react';
import './createproject.scss';
import { CircularProgressbar } from 'react-circular-progressbar';
import { useQuill } from 'react-quilljs';
import 'quill/dist/quill.snow.css';
import 'react-circular-progressbar/dist/styles.css';
import CreatedUser from './CreatedUser';
import AddUserPopup from './AddUserPopup';
import { toast } from 'react-toastify';
import { UploadImage } from '../../utils/ImageUpload';
import AuthRequest, { axiosinstance } from '../../utils/axiosinstance';
import { useSelector } from 'react-redux';
import moment from 'moment';
import { CreateNotification } from '../../utils/CreateNotification';
import { useRef } from 'react';
import Select from 'react-select';
import { options_styles, project_type } from '../Options';

export default function CreateProject({ onCloseProject, isedit, GetUpdates }) {
  const User = useSelector((state) => state.admin.admin);
  const { quill, quillRef } = useQuill({
    placeholder: 'Enter Project description',
  });
  const [Image, setImage] = useState();
  const [progress, setprogress] = useState(0);
  const [loading, setLoading] = useState(0);
  const [values, setValues] = useState();
  const [prevrecord, setPrevRecord] = useState();
  const [prevrecordProducer, setPrevRecordProducer] = useState([]);
  const [prevrecordDirector, setPrevRecordDirector] = useState([]);
  const [isAddUserPopup, setIsAddUserPopup] = useState();
  const [AddedProducers, setAddedProducers] = useState([]);
  const [AddedDirectors, setAddedDirectors] = useState([]);
  const [AddedAuditions, setAddedAuditions] = useState([]);
  const Project_form = useRef();

  const HandleProjectUpload = async (image) => {
    const linkedaudition = AddedAuditions[0]?._id;

    try {
      const res = await AuthRequest().post(
        '/project/create/',
        linkedaudition
          ? {
              ...values,
              userId: User?._id,
              image,
              linkedaudition,
            }
          : {
              ...values,
              userId: User?._id,
              image,
            }
      );

      if (linkedaudition) {
        try {
          await AuthRequest().put(`/audition/update/${linkedaudition}`, {
            userId: res.data.userId,
            linkedproject: res.data?._id,
          });
        } catch (error) {
          console.log(error);
          setLoading(false);
        }
      }

      if (AddedProducers?.length > 0) {
        AddedProducers?.map(async (item) => {
          try {
            await AuthRequest().put(`/assistant/assign/project/${item?._id}`, {
              userId: res.data.userId,
              projectId: res.data?._id,
            });
          } catch (error) {
            console.log(error);
            setLoading(false);
          }
        });
      }

      if (AddedDirectors?.length > 0) {
        AddedDirectors?.map(async (item) => {
          try {
            await AuthRequest().put(`/assistant/assign/project/${item?._id}`, {
              userId: res.data.userId,
              projectId: res.data?._id,
            });
          } catch (error) {
            console.log(error);
            setLoading(false);
          }
        });
      }

      onCloseProject();
      GetUpdates();
      toast.success('Project Created');
      setLoading(false);

      // Notification Templte -----------------------------------------------------
      let producersIds = AddedProducers?.map((item) => item?._id);
      let directorIds = AddedDirectors?.map((item) => item?._id);
      const notification_tem = {
        data: {
          image: res.data?.image,
          title: `New ${
            res.data?.status === 1 ? 'Opened' : 'Upcoming'
          } Project ${res.data?.title}`,
          desc: `Project List`,
        },
        link: `/project/${res.data?._id}`,
        recieverId: [...producersIds, ...directorIds, User?._id],
      };

      CreateNotification(notification_tem);
    } catch (error) {
      toast.error(error?.response.data);
      setLoading(false);
    }
  };

  const OnSuccess = (image) => {
    isedit ? HandleProjectUpdate(image) : HandleProjectUpload(image);
  };

  const GetProgress = (prog) => {
    setprogress(prog);
  };

  const HandleSubmit = async (e) => {
    e.preventDefault();
    if (Validation()) {
      if (Image) {
        setLoading(true);
        UploadImage({ Image, OnSuccess, GetProgress });
      }
    }
  };

  // Handle Project Update ----------------------------------------------------------------------
  const HandleProjectUpdate = async (image) => {
    const linkedaudition = AddedAuditions[0]?._id;

    try {
      const res = await AuthRequest().put(
        `/project/update/${isedit?._id}`,
        (image && { ...values, image, userId: User?._id }) || {
          ...values,
          linkedaudition,
          userId: User?._id,
        }
      );

      // LINKING AUDITIONS & PROJECTS HERE ----------------------------------------------------------------

      if (linkedaudition && linkedaudition !== prevrecord?.audition?._id) {
        try {
          await AuthRequest().put(`/audition/update/${linkedaudition}`, {
            userId: res.data.userId,
            linkedproject: res.data?._id,
          });
        } catch (error) {
          console.log(error);
          setLoading(false);
        }
      }

      if (
        linkedaudition !== prevrecord?.audition?._id ||
        (prevrecord?.audition?._id && linkedaudition === undefined)
      ) {
        try {
          await AuthRequest().put(
            `/audition/update/${prevrecord?.audition?._id}`,
            {
              userId: res.data.userId,
              linkedproject: null,
            }
          );
        } catch (error) {
          console.log(error);
          setLoading(false);
        }
      }

      // LINKING PRODUCER HERE ----------------------------------------------------------------

      if (prevrecordProducer?.length > 0) {
        prevrecordProducer?.map(async (item) => {
          try {
            await AuthRequest().put(
              `/assistant/unassign/project/${item?._id}`,
              {
                userId: res.data.userId,
                projectId: res.data?._id,
              }
            );
          } catch (error) {
            console.log(error);
            setLoading(false);
          }
        });
      }

      if (AddedProducers?.length > 0) {
        AddedProducers?.map(async (item) => {
          try {
            await AuthRequest().put(`/assistant/assign/project/${item?._id}`, {
              userId: res.data.userId,
              projectId: res.data?._id,
            });
          } catch (error) {
            console.log(error);
            setLoading(false);
          }
        });
      }

      // LINKING DIRECTOR HERE ----------------------------------------------------------------

      if (prevrecordDirector?.length > 0) {
        prevrecordDirector?.map(async (item) => {
          try {
            await AuthRequest().put(
              `/assistant/unassign/project/${item?._id}`,
              {
                userId: res.data.userId,
                projectId: res.data?._id,
              }
            );
          } catch (error) {
            console.log(error);
            setLoading(false);
          }
        });
      }

      if (AddedDirectors?.length > 0) {
        AddedDirectors?.map(async (item) => {
          try {
            await AuthRequest().put(`/assistant/assign/project/${item?._id}`, {
              userId: res.data.userId,
              projectId: res.data?._id,
            });
          } catch (error) {
            console.log(error);
            setLoading(false);
          }
        });
      }

      onCloseProject();
      GetUpdates();
      toast.success('Project Updated');
      setLoading(false);
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  };

  const HandleSubmitUpdate = async (e) => {
    e.preventDefault();
    if (Image) {
      setLoading(true);
      UploadImage({ Image, OnSuccess, GetProgress });
    } else {
      setLoading(true);
      HandleProjectUpdate();
    }
  };

  // Get Edit Matrial For Project

  const GetProjectProducer = async () => {
    let producers = [];
    let directors = [];
    try {
      const res = await AuthRequest().post(
        `/assistant/project/assigned/${isedit?._id}`,
        { userId: User?._id }
      );
      res.data?.map((item) => {
        if (item?.role === 3) {
          producers.push(item);
        } else {
          directors.push(item);
        }
      });
      setAddedProducers(producers);
      setPrevRecordProducer(producers);
      setAddedDirectors(directors);
      setPrevRecordDirector(directors);
    } catch (error) {
      console.log(error);
    }
  };

  const GetLinkedAudition = async () => {
    try {
      const res = await axiosinstance.get(
        `/audition/single/${isedit?.linkedaudition}`
      );
      setAddedAuditions([res.data]);
      setPrevRecord((prev) => ({ ...prev, ['audition']: res.data }));
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    isedit?._id && GetProjectProducer();
    isedit?.linkedaudition && GetLinkedAudition();
  }, [isedit]);

  useEffect(() => {
    if (quill) {
      quill.on('text-change', () => {
        setValues((prev) => ({ ...prev, ['desc']: quill.root.innerHTML }));
      });
      if (isedit) {
        quill.root.innerHTML = isedit?.descp;
      }
    }
  }, [quill]);

  const HandleValues = (e) => {
    setValues((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const OnCloseAddUserPopup = () => {
    setIsAddUserPopup();
  };

  const OnAddNewItem = (res) => {
    if (res.producer) {
      if (AddedProducers?.find((item) => res.producer._id === item._id)) {
        toast.error('Line Producer Already Added');
      } else {
        res.producer && setAddedProducers((prev) => [...prev, res.producer]);
      }
    }

    if (res.director) {
      if (AddedDirectors?.find((item) => res.director._id === item._id)) {
        toast.error('Director Already Added');
      } else {
        res.director && setAddedDirectors((prev) => [...prev, res.director]);
      }
    }

    if (res.audition) {
      if (AddedAuditions?.length > 0) {
        toast.error('You Can Link Only One Audition');
      } else {
        res.audition && setAddedAuditions((prev) => [...prev, res.audition]);
      }
    }
  };

  const OnRemoveItem = (res) => {
    if (res.producer) {
      setAddedProducers((prev) =>
        prev?.filter((item) => item?._id !== res.producer?._id)
      );
    }
    if (res.director) {
      setAddedDirectors((prev) =>
        prev?.filter((item) => item?._id !== res.director?._id)
      );
    }
    if (res.audition) {
      setAddedAuditions((prev) =>
        prev?.filter((item) => item?._id !== res.audition?._id)
      );
    }
  };

  const Validation = () => {
    if (!Image) {
      toast.error('Please Add Project Image');
      return false;
    } else if (!values?.title) {
      toast.error('Please Enter Project Title');
      return false;
    } else if (!values?.desc) {
      toast.error('Please Enter Project Description');
      return false;
    } else if (!values?.startdate) {
      toast.error('Please Enter Project Start Date');
      return false;
    } else if (!values?.enddate) {
      toast.error('Please Enter Project End Date');
      return false;
    } else {
      return true;
    }
  };

  const ResetForm = (e) => {
    e.preventDefault();
    Project_form.current.reset();
    setImage();
    !isedit ? quill.setContents(null) : (quill.root.innerHTML = isedit?.desc);
    !isedit ? setAddedProducers() : setAddedProducers([...prevrecordProducer]);
    !isedit ? setAddedDirectors() : setAddedDirectors([...prevrecordDirector]);
    !isedit ? setAddedAuditions() : setAddedAuditions([prevrecord?.audition]);
  };

  return (
    <div className="main_popup_project_container">
      <div className="inner_popup_project_container">
        <i className="fa-solid fa-circle-xmark" onClick={onCloseProject}></i>
        <form className="main_grid_project_container" ref={Project_form}>
          <div className="left_project_popup_conatiner">
            <div className="popup_project_upload_image">
              <label
                className={
                  Image || (isedit?.image && !progress) ? 'active' : ''
                }
                htmlFor="project_img"
              >
                <i className="fa-solid fa-cloud-arrow-up"></i>
                Upload Project Image
              </label>
              <input
                type="file"
                accept="image/png, image/jpeg"
                id="project_img"
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
                <div className="popup_project_uploaded_img">
                  <img
                    src={Image ? URL.createObjectURL(Image) : isedit?.image}
                  />
                </div>
              )}
              {progress > 0 && progress !== 100 && (
                <div className="popup_project_loader">
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

            <div className="popup_project_inputs_grid">
              <div className="popup_project_inputs">
                <input
                  type="text"
                  name="title"
                  placeholder="Project Title"
                  defaultValue={isedit?.title || ''}
                  onChange={HandleValues}
                />
              </div>
              <Select
                options={project_type}
                className="project_popup_select"
                styles={options_styles}
                placeholder="Select project type"
                onChange={(e) => setValues({ ...values, [e.name]: e.value })}
              />
              <div className="popup_project_text_editor">
                <div ref={quillRef} />
              </div>
              {!isedit && (
                <div className="popup_project_inputs">
                  <input
                    type="text"
                    name="startdate"
                    min={new Date().toLocaleDateString('en-ca')}
                    onFocus={(e) => {
                      e.target.setAttribute('type', 'date');
                    }}
                    onBlur={(e) => {
                      e.target.setAttribute('type', 'text');
                    }}
                    placeholder="Project Start Date"
                    onChange={HandleValues}
                  />
                </div>
              )}

              <div className="popup_project_inputs">
                <input
                  disabled={!values?.startdate && !isedit && true}
                  type="text"
                  name="enddate"
                  min={
                    isedit
                      ? new Date(isedit?.enddate).toLocaleDateString('en-ca')
                      : values?.startdate
                  }
                  onFocus={(e) => {
                    e.target.setAttribute('type', 'date');
                  }}
                  onBlur={(e) => {
                    e.target.setAttribute('type', 'text');
                  }}
                  placeholder={
                    isedit
                      ? `Project Ends on ${moment(isedit?.enddate).format(
                          'DD-MM-YYYY'
                        )}`
                      : 'Project End Date'
                  }
                  onChange={HandleValues}
                />
              </div>
            </div>
          </div>
          <div className="right_project_popup_conatiner">
            {/* {!isedit && (
              <div className="add_users_right_project_popup">
                <div className="add_user_project_popup_heading">
                  <h2>Add Artists</h2>
                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      setIsAddUserPopup({
                        ['artist']: true,
                      });
                    }}
                  >
                    <i className="fa-solid fa-plus"></i> Add
                  </button>
                  {isAddUserPopup?.artist && (
                    <AddUserPopup
                      OnCloseAddUserPopup={OnCloseAddUserPopup}
                      OnAddNewItem={OnAddNewItem}
                      item={1}
                    />
                  )}
                </div>
                <div className="main_users_popup_project">
                  {AddedArtists?.map((item) => {
                    return (
                      <CreatedUser
                        item={1}
                        value={item}
                        key={item?._id}
                        isRemoveable={true}
                        OnRemoveItem={OnRemoveItem}
                      />
                    );
                  })}
                </div>
              </div>
            )} */}

            <div className="add_users_right_project_popup">
              <div className="add_user_project_popup_heading">
                <h2>Add Line Producer</h2>
                <button
                  onClick={(e) => {
                    e.preventDefault();
                    setIsAddUserPopup({
                      ['producer']: true,
                    });
                  }}
                >
                  <i className="fa-solid fa-plus"></i> Add
                </button>
                {isAddUserPopup?.producer && (
                  <AddUserPopup
                    OnCloseAddUserPopup={OnCloseAddUserPopup}
                    OnAddNewItem={OnAddNewItem}
                    item={2}
                  />
                )}
              </div>

              <div className="main_users_popup_project">
                {AddedProducers?.map((item) => {
                  return (
                    <CreatedUser
                      item={2}
                      value={item}
                      key={item?._id}
                      isRemoveable={true}
                      OnRemoveItem={OnRemoveItem}
                    />
                  );
                })}
              </div>
            </div>

            <div className="add_users_right_project_popup">
              <div className="add_user_project_popup_heading">
                <h2>Add Director</h2>
                <button
                  onClick={(e) => {
                    e.preventDefault();
                    setIsAddUserPopup({
                      ['director']: true,
                    });
                  }}
                >
                  <i className="fa-solid fa-plus"></i> Add
                </button>
                {isAddUserPopup?.director && (
                  <AddUserPopup
                    OnCloseAddUserPopup={OnCloseAddUserPopup}
                    OnAddNewItem={OnAddNewItem}
                    item={3}
                  />
                )}
              </div>
              <div className="main_users_popup_project">
                {AddedDirectors?.map((item) => {
                  return (
                    <CreatedUser
                      item={3}
                      value={item}
                      key={item?._id}
                      isRemoveable={true}
                      OnRemoveItem={OnRemoveItem}
                    />
                  );
                })}
              </div>
            </div>

            <div className="add_users_right_project_popup">
              <div className="add_user_project_popup_heading">
                <h2>Link a Audition</h2>
                <button
                  onClick={(e) => {
                    e.preventDefault();
                    setIsAddUserPopup({
                      ['audition']: true,
                    });
                  }}
                >
                  <i className="fa-solid fa-plus"></i> Link
                </button>
                {isAddUserPopup?.audition && (
                  <AddUserPopup
                    OnCloseAddUserPopup={OnCloseAddUserPopup}
                    OnAddNewItem={OnAddNewItem}
                    item={4}
                  />
                )}
              </div>
              <div className="main_users_popup_project">
                {AddedAuditions?.map((item) => {
                  return (
                    <CreatedUser
                      item={4}
                      value={item}
                      key={item?._id}
                      isRemoveable={true}
                      OnRemoveItem={OnRemoveItem}
                    />
                  );
                })}
              </div>
            </div>
          </div>
        </form>
        <div className="popup_project_cta_btns">
          <button disabled={loading && true} onClick={ResetForm}>
            Reset
          </button>
          {isedit ? (
            <button
              className="upload"
              onClick={HandleSubmitUpdate}
              disabled={loading && true}
            >
              {loading ? <i className="fa fa-spinner fa-spin"></i> : 'Update'}
            </button>
          ) : (
            <button
              className="upload"
              onClick={HandleSubmit}
              disabled={loading && true}
            >
              {loading ? <i className="fa fa-spinner fa-spin"></i> : 'CREATE'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
