import React, { memo, useCallback, useEffect, useState } from "react";
import styled from "styled-components";
import { NavLink, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";

import { getList } from "../slices/ProductSlice";
import { useQueryString } from "../hooks/useQueryString";
import Spinner from "../components/Spinner";
import ErrorView from "../components/ErrorView";
import mq from "../MediaQuery/MediaQuery";

import glasses from "../assets/productpage/glasses.png";
import sunglasses from "../assets/productpage/sunglasses.png";

const Box = styled.div`
  padding-top: 70px;

  .selectCategory {
    margin-top: 140px;
    display: flex;
    justify-content: center;

    div {
      img {
        width: 110px;
        height: 110px;
        margin: 0 35px 0 35px;
      }

      h4 {
        text-align: center;
        font-weight: 500;
      }

      &:hover {
        cursor: pointer;
        transform: scale(1.05);
        transition: transform 0.8s ease;

        h4 {
          font-weight: 600;
          transition: 0.07s ease;
        }
      }
    }
  }
  .sortContainer {
    display: flex;
    justify-content: right;
    margin-right: 6%;
    margin-top: 50px;
    .sort {
    display: flex;
    flex-direction: column;
    height: ${({ sortopen }) => (sortopen === "true" ? "165px" : "20px")};
    width: 100px;
    border: 1px solid black;
    background-color: #f4f3f2;
    transition: height 0.25s ease-in-out; // 트랜지션 효과 추가

    button {
      border: none;
      font-weight: 500;
      background-color: #f4f3f2;
      margin-bottom: 15px;
      height: 20px;

      &:hover {
        cursor: pointer;
      }
    }
  }
  }
  .productContainer {
    .productBox {
      display: flex;
      flex-wrap: wrap;
      justify-content: center;
      margin: 50px 0 130px 0;

      div {
        width: 21%;
        margin: 12px;

        ${mq.maxWidth("lg")`
                    width: 30%;
                `}

        ${mq.maxWidth("md")`
                    width: 40%;
                    margin: 15px;
                `}

                img {
          width: 100%;
          height: auto;
        }

        .title {
          font-size: 21px;
          font-weight: 600;
          display: block;
          margin-top: 18px;
        }

        .price {
          font-size: 15px;
          display: block;
          margin-top: 18px;
        }
      }
    }
  }
`;

const Glasses = memo(() => {
  // QueryString 변수 받기
  const { query } = useQueryString();

  // 페이지 상태값
  const [currentPage, setCurrentPage] = useState(1);

  // 추가데이터 로딩여부 상태값
  const [dataLoading, setDataLoading] = useState(false);

  // 데이터 결합
  const [allData, setAllData] = useState([]);

  // 정렬 기준 옵션을 위한 상태값
  const [sortOpen, setSortOpen] = useState(false);
  const [sortOrder, setSortOrder] = useState("desc");
  const [sortBy, setSortBy] = useState("prodno");

  // 리덕스 관련 초기화
  const dispatch = useDispatch();
  const { pagenation, data, loading, error } = useSelector(
    (state) => state.ProductSlice
  );

  // 강제이동 함수 생성
  const navigate = useNavigate();

  // 인피니티 스크롤 로직
  const handleScroll = useCallback(() => {
    const { scrollTop, clientHeight, scrollHeight } = document.documentElement;
    /** 스크롤을 하지 않았을때를 대비하여 scrollTop이 존재하며 화면이 끝에 도달하고 데이터로드 중이 아니고 전체데이터수가 현재데이터 수 보다 클 경우 데이터 로딩 */
    if (
      scrollTop &&
      scrollTop + clientHeight >= scrollHeight &&
      !dataLoading &&
      pagenation > allData.length
    ) {
      setDataLoading(true);
    }
  }, [dataLoading, pagenation, allData.length]);

  // 스크롤 이벤트 리스너 등록 및 해제
  useEffect(() => {
    if (dataLoading) {
      setCurrentPage(currentPage + 1);
    }
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [handleScroll]);

  useEffect(() => {
    setAllData([]);
    setCurrentPage(1);
  }, [query, sortBy, sortOrder]);

  /** 데이터 조회 및 인피니티 스크롤 구현*/
  useEffect(() => {
    dispatch(
      getList({
        query: query,
        page: currentPage,
        subcate: 2,
        // 정렬 순을 위해
        sortBy: sortBy, // 정렬할 필드 지정
        sortOrder: sortOrder, // 정렬 순서 지정
      })
    ).then((newData) => {
      if (newData.payload.item && newData.payload.item.length > 0) {
        const newDataArray = [newData.payload.item];
        setAllData((currentData) => [...currentData, ...newDataArray[0]]);
        setDataLoading(false);
      } else {
        setDataLoading(false);
      }
    });
  }, [query, currentPage, dispatch, sortBy, sortOrder]);

  //버튼 클릭시 sunglasses 페이지 이동
  const moveToSunglasses = useCallback((e) => {
    e.preventDefault();
    navigate("/product/sunglasses");
  });
  //버튼 클릭시 glasses 페이지 이동
  const moveToGlasses = useCallback((e) => {
    e.preventDefault();
    navigate("/product/glasses");
  });

  // 정렬 기준 선택
  const onClickFilter = useCallback(
    (e) => {
      setSortOpen(!sortOpen);
    },
    [setSortOpen, sortOpen]
  );

  /** 정렬 기준 */
  // 최신 순
  const onClickNewest = useCallback(
    (e) => {
      // 만약 같은 상태값을 가진 상태일 경우 함수 종료
      if (sortBy === "prodno" && sortOrder === "desc") {
        return;
      }
      setAllData([]);
      setSortBy("prodno");
      setSortOrder("desc");
      setCurrentPage(1);
      setSortOpen(false);
    },
    [sortBy, sortOrder]
  );
  //오래된 순
  const onClickOldest = useCallback(
    (e) => {
      // 만약 같은 상태값을 가진 상태일 경우 함수 종료
      if (sortBy === "prodno" && sortOrder === "asc") {
        return;
      }
      setAllData([]);
      setSortBy("prodno");
      setSortOrder("asc");
      setCurrentPage(1);
      setSortOpen(false);
    },
    [sortBy, sortOrder]
  );
  // 가격 낮은 순
  const onClickLowest = useCallback(
    (e) => {
      // 만약 같은 상태값을 가진 상태일 경우 함수 종료
      if (sortBy === "price" && sortOrder === "asc") {
        return;
      }
      setAllData([]);
      setSortBy("price");
      setSortOrder("asc");
      setCurrentPage(1);
      setSortOpen(false);
    },
    [sortBy, sortOrder]
  );
  // 가격 높은 순
  const onClickHighest = useCallback(
    (e) => {
      // 만약 같은 상태값을 가진 상태일 경우 함수 종료
      if (sortBy === "price" && sortOrder === "desc") {
        return;
      }
      setAllData([]);
      setSortBy("price");
      setSortOrder("desc");
      setCurrentPage(1);
      setSortOpen(false);
    },
    [sortBy, sortOrder]
  );

  return (
    <>
      {/** 로딩바  */}
      <Spinner loading={loading} />

      {/** 조회결과 표사 */}
      {error ? (
        <ErrorView error={error} />
      ) : (
        // data가 있을 경우
        allData.length && (
          <Box sortopen={sortOpen.toString()}>
            <div className="selectCategory">
              <div onClick={moveToSunglasses}>
                <img src={sunglasses} alt="sunglasses button" />
                <h4>Sunglasses</h4>
              </div>
              <div onClick={moveToGlasses}>
                <img src={glasses} alt="glasses button" />
                <h4>Glasses</h4>
              </div>
            </div>
            <div className="sortContainer">
              <div className="sort">
                <button onClick={onClickFilter}>Sort</button>
                {sortOpen === true && (
                  <>
                    <button onClick={onClickNewest} className="openButton">
                      Newest
                    </button>
                    <button onClick={onClickOldest} className="openButton">
                      Oldest
                    </button>
                    <button onClick={onClickLowest} className="openButton">
                      Lowest Price
                    </button>
                    <button onClick={onClickHighest} className="openButton">
                      Highest Price
                    </button>
                  </>
                )}
              </div>
            </div>

            <div className="productContainer">
              <div className="productBox">
                {allData.length > 0 ? (
                  allData.map((v, i) => {
                    // 'is_sell' 값이 'Y'이고 'sub_category_subcateno' 값이 2인 데이터만 출력
                    if (v.is_sell === "Y" && v.sub_category_subcateno === 2) {
                      return (
                        <div key={i}>
                          <NavLink to={`/product/${v.prodno}`}>
                            <img src={v.img1} alt={v.title} />
                          </NavLink>
                          <NavLink
                            to={`/product/${v.prodno}`}
                            className="title"
                          >
                            {v.title}
                          </NavLink>
                          <NavLink
                            to={`/product/${v.prodno}`}
                            className="price"
                          >
                            ${v.price}
                          </NavLink>
                        </div>
                      );
                    } else {
                      return null;
                    }
                  })
                ) : (
                  <h1>No data was retrieved.</h1>
                )}
              </div>
            </div>
          </Box>
        )
      )}
    </>
  );
});

export default Glasses;
