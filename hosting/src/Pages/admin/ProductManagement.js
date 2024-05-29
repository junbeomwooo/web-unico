import React, { memo, useCallback, useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import styled from "styled-components";

import Spinner from "../../components/Spinner";
import ErrorView from "../../components/ErrorView";
import Table from "../../components/Table";
import Pagenation from "../../helper/Pagenation";
import { useQueryString } from "../../hooks/useQueryString";
import { useLocation, useNavigate } from "react-router-dom";
import { deleteItem } from "../../slices/ProductSlice";
import axios from "axios";

import { getListwithPage } from "../../slices/ProductSlice";

const Container = styled.div`
  padding: 30px 50px;
  box-sizing: border-box;
  width: 85%;
  height: 1600px;
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

  .productCount {
    h6 {
      font-size: 13px;
      font-weight: 400;
    }
  }

  .search {
    display: flex;
    justify-content: center;

    .classfication {
      margin: 20px 0;

      .productName {
        display: flex;
        align-items: center;

        h4 {
          font-weight: 400;
          font-size: 14px;
        }

        input {
          height: 16px;
          width: 248px;
          margin-left: 10px;
        }
      }

      .category {
        display: flex;
        align-items: center;
        margin-top: -20px;
        h4 {
          font-weight: 400;
          font-size: 14px;
        }

        label {
          margin-left: 10px;
          font-size: 14px;
        }
      }

      .productSort {
        display: flex;
        align-items: center;
        margin-top: -20px;

        h4 {
          font-weight: 400;
          font-size: 14px;
        }

        select {
          margin-left: 10px;
        }
      }

      .searchButtons {
        margin: 10px 0;
        display: flex;
        justify-content: center;
        button {
          margin: 0 5px;
        }
      }

      .addProduct {
        position: absolute;
        right: 57px;
      }
    }
  }
`;

const ProductManagement = memo(() => {
  /** 드롭다운 상태값 */
  const [sortOption, setSortOption] = useState("desc"); // 정렬 옵션 상태 추가
  /** 체크박스 상태값 */
  const [checkBoxchecked, setCheckBoxChecked] = useState(null);

  /** 참조 변수 생성 */
  const searchRef = useRef();
  /** 쿼리스트링 받기 */
  const { page = 1 } = useQueryString();

  /** 강제 이동 함수 생성 */
  const navigate = useNavigate();
  /** 로케이션 */
  const location = useLocation();
  /** 리덕스 초기화 */
  const dispatch = useDispatch();

  const { data, loading, error, pagenation, count } = useSelector(
    (state) => state.ProductSlice
  );

  /** 렌더링 시 실행 */
  useEffect(() => {
    dispatch(
      getListwithPage({
        query: searchRef.current?.value,
        page: page,
        rows: 8,
        sortOption: sortOption,
        subcate: parseInt(checkBoxchecked),
      })
    );
  }, [page]);

  /** 일반 이벤트 */
  // 체크박스 이벤트
  const onChangeCheckBox = useCallback((e) => {
    setCheckBoxChecked(e.currentTarget.value);
  });
  // 검색조건 및 정렬 제출 핸들러
  const handleSearchSubmit = useCallback((e) => {
    e.preventDefault();

    // 검색어를 이용하여 데이터를 요청
    dispatch(
      getListwithPage({
        query: searchRef.current.value,
        page: 1,
        rows: 8,
        sortOption: sortOption,
        subcate: parseInt(checkBoxchecked),
      })
    );

    /** 정렬 조건이 바뀌었을 때 페이지 번호를 1로 이동하기 위해 쿼리스트링을 변경 */
    const { pathname, search } = location;
    // QueryString 문자열을 객체로 변환
    const params = new URLSearchParams(search);
    // params 객체에 page번호 파라미터 추가
    params.set("page", 1);
    // params객체를 다시 QueryString 문자열로 변환
    const qs = params.toString();
    // 최종 URL을 추출
    const targetUrl = `${pathname}?${qs}`;
    navigate(targetUrl);
  });

  // 버튼 초기화 버튼
  const onClickInitalize = useCallback((e) => {
    searchRef.current.value = "";
    setCheckBoxChecked(null);
    setSortOption("desc");
  });

  // 수정 버튼
  const moveToEdit = useCallback((e) => {
    e.preventDefault();
    navigate(`/admin/product_management/${e.target.value}`);
  });
  // 상품 추가 페이지로 이동
  const onClickAddProduct = useCallback((e) => {
    e.preventDefault();
    navigate('/admin/product_register');
  });

  // 제품 삭제 이벤트
  const onClickDelete = useCallback(async (e) => {
    e.preventDefault();
    // 삭제할 것인지 물어보기
    if (
      window.confirm(
        "All information related to this product in the order history and cart will be permanently deleted. Are you sure you want to delete this product?"
      )
    ) {
      // 삭제를 할 경우
      const current = e.currentTarget;

      /** 선택한 상품의 상품번호 받아오기 */
      // 리덕스를 사용하지 않은 이유는 이미 이 코드에서 ProductSlice.js의 상태값인 data를 사용하고 있으므로
      // 이곳에서만 쓰일 한가지 기능을 위하여 리덕스 함수를 만드는 것은 코드를 복잡하게 보이게 한다 생각하여서임.
      let item = null;

      try {
        const response = await axios.get(
          `/api/product/${current.dataset.prodno}`);
        item = response.data.item;
      } catch (err) {
        item = err.response.data;
        alert(`[${item.rt}] ${item.rtmsg}`);
        return;
      }

      const images = [
        item?.img1,
        item?.img2,
        item?.img3,
        item?.img4,
        item?.img5,
        item?.img6,
      ].filter((image) => image !== null);

      /** 삭제 신청 시 썸네일및 원본 파일 삭제 */
      let deletefile = null;

      try {
        const response = await axios.delete(
          "/upload/multiple",
          { data: { filePath: images } },
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        );

        deletefile = response.data;
      } catch (err) {
        deletefile = err.response.data;
        alert(`[${deletefile.rt}] ${deletefile.rtmsg}`);
        return;
      }

      /** 데이터베이스에 삭제 요청 */
      dispatch(
        deleteItem({
          prodno: current.dataset.prodno,
        })
      ).then(({ payload }) => {
        if (payload.rtcode === 200) {
          window.alert("The product has been successfully deleted.");
          // 삭제 후 새로고침
          window.location.reload();
        } else {
          window.alert("An error occurred during the product deletion.");
          return;
        }
      });
    } else {
      // 삭제를 하지 않을 경우
      return;
    }
  });

  return (
    <>
      <Spinner loading={loading} />
      {error ? (
        <ErrorView error={error} />
      ) : (
        <Container>
          <div className="header">
            <h1>Product Management</h1>
          </div>
          <hr />
          <div className="productCount">
            <h6>
              Total : {count?.allCount} | Sunglasses : {count?.sunglassesCount}{" "}
              | Glasses : {count?.glassesCount}
            </h6>
          </div>
          <form className="search" onSubmit={handleSearchSubmit}>
            <div className="classfication">
              <div className="productName">
                <h4>Product Name:</h4>
                <input type="text" ref={searchRef} />
              </div>
              <div className="category">
                <h4>Category:</h4>
                <label>
                  <input
                    type="checkbox"
                    value=""
                    checked={checkBoxchecked === ""}
                    onChange={onChangeCheckBox}
                  />
                  All
                </label>
                <label>
                  <input
                    type="checkbox"
                    value="1"
                    checked={checkBoxchecked === "1"}
                    onChange={onChangeCheckBox}
                  />
                  Sunglasses
                </label>
                <label>
                  <input
                    type="checkbox"
                    value="2"
                    checked={checkBoxchecked === "2"}
                    onChange={onChangeCheckBox}
                  />
                  Glasses
                </label>
              </div>
              <div className="productSort">
                <h4>Member Sort:</h4>
                <div className="dropDown">
                  <select
                    value={sortOption}
                    onChange={(e) => setSortOption(e.target.value)}
                  >
                    <option value="desc">Product Newest</option>
                    <option value="asc">Product Oldest</option>
                    <option value="descend">Descending Price</option>
                    <option value="ascend">Ascending Price</option>
                  </select>
                </div>
              </div>
              <div className="searchButtons">
                <button type="submit">Search</button>
                <button onClick={onClickInitalize}>Initialize</button>
              </div>
              <div className="addProduct">
                <button onClick={onClickAddProduct}>Add a product</button>
              </div>
            </div>
          </form>
          <div className="product">
            <Table style={{ 'marginTop' : '25px'}}>
              <thead>
                <tr>
                  <th>Prodno</th>
                  <th>Category</th>
                  <th>Img</th>
                  <th>Title</th>
                  <th>Price</th>
                  <th>Content</th>
                  <th>Size</th>
                  <th>Is_sell</th>
                  <th></th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {data?.length > 0 ? (
                  data.map((v, i) => {
                    return (
                      <tr key={i}>
                        <td>{v.prodno}</td>
                        <td>
                          {v.sub_category_subcateno === 1
                            ? "Sunglasses"
                            : "Glasses"}
                        </td>
                        <td>
                          <img
                            src={v.img1}
                            alt={v.title}
                            style={{ maxWidth: "100px", maxHeight: "100px" }}
                          />
                        </td>
                        <td>{v.title}</td>
                        <td>{v.price}</td>
                        <td>{v.content.substring(0, 50)}...</td>
                        <td>{v.size.substring(0, 50)}...</td>
                        <td>{v.is_sell}</td>
                        <td>
                          <button value={v.prodno} onClick={moveToEdit}>
                            Edit
                          </button>
                        </td>
                        <td>
                          <button
                            onClick={onClickDelete}
                            data-prodno={v.prodno}
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan={9} align="center">
                      There is no user data.
                    </td>
                  </tr>
                )}
              </tbody>
            </Table>
            {data?.length > 0 && pagenation && (
              <Pagenation pagenation={pagenation} />
            )}
          </div>
        </Container>
      )}
    </>
  );
});

export default ProductManagement;
