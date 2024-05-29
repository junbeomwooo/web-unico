import React, { memo, useCallback, useEffect } from "react";
import styled from "styled-components";
import { useNavigate, NavLink } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { logoutAccount, loginCheck } from "../slices/MemberSlice";
import Spinner from "../components/Spinner";
import mq from '../MediaQuery/MediaQuery';

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
        margin : 55px 0px;

        ${mq.maxWidth('md')`
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

      ${mq.maxWidth('md')`
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
  ${mq.maxWidth('md')`
      width: 100%;
      margin-bottom: 0px;
    `}
  h2 {
    font-size: 15px;

    ${mq.maxWidth('md')`
      margin-top : -15px;
    `}
  }
  .links {
    display: flex;
    flex-direction: column;
    ${mq.maxWidth('md')`
      flex-direction: row;
    `}

    a {
      margin-top: 30px;
      font-size: 13px;

      ${mq.maxWidth('md')`
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
    transform : translate(-50%, -50%);
    width: 200px;



    ${mq.maxWidth('md')`
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
          font-weight: 600;
          font-size: 22px;
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

        ${mq.maxWidth('md')`
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
const AddressSetting = memo(() => {
  // 강제 이동 함수 생성
  const navigate = useNavigate();

  // 리덕스 관련 초기화
  const dispatch = useDispatch();
  const { data, loading, isLoggedIn } = useSelector((state) => state.MemberSlice);

  // 페이지 최초 마운트시 실행
  useEffect(() => {
    if(!isLoggedIn) {
      // 로그인 상태를 확인
      alert("You must be logged in to access this page.")
      navigate('/member');
    }
  },[])

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
    navigate('/member/editAddress');
  })

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
            <hr/>
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
            <NavLink to='/member/account_setting'>Information</NavLink>
            <NavLink to='/member/address_setting'>Address</NavLink>
            <NavLink to='/member/password_setting'>Change Password</NavLink>
            <NavLink to="/member_view_all">Track Order</NavLink>
          </div>
        </Navigator>
        <Content>
            <div className="info">
              <h2>Address</h2>
              <h3>Address: {data.address}</h3>
              <h3>City: {data.city}</h3>
              <h3>Zipcode: {data.zipcode}</h3>
              <h3>State/Province/Region: {data.province}</h3>
              <h3>Country: {data.country}</h3>
            </div>
            <div className="buttons">
              <button onClick={onClickEditInfo}>Edit</button>
            </div>
        </Content>
            </>
          ):(
            <h1>You must be logged in to access this page.</h1>
          )
        }
    </>
  );
});

export default AddressSetting;
