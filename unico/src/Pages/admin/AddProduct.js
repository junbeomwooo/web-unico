import React, { memo, useCallback, useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { postItem } from "../../slices/ProductSlice";
import { getList } from "../../slices/SubCategorySlice";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import axios from "axios";
import mq from '../../MediaQuery/MediaQuery';

import Spinner from "../../components/Spinner";
import ErrorView from "../../components/ErrorView";
import noimage from "../../assets/buttons/noimage.png";
import regexHelper from "../../helper/RegexHelper";

const Container = styled.form`
  padding: 30px 0px;
  box-sizing: border-box;
  width: 85%;
  height: 1500px;
  margin-left: 250px;

  ${mq.maxWidth("md")`
      margin-left: 0;
      width:100%;
    `}

  hr {
    border: 0.5px solid #212b34;
    margin-top: 20px;

    ${mq.maxWidth("md")`
      margin-bottom: 100px;
    `}
  }

  .header {
    display: flex;
    justify-content: center;
    margin: 10px 0;

    ${mq.maxWidth("md")`
      display:none;
    `}
    h1 {
      font-size: 28px;
      font-weight: 700;
      color: #212b34;
    }
  }
  h4 {
    font-size: 16px;
    margin-right: 40px;
    font-weight: 400;
  }

  input {
    width: 400px;
    height: 25px;
  }
  .category {
    margin: 80px 28% 0 28%;
    display: flex;
    justify-content: space-between;
    align-items: center;

    ${mq.maxWidth("xxl")`
      margin: 0;
      width: 80%;
      margin: auto;
    `}

    .cateContainer {
      border: 1px solid #4f4f4f;
      border-radius: 2%;
      width: 405px;
      height: 27px;

      &:hover {
        cursor: pointer;
      }

      .spans {
        border: none;
        display: flex;
        justify-content: space-between;
        span {
          padding: 4px 0 0 4px;
          display: block;
          font-size: 14px;
        }

        .cateBox {
          margin-right: 12px;
        }
      }

      .dropdownBox {
        position: relative;
        width: 407px;
        height: 63px;
        z-index: 100;
        padding: 0;
        margin-top: 5px;
        border: 1px solid #4f4f4f;
        box-sizing: border-box;
        background-color: white;
        overflow: auto;
        margin-left: -1px;

        ul {
          margin: 0;
          padding: 0;
          li {
            padding: 6px 0px;
            padding-left: 5px;
            font-size: 14px;
          }
        }
      }
    }
  }
  .title {
    margin: 0 28% 0 28%;
    display: flex;
    justify-content: space-between;
    align-items: center;

    ${mq.maxWidth("xxl")`
      margin: 0;
      width: 80%;
      margin: auto;
    `}
  }

  .price {
    margin: 0 28% 0 28%;
    display: flex;
    justify-content: space-between;
    align-items: center;
    ${mq.maxWidth("xxl")`
      margin: 0;
      width: 80%;
      margin: auto;
    `}
  }

  .content {
    margin: 0 28% 0 28%;
    display: flex;
    justify-content: space-between;
    align-items: baseline;
    ${mq.maxWidth("xxl")`
      margin: 0;
      width: 80%;
      margin: auto;
    `}

    textarea {
      width: 400px;
      height: 110px;
    }
  }

  .size {
    margin: 0 28% 0 28%;
    display: flex;
    justify-content: space-between;
    align-items: baseline;
    ${mq.maxWidth("xxl")`
      margin: 0;
      width: 80%;
      margin: auto;
    `}

    textarea {
      width: 400px;
      height: 110px;
    }
  }

  .is_sell {
    margin: 0 28% 0 28%;
    display: flex;
    justify-content: space-between;
    align-items: center;
    ${mq.maxWidth("xxl")`
      margin: 0;
      width: 80%;
      margin: auto;
    `}

    .isSellContainer {
      border: 1px solid #4f4f4f;
      border-radius: 2%;
      width: 405px;
      height: 27px;

      &:hover {
        cursor: pointer;
      }

      .spans {
        border: none;
        display: flex;
        justify-content: space-between;
        span {
          padding: 4px 0 0 4px;
          display: block;
          font-size: 14px;
        }

        .isSellBox {
          margin-right: 12px;
        }
      }

      .dropdownBox {
        position: relative;
        width: 407px;
        height: 63px;
        z-index: 100;
        padding: 0;
        margin-top: 5px;
        border: 1px solid #4f4f4f;
        box-sizing: border-box;
        background-color: white;
        overflow: auto;
        margin-left: -1px;

        ul {
          margin: 0;
          padding: 0;
          li {
            padding: 6px 0px;
            padding-left: 5px;
            font-size: 14px;
          }
        }
      }
    }
  }

  .buttons {
    display: flex;
    justify-content: space-between;
    margin: 100px 28% 0 28%;

    ${mq.maxWidth("xxl")`
      margin: 0;
      width: 80%;
      margin: auto;
      margin-top: 60px;
    `}


    button {
      width: 200px;
      height: 45px;
      border: 1px solid black;
      background-color: black;
      color: white;

      ${mq.maxWidth("xl")`
      width: 170px;
    `}

${mq.maxWidth("sm")`
      width: 140px;
    `}

      &:first-child {
        background-color: white;
        color: black;
      }

      &:hover {
        cursor: pointer;
      }
    }
  }
  .images {
    margin: 0 28% 0 28%;

    ${mq.maxWidth("xxl")`
      margin: 0;
      width: 80%;
      margin: auto;
    `}

    .imageContainer {
      margin-left: 16%;

      ${mq.maxWidth("xxl")`
      margin: 0;
      width: 80%;
      margin: auto;
    `}

      .button {
        display: flex;
        justify-content: end;
      }
      .imageBox {
        display: flex;
        margin-bottom: 15px;
        flex-wrap: wrap;
        width: 100%;
        margin-left: 80px;

        img {
          width: 125px;
          margin-left: 15px;
          margin-bottom: 15px;

          ${mq.maxWidth("xxl")`
          width: 80px;
    `}
        }
      }
    }
  }
`;

const AddProduct = memo(() => {
  /** 리덕스 초기화 */
  const dispatch = useDispatch();
  /** 강제 이동 함수 생성 */
  const navigate = useNavigate();

  /** 미리보기를 보여줄 상태값  */
  // url 정보를 통해 파일 생성은 서버에서만 가능함으로 미리보기를 보여줄 임시 url 생성값을 여기에 담음
  const [previewImg, setPreviewImg] = useState([]);

  /** (업로드 / 전역변수 사용)새로운 이미지 업로드 시 제출할 파일 값 */
  const imgFile = useRef(null);

  /** (데이터베이스 저장 / 전역변수 사용) 새로운 이미지 저장된 경로 url 값 */
  const imgURL = useRef(null);

  /** 드롭다운이 열렸는지 확인 값 */
  const [categoryDropdown, setCategoryDropdown] = useState(null);
  const [isSellDropdown, setIsSellDropdown] = useState(null);

  /** 드롭다운 선택된 값 */
  const [selectedCate, setSelectedCate] = useState("Sunglasses");
  const [selectedIsSell, setSelectedIsSell] = useState("Y");

  const { data, loading, error } = useSelector((state) => state.ProductSlice);

  const {
    data: cateData,
    loading: cateLoading,
    error: cateError,
  } = useSelector((state) => state.SubCategorySlice);

  useEffect(() => {
    window.scrollTo(0, 0);
    dispatch(getList());
  }, []);

  /** 이벤트 */
  //   뒤로가기 이벤트
  const moveToBack = useCallback((e) => {
    e.preventDefault();
    navigate("/admin/product_management");
  });

  // 카테고리 드롭다운 이벤트
  const toggleCategory = useCallback((e) => {
    e.preventDefault();
    setCategoryDropdown(!categoryDropdown);
  });

  // 판매유무 드롭다운 이벤트
  const toggleIsSell = useCallback((e) => {
    e.preventDefault();
    setIsSellDropdown(!isSellDropdown);
  });

  // 카테고리 상태값 변경 이벤트
  const onClickCategory = useCallback((value) => {
    setSelectedCate(value === 1 ? "Sunglasses" : "Glasses");
    setCategoryDropdown(false);
  });

  // 판매유무 상태값 변경 이벤트
  const onClickIsSell = useCallback((value) => {
    setSelectedIsSell(value);
    setIsSellDropdown(false);
  });

  // 이미지 변경 이벤트
  const onClickChangeImg = useCallback((e) => {
    e.preventDefault();
    // 최대 장수인 6장이 넘어갈 경우
    if (e.currentTarget.files.length > 6) {
      window.alert("You can upload a maximum of 6 photos.");
      return;
    }
    const files = Array.from(e.currentTarget.files);

    // form데이터에 제출할 실제 값을 이 상태값에 저장
    imgFile.current = files;

    // 새로운 이미지 파일들의 URL을 가져와서 상태에 저장
    // url 정보를 통해 파일 생성은 서버에서만 가능함으로 미리보기를 보여줄 임시 url 생성값을 여기에 담음
    const newImageFiles = files.map((file) => URL.createObjectURL(file));
    setPreviewImg(newImageFiles);
  }, []);

  // 제출 이벤트
  const onSubmitForm = useCallback(async (e) => {
    e.preventDefault();

    const current = e.currentTarget;

    /** 드롭다운 상태값 가져오기*/
    const is_sell = selectedIsSell;
    const category = selectedCate === "Sunglasses" ? 1 : 2;

    /** 인풋 값들 가져오기 */
    const title = current.title.value;
    const price = current.price.value;
    const content = current.content.value;
    const size = current.size.value;

    console.log(is_sell);
    console.log(category);
    console.log(title);
    console.log(price);
    console.log(content);
    console.log(size);

    //유효성 검사
    try {
      regexHelper.value(title, "Please enter product title name.");
      regexHelper.value(price, "Please enter product price.");
      regexHelper.value(content, "Please enter product description.");
      regexHelper.value(size, "Please enter product size.");
      regexHelper.num(price, "Prices must be numeric only.");
      regexHelper.maxLength(
        title,
        20,
        "Title can contain up to 20 characters."
      );
    } catch (error) {
      console.error(error);
      return;
    }

    /** 사진 업로드 실행 */
    if (imgFile.current) {
      // 백엔드로 전송하기 위한 formData 생성
      const formData = new FormData();

      // 이미지 파일 값이 있는 경우에만 formData에 담기
      if (imgFile.current) {
        imgFile.current?.forEach((v, i) => formData.append("product", v));
      }

      let newFile = null;

      try {
        const response = await axios.post("/upload/multiple", formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });

        newFile = response.data;
      } catch (err) {
        newFile = err.response.data;
        alert(`[${newFile.rt}] ${newFile.rtmsg}`);
        return;
      }
      const imagesURL = [];
      newFile.map((v) => {
        return imagesURL.push(v.url);
      });
      imgURL.current = imagesURL;
    }
    /** 데이터 베이스 저장 요청 */

    const img = imgURL.current;

    dispatch(
      postItem({
        title: title,
        price: price,
        content: content,
        size: size,
        is_sell: is_sell,
        sub_category_subcateno: category,
        // 이미지가 없을 경우에는 null을 대입하고 있을 경우엔 이미지 파일 경로를 대입함
        img1: img && img[0] ? img[0] : null,
        img2: img && img[1] ? img[1] : null,
        img3: img && img[2] ? img[2] : null,
        img4: img && img[3] ? img[3] : null,
        img5: img && img[4] ? img[4] : null,
        img6: img && img[5] ? img[5] : null,
      })
    ).then(({payload}) => {
        if (payload.rtcode === 200) {
          window.alert('The product has been successfully registered.');
          navigate('/admin/product_management');
        } else {
          window.alert(
            '"An error occurred during product registration.');
            return;
        }
      });;
  });

  // cateData의 순서를 오름 순으로 바꾸기 위해 (slice는 배열 일부를 추출하여 새로운 배열을 만듬 , sort는 정렬해줌)
  // 부작용을 막기 위해 새로운 배열로 만드는 걸 추천해서 slice를 사용
  const sortedCateData = cateData
    ?.slice()
    .sort((a, b) => a.subcateno - b.subcateno);

  return (
    <>
      <Spinner loading={cateLoading || loading} />
      {cateError || error ? (
        <ErrorView error={cateError || error} />
      ) : (
        <Container onSubmit={onSubmitForm}>
          <div className="header">
            <h1>Product registration</h1>
          </div>
          <hr />
          <div className="category">
            <h4>Product Category</h4>
            <div className="cateContainer" onClick={toggleCategory}>
              <div className="spans">
                <span>{selectedCate}</span>
                <span className="cateBox">&darr;</span>
              </div>
              {categoryDropdown && sortedCateData && (
                <div className="dropdownBox">
                  <ul>
                    {sortedCateData.map((v, i) => {
                      return (
                        <li
                          key={i}
                          value={v?.subcateno}
                          onClick={() => {
                            onClickCategory(v?.subcateno);
                          }}
                        >
                          {v?.subcateno === 1 ? "Sunglasses" : "Glasses"}
                        </li>
                      );
                    })}
                  </ul>
                </div>
              )}
            </div>
          </div>
          <div className="images">
            <h4>Product Images</h4>
            <div className="imageContainer">
              <div className="imageBox">
                {previewImg.length > 0 ? (
                  previewImg.map((v, i) => {
                    return <img key={i} src={v} alt={`Product + ${i}`} />;
                  })
                ) : (
                  <>
                    <img src={noimage} alt="noImage" />
                    <img src={noimage} alt="noImage" />
                    <img src={noimage} alt="noImage" />
                    <img src={noimage} alt="noImage" />
                    <img src={noimage} alt="noImage" />
                    <img src={noimage} alt="noImage" />
                  </>
                )}
              </div>
              <div className="button">
                <input
                  type="file"
                  id="imageInput"
                  onChange={onClickChangeImg}
                  multiple
                />
              </div>
            </div>
          </div>

          <div className="title">
            <h4>Product Title</h4>
            <input type="text" name="title"></input>
          </div>
          <div className="price">
            <h4>Prodct Price</h4>
            <input type="text" name="price"></input>
          </div>
          <div className="content">
            <h4>Prodct Content</h4>
            <textarea name="content"></textarea>
          </div>
          <div className="size">
            <h4>Prodct Size</h4>
            <textarea name="size"></textarea>
          </div>
          <div className="is_sell">
            <h4>Product Availability</h4>
            <div className="isSellContainer" onClick={toggleIsSell}>
              <div className="spans">
                <span>{selectedIsSell || "is_sell"}</span>
                <span className="isSellBox">&darr;</span>
              </div>
              {isSellDropdown && (
                <div Name="dropdownBox">
                  <ul>
                    <li
                      value="Y"
                      onClick={() => {
                        onClickIsSell("Y");
                      }}
                    >
                      Y
                    </li>
                    <li
                      value="N"
                      onClick={() => {
                        onClickIsSell("N");
                      }}
                    >
                      N
                    </li>
                  </ul>
                </div>
              )}
            </div>
          </div>
          <div className="buttons">
            <button onClick={moveToBack}>Back</button>
            <button type="submit">Register</button>
          </div>
        </Container>
      )}
    </>
  );
});

export default AddProduct;
