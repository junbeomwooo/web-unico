import React, { memo, useCallback, useEffect, useState } from "react";
import styled from "styled-components";
import { useNavigate, NavLink } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  logoutAccount,
  loginCheck,
  deleteMyAccount,
} from "../slices/MemberSlice";
import Spinner from "../components/Spinner";
import mq from "../MediaQuery/MediaQuery";

const Headers = styled.div`
  padding-top: 180px;
  display: flex;
  justify-content: space-around;

  div {
    width: 35%;

    h1 {
      font-size: 19px;
    }

    hr {
      margin: 55px 0px;

      ${mq.maxWidth("md")`
        margin: 40px 0px;
    `}
    }

    div {
      width: 100%;
      display: flex;
      justify-content: space-between;
    }

    .logout {
      display: flex;
      justify-content: flex-end;
      margin-bottom: 55px;

      ${mq.maxWidth("md")`
        margin-bottom: 40px;
    `}

      .logoutBtn {
        border: none;
        background: none;
        font-size: 18px;
        font-weight: 700;

        &:hover {
          cursor: pointer;
        }
      }
    }
  }
`;
const Navigator = styled.nav`
  margin-left: 7.4%;
  width: 150px;
  margin-bottom: 400px;
  ${mq.maxWidth("md")`
      width: 100%;
      margin-bottom: 0px;
    `}
  h2 {
    font-size: 15px;

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
const Content = styled.div`
  position: absolute;
  left: 50%;
  top: 55%;
  transform: translate(-50%, -50%);
  width: 200px;

  ${mq.maxWidth("md")`
        position: static;
        display:block;
        transform: none;
        top: none;
        margin: 50px 8% 200px 8%;
        width:86%;
    `}

  .info {
    width: 300px;
    h2 {
      font-size: 22px;
      font-weight: 600;
    }
    h3 {
      font-size: 14px;
      font-weight: 600;
      line-height: 13px;
      font-weight: 400;
    }
  }

  .buttons {
    display: flex;
    flex-direction: column;

    button {
      color: white;
      background-color: black;
      border: 1px solid black;
      height: 40px;
      margin-top: 15px;
      font-size: 14px;
      width: 320px;

      ${mq.maxWidth("md")`
        width: 100%
      `}

      &:first-child {
        margin-top: 30px;
      }

      &:hover {
        cursor: pointer;
      }
    }
  }
`;
const Popup = styled.div`
  position: fixed;
  z-index: 999;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
  background: rgba(0, 0, 0, 0.3);
  .mainPopupBox {
    width: 500px;
    height: 640px;
    background-color: white;
    position: fixed; /* 화면에 고정 */
    top: 50%; /* 세로 중앙 */
    left: 50%; /* 가로 중앙 */
    transform: translate(-50%, -50%); /* 중앙으로부터 자신의 크기만큼 이동 */

    ${mq.maxWidth("md")`
      width: 460px;
      height: 640px;
    `}

    .mainPopupContent {
      margin: 30px;

      h1 {
        font-size: 18px;
        padding-top: 50px;
        font-weight: 600;
        margin-left: 100px;
      }

      h2 {
        font-size: 15px;
        font-weight: 500;
        margin: 50px 0 40px 0;
      }

      h3 {
        font-size: 14px;
        font-weight: 400;
        margin-top: 20px;
      }

      .checkBox {
        margin-top: 40px;
        label {
          display: flex;

          h3 {
            margin-left: 10px;
          }
        }
      }

      .buttons {
        width: 100%;
        margin-top: 30px;
        button {
          border: 1.2px solid black;
          background-color: white;
          width: 210px;
          height: 40px;
          transition: background-color 0.4s ease-in-out;

          ${mq.maxWidth("md")`
            width: 180px;
          `}

          &:first-child {
            margin-right: 20px;
          }

          &:hover {
            cursor: pointer;
            background-color: black;
            color: white;
          }
        }
      }
    }
  }
