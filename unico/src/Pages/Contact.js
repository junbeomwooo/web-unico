import React, { memo, useEffect } from "react";
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
  left: 55%;
  top: 40%;
  transform: translate(-50%, -50%);
  width: 800px;
  height: 351.73px;
  padding-bottom: 200px;

  ${mq.maxWidth("xl")`
    width: 600px;
    `}

${mq.maxWidth("lg")`
    width: 500px;
    left: 60%;
    `}

  ${mq.maxWidth("md")`
        position: static;
        display:block;
        transform: none;
        top: none;
        margin: 50px 8% 200px 8%;
        width:86%;
        margin-bottom: 300px;
    `}
    
  hr {
    border: 0.5px solid #E0E0E0;
    margin: 30px 0;
  }
  div {
    h1 {
      font-size: 18px;
      margin-bottom:30px;
    }

    h4 {
      font-size: 14px;
      font-weight: 400;
      letter-spacing: 0.3px;
      line-height: 25px;
    }
  }
`;
const Contact = memo(() => {
  useEffect(() => {
    window.scrollTo(0,0);
  },[])
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
        <div className="generalInquiry">
          <h1>General Inquiry</h1>
          <h4>
            If you have any questions or need further assistance, please contact
            us your convenient methods. Please refer category of FAQ for more details.
          </h4>
          <h4>
            Online Customer Service Hours of Operation
            <br />
            Monday - Friday: 9:30am - 5pm&ensp;KST
          </h4>
        </div>
        <hr />
        <div className="phone">
            <h1>Phone</h1>
            <h4>For product information and online purchase call us at 0000-0000, our customer advisor will be happy to assist you. </h4>
        </div>
        <hr />
        <div className="email">
            <h1>Email</h1>
            <h4>Pleases send us details and contact information we will reach you within two business days. </h4>
            <h4>
                Email : junbeom2.woo@gmail.com
            </h4>
        </div>
      </Box>
    </>
  );
});

export default Contact;
