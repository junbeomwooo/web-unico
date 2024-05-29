import React, { memo, useState, useCallback, useEffect } from "react";
import styled from "styled-components";
import { useDispatch, useSelector } from "react-redux";
import { loginCheck } from "../slices/MemberSlice";
import { guestGetList } from "../slices/GuestCartSlice";
import { getList } from "../slices/CartSlice";
import { holdItem } from "../slices/OrderDetailSlice";
import { guestHoldItem } from "../slices/GuestOrderDetailSlice";
import Spinner from "../components/Spinner";
import ErrorView from "../components/ErrorView";
import { useNavigate } from "react-router-dom";
import mq from "../MediaQuery/MediaQuery";
import regexHelper from "../helper/RegexHelper";
import Cookies from "js-cookie";

const ShippingForm = styled.form`
  padding-top: 30px;
  display: flex;
  flex-direction: column;
  align-items: center;
  position: relative;

  .Box {
    margin-top: 150px;
    width: 450px;
    height: auto;

    p {
      font-size: 13px;
    }

    h1 {
      font-size: 18px;
      font-weight: 600;
      margin-bottom: 30px;
    }

    h2 {
      margin-top: 30px;
      font-size: 15px;
      font-weight: 500;
    }

    h3 {
      color: red;
      font-size: 12px;
      position: absolute;
      margin-top: 5px;
      font-weight: 500;
    }

    input {
      width: 100%;
      background: none;
      border: 1px solid black;
      height: 40px;
      padding: 0 0 0 10px;
    }

    .name {
      display: flex;
      justify-content: space-between;
      width: 462px;
      margin-top: 0px;
      input {
        width: 46%;
      }
    }

    .gender {
      width: 462px;
      height: 42px;
      border: 1px solid black;
      background: none;
      box-sizing: border-box;
      position: relative;

      span {
        font-size: 15px;
        padding: 10px 0 0 10px;
        display: block;
      }

      .dropDownBtn {
        position: absolute;
        top: 0px;
        right: 13px;
      }

      &:hover {
        cursor: pointer;
      }

      div {
        position: relative;
        width: 462px;
        height: 106px;
        z-index: 100;
        padding: 0;
        margin-top: 10px;
        border: 1px solid black;
        box-sizing: border-box;
        background-color: #f4f3f2;
        margin-left: -1px;

        ul {
          margin: 0;
          padding: 0;

          li {
            padding: 8px 0px;
            padding-left: 10px;
            font-size: 15px;
          }
        }
      }
    }

    .address {
      margin-top: 0px;

      input {
        margin-bottom: 13px;
      }

      .country {
        width: 462px;
        height: 42px;
        border: 1px solid black;
        background: none;
        box-sizing: border-box;
        position: relative;

        span {
          font-size: 15px;
          padding: 10px 0 0 10px;
          display: block;
        }

        .dropDownBtn {
          position: absolute;
          top: 0px;
          right: 13px;
        }

        &:hover {
          cursor: pointer;
        }

        div {
          position: relative;
          width: 462px;
          height: 250px;
          z-index: 100;
          padding: 0;
          margin-top: 10px;
          border: 1px solid black;
          box-sizing: border-box;
          background-color: #f4f3f2;
          margin-left: -1px;
          overflow: auto;

          ul {
            margin: 0;
            padding: 0;

            li {
              padding: 8px 0px;
              padding-left: 10px;
              font-size: 15px;
            }
          }
        }
      }
    }

    .submit {
      display: flex;
      justify-content: space-between;
      width: 462px;
      margin-top: 20px;
      margin-bottom: 200px;

      button {
        width: 46%;
        box-sizing: border-box;
        height: 40px;
        background-color: black;
        color: white;
        border: none;

        &:hover {
          cursor: pointer;
        }

        &:first-child {
          background-color: white;
          border: 1px solid black;
          color: black;
        }
      }
    }
  }
`;

