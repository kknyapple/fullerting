import styled from "styled-components";
import StyledInput from "../../components/common/Input/StyledInput";
import TradePostLayout from "../../components/common/Layout/TradePostLayout";
import useInput from "../../hooks/useInput";
import NonCheck from "/src/assets/svg/noncheck.svg";
import Check from "/src/assets/svg/check.svg";
import { useEffect, useState } from "react";
import StyledTextArea from "../../components/common/Input/StyledTextArea";
import CheckModal from "../../components/Trade/finishModal";
import SelectModal from "../../components/Trade/SelectModal";
import Diary from "/src/assets/svg/plus-diary.svg";
import Camera from "/src/assets/svg/camera.svg";
import MultiFileUploadInput from "../../components/common/Input/MultiFileUploadInput";
import { useMutation } from "@tanstack/react-query";
import { usePost } from "../../apis/TradeApi";
import { useAtom } from "jotai";
import { imageFilesAtom } from "../../stores/trade";

interface BackGround {
  backgroundColor?: string;
  zIndex?: number;
}
const RadioBox = styled.div`
  width: 100%;
  height: auto;
  justify-content: space-around;
  gap: 0.5rem;
  display: flex;
  flex-direction: column;
`;
const RadioBoxContainer = styled.div`
  width: auto;
  justify-content: flex-start;
  gap: 0.5rem;
  align-items: center;
  display: flex;
  flex-direction: row;
`;
const SelectContainer = styled.div`
  width: auto;
  justify-content: space-between;
  gap: 0.12rem;
  align-items: center;
  display: flex;
  flex-direction: row;
`;
const TitleText = styled.div`
  width: auto;
  font-size: 0.875rem; // 제목의 글씨 크기 조정
  color: #8c8c8c; // 제목의 글씨 색상
  font-weight: bold;
`;

const BiddingBox = styled.div`
  background-color: #eee;
  width: 100%;
  padding: 0.625rem 0.9375rem;
  border: 1px solid #d3d3d3;
  height: 3rem;
  border-radius: 0.5rem;
  align-items: center;
  display: flex;
`;
const CashText = styled.div`
  width: auto;
  font-size: 0.875rem;
  font-style: normal;
  font-weight: 400;
  color: #000000;
`;
const DiaryBox = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: flex-start;
  width: 19.875rem;
  gap: 0.6rem;
`;
const Label = styled.label`
  display: flex;
  color: ${({ theme }) => theme.colors.gray0};
  text-align: center;
  font-size: 0.875rem;
  font-weight: bold;
`;
const SelectBackGround = styled.div<BackGround>`
  position: fixed; // 화면 전체에 고정되도록 설정
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: ${(props) =>
    props.backgroundColor || "rgba(0, 0, 0, 0.5)"}; // 기본 배경색 설정
  z-index: ${(props) =>
    props.zIndex || 1000}; // 다른 컨텐츠 위에 오도록 z-index 설정
  display: flex;
  justify-content: center; // 자식 요소들을 가운데 정렬
  align-items: center; // 자식 요소들을 수직 중앙 정렬
`;
const DiarySquare = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: row;
  width: 4.2rem;
  height: 4.2rem;
  border-radius: 1rem;
  border: 2px solid ${({ theme }) => theme.colors.gray1};
  background: ${({ theme }) => theme.colors.white};
`;
const TradePost = () => {
  const [title, setTitle] = useInput("");
  const [check, setCheck] = useState([true, false]);
  const [cashCheck, setCashCheck] = useState<boolean>(false);
  const [cash, setCash] = useInput("");
  const [content, setContent] = useInput("");
  const closeModal = () => {
    setModal(false);
  };
  const handleRadioClick = (index: number) => {
    setCheck(check.map((a, i) => !a));
  };
  const [modal, setModal] = useState<boolean>(false);
  const handleCashClick = () => {
    setCashCheck(!cashCheck);
  };
  const openModal = () => {
    setModal(true);
  };
  useEffect(() => {
    console.log(document.body);
    // 모달이 열리면 body의 overflow를 hidden으로 설정
    if (modal) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }

    // 컴포넌트가 언마운트 될 때 원래 상태로 복구
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [modal]);
  const [selectedFiles] = useAtom(imageFilesAtom);
  const { mutate: handlePost } = usePost();
  const handleCheckClick = () => {
    handlePost({
      exArticleTitle: `${title}`,
      exArticleContent: "내용",
      exArticleType: "타입",
      img: ["이미지1", "이미지2"],
      ex_article_location: "위치",
      deal_cur_price: 1000,
    });
  };
  const click = () => {
    console.log(selectedFiles);
  };
  return (
    <>
      {modal && (
        <SelectBackGround backgroundColor="rgba(4.87, 4.87, 4.87, 0.28)">
          <SelectModal closeModal={closeModal} />
        </SelectBackGround>
      )}
      <TradePostLayout title="작물거래">
        <StyledInput
          label="제목"
          type="text"
          id="title"
          name="title"
          placeholder="제목을 입력해주세요"
          onChange={setTitle}
          isRequired={false}
        />
        <RadioBox>
          <TitleText>거래 방법</TitleText>
          <RadioBoxContainer>
            {check.map((isChecked, index) => (
              <SelectContainer
                key={index}
                onClick={() => handleRadioClick(index)}
              >
                <img
                  src={isChecked ? Check : NonCheck}
                  alt={isChecked ? "Checked" : "Not checked"}
                  style={{ marginRight: "0.12rem" }}
                />
                <TitleText>{index === 0 ? "제안" : "일반 거래"}</TitleText>
              </SelectContainer>
            ))}
          </RadioBoxContainer>
        </RadioBox>
        <RadioBox>
          <TitleText>거래 단위</TitleText>
          <RadioBoxContainer>
            {cashCheck === true ? (
              <SelectContainer>
                <img
                  src={Check}
                  alt="check"
                  onClick={handleCashClick}
                  style={{ marginRight: "0.12rem" }}
                />{" "}
                <TitleText>현금</TitleText>
              </SelectContainer>
            ) : (
              <SelectContainer>
                <img
                  src={NonCheck}
                  alt="check"
                  onClick={handleCashClick}
                  style={{ marginRight: "0.12rem" }}
                />{" "}
                <TitleText>현금</TitleText>
              </SelectContainer>
            )}
          </RadioBoxContainer>
        </RadioBox>
        <StyledInput
          label="시작가"
          type="text"
          id="startcash"
          name="startcash"
          placeholder="₩ 가격을 입력해주세요."
          onChange={setCash}
          isRequired={false}
        />
        <RadioBox>
          <TitleText>입찰 단위</TitleText>
          <BiddingBox>
            <CashText>100원</CashText>
          </BiddingBox>
        </RadioBox>
        <StyledInput
          label="거래 희망 장소"
          type="text"
          id="place"
          name="place"
          placeholder="거래 장소를 입력해주세요."
          onChange={setCash}
          isRequired={false}
        />
        <StyledTextArea
          label="내용"
          name="content"
          placeholder="내용을 입력해주세요."
          value={content}
          onChange={setContent}
          maxLength={300}
          isRequired={false}
        />
        <DiaryBox>
          <Label>작물 일지</Label>
          <DiarySquare onClick={openModal}>
            <img src={Diary} alt="diary" />
          </DiarySquare>
        </DiaryBox>
        <DiaryBox onClick={click}>
          <MultiFileUploadInput />
        </DiaryBox>
      </TradePostLayout>
    </>
  );
};

export default TradePost;