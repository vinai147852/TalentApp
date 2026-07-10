import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { toast } from "react-toastify";
import AuthRequest from "../../../utils/axiosinstance";
import { Login } from "../../../redux/UserSlice";

export default function PortfolioTab() {
  const User = useSelector((state) => state.user.user);
  const [value, setValue] = useState("");
  const [items, setItems] = useState(User?.portfolio);
  const [loading, setLoading] = useState();
  const dispatch = useDispatch();

  // Update User Values -------------------------------------------------
  const UpdateUser = async () => {
    setLoading(true);
    try {
      const res = await AuthRequest().put("/user/update/profile", {
        portfolio: items,
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

  const AddNewLink = () => {
    if (!value) {
      toast.error("Please Add Portfolio");
    } else {
      if (!items?.includes(value)) {
        setItems((prev) => [...prev, value]);
        setValue("");
      } else {
        toast.error("Link Already Added");
      }
    }
  };

  const RemovePortfolioLink = (e) => {
    setItems(
      items?.filter((item) => {
        if (item !== e) {
          return item;
        }
      })
    );
  };

  return (
    <div className="main_box_container_account">
      <div className="heading_box_container">
        <h2>Add Film History</h2>
      </div>
      <div className="add_portfolio_container">
        <div className="add_portfolio_input">
          <input
            type="text"
            placeholder="Type movie name"
            defaultValue={value}
            onChange={(e) => setValue(e.target.value)}
          />
          <button onClick={AddNewLink}>Add New</button>
        </div>
        <div className="added_portfolios_body">
          {items
            ?.map((item) => {
              return (
                <div className="portfolio_box" key={item}>
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
      </div>
      <div className="save_changes_box_container">
        <button
          disabled={
            items.length === User?.portfolio.length || (loading && true)
          }
          onClick={UpdateUser}
        >
          {loading ? <i className="fa fa-spinner fa-spin"></i> : "Save changes"}
        </button>
      </div>
    </div>
  );
}