const ProductContainer = styled.div`
  position: absolute;
  width: 350px;
  top: 180px;
  right: 130px;
  ${mq.maxWidth("xxxl")`
    position: static;
    margin: auto;
    width: 450px;
    margin-top: -170px;
    margin-bottom: 150px;
  `}

  .container {
    hr {
      color: #e0e0e0;
      background-color: none;
      opacity: 40%;
      margin-top: 18px;
    }
    .subject {
      display: flex;
      justify-content: space-between;

      h1 {
        font-size: 18px;
        font-weight: 600;
        margin-bottom: 20px;
      }

      button {
        border: none;
        margin-bottom: 30px;
        background-color: #f4f3f2;
        text-decoration: underline;
        z-index: 90;

        &:hover {
          cursor: pointer;
        }
      }
    }

    .subSubject {
      display: flex;
      justify-content: space-between;

      h3 {
        font-size: 15px;
        font-weight: 400;
        margin: 0;
      }
    }

    .productBox {
      display: flex;
      margin-top: 15px;

      img {
        width: 100px;
        height: 100px;
      }

      .productInfo {
        width: 100%;

        h4 {
          font-size: 14px;
          font-weight: 400;
          margin: 15px 0 0 15px;
        }

        .nameAndPrice {
          display: flex;
          justify-content: space-between;
          h2 {
            font-size: 16px;
            margin: 0 0 0 15px;
          }

          h4 {
            font-size: 14px;
            font-weight: 400;
            margin: 0;
          }
        }
      }
    }

    .priceDetail {
      width: 100%;

      h4 {
        font-size: 14px;
        font-weight: 400;
        margin: 10px 0 0 0;
      }

      h3 {
        font-size: 14px;
        font-weight: 600;
        margin: 10px 0 0 0;
      }
      .itemTotal {
        display: flex;
        justify-content: space-between;
      }

      .shippingTax {
        display: flex;
        justify-content: space-between;
      }

      .duties {
        display: flex;
        justify-content: space-between;
      }

      .total {
        display: flex;
        justify-content: space-between;
      }
    }
  }
`;

