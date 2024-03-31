import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useParams } from "react-router-dom";
import { getDetailCommunities, toggleLike } from "../../apis/CommunityApi";
import styled from "styled-components";
import grayheart from "../../assets/svg/grayheart.svg";
import like from "../../assets/svg/greenheart.svg";
import Speech from "../../assets/svg/Speech Bubble.svg";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";

interface ImgProps {
  backgroundImage: string;
}

const All = styled.div`
  width: 100%;
  font-family: "GamtanRoad Dotum TTF";
  height: 100%;
  padding-right: 3rem;
  padding-left: 3rem;
  align-items: center;
`;

const Content = styled.div`
  font-size: 1rem;
  font-weight: bold;
  font-size: 0.875rem;
  font-weight: 400;
  line-height: 1.25rem;
`;

const Img = styled.div<ImgProps>`
  width: 20rem;
  height: 20rem;
  background-image: ${(props) => `url(${props.backgroundImage})`};
  background-size: cover;
  background-position: center;
  border-radius: 0.875rem;
  margin-bottom: 1rem;
  margin-top: 1rem;
`;

const Heart = styled.div<ImgProps>`
  width: 0.9375rem;
  height: 0.85225rem;
  background-image: url(${(props) => props.backgroundImage});
  background-size: cover;
  background-position: center;
  flex-shrink: 0;
`;

const Num = styled.div`
  color: var(--gray2, #c8c8c8);
  font-family: "GamtanRoad Dotum TTF";
  font-size: 0.875rem;
  font-style: normal;
  font-weight: 400;
  line-height: normal;
`;

const HeartBox = styled.div`
  display: flex;
  width: 21rem;
  padding: 0rem 1.125rem 0rem 17.125rem;
  justify-content: flex-end;
  align-items: center;
  gap: 0.375rem;
  margin-top: 1rem;
  margin-bottom: 1rem;
`;

const CommunityContent = () => {
  const queryClient = useQueryClient();
  const { communityId } = useParams<{ communityId: string }>();
  const { data: community, isLoading } = useQuery({
    queryKey: ["CommunityDetail"],
    queryFn: communityId ? () => getDetailCommunities(communityId) : undefined,
  });

  const { mutate } = useMutation({
    mutationFn: () => toggleLike(communityId),
    onSuccess: () => {
      queryClient.invalidateQueries(["CommunityDetail", communityId]);
    },
    onError: (error) => {
      console.log(error);
    },
  });

  if (isLoading) {
    return <div>Loading..</div>;
  }

  const handleLikeClick = () => {
    mutate();
  };

  return (
    <All>
      {community.imgurls && community.imgurls.length > 0 && (
        <Swiper
          modules={[Navigation]}
          navigation
          spaceBetween={50}
          slidesPerView={1}
        >
          {community.imgurls.map((url: string, index: number) => (
            <SwiperSlide key={index}>
              <Img backgroundImage={url} />
            </SwiperSlide>
          ))}
        </Swiper>
      )}
      <Content>{community.content}</Content>

      <HeartBox>
        <Heart
          backgroundImage={community.mylove ? like : grayheart}
          onClick={handleLikeClick}
        />
        <Num>{community.love}</Num>
        <img src={Speech} alt="" />
        <Num>{community.commentsize}</Num>
      </HeartBox>
    </All>
  );
};

export default CommunityContent;
