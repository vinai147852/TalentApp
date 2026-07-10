import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { toast } from "react-toastify";
import AuthRequest from "../../../utils/axiosinstance";
import { Login } from "../../../redux/UserSlice";

export default function SocialTab() {
  const User = useSelector((state) => state.user.user);
  const [loading, setLoading] = useState();
  const [values, setValues] = useState();
  const dispatch = useDispatch();

  // Update User Values -------------------------------------------------
  const UpdateUser = async () => {
    setLoading(true);
    try {
      const res = await AuthRequest().put("/user/update/profile", {
        ...values,
        userId: User?._id,
      });
      toast.success(res.data.message);
      dispatch(Login({ ...res.data.item, accesstoken: User?.accesstoken }));
      setLoading(false);
    } catch (err) {
      toast.error(err?.response.data);
      setLoading(false);
    }
  };

  const HandleValues = (e) => {
    setValues((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  return (
    <div className="main_box_container_account">
      <div className="heading_box_container">
        <h2>Social Media</h2>
      </div>
      <div className="add_portfolio_container social">
        <div className="add_portfolio_input">
          <input
            type="text"
            name="facebook"
            defaultValue={User?.facebook}
            placeholder="Facebook"
            onChange={HandleValues}
          />
          <a href={`//${User?.facebook}`} target="_blank" rel="noreferrer">
            <i className="fab fa-facebook"></i>
          </a>
        </div>
        <div className="add_portfolio_input">
          <input
            type="text"
            name="twitter"
            defaultValue={User?.twitter}
            onChange={HandleValues}
            placeholder="Twitter"
          />
          <a href={`//${User?.twitter}`} target="_blank" rel="noreferrer">
            <i className="fab fa-twitter"></i>
          </a>
        </div>
        <div className="add_portfolio_input">
          <input
            type="text"
            name="instagram"
            defaultValue={User?.instagram}
            placeholder="Instagram"
            onChange={HandleValues}
          />
          <a href={`//${User?.instagram}`} target="_blank" rel="noreferrer">
            <i className="fab fa-instagram"></i>
          </a>
        </div>
        <div className="add_portfolio_input">
          <input
            type="text"
            name="youtube"
            placeholder="Youtube"
            defaultValue={User?.youtube}
            onChange={HandleValues}
          />
          <a href={`//${User?.youtube}`} target="_blank" rel="noreferrer">
            <i className="fab fa-youtube"></i>
          </a>
        </div>
      </div>
      <div className="save_changes_box_container">
        <button disabled={!values || (loading && true)} onClick={UpdateUser}>
          {loading ? <i className="fa fa-spinner fa-spin"></i> : "Save changes"}
        </button>
      </div>
    </div>
  );
}
