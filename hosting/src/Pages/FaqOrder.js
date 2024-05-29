import React, { memo, useCallback, useState } from "react";
import styled from "styled-components";
import { NavLink } from "react-router-dom";
import mq from "../MediaQuery/MediaQuery";

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
const Box = styled.div`
  position: absolute;
  left: 50%;
  top: 40%;
  transform: translate(-50%, -50%);
  width: 380px;
  height: 351.73px;

  .links {
    display: flex;
    justify-content: space-between;
    margin-bottom: 50px;
  }
  .dropdownBox {
    width: 700px;

    &:hover {
      cursor: pointer;
    }

    hr {
      width: 100%;
    }

    .dropdownContainer {
      .title {
        display: flex;
        justify-content: space-between;
        h4 {
          font-size: 16px;
          margin-bottom: 4px;
        }

        .symbol {
          transform: rotate(90deg);
          font-size: 11px;
          margin-right: 10px;
          margin-bottom: 0;
        }
      }
      .content {
        overflow: hidden;
        transition: height 0.2s linear;
        margin-bottom: 15px;

        h4 {
          font-weight: 600;
          font-size: 15px;
        }
        h5 {
          font-weight: 400;
          font-size: 15px;
          line-height: 25px;
        }
      }
    }
  }
`;

const NavLinks = styled(NavLink)`
  font-weight: 400;
  &.active {
    font-weight: 700;
  }
`;
const FaqOrder = memo(() => {
  /** 드롭다운 상태값 */
  const [dropdownStates, setDropdownStates] = useState({
    dropdown1: false,
    dropdown2: false,
    dropdown3: false,
    dropdown4: false,

    // 추가적인 드롭다운이 있다면 필요에 따라 추가 가능
  });

  // 드롭다운 토글 함수
  const onClickDropdown = useCallback((dropdownKey) => {
    setDropdownStates((prevStates) => ({
      ...prevStates,
      [dropdownKey]: !prevStates[dropdownKey],
    }));
  }, []);

  return (
    <>
      <Navigator>
        <h2>Customer Service</h2>
        <div className="links">
          <NavLink to="/customer_service/faq/account">FAQ</NavLink>
          <NavLink to="/customer_service/contact">Contact</NavLink>
          <NavLink to="/customer_service/track_order">Track your order</NavLink>
        </div>
      </Navigator>
      <Box>
        <div className="links">
          <NavLinks
            to="/customer_service/faq/account"
            activeClassName="activeLink"
          >
            Account
          </NavLinks>
          <NavLinks
            to="/customer_service/faq/order"
            activeClassName="activeLink"
          >
            Order
          </NavLinks>
          <NavLinks
            to="/customer_service/faq/payment"
            activeClassName="activeLink"
          >
            Payment
          </NavLinks>
          <NavLinks
            to="/customer_service/faq/return"
            activeClassName="activeLink"
          >
            Return & Cancel
          </NavLinks>
        </div>

        <div className="dropdownBox">
          <div
            className="dropdownContainer"
            onClick={() => onClickDropdown("dropdown1")}
          >
            <div className="title">
              <h4
                style={{ fontWeight: dropdownStates.dropdown1 ? "600" : "400" }}
              >
                Where can I check all the order details?
              </h4>
              <h6 className="symbol">&gt;</h6>
            </div>
            <div
              className="content"
              style={{ height: dropdownStates.dropdown1 ? "240px" : "0" }}
            >
              <h4>Member</h4>
              <h5>
                You can check order details through {"["}Login &gt; Account &gt;
                Order{"]"}.
              </h5>
              <h4>Non-member</h4>
              <h5>
                You can check order details through {"["}Account &gt; Track Your Order{"]"}
                <br />
                You can track your order with the email address 
                used when you made a purchase.
              </h5>
            </div>
          </div>
          <hr />
        </div>
        <div
          className="dropdownBox"
          onClick={() => onClickDropdown("dropdown2")}
        >
          <div className="dropdownContainer">
            <div className="title">
              <h4
                style={{ fontWeight: dropdownStates.dropdown2 ? "600" : "400" }}
              >
                I would like to make a change in my order
              </h4>
              <h6 className="symbol">&gt;</h6>
            </div>
            <div
              className="content"
              style={{ height: dropdownStates.dropdown2 ? "200px" : "0" }}
            >
              <h5>
              Once the order already placed, you can not change the order information, Cancellations may only be requested at the status before “Ready to delivery” and requests may be made at the {'['}Account &gt; Order details &gt; Order cancel{']'}
              </h5>
              <h5>
              Please be mindful that cancellation is not possible once the shipping process has begun. From the stage of “Ready to Delivery”, order should be processed by return process after product receiving
              </h5>
            </div>
          </div>
          <hr />
        </div>
        <div
          className="dropdownBox"
          onClick={() => onClickDropdown("dropdown3")}
        >
          <div className="dropdownContainer">
            <div className="title">
              <h4
                style={{ fontWeight: dropdownStates.dropdown3 ? "600" : "400" }}
              >
                How do I delete UNICO account
              </h4>
              <h6 className="symbol">&gt;</h6>
            </div>
            <div
              className="content"
              style={{ height: dropdownStates.dropdown3 ? "150px" : "0" }}
            >
              <h5>
                Withdraw your account under {"["}Account &gt; Edit &gt; Change
                Password{"]"}
              </h5>
            </div>
          </div>
          <hr />
        </div>
        <div
          className="dropdownBox"
          onClick={() => onClickDropdown("dropdown4")}
        >
          <div className="dropdownContainer">
            <div className="title">
              <h4
                style={{ fontWeight: dropdownStates.dropdown4 ? "600" : "400" }}
              >
                Can I link guest order to a registered account ?
              </h4>
              <h6 className="symbol">&gt;</h6>
            </div>
            <div
              className="content"
              style={{ height: dropdownStates.dropdown4 ? "150px" : "0" }}
            >
              <h5>
                Orders already created cannot be modified or moved to another
                account.
              </h5>
            </div>
          </div>
          <hr />
        </div>
      </Box>
    </>
  );
});

export default FaqOrder;