const Shipping = memo(() => {
  /** 강제 이동 함수  */
  const navigate = useNavigate();
  /** 리덕스 관련 초기화 */
  const dispatch = useDispatch();

  // 멤버 관련 슬라이스
  const { data, loading, error, isLoggedIn } = useSelector(
    (state) => state.MemberSlice
  );
  const {
    data: cartData,
    productDetails,
    error: cartError,
  } = useSelector((state) => state.CartSlice);

  // 카트 정보 관련 슬라이스
  const {
    data: guestCartData,
    productDetails: guestProductDetails,
    error: guestCartError,
  } = useSelector((state) => state.GuestCartSlice);

  /** 페이지 렌더링시 실행 */
  useEffect(() => {
    window.scrollTo(0, 0);
    dispatch(loginCheck()).then(() => {
      if (isLoggedIn) {
        dispatch(getList());
      } else if (!isLoggedIn) {
        dispatch(guestGetList());
      }
    });
  }, []);

  //드롭다운 성별 상태값관리
  const [genderDropDown, setGenderDropDown] = useState(false);
  
  //로그인이 되어 있는 상태인지 data.gender값이 존재하는지 확인 후 저장된 값이 M이라면 male, 아니라면 female을 보여주고 O일경우 Others 보여주기
  const [selectedGender, setSelectedGender] = useState(
    data?.gender
      ? data?.gender === "M"
        ? "Male"
        : data?.gender === "F"
        ? "Female"
        : "Others"
      : "Gender"
  );

  // 드롭다운 국가 상태값 관리
  const [countryDropdown, setCountryDropdown] = useState(false);
  const [selectCountry, setSelectedCountry] = useState(
    data?.country ? data?.country : "Country"
  );

  /** 드롭다운 성별 이벤트 관리  */
  const toggleGenderDropdown = useCallback((e) => {
    setGenderDropDown(!genderDropDown);
  });

  const onClickGender = useCallback((value) => {
    setSelectedGender(value);
    setGenderDropDown(false);
  });

  // 드롭다운 국가 이벤트 관리

  // 국가 목록 배열
  const countries = [
    "Afghanistan",
    "Albania",
    "Algeria",
    "American Samoa",
    "Andorra",
    "Angola",
    "Argentina",
    "Armenia",
    "Australia",
    "Austria",
    "Azerbaijan",
    "Bahamas",
    "Bahrain",
    "Bangladesh",
    "Barbados",
    "Belarus",
    "Belgium",
    "Benin",
    "Bermuda",
    "Bhutan",
    "Bolivia",
    "Bosnia and Herzegovina",
    "Botswana",
    "Brazil",
    "Brunei",
    "Bulgaria",
    "Burkina Faso",
    "Burundi",
    "Cambodia",
    "Cameroon",
    "Canada",
    "Cape Verde",
    "Cayman Islands",
    "Central African Republic",
    "Chad",
    "Chile",
    "Chinese Mainland",
    "Colombia",
    "Comoros",
    "Congo The Democratic Republic Of The",
    "Cook Islands",
    "Costa Rica",
    "Croatia",
    "Cuba",
    "Cyprus",
    "Czech Republic",
    "Denmark",
    "Djibouti",
    "Dominican Republic",
    "Ecuador",
    "Egypt",
    "El Salvador",
    "Equatorial Guinea",
    "Eritrea",
    "Estonia",
    "Ethiopia",
    "Falkland Islands",
    "Faroe Islands",
    "Fiji Islands",
    "Finland",
    "France",
    "French Guiana",
    "French Polynesia",
    "Gabon",
    "Gambia",
    "Georgia",
    "Germany",
    "Ghana",
    "Gibraltar",
    "Greece",
    "Greenland",
    "Guadeloupe",
    "Guam",
    "Guatemala",
    "Guinea",
    "Guinea-Bissau",
    "Haiti",
    "Honduras",
    "Hong Kong SAR",
    "Hungary",
    "Iceland",
    "India",
    "Indonesia",
    "Iran",
    "Iraq",
    "Ireland",
    "Isle of Man",
    "Israel",
    "Italy",
    "Jamaica",
    "Japan",
    "Jordan",
    "Kazakhstan",
    "Kenya",
    "Kiribati",
    "Kuwait",
    "Kyrgyzstan",
    "Laos",
    "Latvia",
    "Lebanon",
    "Lesotho",
    "Liberia",
    "Libya",
    "Liechtenstein",
    "Lithuania",
    "Luxembourg",
    "Macau SAR of China",
    "Macedonia",
    "Madagascar",
    "Malawi",
    "Malaysia",
    "Maldives",
    "Mali",
    "Malta",
    "Marshall Islands",
    "Martinique",
    "Mauritania",
    "Mauritius",
    "Mayotte",
    "Mexico",
    "Micronesia",
    "Moldova",
    "Monaco",
    "Mongolia",
    "Morocco",
    "Mozambique",
    "Myanmar",
    "Namibia",
    "Nauru",
    "Nepal",
    "Netherlands",
    "New Caledonia",
    "New Zealand",
    "Nicaragua",
    "Niger",
    "Nigeria",
    "Niue",
    "Northern Mariana Islands",
    "Norway",
    "Oman",
    "Pakistan",
    "Palau",
    "Panama",
    "Papua new Guinea",
    "Paraguay",
    "Peru",
    "Philippines",
    "Poland",
    "Portugal",
    "Puerto Rico",
    "Qatar",
    "Reunion",
    "Romania",
    "Russia",
    "Rwanda",
    "Samoa",
    "Sao Tome and Principe",
    "Saudi Arabia",
    "Senegal",
    "Serbia",
    "Seychelles",
    "Sierra Leone",
    "Singapore",
    "Slovakia",
    "Slovenia",
    "Solomon Islands",
    "Somalia",
    "South Africa",
    "South Korea",
    "Spain",
    "Sri Lanka",
    "Sudan",
    "Suriname",
    "Swaziland",
    "Sweden",
    "Switzerland",
    "Syria",
    "Taiwan area, China",
    "Tajikistan",
    "Tanzania",
    "Thailand",
    "Togo",
    "Tonga",
    "Trinidad And Tobago",
    "Tunisia",
    "Turkey",
    "Tuvalu",
    "Uganda",
    "Ukraine",
    "United Arab Emirates",
    "United Kingdom",
    "United States",
    "Uruguay",
    "Uzbekistan",
    "Vanuatu",
    "Venezuela",
    "Vietnam",
    "Virgin Islands (British)",
    "Virgin Islands (US)",
    "Yemen",
    "Zambia",
    "Zimbabwe",
  ];

  const toggleCountryDropdown = useCallback((e) => {
    setCountryDropdown(!countryDropdown);
    setGenderDropDown(false);
  });

  const onClickCountry = useCallback((value) => {
    setSelectedCountry(value);
    setCountryDropdown(false);
  });

  /** 일반 이벤트 관리*/

  // productContainer 상태값 관리
  const productQuantity = [];
  const productProdno = [];

  // 카트페이지로 이동
  const moveToCart = useCallback((e) => {
    e.preventDefault();
    navigate("/member/cart");
  });

  // 취소버튼 클릭
  const onClcikCancle = useCallback((e) => {
    e.preventDefault();
    navigate('/');
  });

  // onSubmitMember 이벤트
  const onSubmitForm = useCallback((e) => {
    e.preventDefault();

    const current = e.currentTarget;

    // 입력된 이메일 값
    const email = current.email.value.trim().toLowerCase();

    // 입력된 이름 값
    const name = `${current.firstname.value.trim()} ${current.lastname.value.trim()}`;

    // 성별 값 변수에 할당 후 성별 선택이 안되어 있을 경우 알림 창 구현
    let gender = "";

    if (selectedGender !== "Gender" && selectedGender === "Male") {
      gender = "M";
    } else if (selectedGender !== "Gender" && selectedGender === "Female") {
      gender = "F";
    } else if (selectedGender !== "Gender" && selectedGender === "Other") {
      gender = "O";
    }

    // 국가 값 할당, 선택이 안되었을 경우 country 값은 null
    let country = null;
    if (selectCountry !== "Country") {
      country = selectCountry;
    }

    const processedEmail = email.trim().toLowerCase();
    const processedName = name.trim().toUpperCase();
    const processedGender = gender;
    const processedPhone = current.phonenumber.value.toString().trim();
    const processedAddress = current.address.value.toLowerCase().trim();
    const processedCity = current.city.value.trim().toLowerCase();
    const processedZipcode = current.zipcode.value.trim();
    const processedProvince = current.province.value.trim().toLowerCase();
    const processedCountry = country;

    // // 유효성 검사
    try {
      regexHelper.value(processedEmail, "Please enter your email.");
      regexHelper.value(processedName, "Please enter name.");
      regexHelper.eng(processedName, "Please enter name in English.");
      regexHelper.value(processedGender, "Please select gender.");
      regexHelper.value(processedPhone, "Please enter your phone number.");
      regexHelper.phone(
        processedPhone,
        "Please enter correct phone number format."
      );
      regexHelper.value(processedAddress, "Please enter your address.");
      regexHelper.value(processedCity, "Please enter your city.");
      regexHelper.value(processedZipcode, "Please enter your zipcode.");
      regexHelper.value(processedProvince, "Please enter your province.");
      regexHelper.value(processedCountry, "Please select your country.");
    } catch (error) {
      console.error(error);
      return;
    }

    if (isLoggedIn === true) {
      // 로그인 중일 경우
      dispatch(
        holdItem({
          email: processedEmail,
          name: processedName,
          gender: processedGender,
          phonenumber: processedPhone,
          address: processedAddress,
          city: processedCity,
          zipcode: processedZipcode,
          province: processedProvince,
          country: processedCountry,
          quantites: productQuantity,
          products: productProdno,
        })
      ).then((response) => {
        if(response.payload.rtcode === 200) {
          navigate("/checkout_payment");
        }
      });
    } else if (isLoggedIn === false) {
      // 로그인 중이 아닐 경우
      dispatch(
        guestHoldItem({
          email: processedEmail,
          name: processedName,
          gender: processedGender,
          phonenumber: processedPhone,
          address: processedAddress,
          city: processedCity,
          zipcode: processedZipcode,
          province: processedProvince,
          country: processedCountry,
          quantites: productQuantity,
          products: productProdno,
        })
      ).then((response) => {
        if(response.payload.rtcode === 200) {
          navigate("/checkout_payment");
        }
      });
    }
  });

  return (
    <>
      <Spinner loading={loading} />
      {error ? (
        <ErrorView error={error} />
      ) : (
        <>
          <ShippingForm onSubmit={onSubmitForm}>
            <div className="Box">
              <h1>Shipping Address</h1>
              <p>Please provide customer information in English only.</p>
              <h2>Email</h2>
              <input type="email" name="email"></input>
              <h2>Name</h2>
              <div className="name">
                <input
                  type="text"
                  className="firstName"
                  name="firstname"
                  placeholder="First Name"
                  defaultValue={data?.name ? data.name.split(" ")[0] : ""}
                />
                <input
                  type="text"
                  className="lastName"
                  name="lastname"
                  placeholder="Last Name"
                  defaultValue={data?.name ? data.name.split(" ")[1] : ""}
                />
              </div>
              <h2>Gender</h2>
              <div className="gender" onClick={toggleGenderDropdown}>
                <span>{selectedGender}</span>
                <span className="dropDownBtn">&darr;</span>
                {genderDropDown && (
                  <div>
                    <ul>
                      <li value="M" onClick={() => onClickGender("Male")}>
                        Male
                      </li>
                      <li value="F" onClick={() => onClickGender("Female")}>
                        Female
                      </li>
                      <li value="O" onClick={() => onClickGender("Other")}>
                        Other
                      </li>
                    </ul>
                  </div>
                )}
              </div>
              <h2>Phone Number</h2>
              <input
                type="tel"
                name="phonenumber"
                defaultValue={data?.phonenumber}
              />
              <h2>Address</h2>
              <div className="address">
                <input
                  type="text"
                  name="address"
                  placeholder="Address"
                  defaultValue={data?.address}
                />
                <input
                  type="text"
                  name="city"
                  placeholder="City"
                  defaultValue={data?.city}
                />
                <input
                  type="number"
                  name="zipcode"
                  placeholder="ZIP CODE"
                  defaultValue={data?.zipcode}
                />
                <input
                  type="text"
                  name="province"
                  placeholder="State/Province/Region"
                  defaultValue={data?.province}
                />
                <div className="country" onClick={toggleCountryDropdown}>
                  <span>{selectCountry}</span>
                  <span className="dropDownBtn">&darr;</span>
                  {countryDropdown && (
                    <div>
                      <ul>
                        {countries.map((v, i) => {
                          return (
                            <li
                              key={i}
                              value={v}
                              onClick={() => onClickCountry(v)}
                            >
                              {v}
                            </li>
                          );
                        })}
                      </ul>
                    </div>
                  )}
                </div>
              </div>
              <div className="submit">
                <button onClick ={onClcikCancle}>Cancel</button>
                <button type="submit">Next</button>
              </div>
            </div>
          </ShippingForm>
          {isLoggedIn === true ? (
            cartError ? (
              <ErrorView error={cartError} />
            ) : (
              <ProductContainer>
                <div className="container">
                  <div className="subject">
                    <h1>Order Detail</h1>
                    <button onClick={moveToCart}>Edit</button>
                  </div>
                  <div className="subSubject">
                    <h3>Item</h3>
                    <h3>Price</h3>
                  </div>
                  {productDetails.length > 0 ? (
                    productDetails.map((v, i) => {
                      // 배열로 구성되어있으므로 product_prodno과 prodno가 같은 걸 찾아서 수량값만 빼오기 (cartDate의 수량, 가격 값을 수정하기 위해)
                      const cartInfo =
                        cartData &&
                        Array.isArray(cartData) &&
                        cartData.find(
                          (item) => item.product_prodno === v.prodno
                        );

                      // 배열 변수에 추가
                      productQuantity.push(cartInfo?.quantity);
                      productProdno.push(cartInfo?.product_prodno);
                      return (
                        <div className="productBox" key={i}>
                          <img
                            src={v.img1}
                            alt={v.title}
                          />
                          <div className="productInfo">
                            <div className="nameAndPrice">
                              <h2>{v.title}</h2>
                              <h4>${cartInfo?.tprice}</h4>
                            </div>
                            <h4>Quantity:{cartInfo?.quantity}</h4>
                            <h4>Duty not included</h4>
                          </div>
                        </div>
                      );
                    })
                  ) : (
                    <h3>No Product in my order list.</h3>
                  )}

                  <hr />
                  <div className="priceDetail">
                    <div className="itemTotal">
                      <h4>Total</h4>
                      <h4>
                        $
                        {Array.isArray(cartData) &&
                          cartData.reduce((total, item) => {
                            return total + item.tprice;
                          }, 0)}
                      </h4>
                    </div>
                    <div className="shippingTax">
                      <h4>Shipping&Tax</h4>
                      <h4>$0</h4>
                    </div>
                    <div className="duties">
                      <h3>Duties</h3>
                      <h3>Excluded</h3>
                    </div>
                    <hr />
                    <div className="total">
                      <h4>Total</h4>
                      <h4>
                        $
                        {Array.isArray(cartData) &&
                          cartData.reduce((total, item) => {
                            return total + item.tprice;
                          }, 0)}
                      </h4>
                    </div>
                  </div>
                </div>
              </ProductContainer>
            )
          ) : guestCartError ? (
            <ErrorView error={error} />
          ) : (
            <ProductContainer>
              <div className="container">
                <div className="subject">
                  <h1>Order Detail</h1>
                  <button onClick={moveToCart}>Edit</button>
                </div>
                <div className="subSubject">
                  <h3>Item</h3>
                  <h3>Price</h3>
                </div>
                {guestProductDetails.length > 0 ? (
                  guestProductDetails.map((v, i) => {
                    // 배열로 구성되어있으므로 product_prodno과 prodno가 같은 걸 찾아서 수량값만 빼오기 (cartDate의 수량, 가격 값을 수정하기 위해)
                    const cartInfo =
                      guestCartData &&
                      Array.isArray(guestCartData) &&
                      guestCartData.find(
                        (item) => item.product_prodno === v.prodno
                      );

                    // 배열 변수에 추가
                    productQuantity.push(cartInfo?.quantity);
                    productProdno.push(cartInfo?.product_prodno);
                    return (
                      <div className="productBox" key={i}>
                        <img
                          src={v.img1}
                          alt={v.title}
                        />
                        <div className="productInfo">
                          <div className="nameAndPrice">
                            <h2>{v.title}</h2>
                            <h4>${cartInfo?.tprice}</h4>
                          </div>
                          <h4>Quantity:{cartInfo?.quantity}</h4>
                          <h4>Duty not included</h4>
                        </div>
                      </div>
                    );
                  })
                ) : (
                  <h3>No Product in my order list.</h3>
                )}

                <hr />
                <div className="priceDetail">
                  <div className="itemTotal">
                    <h4>Total</h4>
                    <h4>
                      $
                      {Array.isArray(guestCartData) &&
                        guestCartData.reduce((total, item) => {
                          return total + item.tprice;
                        }, 0)}
                    </h4>
                  </div>
                  <div className="shippingTax">
                    <h4>Shipping&Tax</h4>
                    <h4>$0</h4>
                  </div>
                  <div className="duties">
                    <h3>Duties</h3>
                    <h3>Excluded</h3>
                  </div>
                  <hr />
                  <div className="total">
                    <h4>Total</h4>
                    <h4>
                      $
                      {Array.isArray(guestCartData) &&
                        guestCartData.reduce((total, item) => {
                          return total + item.tprice;
                        }, 0)}
                    </h4>
                  </div>
                </div>
              </div>
            </ProductContainer>
          )}
        </>
      )}
    </>
  );
});

export default Shipping;
