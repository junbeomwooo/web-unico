import React, { memo, useCallback, useEffect, useState } from "react";
import { styled } from "styled-components";
import { Link, useNavigate } from "react-router-dom";
import Cookies from "js-cookie";

import { useDispatch, useSelector } from "react-redux";
import { loginAccount, logoutAccount, loginCheck } from "../slices/MemberSlice";

import { getItem } from "../slices/OrderDetailSlice";

import Spinner from "../components/Spinner";
import ErrorView from "../components/ErrorView";
import regexHelper from "../helper/RegexHelper";
import mq from "../MediaQuery/MediaQuery";
import Pagenation from "../helper/Pagenation";

import { useQueryString } from "../hooks/useQueryString";

// 로그인을 안했을 경우 스타일 컴포넌트 박스
const NonLogin = styled.div`
  padding-top: 100px;
  display: flex;
  flex-direction: column;
  align-items: center;

  .login {
    margin-top: 150px;
    width: 450px;
    height: auto;

    ${mq.maxWidth("sm")`
      width: 300px;
    `}

    
    h1 {
      font-size: 18px;
      font-weight: 600;
      margin-bottom: 30px;
    }
    h2 {
      font-size: 15px;
      font-weight: 500;
    }
    h3 {
      font-size: 14px;
      margin-top: 20px;
      font-weight: 500;

      &:hover {
        cursor: pointer;
      }
    }
    input {
      width: 100%;
      background: none;
      border: 1px solid black;
      height: 40px;
      padding: 0 5px;

      &:last-child {
        margin-top: 20px;
      }
    }

    button {
      width: 100%;
      box-sizing: content-box;
      height: 40px;
      background-color: black;
      color: white;
      border: none;
      margin-top: 20px;

      &:hover {
        cursor: pointer;
      }
    }
  }

  .createAccount {
    width: 450px;
    height: auto;
    margin-top: 60px;

    ${mq.maxWidth("sm")`
      width: 300px;
    `}
    h1 {
      font-size: 18px;
      font-weight: 600;
      margin-bottom: 30px;
    }

    h2 {
      font-size: 15px;
      font-weight: 500;
    }
  }

  .trackOrder {
    width: 450px;
    height: auto;
    margin-top: 50px;
    margin-bottom: 200px;

    ${mq.maxWidth("sm")`
      width: 300px;
    `}

    h1 {
      font-size: 18px;
      font-weight: 600;
      margin-bottom: 30px;
    }

    h2 {
      font-size: 15px;
      font-weight: 500;
    }
  }
`;
const ButtonLink = styled(Link)`
  button {
    width: 462px;
    display: block;
    box-sizing: border-box;
    height: 40px;
    background-color: white;
    color: black;
    border: 1px solid black;
    margin-top: 20px;
    transition: background-color 0.4s ease;

    ${mq.maxWidth("sm")`
      width: 300px;
    `}

    &:hover {
      cursor: pointer;
      border: none;
      color: white;
      background-color: black;
    }
  }
`;

// 로그인을 했을 경우 스타일 컴포넌트 박스
const DuringLogin = styled.div`
  padding-top: 180px;
  margin-bottom: 180px;
  display: flex;
  justify-content: space-around;

  ${mq.maxWidth("md")`
      flex-direction: column;
      align-items: center;
    `}

  div {
    width: 35%;

    ${mq.maxWidth("md")`
            width: 75%;
        `}
    h1 {
      font-size: 19px;
    }

    hr {
      margin: 55px 0;
    }

    div {
      width: 100%;
      display: flex;
      justify-content: space-between;
    }

    h2 {
      font-size: 17.5px;
      font-weight: 600;
      margin: 60px 0 40px 0;
    }

    h3 {
      font-size: 16px;
      font-weight: 600;
    }

    .logout {
      display: flex;
      justify-content: flex-end;

      ${mq.maxWidth("md")`
              margin-top: 40px;
            `}

      .logoutBtn {
        border: none;
        background: none;
        font-size: 18px;
        font-weight: 700;

        ${mq.maxWidth("md")`
              font-size: 16px;
            `}

        &:hover {
          cursor: pointer;
        }
      }
    }

    .noProduct {
      margin-top: 100px;
    }

    .product {
      margin-top: 20px;

      img {
        width: 120px;
        height: auto;

        ${mq.maxWidth("xsm")`
        width: 80px;
    `}
      }

      .productInfo {
        margin-left: 25px;
        display: flex;
        justify-content: space-between;
        flex-direction: column;

        h2 {
          font-size: 15px;
          margin: 0;

          ${mq.maxWidth("xsm")`
          font-size: 14px;
    `}
        }

        h4 {
          font-weight: 400;
          font-size: 15px;
          margin: 0;
          ${mq.maxWidth("xsm")`
          font-size: 14px;
    `}
          
        }

        h6 {
          font-size: 13px;
          font-weight: 400;
          margin: 0;

          ${mq.maxWidth("xsm")`
          font-size: 12px;
    `}
        }
      }
    }

    .betweenProduct {
      color: #e0e0e0;
      background-color: none;
      opacity: 40%;
      margin: 25px 0;

      &:last-child {
        display: none;
      }
    }

    .orderTitle {
      margin-bottom: 60px;
    }
  }
`;

