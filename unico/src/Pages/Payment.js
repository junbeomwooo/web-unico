import React, { memo, useState, useCallback, useEffect } from "react";
import styled from "styled-components";
import { useSelector, useDispatch } from "react-redux";
import Spinner from "../components/Spinner";
import ErrorView from "../components/ErrorView";
import { useNavigate } from "react-router-dom";
import mq from "../MediaQuery/MediaQuery";

import { loginCheck } from "../slices/MemberSlice";
import { getList } from "../slices/CartSlice";
import { getHoldingItem } from "../slices/OrderDetailSlice";
import { postItem } from "../slices/OrderDetailSlice";

import { guestGetList } from "../slices/GuestCartSlice";
import { guestGetHoldingItem } from "../slices/GuestOrderDetailSlice";
import { guestPostItem } from "../slices/GuestOrderDetailSlice";

const Container = styled.form`
  padding-top: 180px;
  width: 450px;
  margin: auto;
  margin-bottom: 200px;

  ${mq.maxWidth("xsm")`
       width: 300px;
    `}

  .payment {
    h1 {
      font-size: 16.5px;
      margin-bottom: 35px;
    }

    h4 {
      font-size: 14px;
      font-weight: 400;
    }

    .labels {
      display: flex;
      flex-direction: column;

      label {
        font-size: 14px;
        margin-bottom: 10px;
      }

      h4 {
        position: absolute;
        color: red;
        top: 345px;
        margin-left: 3px;
        font-size: 13px;
      }
    }
  }

  .orderDetail {
    margin-top: 50px;
    h1 {
      font-size: 16.5px;
      margin-bottom: 35px;
    }
    h3 {
      font-size: 14.5px;
    }

    h4 {
      font-size: 12px;
      font-weight: 400;
    }

    .shipping {
      margin-top: 45px;
      display: flex;
      justify-content: space-between;

      button {
        border: none;
        background-color: #f4f3f2;
        text-decoration: underline;
        &:hover {
          cursor: pointer;
        }
      }
    }

    .shippingBox {
      display: flex;
      justify-content: space-between;

      h5 {
        margin-bottom: 14px;
        font-weight: 600;
        font-size: 13px;
      }

      h4 {
        margin-top: 5px;
        margin-bottom: 0px;
      }
    }

    .checkBox {
      margin-top: 30px;
      margin-bottom: 30px;

      label {
        width: 400px;
        display: flex;

        ${mq.maxWidth("xsm")`
       width: 300px;
    `}

        h4 {
          font-size: 14px;
          width: 372px;

          ${mq.maxWidth("xsm")`
       width: 272px;
       margin:0;
       font-size: 12px;
    `}
        }

        input {
          margin: 0;
          margin-right: 15px;
        }
      }
    }

    .buttons {
      display: flex;
      justify-content: space-between;
      button {
        width: 190px;
        height: 40px;
        border: none;
        background-color: black;
        color: white;

        ${mq.maxWidth("xsm")`
       width: 140px;
    `}

        &:first-child {
          background-color: white;
          color: black;
          border: 1px solid black;
        }

        &:hover {
          cursor: pointer;
        }
      }
    }
  }
`;

const ProductContainer = styled.div`
  position: absolute;
  width: 350px;
  top: 180px;
  right: 130px;
  ${mq.maxWidth("xxxl")`
    position: static;
    margin: auto;
    width: 450px;
    margin-top: -150px;
    margin-bottom: 150px;
  `}

${mq.maxWidth("xsm")`
       width: 300px;
    `}

  .container {
    hr {
      color: #e0e0e0;
      background-color: none;
      opacity: 40%;
      margin-top: 18px;
    }
    .subject {
      display: flex;
      justify-content: space-between;

      h1 {
        font-size: 18px;
        font-weight: 600;
        margin-bottom: 20px;
      }

      button {
        border: none;
        margin-bottom: 30px;
        background-color: #f4f3f2;
        text-decoration: underline;

        &:hover {
          cursor: pointer;
        }
      }
    }

    .subSubject {
      display: flex;
      justify-content: space-between;

      h3 {
        font-size: 15px;
        font-weight: 400;
        margin: 0;
      }
    }

    .productBox {
      display: flex;
      margin-top: 15px;

      img {
        width: 100px;
        height: 100px;
      }

      .productInfo {
        width: 100%;

        h4 {
          font-size: 14px;
          font-weight: 400;
          margin: 15px 0 0 15px;
        }

        .nameAndPrice {
          display: flex;
          justify-content: space-between;
          h2 {
            font-size: 16px;
            margin: 0 0 0 15px;
          }

          h4 {
            font-size: 14px;
            font-weight: 400;
            margin: 0;
          }
        }
      }
    }

    .priceDetail {
      width: 100%;

      h4 {
        font-size: 14px;
        font-weight: 400;
        margin: 10px 0 0 0;
      }

      h3 {
        font-size: 14px;
        font-weight: 600;
        margin: 10px 0 0 0;
      }
      .itemTotal {
        display: flex;
        justify-content: space-between;
      }

      .shippingTax {
        display: flex;
        justify-content: space-between;
      }

      .duties {
        display: flex;
        justify-content: space-between;
      }

      .total {
        display: flex;
        justify-content: space-between;
      }
    }
  }
`;

