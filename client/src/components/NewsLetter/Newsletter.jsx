import React, { useRef, useState } from 'react';
import { axiosinstance } from '../../utils/axiosinstance';
import './newsletter.scss';
import { toast } from 'react-toastify';

export default function Newsletter() {
  const [email, setEmail] = useState();
  const [loading, setLoading] = useState(false);
  const NewsletterRef = useRef();

  const HandleSubmit = async () => {
    if (Validation()) {
      setLoading(true);
      try {
        const res = await axiosinstance.post('/newsletter/create', { email });
        toast.success(res.data);
        setLoading(false);
        NewsletterRef.current.value = '';
        setEmail();
      } catch (error) {
        toast.error(error?.response.data);
        setLoading(false);
      }
    }
  };

  const Validation = () => {
    if (!email) {
      toast.error('Please Enter Email');
      return false;
    } else if (!email.includes('@')) {
      toast.error('Please Enter Valid Email');
      return false;
    } else {
      return true;
    }
  };

  return (
    <div className="main_newsletter">
      <div className="inner_newsletter">
        <h2>Subscribe to get news and information</h2>
        <div className="Main_newsletter_bar">
          <input
            type="email"
            ref={NewsletterRef}
            placeholder="Enter Your Email"
            onChange={(e) => setEmail(e.target.value)}
          />
          <button className="newsletter_desk_btn" onClick={HandleSubmit}>
            {loading ? (
              <i className="fa fa-spinner fa-spin"></i>
            ) : (
              <>
                Sign Up <i className="fa-solid fa-paper-plane"></i>
              </>
            )}
          </button>
          <button className="newsletter_mob_btn" onClick={HandleSubmit}>
            <i className="fa-solid fa-paper-plane"></i>
          </button>
        </div>
      </div>
    </div>
  );
}
