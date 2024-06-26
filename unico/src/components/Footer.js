import React, { memo, useState, useEffect } from "react";

import styled from "styled-components";
import { Link } from "react-router-dom";
import { useCallback } from "react";

import Logo from "../assets/logo.png";
import mq from "../MediaQuery/MediaQuery";

const FooterBox = styled.footer`
  .container {
    display: flex;
    justify-content: space-between;
    height: 150px;
    margin: 0 60px 0 50px;

    ${mq.maxWidth("mlg")`
        display:block;
        height: auto; /* 자동으로 높이 계산 */
        margin-top: -50px;
      `}

    ${mq.maxWidth("sm")`
         margin: 0 30px 0 30px;
            `}


      
    img {
      width: auto;
      height: 200px;
      margin-top: 35px;

      ${mq.maxWidth("xxl")`
      height: 150px;
      width: auto;
      margin-top: 60px;
    `}

      ${mq.maxWidth("xl")`
      height: 100px;
      width: auto;
      margin-top: 75px;
    `}

      ${mq.maxWidth("mlg")`
        display:none
      `}

      &:hover {
        cursor: pointer;
      }
    }
    .Box {
      .flexBox {
        display: flex;
        margin-top: 90px;
        height: 100%;
        ${mq.maxWidth("mlg")`
            display:flex;
            justify-content: space-between;
        `}

        ${mq.maxWidth("sm")`
              display: block;
              margin: 30px 0;
            `}

        .category {
          display: flex;
          flex-direction: column;
          margin-right: 150px;
          transition: height 0.2s linear;

          ${mq.maxWidth("xl")`
            margin-right: 75px;
         `}
          ${mq.maxWidth("mlg")`
            margin-right: 0;
        `}

          ${mq.maxWidth("sm")`
              height: 20px;
              overflow: hidden;
              padding: 10px 0px;

              &:hover {
                cursor: pointer;
              }
            `}
          .title {
            display: flex;
            justify-content: space-between;
            .direction {
              transform: rotate(90deg);
            }
          }

          h5 {
            font-size: 13px;
            font-weight: 400;
            margin-bottom: -15px;

            &:hover {
              font-weight: 600;
            }
          }
        }

        .help {
          display: flex;
          flex-direction: column;
          margin-right: 150px;
          width: 70px;
          transition: height 0.2s linear;
          ${mq.maxWidth("xl")`
            margin-right: 75px;
         `}
          ${mq.maxWidth("mlg")`
            margin-right: 0px;
        `}
            ${mq.maxWidth("sm")`
              height: 20px;
              overflow: hidden;
              padding: 10px 0px;
              width: 100%;
              &:hover {
                cursor: pointer;
              }
        `}
          .title {
            display: flex;
            justify-content: space-between;
            .direction {
              transform: rotate(90deg);
            }
          }
        }
        h5 {
          font-size: 13px;
          font-weight: 400;
          margin-bottom: -15px;

          &:hover {
            font-weight: 600;
          }
        }

        .contact {
          display: flex;
          flex-direction: column;
          transition: height 0.2s linear;
          .title {
            display: flex;
            justify-content: space-between;
            .direction {
              transform: rotate(90deg);
            }
          }

          ${mq.maxWidth("sm")`
              height: 20px;
              overflow: hidden;
              padding: 10px 0px;
              &:hover {
                cursor: pointer;
              }
            `}

          h5 {
            font-size: 13px;
            font-weight: 400;
            margin-bottom: -15px;
          }
        }
      }
      h1 {
        font-size: 15px;
        font-weight: 700;
        margin-bottom: 0px;
      }
    }
  }
  .last {
    display: flex;
    justify-content: space-between;
    margin-top: 100px;
    margin: 80px 60px 0 60px;
    ${mq.maxWidth("mlg")`
        margin-top: 100px;
    `}

    ${mq.maxWidth("sm")`
         margin: 30px 30px 0 30px;
            `}

    h5 {
      font-size: 12px;
    }

    .logo {
      &:hover {
        cursor: pointer;
      }
    }
  }
`;

const Footer = memo(() => {
  /** 드롭다운 상태값 */
  const [dropdownStates, setDropdownStates] = useState({
    dropdown1: false,
    dropdown2: false,
    dropdown3: false,
  });
  /** 휴대폰 사이즈인지 확인하는 상태값 (600 이하라면 true 초과라면 fasle) */
  const [isPhoneSize, SetisPhoneSize] = useState(window.innerWidth <= 600);

  // 드롭다운 토글 함수
  const onClickDropdown = useCallback((dropdownKey) => {
    setDropdownStates((prevStates) => ({
      ...prevStates,
      [dropdownKey]: !prevStates[dropdownKey],
    }));
  }, []);

  // 맨위로 부드럽게 이동시키는 함수
  const scrollToTop = useCallback((e) => {
    e.preventDefault();
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }, []);

  // 창을 resize하기 위한 useEffect
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth <= 600) {
        SetisPhoneSize(true);
      } else {
        SetisPhoneSize(false);
      }
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <FooterBox>
      <div className="container">
        <img src={Logo} alt="logo" onClick={scrollToTop} />
        <div className="Box">
          <div className="flexBox">
            <div
              className="category"
              onClick={() => {
                if (isPhoneSize) {
                  onClickDropdown("dropdown1");
                }
              }}
              style={{ height: dropdownStates.dropdown1 ? "85px" : "20px" }}
            >
              <div className="title">
                <h1>CATEGORIES</h1>
                {isPhoneSize && <h1 className="direction">&gt;</h1>}
              </div>
              <h5>
                <Link to="/product/sunglasses">Sunglasses</Link>
              </h5>
              <h5>
                <Link to="/product/glasses">Glasses</Link>
              </h5>
            </div>
            {isPhoneSize && <hr />}
            <div
              className="help"
              onClick={() => {
                if (isPhoneSize) {
                  onClickDropdown("dropdown2");
                }
              }}
              style={{ height: dropdownStates.dropdown2 ? "100px" : "20px" }}
            >
              <div className="title">
                <h1>HELP</h1>
                {isPhoneSize && <h1 className="direction">&gt;</h1>}
              </div>
              <h5>
                <Link to="/customer_service/faq">FAQ</Link>
              </h5>
              <h5>
                <Link to="/customer_service/contact">Contact</Link>
              </h5>
              <h5>
                <Link to="customer_service/track_order">Track Order</Link>
              </h5>
            </div>
            {isPhoneSize && <hr />}
            <div className="contact"
                   onClick={() => {
                    if (isPhoneSize) {
                      onClickDropdown("dropdown3");
                    }
                  }}
                  style={{ height: dropdownStates.dropdown3 ? "100px" : "20px" }}>
              <div className="title">
                <h1>CONTACT</h1>
                {isPhoneSize && <h1 className="direction">&gt;</h1>}
              </div>
              <h5>TEL : +45 44 11 18 14</h5>
              <h5>FAX : +45 44 11 18 14</h5>
              <h5>junbeom2.woo@gmail.com</h5>
            </div>
            {isPhoneSize && <hr />}
          </div>
        </div>
      </div>
      <div className="last">
        <div className="logo">
          <h5>©2023 UNICO</h5>
        </div>
        <h5>Portfolio by Woo Jun Beom</h5>
      </div>
    </FooterBox>
  );
});

export default Footer;
