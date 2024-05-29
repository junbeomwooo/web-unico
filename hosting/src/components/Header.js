
import React, { memo, useCallback, useState, useEffect, useRef} from 'react';

import styled from 'styled-components';
import { useNavigate, useLocation } from 'react-router-dom';
import { useDispatch } from 'react-redux';

import mq from '../MediaQuery/MediaQuery';
import Logo from '../assets/logo.png';
import Search from '../assets/buttons/search.png';
import Menu from '../assets/buttons/menu.png';
import { getList } from '../slices/ProductSlice';



const HeaderBox = styled.header`
    position: fixed;
    padding: 10px 20px;
    width: 100%;
    height: 60px;
    background: ${props => (props.ismain ? 'none' : '#F4F3F2')};
    display: flex;
    align-items: center;
    justify-content: space-between;
    z-index: 4;
    
    a {
        img {
            max-width : 140px;
            height: auto;
            filter:  ${props => props.fontcolor === '#ffffff' ? 'invert(100%)' : 'none'};

                ${mq.maxWidth('sm')`
                    width: 100px;
                    height: auto;
                `}
        }
    }
    
    button {
        border: none;
        background: none;

        ${mq.maxWidth('lg')`
            width: 120px;
            height: auto;
        `}

        &:hover {
            cursor: pointer;
            font-weight: bold;
        }
    }

    div {
        max-width: 1000px;
        height: auto;

        .Menu {
            display:none;
            

            img {
                width: 45px;
                height: 45px;

                ${mq.maxWidth('sm')`
                    width:35px;
                    height:35px;
                `}
            }

            ${mq.maxWidth('md')`
                display:block;
            `}
        }
        
        .buttons {
            width: 90px;
            height: 51.63px;
            margin-right: 35px;

            span {
                font-size: 15px;
                font-weight: 500;
                color: ${props => props.fontcolor};

                &:hover {
                    font-weight: bold;
                }
            }

            &:last-child {
                margin-right: 30px;
            }

            ${mq.maxWidth('md')`
            display:none;
        `}
        }

    }
`;
const DropdownContainer = styled.div`
    position: fixed;
    right: 406px;
    z-index: 1;
    top: ${props => props.isshopopen === 1 ? '75px' : '-100px'};
    opacity: ${props => (props.isshopopen === 1 ? 1 : 0) || 
                        (props.isshopopen === -1 ? 0 : 1)};
    transition: top 0.35s ease-in-out, opacity 0.2s ease-in-out;


    ${mq.maxWidth('md')`
            display:none;
        `}
    

    div {
        max-width: 90px;
        height: auto;

        button {
            width: 120px;
            height: 60px;
            border: none;
            background: ${props => (props.ismain ? 'none' : '#F4F3F2')};

            span {
                font-size: 15px;
                font-weight: 500;
                color: ${props => props.fontcolor};

                &:hover {
                font-weight: bold;
                }
            }

            &:hover {
            cursor: pointer;
            font-weight: bold;
        }
        }
    }
`
const SearchContainer = styled.form`
    ${mq.maxWidth('md')`
        display:none;
    `}
    position: fixed;
    width: 470px; 
    height: 65px;
    right: 0px;
        top : ${props => props.issearchopen === 1 ? '80px': '-20px'};
        opacity: ${props => (props.issearchopen === 1 ? 1 : 0) || 
                            (props.issearchopen === -1 ? 0 : 1)};
        transition: top 0.25s ease-in-out, opacity 0.2s ease-in-out;
        background: none;
        font-size: 15px;
        font-weight: medium;
        z-index: 3;
        background: ${props => (props.ismain ? 'none' : '#F4F3F2')};
        
    input {
        width: 358px; 
        height: 40px;
        border: 1.5px solid ${props => props.fontcolor};
        color: ${props => props.fontcolor};
        padding-left: 8px;
        margin-top: 7px;
        margin-left: 10px;
        background: none;
    }
    button {
            position:fixed;
            width: 50px;
            top : ${props => props.issearchopen === 1 ? '88px': '-50px'};
            opacity: ${props => (props.issearchopen === 1 ? 1 : 0) || 
                            (props.issearchopen === -1 ? 0 : 1)};
            transition: top 0.25s ease-in-out, opacity 0.2s ease-in-out;
            right: 30px;
            border: none;
            background: none;
            cursor: pointer;
        img {
            width: 30px;
            filter:  ${props => props.fontcolor === '#ffffff' ? 'invert(100%)' : 'none'};
        }
    }
`;
const MenuContainer = styled.div`
    width: 330px;
    height:100%;
    right: ${props => props.ismenuopen};
    transition: right 0.3s ease-in-out;
    background-color: #FFFFFF;
    position: fixed;
    z-index: 99;
    display: flex;
    flex-direction: row;
    justify-content: flex-end;

    ${mq.minWidth('md')`
        display:none;
    `}

    .btnCancle {
        position: absolute;
        right: 10px;
        top: 20px;

        button {
            border: none;
            background: none;
            font-size: 25px;

            &:hover {
                cursor: pointer;
                font-weight: 600;
            }

        }

    }
    .category {
        display: flex;
        flex-direction: column;
        align-items: flex-start;
        width: 300px;

        input {
            width: 270px;
            margin: 120px 150px 0px 0;
            height: 50px;
            border: 1.8px solid black;
            border-radius: 80px;
            padding: 0 15px;
            font-size: 19px;
        }
        button{
            font-size: 20px;
            font-weight: 600;
            margin: 50px 150px 0px 0;
            border: none;
            background: none;

            &:hover {
                cursor: pointer;
                font-weight: 700;
            }
        }

        .search {
            width: 38px;
            height: 38px;
            position: absolute;
            top: 79px;
            left: 244px;
            img {
                width:100%;
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
`