const InfoEditLink = styled(Link)`
  margin: 3px 0 0 0;
  font-size: 14px;
  text-decoration: underline;
  font-weight: 500;
`;

const OrderViewAll = styled(Link)`
  margin: 3px 0 0 0;
  font-size: 14px;
  text-decoration: underline;
  font-weight: 500;
`;

// 비밀번호 찾기 시 보여줄 팝업 박스
const FindPasswordPopup = styled.div`
  position: fixed;
  z-index: 999;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
  background: rgba(0, 0, 0, 0.3);
  .mainPopupBox {
    width: 600px;
    height: 420px;
    background-color: white;
    position: fixed; /* 화면에 고정 */
    top: 50%; /* 세로 중앙 */
    left: 50%; /* 가로 중앙 */
    transform: translate(-50%, -50%); /* 중앙으로부터 자신의 크기만큼 이동 */

    ${mq.maxWidth("md")`
      width: 450px;
      height: 460px;
    `}

    ${mq.maxWidth("sm")`
      width: 300px;
      height: 390px
    `}

    .mainPopupContent {
      margin: 80px;
      margin-top: 0px;

      ${mq.maxWidth("sm")`
        margin: 30px;
    `}
      .titleFlex {
        display: flex;
        justify-content: space-between;
        margin-bottom: 40px;
        h1 {
          padding-top: 80px;
          font-size: 16px;
          font-weight: 700;

          ${mq.maxWidth("sm")`
          font-size: 15px;
          padding-top: 30px;
    `}
        }
      }

      h2 {
        margin-top: 25px;
        font-size: 15px;
        font-weight: 400;
        line-height: 30px;
        ${mq.maxWidth("sm")`
        font-size: 14px;
    `}
      }

      .buttons {
        display: flex;
        justify-content: space-between;
        margin-top: 60px;

        ${mq.maxWidth("sm")`
        margin-top: 30px;
    `}
        button {
          height: 40px;
          width: 45%;
          color: black;
          border: 1px solid black;
          background-color: white;
          transition: background-color 0.4s ease-in-out;

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

// 어드민 계정 공유를 위한 팝업 박스
const AdminPopup = styled.div`
  position: fixed;
  z-index: 999;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
  background: rgba(0, 0, 0, 0.3);

  .mainPopupBox {
    width: 470px;
    height: 500px;
    background-color: white;
    position: fixed; /* 화면에 고정 */
    top: 50%; /* 세로 중앙 */
    left: 50%; /* 가로 중앙 */
    transform: translate(-50%, -50%); /* 중앙으로부터 자신의 크기만큼 이동 */

    ${mq.maxWidth("sm")`
      width: 300px;
      height: 430px;
    `}

    .mainPopupContent {
      text-align: center;
      margin: 40px;
      margin-top: 0px;

      ${mq.maxWidth("sm")`
      margin: 30px;
      `}

      .titleFlex {
        margin-bottom: 40px;
        .cross-box {
          font-size: 25px;
          font-weight: 300;
          position: absolute;
          cursor: pointer;
          margin-left: 380px;

          ${mq.maxWidth("sm")`
          margin-left:230px;
          font-size: 23px;
          margin-top: -10px;
      `}
        }
        h1 {
          padding-top: 110px;
          font-size: 16px;
          font-weight: 700;

          ${mq.maxWidth("sm")`
          font-size: 15px;
          padding-top: 60px;
          line-height: 0px;
      `}
        }
      }

      h2 {
        margin-top: 25px;
        font-size: 15px;
        font-weight: 400;
        line-height: 30px;

        ${mq.maxWidth("sm")`
         font-size: 14px;
         line-height: 25px;
      `}
      }

      .checkBox {
        position: absolute;
        margin-top: 80px;

        ${mq.maxWidth("sm")`
          margin-top: 30px;
      `}

        input {
          margin-right: 10px;
        }

        label {
          font-size: 15px;

          ${mq.maxWidth("sm")`
          font-size: 14px;
      `}
        }
      }
    }
  }
