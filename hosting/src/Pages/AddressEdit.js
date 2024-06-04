import React, { memo, useState, useCallback, useEffect } from "react";
import { styled } from "styled-components";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { loginCheck, putMyInfo } from "../slices/MemberSlice";
import regexHelper from "../helper/RegexHelper";
import Spinner from '../components/Spinner';
import mq from '../MediaQuery/MediaQuery';

const Container = styled.form`
  padding-top: 100px;
  display: flex;
  flex-direction: column;
  align-items: center;
  position: relative;

  .Box {
    margin-top: 150px;
    width: 450px;
    height: auto;

    ${mq.maxWidth("xsm")`
      width: 300px;
    `}

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

    .availabilty {
      position: absolute;
      margin-top: 5px;
      font-size: 12px;
      border: 1px solid black;
      color: black;
      padding: 4px 6px;
      background-color: none;
      transition: background-color 0.4s ease;
      margin-left: 355px;

      &:hover {
        background-color: black;
        color: white;
        cursor: pointer;
      }
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

    .birthday {
      display: flex;
      justify-content: space-between;
      width: 462px;

      div {
        width: 31%;
        height: 42px;
        border: 1px solid black;
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
          width: 143.22px;
          height: 250px;
          z-index: 100;
          padding: 0;
          margin-top: 10px;
          border: 1px solid black;
          box-sizing: border-box;
          background-color: #f4f3f2;
          overflow: auto;
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
        
        ${mq.maxWidth("xsm")`
      width: 312px;
    `}

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
      margin-bottom: 100px;

      ${mq.maxWidth("xsm")`
      width: 300px;
    `}

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
const AddressEdit = memo(() => {
  // 리덕스 초기값
  const dispatch = useDispatch();
  const { data, loading, isLoggedIn } = useSelector(
    (state) => state.MemberSlice
  );

  // 강제이동 함수 선언
  const navigate = useNavigate();

  // 드롭다운 국가 상태값 관리
  /** 이 코드에서는 초기 상태값을 모두 null로 선택한 후 ,
   * 드롭다운 값이 만약 바뀌었다면 바뀐 값을 사용하고 그렇지 않을 경우 이전 데이터 값을 그대로 사용
   * submit 버튼 시에 입력값 검사하는 부분을 OR연산자를 사용하여 상태값이 NULL이 아니라면 바뀐 상태값을 사용하고 상태값이 그대로 NULL이라면 이미 저장되어있는 받아온 데이터를 사용함.
   */
  const [countryDropdown, setCountryDropdown] = useState(false);
  const [selectCountry, setSelectedCountry] = useState(null);

  // 드롭다운 국가 이벤트 관리
  const toggleCountryDropdown = useCallback((e) => {
    setCountryDropdown(!countryDropdown);
  });

  const onClickCountry = useCallback((value) => {
    setSelectedCountry(value);
    setCountryDropdown(false);
  });

  const onClickCancle = useCallback((e) => {
    e.preventDefault();
    navigate("/member");
  });

  const onSubmitMember = useCallback((e) => {
    e.preventDefault();

    const current = e.currentTarget;

    // 국가 값 할당, 선택이 안되었을 경우 country 값은 null
    let country = null;

    /** 이전 데이터 값이 아닌 새로 선택한 값이 있을 경우 selected 값을 사용,
        새로 선택한 데이터 값이 아닐 경우 이전 데이터값을 그대로 사용 */
    const finalCountry = selectCountry || data.country;
    if (finalCountry !== "Country") {
      country = finalCountry;
    }
    // 공백지우기, 소문자 변환 등 처리과정

    const processedAddress = current.address.value.toLowerCase().trim();
    const processedCity = current.city.value.trim().toLowerCase();
    const processedZipcode = current.zipcode.value.trim();
    const processedProvince = current.province.value.trim().toLowerCase();
    const processedCountry = country;

    // // 유효성 검사
    try {
      regexHelper.value(processedAddress, "Please enter your address.");
      regexHelper.value(processedCity, "Please enter your city.");
      regexHelper.value(processedZipcode, "Please enter your zipcode.");
      regexHelper.value(processedProvince, "Please enter your province.");
      regexHelper.value(processedCountry, "Please select your country.");
    } catch (error) {
      console.error(error);
      return;
    }

    // 리덕스를 통한 데이터 요청
    dispatch(
      putMyInfo({
        address: processedAddress,
        city: processedCity,
        zipcode: processedZipcode,
        province: processedProvince,
        country: processedCountry,
      })
    ).then(({ payload, error }) => {
      if (error) {
        window.alert(payload.data.rtmsg);
        console.log(payload);
        return;
      }

      alert("Your address has been successfully updated.");
      navigate("/member");
    });
  });

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

  // 페이지 렌더링시 페이지 맨 위 부분으로 설정, 로그인 상태 검사
  useEffect(() => {
    window.scrollTo(0, 0);
    dispatch(loginCheck()).then(() => {
      if (!isLoggedIn) {
        // 로그인 상태 확인
        alert("You must be logged in to access this page.");
        navigate("/member");
      }
    });
  }, []);

  return (
    <>
      {/* 로딩바 표시 */}
      <Spinner loading={loading} />

      {/* 조회결과 표시 */}
      {isLoggedIn ? (
        <Container onSubmit={onSubmitMember}>
          <div className="Box">
            <h1>Edit My Address</h1>
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
                defaultValue={data.province}
              />
              <div className="country" onClick={toggleCountryDropdown}>
                <span>{selectCountry || data.country || "Country"}</span>
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
              <button onClick={onClickCancle}>Cancel</button>
              <button type="submit">Submit</button>
            </div>
          </div>
        </Container>
      ) : (
        <h1>You must be logged in to access this page.</h1>
      )}
    </>
  );
});

export default AddressEdit;