const Header = memo(({ fontcolor }) => {

    const searchRef = useRef();
    // 리덕스 초기화
    const dispatch = useDispatch();

    // url 정보 가져오기
    const location = useLocation();

    // url이 메인페이지인 경우 변수
    const ismain = location.pathname === '/'?  1 : 0 ;
  
    // shop 버튼 토글 상태값
    const [isshopopen, setshopopen] = useState(-1);
    // search 버튼 토글 상태값
    const [issearchopen, setsearchopen] = useState(-1);

    // 모바일크기 Menu 버튼 토글 상태값
    const [ismenuopen, setmenuOpen] = useState('-330px');
     
    // 강제이동 함수 생성
    const navigate = useNavigate();

    // url 정보 변경시 상태값 및 검색어 초기화
    useEffect(() => {
        setshopopen(-1);
        setsearchopen(-1);
        setmenuOpen('-330px');
        searchRef.current.value='';
    },[location]);

    // 검색 이벤트
    const onSearchSubmit = useCallback(async (e) => {
        e.preventDefault();
    
        const query = e.currentTarget.query.value;
    
        // getList 액션을 비동기로 디스패치하고, 해당 액션이 완료될 때까지 대기
        const result = await dispatch(getList({ query: query }));
    
        if (getList.fulfilled.match(result)) {
            const searchUrl = result.payload.item[0].sub_category_subcateno === 1
                ? `/product/sunglasses/?query=${query}`
                : `/product/glasses/?query=${query}`;
            
            console.log(result.payload.item); // 이 부분은 받아온 데이터 확인을 위한 로그
            navigate(searchUrl);

            setsearchopen(-1);
        }
    });

    // 버튼 클릭시 토글 생기고 사라짐
    const toggleShopDropDown = useCallback((e) => {
        setshopopen(isshopopen === -1 ? 1 : -1);
        if(issearchopen === 1) {
            setsearchopen(-1);
        }
    })

    //버튼 클릭시 토글 생기고 사라짐
    const toggleSearchDropDown = useCallback((e) => {
        setsearchopen(issearchopen === -1 ? 1 : -1);
        if(isshopopen === 1) {
            setshopopen(-1);
        }
    })

    //버튼 클릭시 토글 왼쪽 슬라이딩
    const toggleMenuDropDown = useCallback((e) => {
        setmenuOpen('0');
    });

    // X 버튼 클릭시 메뉴 가리기
    const closeMenu = useCallback((e) => {
        setmenuOpen('-330px');
    });

    // 버튼 클릭시 account 페이지 이동
    const moveToAccount = useCallback((e) => {
        e.preventDefault();
        navigate('/member');
    });

    //버튼 클릭시 cart 페이지 이동
    const moveToCart = useCallback((e) => {
        e.preventDefault();
        navigate('/member/cart');
    });

    //버튼 클릭시 cart 페이지 이동
     const moveToSunglasses = useCallback((e) => {
        e.preventDefault();
        navigate('/product/sunglasses');
    });

    //버튼 클릭시 cart 페이지 이동
    const moveToGlasses = useCallback((e) => {
        e.preventDefault();
        navigate('/product/glasses');
    });


    

    return (
        <>  
            <HeaderBox fontcolor={fontcolor} ismain={ismain}>
                <a href="/">
                    <img src={Logo} alt="UNICO Logo" />
                </a>
                <div>
                    <button className='buttons' onClick={toggleShopDropDown}><span>SHOP</span></button>
                    <button className='buttons'onClick={toggleSearchDropDown}><span>SEARCH</span></button>
                    <button className='buttons'onClick={moveToAccount}><span>ACCOUNT</span></button>
                    <button className='buttons'onClick={moveToCart}><span>CART</span></button>

                    <button className='Menu' onClick={toggleMenuDropDown}>
                        <img src={Menu} alt='Menu' />
                    </button>
                </div>
            </HeaderBox>

            {/**SHOP 토글 드롭박스 */}
            {isshopopen && (
                <DropdownContainer isshopopen={isshopopen} fontcolor={fontcolor} ismain={ismain}>
                    <div>
                        <button onClick={moveToSunglasses}><span>Sunglasses</span></button>
                        <button onClick={moveToGlasses}><span>Glasses</span></button>
                    </div>
                </DropdownContainer>
            )}

            {/** SEARCH토글 드롭박스 */}
            {issearchopen && (
                <SearchContainer onSubmit={onSearchSubmit} issearchopen={issearchopen} fontcolor={fontcolor} ismain={ismain}>
                    <input type='text' name="query" ref={searchRef} placeholder='Search'></input>
                    <button type='submit'><img src={Search} alt='검색하기'/></button>
                </SearchContainer>
            )}

            {/** 모바일 MENU 토글 드롭박스 */}
            {ismenuopen && (
                <>
                {/* ismenuopen의 위치가 -330이 아닐 경우에만 보여지기 */}
                {ismenuopen !== '-330px' && <BackGround />}
                
                <MenuContainer ismenuopen={ismenuopen}>
                    <div className='btnCancle'>
                        <button onClick={closeMenu}>×</button>
                    </div>
                    <div className='category'>
                        <form onSubmit={onSearchSubmit}>
                            <input type='search' name='query' placeholder='SEARCH'></input>
                            <button type="submit" className='search'><img src={Search} alt='검색하기'/></button>
                        </form>
                        <button onClick={moveToSunglasses}>SUNGLASSES</button>
                        <button onClick={moveToGlasses}>GLASSES</button>
                        <button onClick={moveToAccount}>ACCOUNT</button>
                        <button onClick={moveToCart}>CART</button>
                    </div>
                </MenuContainer>
                </>
            )}
        </>
    );
});

export default Header;