`;

const Login = memo(() => {
  /** 페이지네이션 구현을 위한 QueryString 변수 받기 */
  const { page = 1 } = useQueryString();

  /** 팝업 창을 위한 상태값 */
  // 비밀번호 찾기 팝업
  const [findPasswordPopup, setFindPasswordPopup] = useState(false);

  // 어드민 계정 공유를 해주기위한 팝업
  const [adminPopup, setAdminPopup] = useState(true);

  // 오늘 하루간 팝업보이지않기 < 를 위한 상태값
  const [turnOffForDay, setTurnOffForDay] = useState(false);

  /** 리덕스 관련 초기화 */
  const dispatch = useDispatch();
  const { data, loading, error, isLoggedIn } = useSelector(
    (state) => state.MemberSlice
  );
  const {
    data: orderData,
    pagenation,
    loading: orderLoading,
  } = useSelector((state) => state.OrderDetailSlice);

  // 강제 이동 함수 생성
  const navigate = useNavigate();

  useEffect(() => {
    window.scrollTo(0, 0);
    // 메인 페이지를 다녀오면 로그인 상태가 풀리는 상황 발생
    // 브라우저를 새로고침 할 경우 리덕스 상태가 초기화 됨으로 loginCheck으로 isloggined 값을 갱신
    const cookieSessionID = Cookies.get("session_id");

    if (cookieSessionID) {
      dispatch(loginCheck()).then(() => {
        if (isLoggedIn === true) {
          dispatch(
            getItem({
              page: page,
              rows: 3,
            })
          );
        }
      });
    }
  }, [page, isLoggedIn]);

  // 로그인 이벤트관리
  const onSubmitLogin = useCallback((e) => {
    e.preventDefault();
    const current = e.currentTarget;
    const account = current.account.value.trim().toLowerCase();
    const userpw = current.userpw.value.trim();

    // 유효성 검사
    try {
      regexHelper.value(account, "Please enter account name.");
      regexHelper.value(userpw, "Please enter password.");
    } catch {
      console.log(error);
      return;
    }

    dispatch(
      loginAccount({
        account: account,
        userpw: userpw,
      })
    ).then((response) => {
      // 로그인 후 로그인 여부 체크
      dispatch(loginCheck());

      // 비밀번호 또는 아이디값을 올바르기 입력한 경우
      if (response.payload.rtcode === 200) {
        // 관리자일 경우
        if (response.payload.item.is_admin === "Y") {
          const answer = window.confirm(
            "You have logged in with an administrator account. Would you like to proceed to the administrator page?"
          );
          if (answer) {
            window.location.href = "/admin";
            return;
          }
        }
        navigate("/");
      }
      // 비밀번호 또는 아이디값이 틀렸을 경우
      if (response.payload.status === 401) {
        alert(response.payload.data.rtmsg);
      }
    });
  });

  //로그아웃 이벤트 관리
  const onClickLogout = useCallback((e) => {
    e.preventDefault();
    dispatch(logoutAccount()).then(() => {
      dispatch(loginCheck());
      navigate("/");
      window.scrollTo(0, 0);
    });
  });

  // 비밀번호 찾기 이벤트
  const onClickFindPW = useCallback((e) => {
    e.preventDefault();
    setFindPasswordPopup(true);
  });

  // 비밀번호 찾기 팝업 끄기
  const onClickCancleFindPW = useCallback((e) => {
    e.preventDefault();
    setFindPasswordPopup(false);
  });

  // 회원가입 사이트 이동
  const onClickMoveToCreatAccount = useCallback((e) => {
    e.preventDefault();
    setFindPasswordPopup(false);
    navigate("/member/account_register");
  });

  // 하루간 보이지않기를 선택할 경우 이벤트
  const popupChange = useCallback((e) => {
    const changed = e.target.checked;
    // changed값이 바뀔 경우 상태값에 담기
    changed ? setTurnOffForDay(true) : setTurnOffForDay(false);
  });

  // 어드민 계정 공유 안내 끄기
  const onClickCancleAdminPopup = useCallback((e) => {
    // '오늘하루보지않기'를 선택하지 않았을 경우
    if (!turnOffForDay) {
      setAdminPopup(false);

      // '오늘하루보지않기'를 선택하고 닫은 경우
    } else if (turnOffForDay) {
      const date = new Date();
      date.setDate(date.getDate() + 1);
      Cookies.set("ForOneDay", true, { path: "/", expires: date });
      setAdminPopup(false);
    }
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

  return (
    <>
      {/** 로딩바 */}
      <Spinner loading={loading || orderLoading} />

      {/** 조회결과 표시 */}
      {error ? (
        <ErrorView error={error} />
      ) : isLoggedIn ? (
        <DuringLogin>
          <div>
            <h1>My Account</h1>
            <hr />
            <div>
              <h1>Account</h1>
              <InfoEditLink to="/member/account_setting">Edit</InfoEditLink>
            </div>
            <h2>Info</h2>
            <h3>Name: {data.name}</h3>
            <h3>Gender: {displayGender}</h3>
            <h3>Date of Birth: {displayBirthday}</h3>
            <h3>Phone Number: {data.phonenumber}</h3>
            <h2>Address</h2>
            <h3>Address: {data.address}</h3>
            <h3>City: {data.city}</h3>
            <h3>Zip Code: {data.zipcode}</h3>
            <h3>State/Province/Region: {data.province}</h3>
            <h3>Country: {data.country}</h3>
          </div>
          <div>
            <div className="logout">
              <button className="logoutBtn" onClick={onClickLogout}>
                Logout
              </button>
            </div>
            <hr />
            <div className="orderTitle">
              <h1>Order</h1>
              <OrderViewAll to="/member_view_all">View all</OrderViewAll>
            </div>
            {orderData.length > 0 ? (
              /** 클라이언트에서  같은 제품을 구매한 경우에는 orderno값을 항상 첫번째 상품만 대입하는 문제가 있어서 컨트롤러 파일에서 자체적으로 데이터를 합친 후 전송 */
              orderData.map((v, i) => {
                const productDetail = v.productDetail;

                return (
                  <React.Fragment key={i}>
                    <div className="product">
                      <img
                        src={productDetail?.img1}
                        alt={productDetail?.title}
                      />
                      <div className="productInfo">
                        <div className="nameAndquantity">
                          <h2>{productDetail?.title}</h2>
                          <h4>Qty: {v?.quantity}</h4>
                        </div>
                        <div className="price">
                          <h4>${v?.tprice}</h4>
                          <h6>{v?.status}</h6>
                        </div>
                      </div>
                    </div>
                    <hr className="betweenProduct" />
                  </React.Fragment>
                );
              })
            ) : (
              <h3 className="noProduct"> No product in my order list.</h3>
            )}
            {/* 오더리스트가 있을 경우 페이지네이션 노출 */}
            {orderData.length > 0 && pagenation && (
              <Pagenation pagenation={pagenation} />
            )}
          </div>
        </DuringLogin>
      ) : (
        <>
          <NonLogin>
            <form className="login" onSubmit={onSubmitLogin}>
              <h1>Login</h1>
              <h2>Account</h2>
              <input type="text" name="account" />
              <h2>Password</h2>
              <input type="password" name="userpw" />
              <h3 onClick={onClickFindPW}>Find My Password</h3>
              <button type="submit">Login</button>
            </form>
            <div className="createAccount">
              <h1>Create Account</h1>
              <h2>
                By creating an account with UNICO, you will be able to check
                your orders, edit and save shipping preferences, and create your
                wish list among other benefits.
              </h2>
              <ButtonLink to="/member/account_register">
                <button>Create Account</button>
              </ButtonLink>
            </div>
            <div className="trackOrder">
              <h1>Check Your Order Status</h1>
              <h2>
                If you purchased it as a non-member, you can track your order
                here. Please enter your email address below.
              </h2>
              <ButtonLink to="/customer_service/track_order">
                <button className="last">Track Your Order</button>
              </ButtonLink>
            </div>
          </NonLogin>
          {findPasswordPopup && (
            <FindPasswordPopup>
              <div className="mainPopupBox">
                <div className="mainPopupContent">
                  <div className="titleFlex">
                    <h1>FORGOT YOUR PASSWORD?</h1>
                  </div>
                  <h2>
                    For inquiries regarding lost accounts or forgotten
                    passwords, please contact us at{" "}
                    <a href="" style={{ color: "#5C80AF" }}>
                      junbeom2@gmail.com
                    </a>
                    , and we will assist you in resetting your password to a
                    random one.
                  </h2>
                  <div className="buttons">
                    <button onClick={onClickCancleFindPW}>Cancel</button>
                    <button onClick={onClickMoveToCreatAccount}>
                      Create Account
                    </button>
                  </div>
                </div>
              </div>
            </FindPasswordPopup>
          )}
          {adminPopup && !Cookies.get("ForOneDay") && (
            <AdminPopup>
              <div className="mainPopupBox">
                <div className="mainPopupContent">
                  <div className="titleFlex">
                    <h4 className="cross-box" onClick={onClickCancleAdminPopup}>
                      &#215;
                    </h4>
                    <h1>USING ADMIN ACCOUNT</h1>
                  </div>
                  <h2>
                    You can access the admin page using the admin account.
                    <br />
                    After logging in, clcik confirm on the pop-up notification
                    to proceed to the admin page. <br />
                    <br />
                    Account : admin123 <br />
                    Password : admin123123! <br />
                  </h2>
                  <div className="checkBox">
                    <input
                      type="checkbox"
                      id="checkbox"
                      onChange={popupChange}
                    />
                    <label htmlFor="checkbox">Don't show again today</label>
                  </div>
                </div>
              </div>
            </AdminPopup>
          )}
        </>
      )}
    </>
  );
});

export default Login;
