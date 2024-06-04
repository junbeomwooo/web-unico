import React, { memo, useCallback, useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import styled from "styled-components";
import logo from "../../assets/logo.png";
import { NavLink } from "react-router-dom";
import { useDispatch } from "react-redux";
import { loginCheck } from "../../slices/MemberSlice";
import mq from "../../MediaQuery/MediaQuery";
import Menu from "../../assets/buttons/menu.png";

const Container = styled.nav`
  background-color: #212b34;
  min-height: 100%;
  width: 250px;
  position: fixed;

  ${mq.maxWidth("md")`
      display:none;
    `}
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

const MobileContainer = styled.nav`
  background-color: #212b34;
  height: 100px;
  width: 100%;
  position: fixed;
  z-index: 99;

  ${mq.minWidth("md")`
      display:none;
    `}

  .title {
    display: flex;
    justify-content: space-between;
    padding: 30px 20px;
    .logo {
      width: 100px;
      height: auto;
      filter: invert(100%);

      &:hover {
        cursor: pointer;
      }
    }
  }

  .menu {
    width: 40px;
    height: 40px;
    filter: invert(100%);
  }
`;

const MenuContainer = styled.div`
  height: 100%;
  width: 200px;
  right: ${(props) => props.menutoggle};
  position: fixed;
  background-color: white;
  z-index: 999;
  transition: right 0.3s ease-in-out;
  padding: 30px;

  .btnCancle {
    position: absolute;
    right: 10px;
    top: 20px;
    button {
      border: none;
      background-color: white;
      font-size: 25px;

      &:hover {
        cursor: pointer;
        font-weight: 600;
      }
    }
  }

  .content {
    margin-top: 100px;

    .member {
      h1 {
        font-size: 23px;
        margin-bottom: 30px;
      }

      h3 {
        font-size: 13.5px;
        font-weight: 300;
        margin-top: 25px;

        &:hover {
          cursor: pointer;
          font-weight: 400;
        }
      }
    }

    .order {
      margin-top: 50px;
      h1 {
        font-size: 23px;
        margin-bottom: 20px;
      }

      h3 {
        font-size: 13.5px;
        font-weight: 300;
        margin-top: 25px;
        &:hover {
          cursor: pointer;
          font-weight: 400;
        }
      }
    }
  }
`;

// 그림자효과를 주기위함
const BackGround = styled.div`
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.3);
  left: 0;
  right: 0;
  z-index: 10;
  position: fixed;
`;

const Link = styled(NavLink)`
  color: white;
  &.active {
    font-weight: 400;
  }
`;

const AdminNavigation = memo(() => {
  /** ** 모바일 **  페이지 메뉼 토글을 위한 상태값 */
  const [menuToggle, setMenuToggle] = useState("-330px");
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
  // useEffect(() => {
  //   dispatch(loginCheck()).then(({ payload }) => {
  //     if (!payload?.item || payload?.item?.is_admin === 'N') {
  //       window.alert("You are not authorized to access this page.");
  //       navigate("/");
  //     }
  //   });
  // }, []);

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

  // ** 모바일 ** 페이지 메뉴 토글
  const mobileMenuToggle = useCallback((e) => {
    setMenuToggle("0");
  });

  // ** 모바일 ** 메뉴 닫기
  const closeMenu = useCallback((e) => {
    setMenuToggle("-330px");
  });

  // 페이지 이동
  const moveTo = useCallback((link) => {
    navigate(link);
    setMenuToggle("-330px");
  })

  return (
    <>
      {isAdminPath && (
        <>
          <Container>
            <img src={logo} alt={logo} onClick={onMoveToAdmin} />
            <div
              className="dropdown"
              style={{ height: dropdownStates.dropdown1 ? "130px" : "50px" }}
            >
              <div
                className="title"
                onClick={() => onClickDropdown("dropdown1")}
              >
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
              <div
                className="title"
                onClick={() => onClickDropdown("dropdown2")}
              >
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
          <MobileContainer>
            <div className="title">
              <img
                className="logo"
                src={logo}
                alt={logo}
                onClick={onMoveToAdmin}
              />
              <img
                className="menu"
                src={Menu}
                alt={Menu}
                onClick={mobileMenuToggle}
              />
            </div>
          </MobileContainer>

          {menuToggle && (
            <>
              {/* ismenuopen의 위치가 -330이 아닐 경우에만 보여지기 */}
              {menuToggle !== "-330px" && <BackGround />}

              <MenuContainer menutoggle={menuToggle}>
                <div className="btnCancle">
                  <button onClick={closeMenu}>×</button>
                </div>
                <div className="content">
                  <div className="member">
                    <h1>Member</h1>
                    <h3 onClick={() => moveTo("/admin/member")}>Member List</h3>
                    <h3 onClick={() => moveTo("/admin/member_statistics")}>Member Activity Statistics</h3>
                  </div>
                  <div className="order">
                    <h1>Product</h1>

                    <h3 onClick={() => moveTo("/admin/product_management")}>Product Management</h3>
                    <h3 onClick={() => moveTo("/admin/order_management")}>Order and Shipping Management</h3>
                  </div>
                </div>
              </MenuContainer>
            </>
          )}
        </>
      )}
    </>
  );
});

export default AdminNavigation;
