import React, { memo, useCallback, useEffect, useState } from "react";

import ReactPlayer from "react-player";
import { styled } from "styled-components";
import { useSelector, useDispatch } from "react-redux";
import { updateColor } from "../slices/fontColorReducer";

import maison from "../assets/maison.png";

import Header from "../components/Header";
import Main3 from "../assets/mainpage/3.avif";
import Main4 from "../assets/mainpage/4.avif";
import MobileMain1 from "../assets/mainpage/mobile1.jpg";
import MobileMain2 from "../assets/mainpage/mobile2.jpg";
import MobileMain3 from "../assets/mainpage/mobile3.jpg";
import MobileMain4 from "../assets/mainpage/mobile4.jpg";
import mq from "../MediaQuery/MediaQuery.js";
import Spinner from "../components/Spinner.js";

const Main = styled.div`
  div {
    display: flex;
    flex-wrap: wrap;

    .Container {
      position: relative;
      width: 100%;
      height: 100%;
      object-fit: cover;

      .video {
        ${mq.maxWidth("sm")`
            display: none;
        `}
      }

      .textContainer {
        position: absolute;
        top: 85%;
        left: 50%;
        transform: translate(-50%, -50%);
        display: flex;
        flex-direction: column;
        text-align: center;
        width: 100%;

        p {
          font-size: 17px;
          margin-bottom: 5px;
          font-weight: 400;

          ${mq.maxWidth("lg")`
                        font-size: 12px;
                    `}

          ${mq.maxWidth("sm")`
                        font-size: 11px;
                    `}
        }
        h1 {
          margin: 0;
          font-weight: bold;
          font-size: 25px;
          margin-bottom: 15px;

          ${mq.maxWidth("lg")`
                        font-size: 20px;
                    `}

          ${mq.maxWidth("sm")`
                        font-size: 15px;
                        margin-bottom: 10px;
                    `}
        }

        .buttons {
          display: flex;
          justify-content: center;

          button {
            width: 165px;
            height: 45px;
            border: 1px solid black;
            background: none;
            font-weight: 500;
            transition: background-color 0.5s ease;
            margin: 0 8px;

            ${mq.maxWidth("lg")`
                        width: 145px;
                        height: 40px;
                    `}

            ${mq.maxWidth("md")`
                        width: 125px;
                        height: 40px;
                        margin-bottom: 40px;
                    `}

                    ${mq.maxWidth("sm")`
                        font-size: 11px;
                        height: 35px;
                    `}

                        &:hover {
              cursor: pointer;
              background-color: black;
              color: white;
            }
          }
        }
      }

      .whiteTextContainer {
        position: absolute;
        top: 85%;
        left: 50%;
        transform: translate(-50%, -50%);
        display: flex;
        flex-direction: column;
        text-align: center;
        width: 100%;
        z-index: 1;

        p {
          font-size: 17px;
          margin-bottom: 5px;
          font-weight: 400;
          color: white;

          ${mq.maxWidth("lg")`
                        font-size: 12px;
                    `}

          ${mq.maxWidth("sm")`
                        font-size: 11px;
                    `}
        }
        h1 {
          margin-top: 0;
          font-weight: bold;
          font-size: 25px;
          margin-bottom: 15px;
          color: white;

          ${mq.maxWidth("lg")`
                        font-size: 20px;
                    `}

          ${mq.maxWidth("sm")`
                        font-size: 15px;
                        margin-bottom: 10px;
                    `}
        }

        .buttons {
          display: flex;
          justify-content: center;
          button {
            width: 165px;
            height: 45px;
            border: 1px solid white;
            background: none;
            font-weight: 500;
            transition: background-color 0.5s ease;
            margin: 0 8px;
            color: white;

            ${mq.maxWidth("lg")`
                        width: 145px;
                        height: 40px;
                    `}

            ${mq.maxWidth("md")`
                        width: 125px;
                        height: 40px;
                        margin-bottom: 40px;
                    `}

                    ${mq.maxWidth("sm")`
                        font-size: 11px;
                        height: 35px;
                    `}

                        &:hover {
              cursor: pointer;
              background-color: white;
              color: black;
            }
          }
        }
      }

      img {
        width: 100%;
        height: auto;
        margin: 0;
        vertical-align: bottom;
      }

      .logoBox {
        position: absolute;
        top: 85%;
        left: 50%;
        transform: translate(-50%, -50%);
        display: flex;
        flex-direction: column;
        width: 100%;

        .logoContainer {
          display: flex;
          justify-content: center;
          margin-bottom: 20px;

          img {
            max-width: 200px;
            height: auto;
            object-fit: contain;

            ${mq.maxWidth("md")`
                        width: 150px;
                    `}

            ${mq.maxWidth("md")`
                        width: 140px;
                    `}
          }
          h2 {
            font-size: 20px;
            color: #ffff;
            font-weight: normal;
            margin: 9px 0 0 15px;

            ${mq.maxWidth("md")`
                            font-size:18px;
                        `}

            ${mq.maxWidth("md")`
                            font-size:15px;
                            margin: 9px 0 0 7px;
                    `}
          }

          h1 {
            color: #ffff;
            font-size: 25px;
            font-weight: bold;
            margin: 9px 0 20px 15px;
            letter-spacing: 1.5px;
            ${mq.maxWidth("md")`
                            font-size:20px;
                        `}

            ${mq.maxWidth("md")`
                            font-size:17px;
                            margin: 9px 0 20px 7px;
                    `}
          }
        }

        .buttons {
          display: flex;
          justify-content: center;
          button {
            display: block;
            width: 165px;
            height: 40px;
            border: none;
            border-radius: 7px;
            background-color: #ffff;
            opacity: 65%;
            font-weight: 500;
            transition: opacity 0.5s ease;
            margin: 0 8px;

            ${mq.maxWidth("md")`
                                width: 120px;
                                height: 38px;
                                margin-bottom: 40px;
                            `}

            ${mq.maxWidth("sm")`
                        font-size: 11px;
                        height: 35px;
                            `}


                            &:hover {
              cursor: pointer;
              background-color: #ffff;
              opacity: 90%;
            }
          }
        }
      }
    }
  }
`;
const MainPage = memo(() => {
  /** 윈도우 사이즈에 따라 동셩상,이미지 url 변경 상태값 */
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 650);

  const { fontcolor } = useSelector((state) => state.colorReducer);
  const dispatch = useDispatch();

  /** 스크롤 이벤트 */
  const handleScroll = useCallback(() => {
    // 내 현재 스크롤 위치 가져오기
    const scrollPosition = window.scrollY;

    // 각 돔요소 스크롤 위치 가져오기
    const element1 = document.getElementById("firstContainer");
    const element2 = document.getElementById("secondContainer");
    const element3 = document.getElementById("thirdContainer");
    const element4 = document.getElementById("forthContainer");

    // 모든 요소가 존재하는지 확인
    if (
      element1 &&
      element1?.offsetHeight &&
      element2 &&
      element2?.offsetHeight &&
      element3 &&
      element3?.offsetHeight &&
      element4 &&
      element4?.offsetHeight
    ) {
      // 스크롤 위치에 따른 폰트 색상 업데이트
      if (scrollPosition <= element1?.offsetHeight) {
        dispatch(updateColor("#000000"));
      } else if (
        scrollPosition <=
        element1?.offsetHeight + element2?.offsetHeight
      ) {
        dispatch(updateColor("#ffffff"));
      } else if (
        scrollPosition <=
        element1?.offsetHeight + element2?.offsetHeight + element3?.offsetHeight
      ) {
        dispatch(updateColor("#000000"));
      } else if (
        scrollPosition <=
        element1?.offsetHeight +
          element2?.offsetHeight +
          element3?.offsetHeight +
          element4?.offsetHeight
      ) {
        dispatch(updateColor("#ffffff"));
      }
    }
  }, [dispatch]);

  /** 윈도우 사이즈에 따라 동영상 사진 변경*/
  const handleResize = useCallback(() => {
    setIsMobile(window.innerWidth <= 650);
  }, []);

  useEffect(() => {
    handleResize(); // 초기 켜졌을떄 윈도우 크기 확인
    window.scrollTo(0, 0);
    window.addEventListener("scroll", handleScroll);
    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleResize);
    };
  }, [handleScroll, handleResize]);

  return (
    <>
      <Header fontcolor={fontcolor} />
      {isMobile === null ? (
        <Spinner loading={true} />
      ) : (
        <Main>
          <div>
            <div className="Container" id="firstContainer">
              {isMobile ? (
                <img
                  src={MobileMain1}
                  alt="Main Video copyright GENTLEMONSTER"
                />
              ) : (
                <ReactPlayer
                  className="video"
                  url={"/video.mp4"}
                  width="100%"
                  height="auto"
                  loop={true}
                  playing={true}
                  muted={true}
                  controls={false}
                  alt="Main Video copyright GENTLEMONSTER"
                  playsinline={true} 
                />
              )}
              <div className="textContainer">
                <p>Check out the 2nd drop of the Bold Collection</p>
                <h1>BOLD COLLECTION</h1>
                <div className="buttons">
                  <button>PURCHASE</button>
                  <button>DETAIL</button>
                </div>
              </div>
            </div>
            <div className="Container" id="secondContainer">
              {isMobile ? (
                <img
                  src={MobileMain2}
                  alt="Main Video copyright GENTLEMONSTER"
                />
              ) : (
                <ReactPlayer
                  className="video"
                  url={"/video2.mp4"}
                  width="100%"
                  height="auto"
                  loop={true}
                  playing={true}
                  muted={true}
                  controls={false}
                  alt="Main Video copyright GENTLEMONSTER"
                  playsinline={true} 
                />
              )}
              <div className="whiteTextContainer">
                <p>New collaboration collection with KUN</p>
                <h1>UNICO X KUN</h1>
                <div className="buttons">
                  <button>PURCHASE</button>
                  <button>DETAIL</button>
                </div>
              </div>
            </div>
            <div className="Container" id="thirdContainer">
              <img
                src={isMobile ? MobileMain3 : Main3}
                alt="Main Page copyright GENTLEMONSTER"
              />
              <div className="whiteTextContainer">
                <p>Check out the 2nd drop of the Bold Collection</p>
                <h1>BOLD COLLECTION</h1>
                <div className="buttons">
                  <button>PURCHASE</button>
                  <button>DETAIL</button>
                </div>
              </div>
            </div>
            <div className="Container" id="forthContainer">
              <img
                src={isMobile ? MobileMain4 : Main4}
                alt="Main Page copyright GENTLEMONSTER"
              />
              <div className="logoBox">
                <div className="logoContainer">
                  <img src={maison} alt="Maison Margiela Logo" />
                  <h2>X</h2>
                  <h1>UNICO</h1>
                </div>
                <div className="buttons">
                  <button>PURCHASE</button>
                  <button>DETAIL</button>
                </div>
              </div>
            </div>
          </div>
        </Main>
      )}
    </>
  );
});

export default MainPage;
