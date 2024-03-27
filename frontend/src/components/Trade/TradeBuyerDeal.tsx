import styled from "styled-components";
import { TopBar } from "../common/Navigator/navigator";
import Coli from "/src/assets/images/브로콜리.png";
import { LayoutMainBox } from "../common/Layout/Box";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { getTradeDetail, useLike } from "../../apis/TradeApi";
import { useParams } from "react-router-dom";
import { Swiper, SwiperSlide } from "swiper/react";
import Send from "/src/assets/images/send.png";
import "swiper/css";
import "swiper/css/navigation";

import StyledInput from "../common/Input/StyledInput";
import useInput from "../../hooks/useInput";
interface ImageResponse {
  img_store_url: string;
}
interface SituationResponse {
  border: string;
  color: string;
}
interface Icon {
  width?: number;
  height: number;
  backgroundColor: string;
  color: string;
  text?: string;
}
const AppContainer = styled.div`
  display: flex;
  flex-direction: column;
  height: 100vh; /* 전체 화면 높이 */
`;

const ImgBox = styled.img`
  width: 100%;
  height: 15.5625rem;
  object-fit: cover;
`;
const InfoBox = styled.div`
  width: 100%;
  height: 2.125rem;
  display: flex;
  justify-content: space-between;
  gap: 8.81rem;
  position: relative;
`;
const Profile = styled.div`
  width: 5.875rem;
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 0.2rem;
`;
const Name = styled.div`
  width: auto;
  display: flex;
  flex-direction: column;
  gap: 0.2rem;
`;
const NameText = styled.text`
  font-size: 0.8125rem;
  font-style: normal;
  font-weight: bold;
  color: #000000;
`;
const ClassesText = styled.div`
  color: #4f4f4f;
  display: flex;
  font-size: 0.6875rem;
  font-weight: 400;
  align-items: center;
  gap: 0.2rem;
`;
const Date = styled.div`
  width: auto;
  position: absolute;
  right: 0;
  bottom: 0;
  color: "#8C8C8C";
  font-size: 0.6875rem;
  font-weight: "400";
`;

