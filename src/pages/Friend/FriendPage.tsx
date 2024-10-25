/** @jsxImportSource @emotion/react */
import { useState, useMemo } from "react";
import { css } from "@emotion/react";
import { useNavigate } from "react-router-dom";
import { Search } from "@mui/icons-material";
import List from "@/components/common/List/List";
import {
  useGetFriends,
  useGetReceivedRequests,
  useGetSentRequests,
} from "@/api/hooks/useGetFriends";
import breakpoints from "@/variants/breakpoints";
import { Friend, SentRequest, ReceivedRequest } from "@/types/types";
import Button from "@/components/common/Button/Button";

// Styles
const pageStyles = css`
  width: 100%;
  max-width: 1200px;
  height: 100vh;
  padding: 10px 45px;
  display: flex;
  flex-direction: column;
  align-items: center;
  font-family: "Inter", sans-serif;
  box-sizing: border-box;
  @media (max-width: ${breakpoints.sm}px) {
    padding-top: 80px;
  }
`;

const searchBarStyles = css`
  display: flex;
  align-items: center;
  padding: 10px;
  background: #f4f4f4;
  border-radius: 16px;
  margin-bottom: 20px;
  width: 100%;
  box-sizing: border-box;
`;

const searchIconStyles = css`
  color: #aab2c8;
  font-size: 20px;
  margin-right: 10px;
`;

const searchInputStyles = css`
  flex: 1;
  border: none;
  background: transparent;
  font-size: 15.28px;
  font-weight: 700;
  color: #aab2c8;
  outline: none;
  &::placeholder {
    color: #aab2c8;
  }
`;

const tabsStyles = css`
  display: flex;
  justify-content: flex-end;
  gap: 28px;
  width: 100%;
  margin-bottom: 20px;
  box-sizing: border-box;
`;

const tabStyles = css`
  font-size: 15px;
  font-weight: 400;
  color: #9b9b9b;
  cursor: pointer;
  transition: color 0.3s ease;

  &.active {
    color: black;
    font-weight: 600;
  }
`;

const friendListStyles = css`
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 10px;
  box-sizing: border-box;
`;

const friendItemStyles = css`
  display: flex;
  align-items: center;
  padding: 10px;
  background: #f4f4f4;
  border-radius: 16px;
  box-sizing: border-box;
  width: 100%;
  flex-wrap: nowrap;
  min-width: 394px;
`;

const buttonContainerStyles = css`
  display: flex;
  gap: 10px; // 버튼 사이의 간격
  margin-left: auto; // 오른쪽 끝으로 배치
  margin-right: 20px;
`;

// List 아이템을 렌더링하는 컴포넌트
const FriendItem = ({ friend }: { friend: Friend }) => {
  const navigate = useNavigate();

  const handleVisitClick = () => {
    navigate(`/friend/${friend.friend_id}`, {
      state: { friendName: friend.friend_name },
    });
  };

  return (
    <div key={friend.friend_id} css={friendItemStyles}>
      <List
        profileSrc={friend.friend_profile_image}
        name={friend.friend_name}
        date={new Date(friend.createdAt).toLocaleString()}
      />
      <div css={buttonContainerStyles}>
        <Button size="small" theme="primary" onClick={handleVisitClick}>
          방문
        </Button>
        <Button
          size="small"
          theme="secondary"
          onClick={() => console.log("삭제 clicked")}
        >
          삭제
        </Button>
      </div>
    </div>
  );
};

function isSentRequest(
  request: SentRequest | ReceivedRequest,
): request is SentRequest {
  return (request as SentRequest).receiver_name !== undefined;
} // 타입가드

const RequestItem = ({
  request,
  type,
}: {
  request: SentRequest | ReceivedRequest;
  type: "sent" | "received";
}) => {
  return (
    <div key={request.id} css={friendItemStyles}>
      <List
        profileSrc={request.friend_profile_image}
        name={
          isSentRequest(request)
            ? request.receiver_name
            : request.requester_name
        }
        date={request.status}
      />
      <div css={buttonContainerStyles}>
        {type === "sent" ? (
          <Button
            style={{ marginRight: "10px" }}
            size="small"
            theme="primary"
            onClick={() => console.log("취소 clicked")}
          >
            취소
          </Button>
        ) : (
          <>
            <Button
              style={{ paddingRight: "10px" }}
              size="small"
              theme="primary"
              onClick={() => console.log("수락 clicked")}
            >
              수락
            </Button>
            <Button
              style={{ margin: "10px" }}
              size="small"
              theme="secondary"
              onClick={() => console.log("거절 clicked")}
            >
              거절
            </Button>
          </>
        )}
      </div>
    </div>
  );
};

export default function FriendListPage() {
  const [activeTab, setActiveTab] = useState("friendList");
  const [searchQuery, setSearchQuery] = useState("");

  // React Query 훅 사용
  const { data: friendList = [], isLoading: isLoadingFriends } =
    useGetFriends();
  const { data: receivedRequests = [], isLoading: isLoadingReceived } =
    useGetReceivedRequests();
  const { data: sentRequests = [], isLoading: isLoadingSent } =
    useGetSentRequests();

  const renderedFriendList = useMemo(
    () =>
      friendList.map((friend) => (
        <FriendItem key={friend.friend_id} friend={friend} />
      )),
    [friendList],
  );
  const renderedSentRequests = useMemo(
    () =>
      sentRequests.map((request) => (
        <RequestItem key={request.id} request={request} type="sent" />
      )),
    [sentRequests],
  );
  const renderedReceivedRequests = useMemo(
    () =>
      receivedRequests.map((request) => (
        <RequestItem key={request.id} request={request} type="received" />
      )),
    [receivedRequests],
  );

  return (
    <div css={pageStyles}>
      <div css={tabsStyles}>
        <div
          css={tabStyles}
          className={activeTab === "friendSearch" ? "active" : ""}
          onClick={() => setActiveTab("friendSearch")}
          role="button"
          tabIndex={0}
        >
          친구 검색
        </div>
        <div
          css={tabStyles}
          className={activeTab === "friendList" ? "active" : ""}
          onClick={() => setActiveTab("friendList")}
          role="button"
          tabIndex={0}
        >
          친구 목록
        </div>
        <div
          css={tabStyles}
          className={activeTab === "receivedRequests" ? "active" : ""}
          onClick={() => setActiveTab("receivedRequests")}
          role="button"
          tabIndex={0}
        >
          받은 요청
        </div>
        <div
          css={tabStyles}
          className={activeTab === "sentRequests" ? "active" : ""}
          onClick={() => setActiveTab("sentRequests")}
          role="button"
          tabIndex={0}
        >
          보낸 요청
        </div>
      </div>
      <div css={friendListStyles}>
        {activeTab === "friendSearch" && (
          <div css={searchBarStyles}>
            <Search css={searchIconStyles} />
            <input
              css={searchInputStyles}
              placeholder="검색"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        )}
        {activeTab === "friendList" && !isLoadingFriends && renderedFriendList}
        {activeTab === "sentRequests" && !isLoadingSent && renderedSentRequests}
        {activeTab === "receivedRequests" &&
          !isLoadingReceived &&
          renderedReceivedRequests}
      </div>
    </div>
  );
}
