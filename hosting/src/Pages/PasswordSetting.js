import React, { memo, useCallback, useEffect, useState } from "react";
import styled from "styled-components";
import { useNavigate, NavLink } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { logoutAccount, loginCheck, putMyPassword } from "../slices/MemberSlice";
import Spinner from "../components/Spinner";
import mq from '../MediaQuery/MediaQuery';
import regexHelper from '../helper/RegexHelper';

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
const Content = styled.form`
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
        h3 {
            font-size: 14px;
            font-weight: 600;
            line-height: 13px;
            font-weight: 400;
        }

        h4 {
            color: red;
            font-size: 12px;
            position: absolute;
            margin-top: 5px;
            font-weight: 500;
        }

        input {
            border: 1px solid black;
            width : 320px;
            height: 40px;
            box-sizing: border-box;
            

            ${mq.maxWidth('md')`
                width: 100%
            `}
        }
    }

    .buttons {
      display: flex;
      flex-direction: column;
      margin-top: 5px;

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
const PasswordSetting = memo(() => {
  // 강제 이동 함수 생성
  const navigate = useNavigate();

  // 리덕스 관련 초기화
  const dispatch = useDispatch();
  const { loading, isLoggedIn } = useSelector((state) => state.MemberSlice);

  // 페이지 최초 마운트시 실행
  useEffect(() => {
    if(!isLoggedIn) {
      // 로그인 상태를 확인
      alert("You must be logged in to access this page.")
      navigate('/member');
    }   
  },[])

  // 비밀번호 상태값 관리
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [matchPassword, setMatchPassword] = useState(false);

  // 비밀번호 이벤트 관리
  const onChangePassword = useCallback((e) => {
    setPassword(e.currentTarget.value);
    // 현재 입력값과 confirm값이 같으며 confirm값이 빈 문자열이 아닌 경우 true 반환.
    if(e.currentTarget.value ===  confirmPassword && confirmPassword !== ''){
        setMatchPassword(true);
    } else {
        setMatchPassword(false);
    }
})

const onChangeCofirmPassword = useCallback((e) => {
    setConfirmPassword(e.currentTarget.value);
    // 현재 입력값과 패스워드값이 같으며 패스워드값이 빈 문자열이 아닌 경우 true 반환.
    if(e.currentTarget.value === password && password !== ''){
        setMatchPassword(true);
    } else {
        setMatchPassword(false);
    }
})
  //로그아웃 이벤트 관리
  const onClickLogout = useCallback((e) => {
    e.preventDefault();
    dispatch(logoutAccount()).then(() => {
      dispatch(loginCheck());
      navigate("/");
    });
  });

  /** Edit Information 이벤트 관리 **/
  const onSubmitChangePassword = useCallback((e) => {
    e.preventDefault();
    
    const current = e.currentTarget;

    // 비밀번호 값이 일치하게 작성되었는지 검사
    if(current.newPassword.value !== current.confirmNewPassword.value) {
        alert("Passwords do not match. Please make sure both passwords are the same.");
        return;
    }

    // 스트링값으로 변환 후 앞 뒤 공백 없애기.
    const processedPrepw = current.currentPassword.value.toString().trim();
    const processedNewpw = current.newPassword.value.toString().trim();

    // 이전 비밀번호와 바꾸려는 비밀번호 값이 같을 경우 alert창 발생
    if (processedPrepw === processedNewpw){
        alert("New password cannot be same as old password.")
        return;
    }
    
    // 유효성 검사
    try {
        regexHelper.value(processedPrepw, "Please enter password.");
        regexHelper.minLength(processedPrepw, 12 , "Please enter password of at least 12 characters.");
        regexHelper.engNumSpe(processedPrepw, "Passwords must include letters, numbers, and special characters.");
        regexHelper.value(processedNewpw, "Please enter password.");
        regexHelper.minLength(processedNewpw, 12 , "Please enter password of at least 12 characters.");
        regexHelper.engNumSpe(processedNewpw, "Passwords must include letters, numbers, and special characters.");
    } catch(err) {
        console.error(err);
        return;
    }

    dispatch(putMyPassword({
        userpw: processedPrepw,
        newPassword: processedNewpw
    })).then((response) => {
        console.log(response);
        if(response.payload.rtcode !== 200) {
            alert(response.payload.data.rtmsg)
        } else if (response.payload.rtcode === 200) {
            alert('Your password has been successfully updated.')
            navigate('/member');
        }
    });
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
        <Content onSubmit={onSubmitChangePassword}>
            <div className="info">
              <h3>Current Password</h3>
              <input type='password' name='currentPassword'/>
              <h3>New Password</h3>
              <input type='password' name='newPassword' onChange={onChangePassword} />
              <h3>Confirm New Password</h3>
              <input type='password' name='confirmNewPassword' onChange={onChangeCofirmPassword}/>
              {password !== '' && confirmPassword !== '' && matchPassword === false && (
                    <h4>Passwords are not matching.</h4>
              )}
            </div>
            <div className="buttons">
              <button type="submit">Change Password</button>
            </div>
        </Content>
            </>
          ):(
            <h1>You must be logged in to access this page.</h1>
          )}
    </>
  );
});

export default PasswordSetting;
