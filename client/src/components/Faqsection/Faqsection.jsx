import React from 'react';
import './faqsection.scss';
import $ from 'jquery';

export default function Faqsection() {
  $(document).ready(function () {
    $('.inner_faq_part_dropdown')
      .unbind()
      .click(function () {
        $(this).toggleClass('active_inner_faq_part_dropdown');
      });
  });
  return (
    <div className="main_faq_section">
      <div className="inner_faq_section">
        <div className="Faq_Part">
          <h2>General</h2>
          <div className="inner_faq_part_dropdown active_inner_faq_part_dropdown">
            <div className="heading_faq_dropdown">
              <h4>How to register?</h4>
              <i className="fa-solid fa-angle-down"></i>
            </div>
            <div className="text_faq_dropdown">
              <p>
              You can create an account with Talentapp by clicking the join button in the top of the website. There you will have to enter the basic details of you with your photos.
              </p>
            </div>
          </div>
          <div className="inner_faq_part_dropdown">
            <div className="heading_faq_dropdown">
              <h4>How to login?</h4>
              <i className="fa-solid fa-angle-down"></i>
            </div>
            <div className="text_faq_dropdown">
              <p>
              Your user id is going to be your phone number. You can enter your phone number and the password you have created to log into the account. 
              </p>
            </div>
          </div>
          <div className="inner_faq_part_dropdown">
            <div className="heading_faq_dropdown">
              <h4>Forgot password?</h4>
              <i className="fa-solid fa-angle-down"></i>
            </div>
            <div className="text_faq_dropdown">
              <p>
              In the case you forgot your password, you can just click the forgot the password option. After entering the OTP sent to your mobile number you can enter a new password and log into the account again.
              </p>
            </div>
          </div>
          <div className="inner_faq_part_dropdown">
            <div className="heading_faq_dropdown">
              <h4>How do I change my password?</h4>
              <i className="fa-solid fa-angle-down"></i>
            </div>
            <div className="text_faq_dropdown">
              <p>
              You can change your password by clicking the profile button on the top right side -&gt; Account -&gt; change password on the left side bar
              </p>
            </div>
          </div>
          <div className="inner_faq_part_dropdown">
            <div className="heading_faq_dropdown">
              <h4>Should I pay to create an account?</h4>
              <i className="fa-solid fa-angle-down"></i>
            </div>
            <div className="text_faq_dropdown">
              <p>
              No. The portal is completely free to create and access.
              </p>
            </div>
          </div>
          <div className="inner_faq_part_dropdown">
            <div className="heading_faq_dropdown">
              <h4>Deleting the account?</h4>
              <i className="fa-solid fa-angle-down"></i>
            </div>
            <div className="text_faq_dropdown">
              <p>
              Deleting your account will delete all your information with us. However you can delete your account by click the profile button on the top right side -&gt; Account -&gt; delete my profile button
              </p>
            </div>
          </div>
        </div>

        <div className="Faq_Part">
          <h2>Applicants / Auditions</h2>
          <div className="inner_faq_part_dropdown">
            <div className="heading_faq_dropdown">
              <h4>How to check for auditions?</h4>
              <i className="fa-solid fa-angle-down"></i>
            </div>
            <div className="text_faq_dropdown">
              <p>
              When you log into your account. You can click the auditions tab on the top strip bar to open the available auditions
              </p>
            </div>
          </div>
          <div className="inner_faq_part_dropdown">
            <div className="heading_faq_dropdown">
              <h4>How can I check the ongoing auditions?</h4>
              <i className="fa-solid fa-angle-down"></i>
            </div>
            <div className="text_faq_dropdown">
              <p>
              There will be a button at the top of the auditions page, where you can select the ongoing, future auditions calls. You can just click on the ongoing auditions button. A list of audition calls are displayed.
              </p>
            </div>
          </div>
          <div className="inner_faq_part_dropdown">
            <div className="heading_faq_dropdown">
              <h4>What happens when I click any audition call?</h4>
              <i className="fa-solid fa-angle-down"></i>
            </div>
            <div className="text_faq_dropdown">
              <p>
              When you click the audition call you want to know about, there will be a new page opened which displays all the details provided to you from the team that called for it. You can view all the details regarding the audition.
              </p>
            </div>
          </div>
        </div>

        <div className="Faq_Part">
          <h2>Account</h2>
          <div className="inner_faq_part_dropdown">
            <div className="heading_faq_dropdown">
              <h4>How to apply for the audition?</h4>
              <i className="fa-solid fa-angle-down"></i>
            </div>
            <div className="text_faq_dropdown">
              <p>
              Once you open the audition call page. You can click apply button.
              </p>
            </div>
          </div>
          <div className="inner_faq_part_dropdown">
            <div className="heading_faq_dropdown">
              <h4>How will I know I am shortlisted?</h4>
              <i className="fa-solid fa-angle-down"></i>
            </div>
            <div className="text_faq_dropdown">
              <p>
              You will either receive a message in the app or call from the audition team to attend the audition in our campus. You have to physically present to the audition in the date given by us.
              </p>
            </div>
          </div>
          <div className="inner_faq_part_dropdown">
            <div className="heading_faq_dropdown">
              <h4>Can I apply for more than one audition in the website?</h4>
              <i className="fa-solid fa-angle-down"></i>
            </div>
            <div className="text_faq_dropdown">
              <p>
              Yes. You can apply for as many auditions as you need. You must ensure that you will apply only to the ones that are relevant to you.
              </p>
            </div>
          </div>
          <div className="inner_faq_part_dropdown">
            <div className="heading_faq_dropdown">
              <h4>Can I message the team members ?</h4>
              <i className="fa-solid fa-angle-down"></i>
            </div>
            <div className="text_faq_dropdown">
              <p>
              No. You cannot message anyone or any other applicant in the website. You can only reply to them, if they want to communicate with you.
              </p>
            </div>
          </div>
          <div className="inner_faq_part_dropdown">
            <div className="heading_faq_dropdown">
              <h4>Should I pay any amount to get shortlisted?</h4>
              <i className="fa-solid fa-angle-down"></i>
            </div>
            <div className="text_faq_dropdown">
              <p>
              No. It&apos;s free and open for everyone. The entire process is carried out with extreme measures to avoid any acts of bribery.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
