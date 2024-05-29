import React, { memo, useState, useEffect, useCallback, useRef } from "react";
import styled from "styled-components";
import { useDispatch, useSelector } from "react-redux";
import { getList } from "../../slices/MemberSlice";
import { orderGetList } from "../../slices/OrderDetailSlice";
import { useQueryString } from "../../hooks/useQueryString";
import { useLocation, useNavigate } from "react-router-dom";

import Table from "../../components/Table";
import Pagenation from "../../helper/Pagenation";
import Spinner from "../../components/Spinner";
import ErrorView from "../../components/ErrorView";

const Container = styled.div`
  padding: 30px 50px;
  box-sizing: border-box;
  width: 85%;
  height: 1500px;

  hr {
    border: 0.5px solid #212b34;
    margin-top: 20px;
  }

  /** 검색 및 정렬 기준  */
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
  .memberCount {
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

      .memberName {
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

      .memberGender {
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

      .memberSort {
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
    }
  }
`;

const AdminMember = memo(() => {
  // 강제 이동 함수 생성
  const navigate = useNavigate();
  // 로케이션 함수 생성
  const location = useLocation();
  /** 페이지네이션 구현을 위한 QueryString 변수 받기 */
  const { page = 1 } = useQueryString();
  /** 리덕스 초기화 */
  const dispatch = useDispatch();
  const { pagenation, data, loading, error, count } = useSelector(
    (state) => state.MemberSlice
  );

  /** 참조 변수 생성 */
  const searchRef = useRef();

  /** 체크박스 상태값 */
  const [checkBoxchecked, setCheckBoxChecked] = useState(null);
  /** 드롭다운 상태값 */
  const [sortOption, setSortOption] = useState("desc"); // 정렬 옵션 상태 추가

  /** 첫 렌더링 시 실행 */
  useEffect(() => {
    let gender = null;

    if (checkBoxchecked === "male") {
      gender = "M";
    } else if (checkBoxchecked === "female") {
      gender = "F";
    } else if (checkBoxchecked === "others") {
      gender = "O";
    }

    dispatch(
      getList({
        query: searchRef?.current?.value,
        gender: gender,
        page: page,
        rows: 20,
        sortOption: sortOption,
      })
    );
    dispatch(orderGetList());
  }, [page, dispatch]);

  /** 이벤트 목록 */

  // 체크박스 이벤트
  const onChangeCheckBox = useCallback((e) => {
    setCheckBoxChecked(e.currentTarget.value);
  });

  // 버튼 초기화 버튼
  const onClickInitalize = useCallback((e) => {
    searchRef.current.value = "";
    setCheckBoxChecked(null);
    setSortOption("asc");
  });

  // 검색조건 및 정렬 제출 핸들러
  const handleSearchSubmit = useCallback((e) => {
    e.preventDefault();
    let gender = null;

    if (checkBoxchecked === "male") {
      gender = "M";
    } else if (checkBoxchecked === "female") {
      gender = "F";
    } else if (checkBoxchecked === "others") {
      gender = "O";
    }

    // 검색어를 이용하여 데이터를 요청
    dispatch(
      getList({
        query: searchRef.current.value,
        gender: gender,
        page: 1,
        rows: 20,
        sortOption: sortOption,
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
  return (
    <>
      <Spinner loading={loading} />
      {error ? (
        <ErrorView />
      ) : (
        <Container>
          {/** 검색 및 정렬 기준 */}
          <div className="header">
            <h1>Member List</h1>
          </div>
          <hr />
          <div className="memberCount">
            <h6>
              Total : {count?.allCount} | Male : {count?.maleCount} | Female :{" "}
              {count?.femaleCount} | Others : {count?.othercount}
            </h6>
          </div>
          <form className="search" onSubmit={handleSearchSubmit}>
            <div className="classfication">
              <div className="memberName">
                <h4>Member Name:</h4>
                <input type="text" ref={searchRef} />
              </div>
              <div className="memberGender">
                <h4>Member Gender:</h4>
                <label>
                  <input
                    type="checkbox"
                    value=""
                    checked={checkBoxchecked === ""}
                    onChange={onChangeCheckBox}
                  />
                  Total
                </label>
                <label>
                  <input
                    type="checkbox"
                    value="male"
                    checked={checkBoxchecked === "male"}
                    onChange={onChangeCheckBox}
                  />
                  Male
                </label>
                <label>
                  <input
                    type="checkbox"
                    value="female"
                    checked={checkBoxchecked === "female"}
                    onChange={onChangeCheckBox}
                  />
                  Female
                </label>
                <label>
                  <input
                    type="checkbox"
                    value="others"
                    checked={checkBoxchecked === "others"}
                    onChange={onChangeCheckBox}
                  />
                  Others
                </label>
              </div>
              <div className="memberSort">
                <h4>Member Sort:</h4>
                <div className="dropDown">
                  <select
                    value={sortOption}
                    onChange={(e) => setSortOption(e.target.value)}
                  >
                    <option value="desc">Member Newest</option>
                    <option value="asc">Member Oldest</option>
                    <option value="descend">Descending Order</option>
                    <option value="ascend">Ascending Order</option>
                  </select>
                </div>
              </div>
              <div className="searchButtons">
                <button type="submit">Search</button>
                <button onClick={onClickInitalize}>Initialize</button>
              </div>
            </div>
          </form>
          {/** 테이블 */}
          <Table>
            <thead>
              <tr>
                <th>UserNo</th>
                <th>ID</th>
                <th>Name</th>
                <th>Gender</th>
                <th>BirthDate</th>
                <th>PhoneNumber</th>
                <th>Country</th>
                <th>Total Payment</th>
                <th>Registration Date</th>
                <th>is_out</th>
              </tr>
            </thead>
            <tbody>
              {data?.length > 0 ? (
                data.map((v) => {
                  return (
                    <tr key={v.userno} onClick={() => navigate(`/admin/member/${v.userno}`)} style={{ cursor: 'pointer'}}>
                      <td>{v.userno}</td>
                      <td>
                          {v.account}
                      </td>
                      <td>
                          {v.name}
                      </td>
                      <td>
                        {v.gender === "M"
                          ? "Male"
                          : v.gender === "F"
                          ? "Female"
                          : "Others"}
                      </td>
                      <td>{v.birthdate.substring(0, 10)}</td>
                      <td>{v.phonenumber}</td>
                      <td>{v.country}</td>
                      <td>${v.total_payment ? v.total_payment : "0"}</td>
                      <td>{v.reg_date.substring(0, 10)}</td>
                      <td>{v.is_out}</td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan="10" align="center">
                    There is no result.
                  </td>
                </tr>
              )}
            </tbody>
          </Table>
          {data?.length > 0 && <Pagenation pagenation={pagenation} />}
        </Container>
      )}
    </>
  );
});

export default AdminMember;
