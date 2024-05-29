import React, { memo, useCallback, useEffect } from 'react';

import ReactPlayer from 'react-player';
import { styled } from 'styled-components';
import { useSelector, useDispatch } from 'react-redux';
import { updateColor } from '../slices/fontColorReducer';

import maison from '../assets/maison.png'

import Header from '../components/Header'
import Main1 from '../assets/mainpage/1.avif'
import Main2 from '../assets/mainpage/2.avif'
import mq from '../MediaQuery/MediaQuery.js';


const Main = styled.div`


    div{
        display: flex;
        flex-wrap: wrap;

        .Container {
            position: relative;
            width: 100%;
            height: 100%;
            object-fit: cover;

            .textContainer { 
                position: absolute;
                top: 85%;
                left: 50%;
                transform: translate(-50%, -50%);
                display: flex;
                flex-direction: column;
                text-align: center;

                
                p {
                    font-size: 17px;
                    margin-bottom: 5px;
                    font-weight: 400;

                    ${mq.maxWidth('lg')`
                        font-size: 12px;
                    `}

                    ${mq.maxWidth('sm')`
                        font-size: 11px;
                    `}
    
                }
                h1 {
                    margin: 0;
                    font-weight: bold;
                    font-size: 25px;
                    margin-bottom: 15px;

                    ${mq.maxWidth('lg')`
                        font-size: 20px;
                    `}

                    ${mq.maxWidth('sm')`
                        font-size: 15px;
                        margin-bottom: 10px;
                    `}
                }
                
                .buttons {

                    button {
                    width: 165px;
                    height: 45px;
                    border: 1px solid black;
                    background: none;
                    font-weight: 500;
                    transition: background-color 0.5s ease;
                    margin: 0 8px;

                    ${mq.maxWidth('lg')`
                        width: 145px;
                        height: 40px;
                    `}

                    ${mq.maxWidth('md')`
                        width: 125px;
                        height: 40px;
                        margin-bottom: 25px;
                    `}

                    ${mq.maxWidth('sm')`
                        font-size: 12px;
                        height: 35px;
                        width: 100px;
                        margin: 0 5px 35px 5px;
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
                
                p {
                    font-size: 17px;
                    margin-bottom: 5px;
                    font-weight: 400;
                    color: white;

                    ${mq.maxWidth('lg')`
                        font-size: 12px;
                    `}

                    ${mq.maxWidth('sm')`
                        font-size: 11px;
                    `}
    
                }
                h1 {
                    margin-top: 0;
                    font-weight: bold;
                    font-size: 25px;
                    margin-bottom: 15px;
                    color: white;

                    ${mq.maxWidth('lg')`
                        font-size: 20px;
                    `}

                    ${mq.maxWidth('sm')`
                        font-size: 15px;
                        margin-bottom: 10px;
                    `}
                }
                
                .buttons {

                    button {
                    width: 165px;
                    height: 45px;
                    border: 1px solid white;
                    background: none;
                    font-weight: 500;
                    transition: background-color 0.5s ease;
                    margin: 0 8px;
                    color: white;

                    ${mq.maxWidth('lg')`
                        width: 145px;
                        height: 40px;
                    `}

                    ${mq.maxWidth('md')`
                        width: 125px;
                        height: 40px;
                        margin-bottom: 25px;
                    `}

                    ${mq.maxWidth('sm')`
                        font-size: 12px;
                        height: 35px;
                        width: 100px;
                        margin: 0 5px 35px 5px;
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

                .logoContainer {
                    
                    display: flex;
                    justify-content: center;
                    margin-bottom: 20px;

                    img {
                        max-width: 200px;
                        height: auto;
                        object-fit: contain;

                        ${mq.maxWidth('md')`
                        width: 150px;
                    `}

                        ${mq.maxWidth('md')`
                        width: 140px;
                    `}
                    
                    }
                    h2 {
                        font-size:20px;
                        color: #ffff;
                        font-weight: normal;
                        margin: 9px 0 0 15px;

                        ${mq.maxWidth('md')`
                            font-size:18px;
                        `}

                        ${mq.maxWidth('md')`
                            font-size:15px;
                            margin: 9px 0 0 7px;
                    `}
                    }

                    h1 {
                        color: #ffff;
                        font-size:25px;
                        font-weight: bold;
                        margin: 9px 0 20px 15px;
                        letter-spacing: 1.5px;
                        ${mq.maxWidth('md')`
                            font-size:20px;
                        `}

                        ${mq.maxWidth('md')`
                            font-size:17px;
                            margin: 9px 0 20px 7px;
                    `}
                    }
                }

                .buttons {
                    display:flex;
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

                            ${mq.maxWidth('md')`
                                width: 120px;
                                height: 38px;
                                margin-bottom: 25px;
                            `}

                            ${mq.maxWidth('sm')`
                                font-size: 12px;
                                height: 35px;
                                width: 100px;
                                margin: 0 5px 40px 5px;
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

`
const MainPage = memo(() => {
    const {fontcolor} = useSelector((state) => state.colorReducer);
    const dispatch = useDispatch();

    const handleScroll = useCallback((e) => {
        const scrollPosition = window.scrollY;

        // 스크롤 위치에 따른 폰트 색상 업데이트
        if (scrollPosition < 920) {
            dispatch(updateColor('#000000'));
        } else if (scrollPosition < 1840) {
            dispatch(updateColor('#ffffff'));
        } else if (scrollPosition < 2760) {
            dispatch(updateColor('#000000'));
        } else {
            dispatch(updateColor('#ffffff'));
        }
    },[dispatch]);
    
    useEffect(() => {
        window.scrollTo(0,0);
        window.addEventListener('scroll', handleScroll);
        return () => {
            window.removeEventListener('scroll', handleScroll);
        }
    },[])


    return (
        <>
            <Header fontcolor={fontcolor} />
            <Main>  
                <div>
                    <div className='Container'>
                        <ReactPlayer
                        url={'/video.mp4'}
                        width="100%"
                        height="auto"
                        loop={true}
                        playing={true}
                        muted={true}
                        controls={false}
                        alt='Main Video copyright GENTLEMONSTER'
                        />
                        <div className='textContainer'>
                            <p>Check out the 2nd drop of the Bold Collection</p>
                            <h1>BOLD COLLECTION</h1>
                            <div className='buttons'>
                                <button>PURCHASE</button>
                                <button>DETAIL</button>
                            </div>
                        </div>
                    </div>
                    <div className='Container'>
                        <ReactPlayer
                        url={'/video2.mp4'}
                        width="100%"
                        height="auto"
                        loop={true}
                        playing={true}
                        muted={true}
                        controls={false}
                        alt='Main Video copyright GENTLEMONSTER'
                        />
                        <div className='whiteTextContainer'>
                            <p>New collaboration collection with KUN</p>
                            <h1>UNICO X KUN</h1>
                            <div className='buttons'>
                                <button>PURCHASE</button>
                                <button>DETAIL</button>
                            </div>
                        </div>
                    </div>
                    <div className='Container'>
                        <img src={Main1} alt='Main Page copyright GENTLEMONSTER' />
                        <div className='whiteTextContainer'>
                            <p>Check out the 2nd drop of the Bold Collection</p>
                            <h1>BOLD COLLECTION</h1>
                            <div className='buttons'>
                                <button>PURCHASE</button>
                                <button>DETAIL</button>
                            </div>
                        </div>
                    </div>
                    <div className='Container'>
                        <img src={Main2} alt='Main Page copyright GENTLEMONSTER' />
                        <div className='logoBox'>
                            <div className='logoContainer'>
                                <img src={maison} alt='Maison Margiela Logo'/>
                                <h2>X</h2>
                                <h1>UNICO</h1>
                            </div>
                            <div className='buttons'>
                                <button>PURCHASE</button>
                                <button>DETAIL</button>
                            </div>
                        </div>
                    </div>
                </div>
            </Main>
        </>
    );
});

export default MainPage;