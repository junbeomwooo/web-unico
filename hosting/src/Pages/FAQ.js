import React, { memo, useCallback, useState, useEffect } from "react";
import styled from "styled-components";
import { NavLink } from "react-router-dom";
import mq from "../MediaQuery/MediaQuery";

const Navigator = styled.nav`
  margin-left: 7%;
  width: 150px;
  margin-bottom: 3500px;
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

  ${mq.maxWidth("md")`
        position: static;
        display:block;
        transform: none;
        top: none;
        margin: 50px 7% 3300px 7%;
        width:86%;
        margin-top: 20px;
    `}
  h2 {
    font-size: 18px;

    ${mq.maxWidth("md")`
        font-size: 16px;
        margin-top: 40px;
    `}
  }

  .faqTitle {
    margin-top: 60px;
  }
  .dropdownBox {
    width: 700px;

    ${mq.maxWidth("md")`
        width: 100%;
    `}

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
        h5 {
          font-weight: 400;
          font-size: 15px;
          line-height: 25px;
        }

        h4 {
          font-size: 15px;
          font-weight: 600;
        }
      }
    }
  }
`;

const FaqAccount = memo(() => {

  useEffect(() => {
    window.scrollTo(0,0);
  },[])
  /** 드롭다운 상태값 */
  const [dropdownStates, setDropdownStates] = useState({
    dropdown1: false,
    dropdown2: false,
    dropdown3: false,
    dropdown4: false,
    dropdown5: false,
    dropdown6: false,
    dropdown7: false,
    dropdown8: false,
    dropdown9: false,
    dropdown10: false,
    dropdown11: false,
    dropdown12: false,
    dropdown13: false,
    dropdown14: false,
    dropdown15: false,
    dropdown16: false,

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
          <NavLink to="/customer_service/faq">FAQ</NavLink>
          <NavLink to="/customer_service/contact">Contact</NavLink>
          <NavLink to="/customer_service/track_order">Track your order</NavLink>
        </div>
      </Navigator>
      <Box>
        <h2>Account</h2>
        <div className="dropdownBox">
          <div
            className="dropdownContainer"
            onClick={() => onClickDropdown("dropdown1")}
          >
            <div className="title">
              <h4
                style={{ fontWeight: dropdownStates.dropdown1 ? "600" : "400" }}
              >
                Can I change my ID and password?
              </h4>
              <h6 className="symbol">&gt;</h6>
            </div>
            <div
              className="content"
              style={{ height: dropdownStates.dropdown1 ? "120px" : "0" }}
            >
              <h5>
                Once you sign up , you cannot change your ID. However, you can
                close your account and register with a new ID. We would like to
                inform you that closing an account means you will lose all
                records of your purchases. Moreover, you may change your
                password under {"["}Account &gt; Account Edit &gt; Change
                Password{"]"}.
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
                How can I modify my account information?
              </h4>
              <h6 className="symbol">&gt;</h6>
            </div>
            <div
              className="content"
              style={{ height: dropdownStates.dropdown2 ? "100px" : "0" }}
            >
              <h5>
                You may edit the personal information under {"["}Account &gt;
                Edit &gt; Information &gt; Edit{"]"} and address information
                under {"["}Account &gt; Edit &gt; Address &gt; Edit{"]"}
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
              style={{ height: dropdownStates.dropdown3 ? "70px" : "0" }}
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
              style={{ height: dropdownStates.dropdown4 ? "70px" : "0" }}
            >
              <h5>
                Orders already created cannot be modified or moved to another
                account.
              </h5>
            </div>
          </div>
          <hr />
        </div>
        <h2 className="faqTitle">Order</h2>
        <div className="dropdownBox">
          <div
            className="dropdownContainer"
            onClick={() => onClickDropdown("dropdown5")}
          >
            <div className="title">
              <h4
                style={{ fontWeight: dropdownStates.dropdown5 ? "600" : "400" }}
              >
                Where can I check all the order details?
              </h4>
              <h6 className="symbol">&gt;</h6>
            </div>
            <div
              className="content"
              style={{ height: dropdownStates.dropdown5 ? "240px" : "0" }}
            >
              <h4>Member</h4>
              <h5>
                You can check order details through {"["}Login &gt; Account &gt;
                Order{"]"}.
              </h5>
              <h4>Non-member</h4>
              <h5>
                You can check order details through {"["}Account &gt; Track Your
                Order{"]"}
                <br />
                You can track your order with the email address used when you
                made a purchase.
              </h5>
            </div>
          </div>
          <hr />
        </div>
        <div
          className="dropdownBox"
          onClick={() => onClickDropdown("dropdown6")}
        >
          <div className="dropdownContainer">
            <div className="title">
              <h4
                style={{ fontWeight: dropdownStates.dropdown6 ? "600" : "400" }}
              >
                I would like to make a change in my order
              </h4>
              <h6 className="symbol">&gt;</h6>
            </div>
            <div
              className="content"
              style={{ height: dropdownStates.dropdown6 ? "200px" : "0" }}
            >
              <h5>
                Once the order already placed, you can not change the order
                information, Cancellations may only be requested at the status
                before “Order Preparation” and requests may be made at the {"["}
                Account &gt; Order details &gt; Order cancel{"]"}
              </h5>
              <h5>
                Please be mindful that cancellation is not possible once the
                shipping process has begun. From the stage of “Order Preparation”, order should be processed by return process after
                product receiving
              </h5>
            </div>
          </div>
          <hr />
        </div>
        <div
          className="dropdownBox"
          onClick={() => onClickDropdown("dropdown7")}
        >
          <div className="dropdownContainer">
            <div className="title">
              <h4
                style={{ fontWeight: dropdownStates.dropdown7 ? "600" : "400" }}
              >
                Can I buy only the frame except for the lens?
              </h4>
              <h6 className="symbol">&gt;</h6>
            </div>
            <div
              className="content"
              style={{ height: dropdownStates.dropdown7 ? "70px" : "0" }}
            >
              <h5>
                All products from UNICO are sold only as finished
                products.
              </h5>
            </div>
          </div>
          <hr />
        </div>
        <div
          className="dropdownBox"
          onClick={() => onClickDropdown("dropdown8")}
        >
          <div className="dropdownContainer">
            <div className="title">
              <h4
                style={{ fontWeight: dropdownStates.dropdown8 ? "600" : "400" }}
              >
                Can I get a shopping bag when I order?
              </h4>
              <h6 className="symbol">&gt;</h6>
            </div>
            <div
              className="content"
              style={{ height: dropdownStates.dropdown8 ? "80px" : "0" }}
            >
              <h5>
                Shopping bags are not included when purchasing online. But we
                offer you complimentary gift wrapping service for all online
                purchase
              </h5>
            </div>
          </div>
          <hr />
        </div>
        <h2 className="faqTitle">Payment</h2>
        <div
          className="dropdownBox"
          onClick={() => onClickDropdown("dropdown9")}
        >
          <div className="dropdownContainer">
            <div className="title">
              <h4
                style={{ fontWeight: dropdownStates.dropdown9 ? "600" : "400" }}
              >
                Can I split my payment between multiple credit cards?
              </h4>
              <h6 className="symbol">&gt;</h6>
            </div>
            <div
              className="content"
              style={{ height: dropdownStates.dropdown9 ? "70px" : "0" }}
            >
              <h5>You can only use one credit/debit card per order.</h5>
            </div>
          </div>
          <hr />
        </div>
        <div
          className="dropdownBox"
          onClick={() => onClickDropdown("dropdown10")}
        >
          <div className="dropdownContainer">
            <div className="title">
              <h4
                style={{
                  fontWeight: dropdownStates.dropdown10 ? "600" : "400",
                }}
              >
                I would like to change the payment method
              </h4>
              <h6 className="symbol">&gt;</h6>
            </div>
            <div
              className="content"
              style={{ height: dropdownStates.dropdown10 ? "80px" : "0" }}
            >
              <h5>
                [Account &gt; View all &gt; Click a Product &gt; Cancel Order]
                Please cancel and reorder with the payment method you want. You
                cannot cancel the payment from the stage of “Order Preparation”.
              </h5>
            </div>
          </div>
          <hr />
        </div>
        <div
          className="dropdownBox"
          onClick={() => onClickDropdown("dropdown11")}
        >
          <div className="dropdownContainer">
            <div className="title">
              <h4
                style={{
                  fontWeight: dropdownStates.dropdown11 ? "600" : "400",
                }}
              >
                When will the payment cancellation amount be deposited?
              </h4>
              <h6 className="symbol">&gt;</h6>
            </div>
            <div
              className="content"
              style={{ height: dropdownStates.dropdown11 ? "240px" : "0" }}
            >
              <h5>
                When you place an online order, the sum total of your order is
                pre-authorized by your credit card provider, meaning that amount
                is reserved for your order. You will see that the pre-authorized
                amount has been deducted from the available limit of your credit
                card, however your account will not be charged until your order
                has shipped.
              </h5>
              <h5>
                If you cancel your order before it ships, your account will not
                be charged and the pre-authorization is made void. Please note
                that the pre-authorization is valid for at least 7 days and the
                time it takes to release the pre-authorized amount depends on
                your bank.
              </h5>
            </div>
          </div>
          <hr />
        </div>
        <div
          className="dropdownBox"
          onClick={() => onClickDropdown("dropdown12")}
        >
          <div className="dropdownContainer">
            <div className="title">
              <h4
                style={{
                  fontWeight: dropdownStates.dropdown12 ? "600" : "400",
                }}
              >
                The payment has been completed, but the order is not available.
              </h4>
              <h6 className="symbol">&gt;</h6>
            </div>
            <div
              className="content"
              style={{ height: dropdownStates.dropdown12 ? "70px" : "0" }}
            >
              <h5>
                Please check if the name of the card you used for payment is
                your name.
              </h5>
            </div>
          </div>
          <hr />
        </div>
        <h2 className="faqTitle">Return & Cancel</h2>
        <div
          className="dropdownBox"
          onClick={() => onClickDropdown("dropdown13")}
        >
          <div className="dropdownContainer">
            <div className="title">
              <h4
                style={{
                  fontWeight: dropdownStates.dropdown13 ? "600" : "400",
                }}
              >
                I'd like to cancel my order before delivery.
              </h4>
              <h6 className="symbol">&gt;</h6>
            </div>
            <div
              className="content"
              style={{ height: dropdownStates.dropdown13 ? "80px" : "0" }}
            >
              <h5>
                Cancellation is possible in Order details. It is not possible to
                cancel the order from the 'Order Preparation' stage, and you can
                return the product after receiving it.
              </h5>
            </div>
          </div>
          <hr />
        </div>
        <div
          className="dropdownBox"
          onClick={() => onClickDropdown("dropdown14")}
        >
          <div className="dropdownContainer">
            <div className="title">
              <h4
                style={{
                  fontWeight: dropdownStates.dropdown14 ? "600" : "400",
                }}
              >
                How do I apply for a return?
              </h4>
              <h6 className="symbol">&gt;</h6>
            </div>
            <div
              className="content"
              style={{ height: dropdownStates.dropdown14 ? "490px" : "0" }}
            >
              <h4>How to return</h4>
              <h5>
                Please submit ‘return request’ at {"["}Account &gt; Order &gt;
                Order detail{"]"} on the UNICO website. Please arrange return
                pick-up and it must be paid by customer’s end. You can use any
                courier but, DHL is preferable.
              </h5>
              <h5>
                Please fill out ‘Return request form’ below and email to us
                junbeom.woo@gmail.com
              </h5>
              <h4>Return request form.</h4>
              <h5>
                Please send parcel to our warehouse : <br />- Street: <br />-
                Town: <br />
                - City: <br />- Province: <br />- Country: <br />- Postcode:
              </h5>
              <h5>
                When the product arrives at our warehouse, you will get a refund
                into your original payment method after inspection process is
                completed.
              </h5>
            </div>
          </div>
          <hr />
        </div>
        <div
          className="dropdownBox"
          onClick={() => onClickDropdown("dropdown15")}
        >
          <div className="dropdownContainer">
            <div className="title">
              <h4
                style={{
                  fontWeight: dropdownStates.dropdown15 ? "600" : "400",
                }}
              >
                I'd like to exchange products.
              </h4>
              <h6 className="symbol">&gt;</h6>
            </div>
            <div
              className="content"
              style={{ height: dropdownStates.dropdown15 ? "70px" : "0" }}
            >
              <h5>
                There is no exchange system in the online store, please return
                it and place an order again.
              </h5>
            </div>
          </div>
          <hr />
        </div>
        <div
          className="dropdownBox"
          onClick={() => onClickDropdown("dropdown16")}
        >
          <div className="dropdownContainer">
            <div className="title">
              <h4
                style={{
                  fontWeight: dropdownStates.dropdown16 ? "600" : "400",
                }}
              >
                I'm curious about the return fee.
              </h4>
              <h6 className="symbol">&gt;</h6>
            </div>
            <div
              className="content"
              style={{ height: dropdownStates.dropdown16 ? "80px" : "0" }}
            >
              <h5>
                You have to pay the shipping fee directly when you return it,
                and when the product arrives, we will refund the entire amount
                to original payment methods.
              </h5>
            </div>
          </div>
          <hr />
        </div>
      </Box>
    </>
  );
});

export default FaqAccount;
