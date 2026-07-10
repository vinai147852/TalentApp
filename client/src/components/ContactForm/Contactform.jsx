import React, { useState } from 'react';
import './contactform.scss';
import { useSelector } from 'react-redux';
import { axiosinstance } from '../../utils/axiosinstance';
import { toast } from 'react-toastify';

export default function Contactform() {
  const User = useSelector((state) => state.user.user);
  const [values, setValues] = useState(User?.email && { email: User?.email });
  const [loading, setLoading] = useState(false);

  const HandleValues = (e) => {
    setValues({ ...values, [e.target.name]: e.target.value });
  };

  const HandleSubmit = async () => {
    if (Validation()) {
      setLoading(true);
      try {
        const res = await axiosinstance.post('email/send', {
          name: User?.name + ' ' + User?.surname,
          email: values?.email,
          phonenumber: User?.mobileno,
          message: values?.message,
        });
        toast.success(res.data);
        setLoading(false);
      } catch (error) {
        toast.error(error?.response.data);
        setLoading(false);
      }
    }
  };

  const Validation = () => {
    if (!values.email) {
      toast.error('Please enter email address');
      return false;
    } else if (!values.email.includes('@')) {
      toast.error('Please enter valid email address');
      return false;
    } else if (!values.email.includes('.com')) {
      toast.error('Please enter valid email address');
      return false;
    } else if (!values.message) {
      toast.error('Please type your message');
      return false;
    } else {
      return true;
    }
  };

  return (
    <div className="contact_form_main">
      <div className="inner_contact_form">
        <div className="form_heading_contact">
          <h2>Contact Us</h2>
        </div>
        <div className="contact_page_form">
          <input
            type="text"
            name="name"
            placeholder="Full Name"
            value={User?.name + ' ' + User?.surname}
            readOnly
          />
          <div className="grid_inputs">
            <input
              type="text"
              name="mobileno"
              placeholder="Phone Number"
              readOnly
              value={'+' + User?.mobileno}
            />
            <input
              type="text"
              name="email"
              placeholder="Email"
              value={User?.email}
              onChange={HandleValues}
            />
          </div>
          <textarea
            name="message"
            placeholder="Your Message"
            onChange={HandleValues}
          ></textarea>
          <div className="submit_form_btn">
            <button
              onClick={HandleSubmit}
              disabled={(!values?.email || !values?.message) && true}
            >
              {loading ? <i className="fa fa-spinner fa-spin"></i> : 'Submit'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
