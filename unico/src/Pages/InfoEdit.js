import React, { memo, useState, useCallback, useEffect } from "react";
import { styled } from "styled-components";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { loginCheck, putMyInfo } from "../slices/MemberSlice";
import regexHelper from "../helper/RegexHelper";
import Spinner from "../components/Spinner";
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

      ${mq.maxWidth("xsm")`
        width: 300px;  
    `}
      input {
        width: 44%;
      }
    }

    .birthday {
      display: flex;
      justify-content: space-between;
      width: 462px;

      ${mq.maxWidth("xsm")`
        width: 300px;  
    `}

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

          ${mq.maxWidth("xsm")`
        width: 300px;  
    `}

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

      ${mq.maxWidth("xsm")`
        width: 300px;  
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
    .phone {
      ${mq.maxWidth("xsm")`
        width: 290px;
    `}
    }
    .submit {
      display: flex;
      justify-content: space-between;
      width: 462px;
      margin-top: 60px;
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
const CreateAcc = memo(() => {
  // 리덕스 초기값
  const dispatch = useDispatch();
  const { data, loading, isLoggedIn } = useSelector(
    (state) => state.MemberSlice
  );

  // 강제이동 함수 선언
  const navigate = useNavigate();

  // 초기 마운트 시 로그인 상태 검사
  useEffect(() => {
    window.scrollTo(0, 0);
    dispatch(loginCheck()).then(() => {
      if (!isLoggedIn) {
        // 로그인 상태를 확인
        alert("You must be logged in to access this page.");
        navigate("/member");
      }
    });
  }, []);

  /** 이 코드에서는 초기 상태값을 모두 null로 선택한 후 ,
   * 드롭다운 값이 만약 바뀌었다면 바뀐 값을 사용하고 그렇지 않을 경우 이전 데이터 값을 그대로 사용
   * submit 버튼 시에 입력값 검사하는 부분을 OR연산자를 사용하여 상태값이 NULL이 아니라면 바뀐 상태값을 사용하고 상태값이 그대로 NULL이라면 이미 저장되어있는 받아온 데이터를 사용함.
   */
  // defaultValue에 넣기 위한 이전 데이터 값
  const { name, gender, birthdate, phonenumber } = data || {};
  const y = birthdate ? birthdate.substring(0, 4) : "Day";
  const m = birthdate ? birthdate.substring(5, 7) : "Month";
  const d = birthdate ? birthdate.substring(8, 10) : "Day";
  const mappedGender =
    gender === "M"
      ? "Male"
      : gender === "F"
      ? "Female"
      : gender === "O"
      ? "Other"
      : "";

  // 드롭다운 생년월일 상태값 관리
  const [monthDropdown, setMonthDropdown] = useState(false);
  const [dayDropdown, setDayDropdown] = useState(false);
  const [yearDropdown, setYearDropdown] = useState(false);
  const [selectedMonth, setSelectedMonth] = useState(null);
  const [selectedDay, setSelectedDay] = useState(null);
  const [selectedYear, setSelectedYear] = useState(null);

  //드롭다운 성별 상태값관리
  const [genderDropDown, setGenderDropDown] = useState(false);
  const [selectedGender, setSelectedGender] = useState(null);

  // 드롭다운 생년월일 이벤트 관리
  const toggleMonthDropdown = useCallback((e) => {
    setMonthDropdown(!monthDropdown);
    setGenderDropDown(false);
    setDayDropdown(false);
    setYearDropdown(false);
  });
  const toggleDayDropdown = useCallback((e) => {
    setDayDropdown(!dayDropdown);
    setGenderDropDown(false);
    setMonthDropdown(false);
    setYearDropdown(false);
  });
  const toggleYearDropdown = useCallback((e) => {
    setYearDropdown(!yearDropdown);
    setGenderDropDown(false);
    setMonthDropdown(false);
    setDayDropdown(false);
  });

  const onClickMonth = useCallback((value) => {
    setSelectedMonth(value);
    setMonthDropdown(false);
  });

  const onClickDay = useCallback((value) => {
    setSelectedDay(value);
    setDayDropdown(false);
  });

  const onClickYear = useCallback((value) => {
    setSelectedYear(value);
    setDayDropdown(false);
  });

  // 드롭다운 성별 이벤트 관리
  const toggleGenderDropdown = useCallback((e) => {
    setGenderDropDown(!genderDropDown);
    setMonthDropdown(false);
    setDayDropdown(false);
    setYearDropdown(false);
  });

  const onClickGender = useCallback((value) => {
    setSelectedGender(value);
    setGenderDropDown(false);
  });

  const onClickCancle = useCallback((e) => {
    e.preventDefault();
    navigate("/member");
  });

  const onSubmitMember = useCallback((e) => {
    e.preventDefault();

    const current = e.currentTarget;

    // 이름 칸에 입력이 되어있는지 안되어있는지 확인 후 결합
    if (!current.firstname.value || !current.lastname.value) {
      alert("Please enter First name and Last name.");
      return;
    }
    const name = `${current.firstname.value.trim()} ${current.lastname.value.trim()}`;

    // 성별 값 변수에 할당 후 성별 선택이 안되어 있을 경우 알림 창 구현
    let gender = "";

    /** 이전 데이터 값이 아닌 새로 선택한 값이 있을 경우 selectedGender값을 사용,
        새로 선택한 데이터 값이 아닐 경우 이전 데이터값을 그대로 사용 */
    const FinalGender = selectedGender || mappedGender;

    if (FinalGender !== "Gender" && FinalGender === "Male") {
      gender = "M";
    } else if (FinalGender !== "Gender" && FinalGender === "Female") {
      gender = "F";
    } else if (FinalGender !== "Gender" && FinalGender === "Other") {
      gender = "O";
    }

    // 생일 값 할당 , 10보다 작을 경우 앞쪽에 0을 붙임
    let monthValue = null;
    let dayValue = null;
    let yearValue = null;
    let birthdate = null;

    /** 이전 데이터 값이 아닌 새로 선택한 값이 있을 경우 selected 값을 사용,
        새로 선택한 데이터 값이 아닐 경우 이전 데이터값을 그대로 사용 */

    const FinalMonth = parseInt(selectedMonth) || parseInt(m);
    const FinalDay = parseInt(selectedDay) || parseInt(d);
    const FinalYear = parseInt(selectedYear) || parseInt(y);

    if (FinalMonth && parseInt(FinalMonth) < 10) {
      monthValue = `0${FinalMonth}`;
    } else if (FinalMonth !== "Month") {
      monthValue = FinalMonth;
    }
    if (FinalDay && parseInt(FinalDay) < 10) {
      dayValue = `0${FinalDay}`;
    } else if (FinalDay !== "Day") {
      dayValue = FinalDay;
    }
    if (FinalYear !== "Year") {
      yearValue = FinalYear;
    }

    if (monthValue && dayValue && yearValue) {
      birthdate = `${yearValue}${monthValue}${dayValue}`;
    }

    // 공백지우기, 소문자 변환 등 처리과정
    const processedName = name.trim().toUpperCase();
    const processedGender = gender;
    const processedBirthday = birthdate;
    const processedPhone = current.phonenumber.value.toString().trim();

    // // 유효성 검사
    try {
      regexHelper.value(processedName, "Please enter name.");
      regexHelper.eng(processedName, "Please enter name in English.");
      regexHelper.value(processedGender, "Please select gender.");
      regexHelper.value(processedBirthday, "Please enter your birthdate.");
      regexHelper.value(processedPhone, "Please enter your phone number.");
    } catch (error) {
      console.error(error);
      return;
    }

    // 리덕스를 통한 데이터 요청
    dispatch(
      putMyInfo({
        name: processedName,
        gender: processedGender,
        birthdate: processedBirthday,
        phonenumber: processedPhone,
      })
    ).then(({ payload, error }) => {
      if (error) {
        window.alert(payload.data.rtmsg);
        console.log(payload);
        return;
      }

      alert("Your profile information has been successfully updated.");
      navigate("/member");
    });
  });

  // 연 기준 범위 설정
  const now = new Date();
  const years = [];
  for (let i = now.getFullYear() - 15; i >= now.getFullYear() - 100; i--) {
    years.push(i.toString());
  }

  // 달 기준 범위 설정
  const month = [];
  for (let i = 1; i <= 12; i++) {
    month.push(i.toString());
  }

  // 일 기준 범위 설정
  const date = [];
  for (let i = 1; i <= 31; i++) {
    date.push(i.toString());
  }

  return (
    <>
      {/* 로딩 바 표시 */}
      <Spinner loading={loading} />
      {/** 조회 결과 표시 */}
      {isLoggedIn ? (
        <Container onSubmit={onSubmitMember}>
          <div className="Box">
            <h1>Edit My Information</h1>
            <h2>Name</h2>
            <div className="name">
              <input
                type="text"
                className="firstName"
                name="firstname"
                placeholder="First Name"
                defaultValue={name ? name.split(" ")[0] : ""}
              />
              <input
                type="text"
                className="lastName"
                name="lastname"
                placeholder="Last Name"
                defaultValue={name ? name.split(" ")[1] : ""}
              />
            </div>
            <h2>Date of Birth</h2>
            <div className="birthday">
              <div onClick={toggleMonthDropdown}>
                <span>{selectedMonth || m}</span>
                <span className="dropDownBtn">&darr;</span>
                {monthDropdown && (
                  <div>
                    <ul>
                      {month.map((v, i) => {
                        return (
                          <li
                            key={i}
                            name="month"
                            value={v}
                            onClick={() => onClickMonth(v)}
                          >
                            {v}
                          </li>
                        );
                      })}
                    </ul>
                  </div>
                )}
              </div>
              <div onClick={toggleDayDropdown}>
                <span>{selectedDay || d}</span>
                <span className="dropDownBtn">&darr;</span>
                {dayDropdown && (
                  <div>
                    <ul>
                      {date.map((v, i) => {
                        return (
                          <li key={i} value={v} onClick={() => onClickDay(v)}>
                            {v}
                          </li>
                        );
                      })}
                    </ul>
                  </div>
                )}
              </div>
              <div onClick={toggleYearDropdown}>
                <span>{selectedYear || y}</span>
                <span className="dropDownBtn">&darr;</span>
                {yearDropdown && (
                  <div>
                    <ul>
                      {years.map((v, i) => {
                        return (
                          <li key={i} value={v} onClick={() => onClickYear(v)}>
                            {v}
                          </li>
                        );
                      })}
                    </ul>
                  </div>
                )}
              </div>
            </div>
            <h2>Gender</h2>
            <div className="gender" onClick={toggleGenderDropdown}>
              <span>{selectedGender || mappedGender || "Gender"}</span>
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
            <input className="phone" type="tel" name="phonenumber" defaultValue={phonenumber} />
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

export default CreateAcc;