const Payment = memo(() => {
  /** 리덕스 관련 초기화 */
  const dispatch = useDispatch();

  // 로그인 확인 여부를 위한 값
  const { isLoggedIn } = useSelector((state) => state.MemberSlice);

  // 로그인 중일 경우 불러온 값들
  const {
    data: cartData,
    productDetails,
    loading,
    error,
  } = useSelector((state) => state.CartSlice);

  const { data: orderData } = useSelector((state) => state.OrderDetailSlice);

  // 비로그인 중일 경우 불러온 값들
  const {
    data: guestCartData,
    productDetails: guestProductDetails,
    loading: guestLoading,
    error: guestError,
  } = useSelector((state) => state.GuestCartSlice);

  const { data: guestOrderData } = useSelector(
    (state) => state.GuestOrderDetailSlice
  );

  /** 강제 이동 함수 생성 */
  const navigate = useNavigate();

  /** 페이지 렌더링 시 실행 */
  useEffect(() => {
    window.scrollTo(0, 0);
    dispatch(loginCheck()).then((response) => {
      if (isLoggedIn === true) {
        dispatch(getHoldingItem()); // 오더리스트 홀딩 세션
        dispatch(getList()); // 카트
      } else if (isLoggedIn === false) {
        dispatch(guestGetHoldingItem());
        dispatch(guestGetList());
      }
    });
  }, []);

  console.log(isLoggedIn);

  /** label 관련 이벤트 */

  // label 상태값
  const [selectedPayment, setSelectedPayment] = useState(null);

  // label 변경 시 이벤트
  const handlePaymentChange = useCallback((e) => {
    setSelectedPayment(e.target.value);
  });

  /** 이벤트 */

  // checkbox 상태값
  const [checkBoxchecked, setCheckBoxChecked] = useState(false);

  // 체크박스 이벤트
  const onChangeCheckBox = useCallback((e) => {
    setCheckBoxChecked(!checkBoxchecked);
  });

  // 주소입력창으로 이동
  const onClickMoveToShipping = useCallback((e) => {
    e.preventDefault();
    navigate("/checkout_shipping");
  });

  // 카트페이지로 이동
  const moveToCart = useCallback((e) => {
    navigate("/member/cart");
  });

  // 결제하기 버튼
  const onSubmitForm = useCallback((e) => {
    e.preventDefault();

    // 결제 방식이 선택 안되었거나 선택이 불가능한 방식을 선택했을 경우
    if (selectedPayment === "card" || selectedPayment === "paypal") {
      window.alert("Please select other payment method.");
      return;
    }

    if (selectedPayment === null || selectedPayment === "") {
      window.alert("Please select your payment method.");
      return;
    }

    if (checkBoxchecked !== true) {
      window.alert("Please agree with the terms and conditions.");
      return;
    }

    // 로그인 중일 경우
    if (isLoggedIn === true) {
      // 계좌송금을 통한 결제 방식일 경우
      if (selectedPayment === "transfer") {
        dispatch(
          postItem({
            status: "Payment Verification", // Payment Verification
            payment_method: selectedPayment,
          })
        ).then((response) => {
          if (response.payload.rtcode === 200) {
            navigate("/confirm_payment");
          }
        });
      }
      // 비로그인 중일 경우
    } else if (isLoggedIn === false) {
      // 계좌송금을 통한 결제 방식일 경우
      if (selectedPayment === "transfer") {
        dispatch(
          guestPostItem({
            status: "Payment Verification", // Payment Verification
            payment_method: selectedPayment,
          })
        ).then((response) => {
          if (response.payload.rtcode === 200) {
            navigate("/confirm_payment");
          }
        });
      }
    }
  });

  return (
    <>
      <Spinner loading={isLoggedIn === true ? loading : guestLoading} />
      {error ? (
        <ErrorView error={isLoggedIn === true ? error : guestError} />
      ) : // 로그인 중일경우
      isLoggedIn === true ? (
        orderData && (
          <>
            <Container onSubmit={onSubmitForm}>
              <div className="payment">
                <h1>Payment Method</h1>
                <h4>Select a payment method.</h4>
                <div className="labels">
                  <label>
                    <input
                      type="radio"
                      value="card"
                      checked={selectedPayment === "card"}
                      onChange={handlePaymentChange}
                    />
                    &ensp;Debit/Credit card
                  </label>
                  <label>
                    <input
                      type="radio"
                      value="paypal"
                      checked={selectedPayment === "paypal"}
                      onChange={handlePaymentChange}
                    />
                    &ensp;Paypal
                  </label>
                  <label>
                    <input
                      type="radio"
                      value="transfer"
                      checked={selectedPayment === "transfer"}
                      onChange={handlePaymentChange}
                    />
                    &ensp;Bank Transfer
                  </label>
                  {selectedPayment !== "transfer" &&
                    selectedPayment !== null && (
                      <h4>This payment method is currently unavailable.</h4>
                    )}
                </div>
              </div>
              <div className="orderDetail">
                <h1>Information</h1>
                <h3>Email</h3>
                <h4>{orderData[0]?.email}</h4>
                <div className="shipping">
                  <h3>Shipping</h3>
                  <button onClick={onClickMoveToShipping}>Edit</button>
                </div>
                <div className="shippingBox">
                  <div className="shippingAddress">
                    <h5>Address</h5>
                    <h4>{orderData[0]?.address}</h4>
                    <h4>{orderData[0]?.city}</h4>
                    <h4>{orderData[0]?.province}</h4>
                    <h4>{orderData[0]?.country}</h4>
                  </div>
                  <div className="Billing Address">
                    <h5>information</h5>
                    <h4>{orderData[0]?.email}</h4>
                    <h4>{orderData[0]?.name}</h4>
                    <h4>{orderData[0]?.phonenumber}</h4>
                  </div>
                </div>
                <div className="checkBox">
                  <label>
                    <input
                      type="checkbox"
                      checked={checkBoxchecked}
                      onChange={onChangeCheckBox}
                    ></input>
                    <h4>
                      Please check if you agree to the terms, conditions, and
                      the collection and use of personal information.
                    </h4>
                  </label>
                </div>
                <div className="buttons">
                  <button onClick={onClickMoveToShipping}>Previous</button>
                  <button type="submit">Purchase</button>
                </div>
              </div>
            </Container>
            <ProductContainer>
              <div className="container">
                <div className="subject">
                  <h1>Order Detail</h1>
                  <button onClick={moveToCart}>Edit</button>
                </div>
                <div className="subSubject">
                  <h3>Item</h3>
                  <h3>Price</h3>
                </div>
                {productDetails.length > 0 ? (
                  productDetails.map((v, i) => {
                    // 배열로 구성되어있으므로 product_prodno과 prodno가 같은 걸 찾아서 수량값만 빼오기 (cartDate의 수량, 가격 값을 수정하기 위해)
                    const cartInfo =
                      cartData &&
                      Array.isArray(cartData) &&
                      cartData.find((item) => item.product_prodno === v.prodno);

                    return (
                      <div className="productBox" key={i}>
                        <img src={v.img1} alt={v.title} />
                        <div className="productInfo">
                          <div className="nameAndPrice">
                            <h2>{v.title}</h2>
                            <h4>${cartInfo?.tprice}</h4>
                          </div>
                          <h4>Quantity:{cartInfo?.quantity}</h4>
                          <h4>Duty not included</h4>
                        </div>
                      </div>
                    );
                  })
                ) : (
                  <h3>No Product in my order list.</h3>
                )}

                <hr />
                <div className="priceDetail">
                  <div className="itemTotal">
                    <h4>Total</h4>
                    <h4>
                      $
                      {Array.isArray(cartData) &&
                        cartData.reduce((total, item) => {
                          return total + item.tprice;
                        }, 0)}
                    </h4>
                  </div>
                  <div className="shippingTax">
                    <h4>Shipping&Tax</h4>
                    <h4>$0</h4>
                  </div>
                  <div className="duties">
                    <h3>Duties</h3>
                    <h3>Excluded</h3>
                  </div>
                  <hr />
                  <div className="total">
                    <h4>Total</h4>
                    <h4>
                      $
                      {Array.isArray(cartData) &&
                        cartData.reduce((total, item) => {
                          return total + item.tprice;
                        }, 0)}
                    </h4>
                  </div>
                </div>
              </div>
            </ProductContainer>
          </>
        )
      ) : (
        // 비로그인 상태일 경우
        guestOrderData && (
          <>
            <Container onSubmit={onSubmitForm}>
              <div className="payment">
                <h1>Payment Method</h1>
                <h4>Select a payment method.</h4>
                <div className="labels">
                  <label>
                    <input
                      type="radio"
                      value="card"
                      checked={selectedPayment === "card"}
                      onChange={handlePaymentChange}
                    />
                    &ensp;Debit/Credit card
                  </label>
                  <label>
                    <input
                      type="radio"
                      value="paypal"
                      checked={selectedPayment === "paypal"}
                      onChange={handlePaymentChange}
                    />
                    &ensp;Paypal
                  </label>
                  <label>
                    <input
                      type="radio"
                      value="transfer"
                      checked={selectedPayment === "transfer"}
                      onChange={handlePaymentChange}
                    />
                    &ensp;Bank Transfer
                  </label>
                  {selectedPayment !== "transfer" &&
                    selectedPayment !== null && (
                      <h4>This payment method is currently unavailable.</h4>
                    )}
                </div>
              </div>
              <div className="orderDetail">
                <h1>Information</h1>
                <h3>Email</h3>
                <h4>{guestOrderData[0]?.email}</h4>
                <div className="shipping">
                  <h3>Shipping</h3>
                  <button onClick={onClickMoveToShipping}>Edit</button>
                </div>
                <div className="shippingBox">
                  <div className="shippingAddress">
                    <h5>Address</h5>
                    <h4>{guestOrderData[0]?.address}</h4>
                    <h4>{guestOrderData[0]?.city}</h4>
                    <h4>{guestOrderData[0]?.province}</h4>
                    <h4>{guestOrderData[0]?.country}</h4>
                  </div>
                  <div className="Billing Address">
                    <h5>information</h5>
                    <h4>{guestOrderData[0]?.email}</h4>
                    <h4>{guestOrderData[0]?.name}</h4>
                    <h4>{guestOrderData[0]?.phonenumber}</h4>
                  </div>
                </div>
                <div className="checkBox">
                  <label>
                    <input
                      type="checkbox"
                      checked={checkBoxchecked}
                      onChange={onChangeCheckBox}
                    ></input>
                    <h4>
                      Please check if you agree to the terms, conditions, and
                      the collection and use of personal information.
                    </h4>
                  </label>
                </div>
                <div className="buttons">
                  <button onClick={onClickMoveToShipping}>Previous</button>
                  <button type="submit">Purchase</button>
                </div>
              </div>
            </Container>
            <ProductContainer>
              <div className="container">
                <div className="subject">
                  <h1>Order Detail</h1>
                  <button onClick={moveToCart}>Edit</button>
                </div>
                <div className="subSubject">
                  <h3>Item</h3>
                  <h3>Price</h3>
                </div>
                {guestProductDetails.length > 0 ? (
                  guestProductDetails.map((v, i) => {
                    // 배열로 구성되어있으므로 product_prodno과 prodno가 같은 걸 찾아서 수량값만 빼오기 (cartDate의 수량, 가격 값을 수정하기 위해)
                    const guestCartInfo =
                      guestCartData &&
                      Array.isArray(guestCartData) &&
                      guestCartData.find(
                        (item) => item.product_prodno === v.prodno
                      );

                    return (
                      <div className="productBox" key={i}>
                        <img src={v.img1} alt={v.title} />
                        <div className="productInfo">
                          <div className="nameAndPrice">
                            <h2>{v.title}</h2>
                            <h4>${guestCartInfo?.tprice}</h4>
                          </div>
                          <h4>Quantity:{guestCartInfo?.quantity}</h4>
                          <h4>Duty not included</h4>
                        </div>
                      </div>
                    );
                  })
                ) : (
                  <h3>No Product in my order list.</h3>
                )}

                <hr />
                <div className="priceDetail">
                  <div className="itemTotal">
                    <h4>Total</h4>
                    <h4>
                      $
                      {Array.isArray(guestCartData) &&
                        guestCartData.reduce((total, item) => {
                          return total + item.tprice;
                        }, 0)}
                    </h4>
                  </div>
                  <div className="shippingTax">
                    <h4>Shipping&Tax</h4>
                    <h4>$0</h4>
                  </div>
                  <div className="duties">
                    <h3>Duties</h3>
                    <h3>Excluded</h3>
                  </div>
                  <hr />
                  <div className="total">
                    <h4>Total</h4>
                    <h4>
                      $
                      {Array.isArray(guestCartData) &&
                        guestCartData.reduce((total, item) => {
                          return total + item.tprice;
                        }, 0)}
                    </h4>
                  </div>
                </div>
              </div>
            </ProductContainer>
          </>
        )
      )}
    </>
  );
});

export default Payment;