const SwiperContainer = styled.div`
  width: 100%;
  height: 12.5rem;
`;
const Thumbnail = styled.img`
  width: 1.875rem;
  height: 1.875rem;
`;
const Title = styled.div`
  justify-content: flex-start;
  color: #000;
  width: 100%;
  height: 2.0625rem;
  font-size: 1.25rem;
  font-weight: bold;
  display: flex;
  align-items: center;
  border-bottom: 1px solid #f4f4f4;
`;
const SituationBox = styled.div`
  width: 100%;
  justify-content: flex-start;
  display: flex;
  flex-direction: column;
  gap: 0.69rem;
  padding-bottom: 0.5rem;
  border-bottom: 1px solid #f4f4f4;
`;
const Situation = styled.div<SituationResponse>`
  text-align: center;
  display: flex;
  width: 3.5rem;
  height: 1.625rem;
  border-radius: 0.625rem;
  border: ${(props) => `${props.border}`};
  color: ${(props) => `${props.color}`};
  align-items: center;
  font-size: 0.75rem;
  font-weight: bold;
  justify-content: center;
`;
const LayoutInnerBox = styled.div`
  display: flex;
  width: 19.875rem;
  flex-direction: column;
  justify-content: center;
  align-items: flex-start;
  gap: 1.5rem;
  padding: 1.12rem 0;
`;
const TextStyle = styled.div`
  align-items: center;
  display: flex;
  color: #000;
  font-size: 0.8125rem;
  font-weight: 400;
  margin-left: 0.5rem;
`;
const SituationGroup = styled.div`
  width: auto;
  height: auto;
  align-items: center;
  display: flex;
  flex-direction: row;
  gap: 0.5rem;
`;
const DealBox = styled.div`
  width: 100%;
  height: 9.8rem;
  overflow-y: scroll;
  flex-direction: column;
  gap: 1rem;
  display: flex;
`;
const DealList = styled.div`
  padding-right: 0.5rem;
  width: 100%;
  justify-content: space-between;
  height: 2.0625rem;
  border-radius: 0.625rem;
  background: var(--sub1, #e5f9db);
  display: flex;
  align-items: center;
`;
const ProfileBox = styled.div`
  width: auto;
  justify-content: space-between;
  gap: 0.6rem;
  align-items: center;
  color: #000;
  font-size: 0.8125rem;
  font-weight: bold;
  display: flex;
`;
const CostBox = styled.div`
  color: var(--a-0-d-8-b-3, #2a7f00);
  text-align: right;
  font-size: 0.8125rem;
  font-weight: bold;
  align-items: center;
  display: flex;
`;
const PhotoBox = styled.img`
  width: 2.0625rem;
  height: 2.0625rem;
  border-radius: 50%;
  object-fit: cover;
`;
const DealInput = styled.input`
  display: flex;
  justify-content: flex-start;
  padding-left: 1rem;
  width: 17rem;
  height: 2.1875rem;
  border-radius: 1rem;
  border: 1px solid var(--gray2, #c8c8c8);
  font-size: 0.875rem;
`;
const SendButton = styled.img`
  width: 2.1875rem;
  height: 2.1875rem;
`;
const DealChatBox = styled.div`
  display: flex;
  width: 100%;
  justify-content: space-between;
  align-items: center;
`;
const TradeBuyerDetail = () => {
  const navigate = useNavigate();
  const [dealCash, setDealCash] = useInput("");
  const [like, setLike] = useState<boolean>(false);
  const handleLike = () => {
    setLike(!like);
  };

  const { mutate: handleLikeClick } = useLike();
  const { postId } = useParams<{ postId?: string }>();
  const postNumber = Number(postId);
  const accessToken = sessionStorage.getItem("accessToken");
  const { isLoading, data, error } = useQuery({
    queryKey: ["tradeDetail", postNumber],
    queryFn: accessToken
      ? () => getTradeDetail(accessToken, postNumber)
      : undefined,
  });

  const formatDateAndTime = (dateString: string) => {
    if (!dateString) return "";
    const [date, time] = dateString.split("T");
    const [hours, minutes, seconds] = time.split(":");
    return `${date} ${hours}:${minutes}:${seconds}`;
  };

  return (
    <AppContainer>
      <TopBar title="작물거래" showBack={true} showEdit={true} />
      <LayoutMainBox>
        <LayoutInnerBox>
          <SwiperContainer>
            <Swiper
              slidesPerView={1}
              pagination={true}
              onSlideChange={() => console.log("slide change")}
              onSwiper={(swiper) => console.log(swiper)}
            >
              {data?.imageResponses.map(
                (image: ImageResponse, index: number) => (
                  <SwiperSlide key={index}>
                    <ImgBox src={image.img_store_url} alt={"img"} />
                  </SwiperSlide>
                )
              )}
            </Swiper>
          </SwiperContainer>
          <InfoBox>
            <Profile>
              <Thumbnail src={data?.userResponse.thumbnail} alt="profile" />
              <Name>
                <NameText>{data?.userResponse.nickname}</NameText>
                <ClassesText>
                  {data?.userResponse.rank}
                  {/* <img src={Sprout} alt="Sprout" /> */}
                </ClassesText>
              </Name>
            </Profile>
            <Date>{formatDateAndTime(data?.exArticleResponse.time)}</Date>
          </InfoBox>

          <Title>{data?.exArticleResponse.exArticleTitle}</Title>
          <SituationBox>
            <SituationGroup>
              <Situation
                border="2px solid var(--sub3, #FFBFBF)"
                color="#FFBFBF;"
              >
                최고가
              </Situation>
              <TextStyle>800원</TextStyle>
            </SituationGroup>
            <SituationGroup>
              <Situation
                border="2px solid var(--sub0, #A0D8B3)"
                color="#A0D8B3;"
              >
                참여자
              </Situation>
              <TextStyle>3명</TextStyle>
            </SituationGroup>
          </SituationBox>
          <DealBox>
            <DealList>
              <ProfileBox>
                <PhotoBox src={Coli} alt="coli" />
                고두심우석
              </ProfileBox>
              <CostBox>300원</CostBox>
            </DealList>
            <DealList>
              <ProfileBox>
                <PhotoBox src={Coli} alt="coli" />
                고두심우석
              </ProfileBox>
              <CostBox>300원</CostBox>
            </DealList>
          </DealBox>
          <DealChatBox>
            <DealInput placeholder="최고가보다 높게 제안해주세요" />
            <SendButton src={Send} alt="send" />
          </DealChatBox>
        </LayoutInnerBox>
      </LayoutMainBox>
    </AppContainer>
  );
};

export default TradeBuyerDetail;