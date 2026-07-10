import React, { useState } from "react";
import { CircularProgressbar } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import { useSelector, useDispatch } from "react-redux";
import { toast } from "react-toastify";
import { UploadImage } from "../../../utils/ImageUpload";
import AuthRequest from "../../../utils/axiosinstance";
import { Login } from "../../../redux/UserSlice";
import { useEffect } from "react";

export default function ImageTab() {
  const User = useSelector((state) => state.user.user);
  const [loading, setLoading] = useState(false);
  const [images, setimages] = useState({});
  const [links, setlinks] = useState({});
  const dispatch = useDispatch();
  const [progress, setProgress] = useState({});

  // Update User Values -------------------------------------------------
  const UpdateUser = async () => {
    setLoading(true);
    try {
      const res = await AuthRequest().put("/user/update/profile", {
        ...links,
        userId: User?._id,
      });
      toast.success(res.data.message);
      dispatch(Login({ ...res.data.item, accesstoken: User?.accesstoken }));
      setLoading(false);
      setlinks({});
      setimages({});
    } catch (err) {
      toast.error(err?.response.data);
      setLoading(false);
    }
  };

  const HandleImages = (e) => {
    const validImageTypes = ["image/jpeg", "image/png"];
    if (e.target.files[0].size > 500000) {
      toast.error("image must be less than 500 Kbs");
    } else if (!validImageTypes.includes(e.target.files[0]["type"])) {
      toast.error("Only Png & Jpg will be accepted");
    } else {
      setimages({ ...images, [e.target.name]: e.target.files[0] });
    }
  };

  const OnSuccess = (link) => {
    setlinks((prev) => ({ ...prev, ...link }));
    setProgress({});
  };

  useEffect(() => {
    if (
      Object.keys(links)?.length &&
      Object.keys(links)?.length === Object.keys(images)?.length
    ) {
      UpdateUser();
    }
  }, [links]);

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

  return (
    <div className="main_box_container_account">
      <div className="heading_box_container">
        <h2>Your Photos</h2>
      </div>
      <div className="account_images_grid">
        <div className="image_account_div">
          <div
            className={
              images?.image1 || User?.image1
                ? "account_image_uploaders "
                : "account_image_uploaders show"
            }
          >
            <label htmlFor="upload1">
              <i className="fa-solid fa-cloud-arrow-up"></i>
              <h4>Upload Image</h4>
            </label>
            <input
              type="file"
              id="upload1"
              name="image1"
              onChange={(e) => {
                HandleImages(e);
              }}
            />
          </div>
          <img
            src={
              images?.image1
                ? URL.createObjectURL(images?.image1)
                : User?.image1
            }
            alt=""
          />
          {progress?.image1 === 0 && progress?.image1 !== 100 && (
            <div className="image_uploader">
              <CircularProgressbar
                value={progress?.image1}
                text={`${progress?.image1}%`}
              />
            </div>
          )}
        </div>
        {(User.category === "Artist" || User.category === "Anchor") && (
          <>
            <div className="image_account_div">
              <div
                className={
                  images?.image2 || User?.image2
                    ? "account_image_uploaders "
                    : "account_image_uploaders show"
                }
              >
                <label htmlFor="upload2">
                  <i className="fa-solid fa-cloud-arrow-up"></i>
                  <h4>Upload Image</h4>
                </label>
                <input
                  type="file"
                  id="upload2"
                  name="image2"
                  onChange={(e) => {
                    HandleImages(e);
                  }}
                />
              </div>
              <img
                src={
                  images?.image2
                    ? URL.createObjectURL(images?.image2)
                    : User?.image2
                }
                alt=""
              />
              {progress?.image2 === 0 && progress?.image2 !== 100 && (
                <div className="image_uploader">
                  <CircularProgressbar
                    value={progress?.image2}
                    text={`${progress?.image2}%`}
                  />
                </div>
              )}
            </div>
            <div className="image_account_div">
              <div
                className={
                  images?.image3 || User?.image3
                    ? "account_image_uploaders "
                    : "account_image_uploaders show"
                }
              >
                <label htmlFor="upload3">
                  <i className="fa-solid fa-cloud-arrow-up"></i>
                  <h4>Upload Image</h4>
                </label>
                <input
                  type="file"
                  id="upload3"
                  name="image3"
                  onChange={(e) => {
                    HandleImages(e);
                  }}
                />
              </div>
              <img
                src={
                  images?.image3
                    ? URL.createObjectURL(images?.image3)
                    : User?.image3
                }
                alt=""
              />
              {progress?.image3 === 0 && progress?.image3 !== 100 && (
                <div className="image_uploader">
                  <CircularProgressbar
                    value={progress?.image3}
                    text={`${progress?.image3}%`}
                  />
                </div>
              )}
            </div>
            <div className="image_account_div">
              <div
                className={
                  images?.image4 || User?.image4
                    ? "account_image_uploaders "
                    : "account_image_uploaders show"
                }
              >
                <label htmlFor="upload4">
                  <i className="fa-solid fa-cloud-arrow-up"></i>
                  <h4>Upload Image</h4>
                </label>
                <input
                  type="file"
                  id="upload4"
                  name="image4"
                  onChange={(e) => {
                    HandleImages(e);
                  }}
                />
              </div>
              <img
                src={
                  images?.image4
                    ? URL.createObjectURL(images?.image4)
                    : User?.image4
                }
                alt=""
              />
              {progress?.image4 === 0 && progress?.image4 !== 100 && (
                <div className="image_uploader">
                  <CircularProgressbar
                    value={progress?.image4}
                    text={`${progress?.image4}%`}
                  />
                </div>
              )}
            </div>
          </>
        )}
      </div>
      <div className="save_changes_box_container">
        <button
          onClick={HandleUploadImages}
          disabled={
            !Object.keys(images).length ||
            (Object.keys(progress).length && loading && true)
          }
        >
          {Object.keys(progress).length || loading ? (
            <i className="fa fa-spinner fa-spin"></i>
          ) : (
            "Save Changes"
          )}
        </button>
      </div>
    </div>
  );
}
