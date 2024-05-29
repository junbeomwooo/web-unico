import React, { memo, useCallback, useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import styled from "styled-components";
import logo from "../../assets/logo.png";
import { NavLink } from "react-router-dom";
import { useDispatch } from "react-redux";
import { loginCheck } from "../../slices/MemberSlice";

const Container = styled.nav`
  background-color: #212b34;
  min-height: 100vh;
  width: 250px;
  img {
    width: 150px;
    margin: auto;
    display: flex;
    justify-content: center;
    padding-top: 5px;
    filter: invert(100%);
    margin-top: 20px;
    margin-bottom: 35px;

    &:hover {
      cursor: pointer;
    }
  }

  .dropdown {
    padding: 0 20px;

    transition: height 0.2s linear;
    overflow: hidden;

    .title {
      cursor: pointer;
      display: flex;
      justify-content: space-between;

      h4 {
        color: white;
        font-weight: 500;
      }

      .click {
        transform: rotate(90deg);
      }
    }

    .content {
      h5 {
        color: white;
        font-weight: 100;
        margin-top: 5px;
      }
    }
  }
`;

const Link = styled(NavLink)`
  color: white;
  &.active {
    font-weight: 400;
  }
`;
const AdminNavigation = memo(() => {
  /** url */
  const location = useLocation();

  /** 강제 이동 함수 생성 */
  const navigate = useNavigate();
  /** 드롭다운 상태값 */
  const [dropdownStates, setDropdownStates] = useState({
    dropdown1: false,
    dropdown2: false,
  });

  /** 리덕스 초기화 */
  const dispatch = useDispatch();

  // 드롭다운 토글 함수
  const onClickDropdown = useCallback((dropdownKey) => {
    setDropdownStates((prevStates) => ({
      ...prevStates,
      [dropdownKey]: !prevStates[dropdownKey],
    }));
  }, []);

  /** 렌더링 시 실행 */
  useEffect(() => {
    dispatch(loginCheck()).then(({ payload }) => {
      if (!payload?.item || payload?.item?.is_admin === 'N') {
        window.alert("You are not authorized to access this page.");
        navigate("/");
      }
    });
  }, []);

  /** 관리자 페이지인지 판별
   * 판별 후 관리자 페이지가 아니라면 렌더링하지 않음
   */
  const isAdminPath = location.pathname.includes("admin");
  /** 이벤트 목록 */

  // 관리 메인 페이지 이동
  const onMoveToAdmin = useCallback(
    (e) => {
      navigate("/admin");
    },
    [navigate]
  );
  return (
    <>
      {isAdminPath && (
        <Container>
          <img src={logo} alt={logo} onClick={onMoveToAdmin} />
          <div
            className="dropdown"
            style={{ height: dropdownStates.dropdown1 ? "130px" : "50px" }}
          >
            <div className="title" onClick={() => onClickDropdown("dropdown1")}>
              <h4>Member</h4>
              <h4 className="click">&gt;</h4>
            </div>
            <div className="content">
              <h5>
                <Link to="/admin/member">Member List</Link>
              </h5>
              <h5>
                <Link to="/admin/member_statistics">
                  Member Activity Statistics
                </Link>
              </h5>
            </div>
          </div>
          <div
            className="dropdown"
            style={{ height: dropdownStates.dropdown2 ? "200px" : "50px" }}
          >
            <div className="title" onClick={() => onClickDropdown("dropdown2")}>
              <h4>Product</h4>
              <h4 className="click">&gt;</h4>
            </div>
            <div className="content">
              <h5>
                <Link to="/admin/product_management">Product Management</Link>
              </h5>
              <h5>
                <Link to="/admin/order_management">
                  Order and Shipping Management
                </Link>
              </h5>
            </div>
          </div>
        </Container>
      )}
    </>
  );
});

export default AdminNavigation;
