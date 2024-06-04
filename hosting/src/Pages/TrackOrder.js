import React, { memo, useState, useCallback, useRef, useEffect } from "react";
import styled from "styled-components";
import mq from "../MediaQuery/MediaQuery";
import { NavLink, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";

import { trackItem, guestTrackItem } from "../slices/OrderDetailSlice";

const Navigator = styled.nav`
  margin-left: 7%;
  width: 150px;
  margin-bottom: 800px;
  padding-top: 150px;
  ${mq.maxWidth("md")`
      width: 100%;
      margin-bottom: 0px;
    `}
  h2 {
    font-size: 18px;

    ${mq.maxWidth("md")`
      margin-top : -15px;
    `}
  }
  .links {
    display: flex;
    flex-direction: column;
    ${mq.maxWidth("md")`
      flex-direction: row;
    `}

    a {
      margin-top: 30px;
      font-size: 13px;

      ${mq.maxWidth("md")`
      margin: 10px 20px 0 0;
      font-size: 14px;
    `}
    }

    .active {
      text-decoration: underline;
    }
  }
`;
const Box = styled.form`
  position: absolute;
  left: 50%;
  top: 40%;
  transform: translate(-50%, -50%);
  width: 380px;
  height: 351.73px;

  ${mq.maxWidth("md")`
        position: static;
        display:block;
        transform: none;
        top: none;
        margin: 50px 8% 200px 8%;
        width:86%;
    `}

${mq.maxWidth("xsm")`
        width: 300px;
    `}

  h2 {
    font-size: 18px;
  }
  .labels {
    label {
      input {
        margin-top: 20px;
        margin-left: 8px;
        width: 22px;
        height: 14.5px;

        &:first-child {
          margin-right: 35px;
        }
      }
    }
  }

  .input {
    margin-top: 30px;
    h4 {
      font-size: 14px;
      font-weight: 400;
    }
    input {
      width: 100%;
      height: 30px;
    }
  }

  button {
    width: 100%;
    height: 38px;
    margin-top: 30px;
    border: 1px solid black;
    background-color: black;
    color: white;


    ${mq.maxWidth("xsm")`
        width: 312px;
    `}

    &:hover {
      cursor: pointer;
    }
  }
`;

const TrackOrder = memo(() => {
  // 강제 이동 함수 생성
  const navigate = useNavigate();

  // 참조변수
  const accountRef = useRef();
  const psRef = useRef();
  const emailRef = useRef();
  const orderRef = useRef();

  // 리덕스 초기화
  const dispatch = useDispatch();

  // 렌더링 시 실행
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // checkbox 상태값
  const [checkBoxchecked, setCheckBoxChecked] = useState("guest");

  // 체크박스 이벤트
  const onChangeCheckBox = useCallback((e) => {
    setCheckBoxChecked(e.target.value);

    // 체크박스가 바뀔때 인풋태그들을 빈값으로 만들기 위해
    if (accountRef.current) accountRef.current.value = "";
    if (psRef.current) psRef.current.value = "";
    if (emailRef.current) emailRef.current.value = "";
    if (orderRef.current) orderRef.current.value = "";
  });

  /** 일반 상태값 */
  const submitForm = useCallback((e) => {
    e.preventDefault();

    // 멤버가 선택되었을 경우
    if (checkBoxchecked === "member") {
      // 참조값 가져오기
      const account = accountRef.current.value;
      const userpw = psRef.current.value;

      if (account === '') {
        window.alert('Please enter your account.');
        return;
      }

      if (userpw === '') {
        window.alert('Please enter your password.');
        return;
      }

      // 공백지우기, 소문자 변환 등 처리과정
      const processedAccount = account.trim().toLowerCase();
      const processedUserpw = userpw.toString().trim();

      dispatch(
        trackItem({
          account: processedAccount,
          userpw: processedUserpw,
        })
      ).then((response) => {
        if (response.payload.rtcode === 200) {
          navigate("/customer_service/nonTrack_order");
        } else if (response.payload.status === 401) {
          window.alert("Wrong account name or password.");
        }
      });

      // 비회원이 선택되었을 경우
    } else if (checkBoxchecked === "guest") {
      // 참조값 가져오기
      const email = emailRef.current.value;

      if (email === '') {
        window.alert('Please enter your email.')
        return;
      }

      // 공백지우기, 소문자 변환 등 처리과정
      const processedEmail = email.trim().toLowerCase();

      dispatch(
        guestTrackItem({
          email: processedEmail,
        })
      ).then((response) => {
        if (response.payload.rtcode === 200) {
          navigate("/customer_service/nonTrack_order");
        } else if (response.payload.status === 401) {
          window.alert("Wrong email address.");
        }
      });
    }
  });
  return (
    <>
      <Navigator>
        <h2>Customer Service</h2>
        <div className="links">
          <NavLink to="/customer_service/faq">FAQ</NavLink>
          <NavLink to="/customer_service/contact">Contact</NavLink>
          <NavLink to="/customer_service/track_order">Track your order</NavLink>
        </div>
      </Navigator>
      <Box onSubmit={submitForm}>
        <h2>Track Order</h2>
        <div className="labels">
          <label>
            Member
            <input
              type="checkbox"
              value="member"
              checked={checkBoxchecked === "member"}
              onChange={onChangeCheckBox}
            />
          </label>
          <label>
            Guest
            <input
              type="checkbox"
              value="guest"
              checked={checkBoxchecked === "guest"}
              onChange={onChangeCheckBox}
            />
          </label>
        </div>
        {checkBoxchecked === "guest" ? (
          <>
            <div className="input">
              <h4>Email Address</h4>
              <input type="text" ref={emailRef} />
            </div>
            <button type="submit">Next</button>
          </>
        ) : (
          <>
            <div className="input">
              <h4>Account</h4>
              <input type="text" ref={accountRef} />
              <h4>Password</h4>
              <input type="password" ref={psRef} />
            </div>
            <button type="submit">Next</button>
          </>
        )}
      </Box>
    </>
  );
});

export default TrackOrder;
