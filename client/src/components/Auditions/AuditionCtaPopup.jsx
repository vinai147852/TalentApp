import React from "react";
import "./auditions.scss";

function AuditionCtaPopup({ onCloseCtaPopup, loading, onPress, state }) {
  return (
    <div className="account_box_delete">
      <div className="isdelete_container">
        <div className="inner_isdelete">
          <h2>
            Are you sure you want to {state === 1 ? "Apply" : "Withdraw"} ?
          </h2>
          <div className="btns_isdelete">
            <button onClick={onCloseCtaPopup}>Cancel</button>
            <button onClick={onPress}>
              {loading ? <i className="fa fa-spin fa-spinner"></i> : "Sure"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AuditionCtaPopup;
