import React, { useRef, useState } from 'react';
import Select from 'react-select';
import {
  category_options,
  gender_options,
  Height_options,
  languages_options,
  options_styles,
  subcategory_options,
} from '../../Options';
import { useSelector, useDispatch } from 'react-redux';
import { toast } from 'react-toastify';
import AuthRequest from '../../../utils/axiosinstance';
import { Login } from '../../../redux/UserSlice';
import { useEffect } from 'react';

export default function ProfileTab() {
  const User = useSelector((state) => state.user.user);
  const [values, setvalues] = useState();
  const [loading, setLoading] = useState(false);
  const SubCategoryRef = useRef();
  const DateofBirthRef = useRef();
  const dispatch = useDispatch();

  // Update User Values -------------------------------------------------
  const UpdateUser = async () => {
    setLoading(true);
    try {
      const res = await AuthRequest().put('/user/update/profile', {
        ...values,
        userId: User?._id,
      });
      toast.success(res.data.message);
      dispatch(Login({ ...res.data.item, accesstoken: User?.accesstoken }));
      setLoading(false);
      setvalues();
    } catch (err) {
      toast.error(err?.response.data);
      setLoading(false);
    }
  };

  // Handle Values

  const HandleValues = (e) => {
    if (e?.name === 'category') {
      SubCategoryRef.current.setValue('');
    }
    if (e.name !== undefined) {
      setvalues((prev) => ({ ...prev, [e?.name]: e?.value }));
    } else {
      setvalues((prev) => ({ ...prev, [e?.target?.name]: e?.target?.value }));
    }
  };

  const HandleMultiValues = (e) => {
    setvalues((prev) => ({ ...prev, ['knownlanguages']: e }));
  };

  const GetAge = () => {
    var today = new Date();
    var birthDate = new Date(
      values?.dateofbirth ? values?.dateofbirth : User?.dateofbirth
    );
    var age = today.getFullYear() - birthDate.getFullYear();
    var m = today.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    DateofBirthRef.current.value = `${age} years old`;
  };

  useEffect(() => {
    GetAge();
  }, []);

  return (
    <div className="main_box_container_account">
      <div className="heading_box_container">
        <h2>Personal Details</h2>
      </div>
      <div className="account_box_data_settings">
        <div className="input_bx">
          <div className="label_inputs">
            <label htmlFor="">Category</label>
          </div>
          <div className="select_bx">
            <Select
              styles={options_styles}
              onChange={HandleValues}
              options={category_options}
              defaultValue={{
                name: User?.category,
                label: User?.category,
                value: User?.category,
              }}
            />
          </div>
        </div>
        <div className="input_bx">
          <div className="label_inputs">
            <label htmlFor="">Sub Category</label>
          </div>
          <div className="select_bx">
            <Select
              ref={SubCategoryRef}
              styles={options_styles}
              onChange={HandleValues}
              isDisabled={!values?.category && !User?.category}
              options={subcategory_options.filter((item) => {
                if (
                  item.target?.toLocaleLowerCase() ===
                  (values?.category
                    ? values?.category?.toLocaleLowerCase()
                    : User?.category?.toLocaleLowerCase())
                ) {
                  return item;
                }
              })}
              defaultValue={{
                name: User?.subcategory,
                label: User?.subcategory,
                value: User?.subcategory,
              }}
            />
          </div>
        </div>
        <div className="input_bx">
          <div className="label_inputs">
            <label htmlFor="">Gender</label>
          </div>
          <div className="select_bx">
            <Select
              styles={options_styles}
              options={gender_options}
              onChange={HandleValues}
              defaultValue={{
                name: User?.gender,
                label: User?.gender,
                value: User?.gender,
              }}
            />
          </div>
        </div>
        <div className="input_bx">
          <div className="label_inputs">
            <label htmlFor="">Date of Birth</label>
          </div>
          <div className="select_bx">
            <input
              type="text"
              ref={DateofBirthRef}
              placeholder="Your Date of Birth"
              name="dateofbirth"
              onFocus={(e) => {
                e.target.setAttribute('type', 'date');
              }}
              onBlur={(e) => {
                e.target.setAttribute('type', 'text');
                values?.dateofbirth && GetAge();
              }}
              onChange={HandleValues}
            />
          </div>
        </div>

        <div className="input_bx">
          <div className="label_inputs">
            <label htmlFor="">Height</label>
          </div>
          <div className="select_bx">
            <Select
              options={Height_options}
              styles={options_styles}
              onChange={HandleValues}
              defaultValue={{
                name: User?.height,
                label: User?.height,
                value: User?.height,
              }}
            />
          </div>
        </div>
        <div className="input_bx">
          <div className="label_inputs">
            <label htmlFor="">Weight</label>
          </div>
          <div className="select_bx">
            <input
              type="number"
              name="weight"
              min={1}
              onInput={(e) => {
                if (e.target.value < e.target.min) {
                  e.target.value = '';
                } else if (e.target.value.length > e.target.maxLength) {
                  e.target.value = e.target.value.slice(0, e.target.maxLength);
                }
              }}
              maxLength={3}
              onChange={HandleValues}
              defaultValue={User?.weight}
            />
          </div>
        </div>
      </div>

      <div className="heading_box_container">
        <h2>Languages Details</h2>
      </div>
      <div className="account_box_data_settings">
        <div className="input_bx">
          <div className="label_inputs">
            <label htmlFor="">Mother language</label>
          </div>
          <div className="select_bx">
            <Select
              styles={options_styles}
              options={languages_options}
              onChange={HandleValues}
              defaultValue={{
                name: User?.motherlanguage,
                label: User?.motherlanguage,
                value: User?.motherlanguage,
              }}
            />
          </div>
        </div>
        <div className="input_bx">
          <div className="label_inputs">
            <label htmlFor="">Known Languages</label>
          </div>
          <div className="select_bx ismulti">
            <Select
              styles={options_styles}
              isMulti={true}
              defaultValue={User?.knownlanguages?.map((item) => {
                return item;
              })}
              onChange={HandleMultiValues}
              options={languages_options}
            />
          </div>
        </div>
      </div>

      {(User.category === 'Artist' || User.category === 'Anchor') && (
        <>
          <div className="heading_box_container">
            <h2>Vitals Measurements (Inches)</h2>
          </div>
          <div className="account_box_data_settings">
            <div className="input_bx">
              <div className="label_inputs">
                <label htmlFor="">Chest</label>
              </div>
              <div className="select_bx">
                <input
                  type="number"
                  name="chest"
                  min={1}
                  maxLength={2}
                  onInput={(e) => {
                    if (e.target.value < e.target.min) {
                      e.target.value = '';
                    } else if (e.target.value.length > e.target.maxLength) {
                      e.target.value = e.target.value.slice(
                        0,
                        e.target.maxLength
                      );
                    }
                  }}
                  onChange={HandleValues}
                  defaultValue={User?.chest}
                />
              </div>
            </div>
            <div className="input_bx">
              <div className="label_inputs">
                <label htmlFor="">Waist</label>
              </div>
              <div className="select_bx">
                <input
                  type="number"
                  name="waist"
                  min={1}
                  maxLength={2}
                  onInput={(e) => {
                    if (e.target.value < e.target.min) {
                      e.target.value = '';
                    } else if (e.target.value.length > e.target.maxLength) {
                      e.target.value = e.target.value.slice(
                        0,
                        e.target.maxLength
                      );
                    }
                  }}
                  onChange={HandleValues}
                  defaultValue={User?.waist}
                />
              </div>
            </div>
            <div className="input_bx">
              <div className="label_inputs">
                <label htmlFor="">Hips</label>
              </div>
              <div className="select_bx">
                <input
                  type="number"
                  min={1}
                  maxLength={2}
                  onInput={(e) => {
                    if (e.target.value < e.target.min) {
                      e.target.value = '';
                    } else if (e.target.value.length > e.target.maxLength) {
                      e.target.value = e.target.value.slice(
                        0,
                        e.target.maxLength
                      );
                    }
                  }}
                  name="hips"
                  onChange={HandleValues}
                  defaultValue={User?.hips}
                />
              </div>
            </div>
            <div className="input_bx">
              <div className="label_inputs">
                <label htmlFor="">Shoulder</label>
              </div>
              <div className="select_bx">
                <input
                  type="number"
                  name="shoulders"
                  min={1}
                  maxLength={2}
                  onInput={(e) => {
                    if (e.target.value < e.target.min) {
                      e.target.value = '';
                    } else if (e.target.value.length > e.target.maxLength) {
                      e.target.value = e.target.value.slice(
                        0,
                        e.target.maxLength
                      );
                    }
                  }}
                  onChange={HandleValues}
                  defaultValue={User?.shoulders}
                />
              </div>
            </div>
          </div>
        </>
      )}

      <div className="heading_box_container">
        <h2>Comunicational Address</h2>
      </div>
      <div className="account_box_data_settings">
        <div className="input_bx">
          <div className="label_inputs">
            <label htmlFor="">House / Flat</label>
          </div>
          <div className="select_bx">
            <input
              type="text"
              name="address"
              onChange={HandleValues}
              defaultValue={User?.house}
            />
          </div>
        </div>
        <div className="input_bx">
          <div className="label_inputs">
            <label htmlFor="">Street Name</label>
          </div>
          <div className="select_bx">
            <input
              type="text"
              name="street"
              onChange={HandleValues}
              defaultValue={User?.street}
            />
          </div>
        </div>
        <div className="input_bx">
          <div className="label_inputs">
            <label htmlFor="">Colony Name</label>
          </div>
          <div className="select_bx">
            <input
              type="text"
              name="colony"
              onChange={HandleValues}
              defaultValue={User?.colony}
            />
          </div>
        </div>
        <div className="input_bx">
          <div className="label_inputs">
            <label htmlFor="">City</label>
          </div>
          <div className="select_bx">
            <input
              type="text"
              name="city"
              onChange={HandleValues}
              defaultValue={User?.city}
            />
          </div>
        </div>
        <div className="input_bx">
          <div className="label_inputs">
            <label htmlFor="">State</label>
          </div>
          <div className="select_bx">
            <Select
              styles={options_styles}
              options={[
                { label: 'Delhi', value: 'delhi', name: 'state' },
                { label: 'Mombay', value: 'mombay', name: 'state' },
              ]}
              onChange={HandleValues}
              defaultValue={{
                name: User?.state,
                label: User?.state,
                value: User?.state,
              }}
            />
          </div>
        </div>
        <div className="input_bx">
          <div className="label_inputs">
            <label htmlFor="">Zip</label>
          </div>
          <div className="select_bx">
            <input
              type="number"
              name="zip"
              onInput={(e) => {
                if (e.target.value.length > e.target.maxLength) {
                  e.target.value = e.target.value.slice(0, e.target.maxLength);
                } else {
                  e.target.value = Math.abs(e.target.value);
                }
              }}
              maxLength="6"
              min={0}
              onChange={HandleValues}
              defaultValue={User?.zip}
            />
          </div>
        </div>
      </div>

      <div className="save_changes_box_container">
        <button disabled={(loading || !values) && true} onClick={UpdateUser}>
          {loading ? <i className="fa fa-spinner fa-spin"></i> : 'Save changes'}
        </button>
      </div>
    </div>
  );
}
