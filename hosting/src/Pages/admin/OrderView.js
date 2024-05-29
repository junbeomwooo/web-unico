import React, { memo, useCallback, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import styled from "styled-components";
import Spinner from "../../components/Spinner";
import { useDispatch, useSelector } from "react-redux";
import { getItemParams } from "../../slices/OrderDetailSlice";
import { guestGetItemParams } from "../../slices/GuestOrderDetailSlice";
import ErrorView from "../../components/ErrorView";

const Container = styled.div`
  padding: 30px 50px;
  box-sizing: border-box;
  width: 85%;
  height: 1200px;

  hr {
    border: 0.5px solid #212b34;
    margin-top: 20px;
  }

  .header {
    display: flex;
    justify-content: center;
    margin: 10px 0;
    h1 {
      font-size: 28px;
      font-weight: 700;
      color: #212b34;
    }
  }
  .box {
    display: flex;
    justify-content: space-between;
    .order {
      width: 50%;
      margin-top: 80px;
      margin-left: 80px;
      margin-right: 40px;

      h4 {
        font-size: 14px;
        margin-right: 40px;
        font-weight: 400;
      }

      h5 {
        font-size: 14px;
        font-weight: 300;
      }
    }

    .info {
      .email,
      .name,
      .gender,
      .phonenumber {
        margin-top: -25px;
        display: flex;
        justify-content: space-between;
        align-items: center;
      }

      h1 {
        font-size: 18px;
        font-weight: 700;
        margin-bottom: 30px;
      }
    }

    .place {
      .address,
      .city,
      .zipcode,
      .province,
      .country {
        margin-top: -25px;
        display: flex;
        justify-content: space-between;
        align-items: center;
      }

      h1 {
        font-size: 18px;
        font-weight: 700;
        margin-bottom: 30px;
        margin-top: 30px;
      }
    }

    .address {
    }

    .payment {
      .tprice,
      .quantity,
      .status,
      .payment_method,
      .order_date {
        margin-top: -25px;
        display: flex;
        justify-content: space-between;
        align-items: center;
      }

      h1 {
        margin-top: 30px;
        font-size: 18px;
        font-weight: 700;
        margin-bottom: 30px;
      }
    }

    .product {
      width: 30%;
      margin-top: 80px;
      margin-right: 40px;
      margin-left: 40px;

      .container {
        hr {
          color: #e0e0e0;
          background-color: none;
          opacity: 30%;
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
    }
  }

  .buttons {
    margin-top: 100px;
    margin-left: 33.5%;

    button {
      width: 450px;
      height: 45px;
      border: 1px solid black;
      background-color: black;
      color: white;

      &:hover {
        cursor: pointer;
      }
    }
  }
`;

const OrderView = memo(() => {
  /** 파라미터 받기 */
  const { orderno } = useParams();

  /** 리덕스 초기화 */
  const dispatch = useDispatch();
  const { data, loading, error, productDetails } = useSelector(
    (state) => state.OrderDetailSlice
  );

  const {
    data: guestData,
    loading: guestLoading,
    error: guestError,
    productDetails: guestProductDetails,
  } = useSelector((state) => state.GuestOrderDetailSlice);

  /** 강제 이동 함수 생성 */
  const navigate = useNavigate();

  //쿼리 스트링 가져온 후 멤버 주문인 지 아닌 지 판별
  const isMember = new URLSearchParams(window.location.search).get("member");

  /** 렌더링 시 실행 */
  useEffect(() => {
    window.scrollTo(0, 0);

    // 쿼리스트링을 통해 멤버 계정을 상세 조회하는지 안하는지 판별 후 dispatch
    if (isMember === "true") {
      dispatch(
        getItemParams({
          orderno: orderno,
        })
      );
    } else if (isMember === "false") {
      dispatch(
        guestGetItemParams({
          orderno: orderno,
        })
      );
    }
  }, []);

  console.log(isMember);

  /** 일반 이벤트 */
  //   뒤로가기
  const moveToBack = useCallback((e) => {
    e.preventDefault();
    navigate("/admin/order_management");
  });
  return (
    <>
      <Spinner loading={loading || guestLoading} />
      {error || guestError ? (
        <ErrorView error={error || guestError} />
      ) : (
        <Container>
          <div className="header">
            <h1>Order Management</h1>
          </div>
          <hr />
          <div className="box">
            <div className="order">
              <div className="info">
                <h1>Info</h1>
                <div className="email">
                  <h4>Email</h4>
                  <h5>{data?.email}</h5>
                </div>
                <div className="name">
                  <h4>Name</h4>
                  <h5>{data?.name}</h5>
                </div>
                <div className="gender">
                  <h4>Gender</h4>
                  <h5>
                    {data?.gender === "M"
                      ? "Male"
                      : data?.gender === "F"
                      ? "Female"
                      : "Others"}
                  </h5>
                </div>
                <div className="phonenumber">
                  <h4>Phone Number</h4>
                  <h5>{data?.phonenumber}</h5>
                </div>
              </div>
              <div className="place">
                <h1>Address</h1>
                <div className="address">
                  <h4>Address</h4>
                  <h5>{data?.address}</h5>
                </div>
                <div className="city">
                  <h4>City</h4>
                  <h5>{data?.city}</h5>
                </div>
                <div className="zipcode">
                  <h4>Zipcode</h4>
                  <h5>{data?.zipcode}</h5>
                </div>
                <div className="province">
                  <h4>Province</h4>
                  <h5>{data?.province}</h5>
                </div>
                <div className="country">
                  <h4>Country</h4>
                  <h5>{data?.country}</h5>
                </div>
              </div>
              <div className="payment">
                <h1>Payment</h1>
                <div className="tprice">
                  <h4>Total Price</h4>
                  <h5>{data?.tprice}</h5>
                </div>
                <div className="quantity">
                  <h4>Quantity</h4>
                  <h5>{data?.quantity}</h5>
                </div>
                <div className="status">
                  <h4>Status</h4>
                  <h5>{data?.status}</h5>
                </div>
                <div className="payment_method">
                  <h4>Payment Method</h4>
                  <h5>{data?.payment_method}</h5>
                </div>
                <div className="order_date">
                  <h4>Order Date</h4>
                  <h5>{data?.order_date?.substring(0, 10)}</h5>
                </div>
              </div>
            </div>
            <div className="product">
              <div className="container">
                <div className="subject">
                  <h1>Product</h1>
                </div>
                <div className="subSubject">
                  <h3>Item</h3>
                  <h3>Price</h3>
                </div>

                <div className="productBox">
                  <img src={productDetails?.img1} alt={productDetails?.title} />
                  <div className="productInfo">
                    <div className="nameAndPrice">
                      <h2>{productDetails?.title}</h2>
                      <h4>${data?.tprice}</h4>
                    </div>
                    <h4>Quantity:{data?.quantity}</h4>
                    <h4>{data?.status}</h4>
                  </div>
                </div>
                <hr />
                <div className="priceDetail">
                  <div className="itemTotal">
                    <h4>Total</h4>
                    <h4>${data?.tprice}</h4>
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
                    <h4>${data?.tprice}</h4>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="buttons">
            <button onClick={moveToBack}>Back</button>
          </div>
        </Container>
      )}
    </>
  );
});

export default OrderView;
