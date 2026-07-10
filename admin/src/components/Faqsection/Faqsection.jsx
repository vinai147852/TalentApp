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
                Is simply dummy text of the printing and typesetting industry.
                Lorem Ipsum has been the industrys standard dummy text ever
                since the 1500s, when an unknown printer took a galley of type
                and scrambled it to make a type specimen book. It has survived
                not only five centuries, but also the leap into electronic
                typesetting, remaining essentially unchanged.
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
                Is simply dummy text of the printing and typesetting industry.
                Lorem Ipsum has been the industrys standard dummy text ever
                since the 1500s, when an unknown printer took a galley of type
                and scrambled it to make a type specimen book. It has survived
                not only five centuries, but also the leap into electronic
                typesetting, remaining essentially unchanged.
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
                Is simply dummy text of the printing and typesetting industry.
                Lorem Ipsum has been the industrys standard dummy text ever
                since the 1500s, when an unknown printer took a galley of type
                and scrambled it to make a type specimen book. It has survived
                not only five centuries, but also the leap into electronic
                typesetting, remaining essentially unchanged.
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
                Is simply dummy text of the printing and typesetting industry.
                Lorem Ipsum has been the industrys standard dummy text ever
                since the 1500s, when an unknown printer took a galley of type
                and scrambled it to make a type specimen book. It has survived
                not only five centuries, but also the leap into electronic
                typesetting, remaining essentially unchanged.
              </p>
            </div>
          </div>
        </div>

        <div className="Faq_Part">
          <h2>Artists / Auditions</h2>
          <div className="inner_faq_part_dropdown">
            <div className="heading_faq_dropdown">
              <h4>How to select an artist?</h4>
              <i className="fa-solid fa-angle-down"></i>
            </div>
            <div className="text_faq_dropdown">
              <p>
                Is simply dummy text of the printing and typesetting industry.
                Lorem Ipsum has been the industrys standard dummy text ever
                since the 1500s, when an unknown printer took a galley of type
                and scrambled it to make a type specimen book. It has survived
                not only five centuries, but also the leap into electronic
                typesetting, remaining essentially unchanged.
              </p>
            </div>
          </div>
          <div className="inner_faq_part_dropdown">
            <div className="heading_faq_dropdown">
              <h4>How to chat with artist?</h4>
              <i className="fa-solid fa-angle-down"></i>
            </div>
            <div className="text_faq_dropdown">
              <p>
                Is simply dummy text of the printing and typesetting industry.
                Lorem Ipsum has been the industrys standard dummy text ever
                since the 1500s, when an unknown printer took a galley of type
                and scrambled it to make a type specimen book. It has survived
                not only five centuries, but also the leap into electronic
                typesetting, remaining essentially unchanged.
              </p>
            </div>
          </div>
          <div className="inner_faq_part_dropdown">
            <div className="heading_faq_dropdown">
              <h4>Question goes here</h4>
              <i className="fa-solid fa-angle-down"></i>
            </div>
            <div className="text_faq_dropdown">
              <p>
                Is simply dummy text of the printing and typesetting industry.
                Lorem Ipsum has been the industrys standard dummy text ever
                since the 1500s, when an unknown printer took a galley of type
                and scrambled it to make a type specimen book. It has survived
                not only five centuries, but also the leap into electronic
                typesetting, remaining essentially unchanged.
              </p>
            </div>
          </div>
        </div>

        <div className="Faq_Part">
          <h2>Account</h2>
          <div className="inner_faq_part_dropdown">
            <div className="heading_faq_dropdown">
              <h4>Question goes here</h4>
              <i className="fa-solid fa-angle-down"></i>
            </div>
            <div className="text_faq_dropdown">
              <p>
                Is simply dummy text of the printing and typesetting industry.
                Lorem Ipsum has been the industrys standard dummy text ever
                since the 1500s, when an unknown printer took a galley of type
                and scrambled it to make a type specimen book. It has survived
                not only five centuries, but also the leap into electronic
                typesetting, remaining essentially unchanged.
              </p>
            </div>
          </div>
          <div className="inner_faq_part_dropdown">
            <div className="heading_faq_dropdown">
              <h4>Question goes here</h4>
              <i className="fa-solid fa-angle-down"></i>
            </div>
            <div className="text_faq_dropdown">
              <p>
                Is simply dummy text of the printing and typesetting industry.
                Lorem Ipsum has been the industrys standard dummy text ever
                since the 1500s, when an unknown printer took a galley of type
                and scrambled it to make a type specimen book. It has survived
                not only five centuries, but also the leap into electronic
                typesetting, remaining essentially unchanged.
              </p>
            </div>
          </div>
          <div className="inner_faq_part_dropdown">
            <div className="heading_faq_dropdown">
              <h4>Question goes here</h4>
              <i className="fa-solid fa-angle-down"></i>
            </div>
            <div className="text_faq_dropdown">
              <p>
                Is simply dummy text of the printing and typesetting industry.
                Lorem Ipsum has been the industrys standard dummy text ever
                since the 1500s, when an unknown printer took a galley of type
                and scrambled it to make a type specimen book. It has survived
                not only five centuries, but also the leap into electronic
                typesetting, remaining essentially unchanged.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