`;
const AccountSetting = memo(() => {
  // 강제 이동 함수 생성
  const navigate = useNavigate();

  // 리덕스 관련 초기화
  const dispatch = useDispatch();
  const { data, loading, isLoggedIn } = useSelector(
    (state) => state.MemberSlice
  );

  // 페이지 최초 마운트시 실행
  useEffect(() => {
    if (!isLoggedIn) {
      // 로그인 상태를 확인
      alert("You must be logged in to access this page.");
      navigate("/member");
    }
  }, []);

  //로그아웃 이벤트 관리
  const onClickLogout = useCallback((e) => {
    e.preventDefault();
    dispatch(logoutAccount()).then(() => {
      dispatch(loginCheck());
      navigate("/");
    });
  });

  // Edit Information 이벤트 관리
  const onClickEditInfo = useCallback((e) => {
    e.preventDefault();
    navigate("/member/check_password");
  });

  // Withdrawal 이벤트 관리
  const onClickWithdrawal = useCallback((e) => {
    e.preventDefault();
    setWithdrawalPopup(true);
  });

  /** 클라이언트에 보여질 값 변경하기 */
  let displayGender = null;
  if (data) {
    if (data.gender === "M") {
      displayGender = "Male";
    } else if (data.gender === "F") {
      displayGender = "Female";
    } else if (data.gender === "O") {
      displayGender = "Other";
    }
  }

  let displayBirthday = null;
  if (data) {
    if (data.birthdate) {
      displayBirthday = data.birthdate.slice(0, 10);
    }
  }

  /** 이 부분부터는 팝업관련 */

  // 탈퇴시 팝업 창 상태값
  const [withdrawaLpopup, setWithdrawalPopup] = useState(false);

  // 체크박스 상태값
  const [checkBoxchecked, setCheckBoxChecked] = useState(true);

  const onChangeCheckBox = useCallback((e) => {
    setCheckBoxChecked(!checkBoxchecked);
  });

  const onClickCancle = useCallback((e) => {
    setWithdrawalPopup(false);
  });

  const onClickConfirm = useCallback((e) => {
    e.preventDefault();

    if (checkBoxchecked !== true) {
      return;
    }
    dispatch(deleteMyAccount()).then((response) => {
      if (response.payload.rtcode === 200) {
        alert(response.payload.item);
        navigate("/");
      } else {
        console.log(response);
      }
    });
  });
  return (
    <>
      {/* 로딩 바 구현 */}
      <Spinner loading={loading} />

      {/* 조회결과 표시 */}
      {isLoggedIn ? (
        <>
          <Headers>
            <div>
              <h1>My Account</h1>
              <hr />
            </div>
            <div>
              <div className="logout">
                <button className="logoutBtn" onClick={onClickLogout}>
                  Logout
                </button>
              </div>
              <hr />
            </div>
          </Headers>
          <Navigator>
            <h2>My Page</h2>
            <div className="links">
              <NavLink to="/member/account_setting">Information</NavLink>
              <NavLink to="/member/address_setting">Address</NavLink>
              <NavLink to="/member/password_setting">Change Password</NavLink>
              <NavLink to="/member_view_all">Track Order</NavLink>
            </div>
          </Navigator>
          <Content>
            <div className="info">
              <h2>Info</h2>
              <h3>Name: {data.name}</h3>
              <h3>Gender: {displayGender}</h3>
              <h3>Date of Birth: {displayBirthday}</h3>
              <h3>Phone Number: {data.phonenumber}</h3>
            </div>
            <div className="buttons">
              <button onClick={onClickEditInfo}>Edit</button>
              <button onClick={onClickWithdrawal}>Withdrawal</button>
            </div>
          </Content>
          {withdrawaLpopup && (
            <Popup>
              <div className="mainPopupBox">
                <div className="mainPopupContent">
                  <h1>Member Notice of withdrawal</h1>
                  <h2>Check the precautions</h2>
                  <h3>
                    Personal information will be automatically deleted 15 days
                    after the withdrawal request. It cannot be recovered in any
                    way after the expiration of the 15-day period.
                  </h3>
                  <h3>
                    After account withdrawal, you will no longer be able to
                    login to the website or service and will lose access to
                    member-exclusive features and benefits.
                  </h3>
                  <h3>
                    Unpaid orders or unresolved refunds will be deleted with the
                    account. If you wish otherwise withdraw member account after
                    paying or receiving a refund.
                  </h3>
                  <div className="checkBox">
                    <label>
                      <input
                        type="checkbox"
                        checked={checkBoxchecked}
                        onChange={onChangeCheckBox}
                      />
                      <h3 style={{ color: checkBoxchecked ? "black" : "red" }}>
                        I have checked all the above precautions and agree to
                        withdraw from the membership.
                      </h3>
                    </label>
                  </div>
                  <div className="buttons">
                    <button onClick={onClickCancle}>Cancel</button>
                    <button onClick={onClickConfirm}>Confirm</button>
                  </div>
                </div>
              </div>
            </Popup>
          )}
        </>
      ) : (
        <h1>You must be logged in to access this page.</h1>
      )}
    </>
  );
});

export default AccountSetting;
