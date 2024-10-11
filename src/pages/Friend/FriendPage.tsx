/** @jsxImportSource @emotion/react */
import { useState, useMemo } from "react";
import { css } from "@emotion/react";
import List from "@/components/common/List/List";
import {
  useGetFriends,
  useGetReceivedRequests,
  useGetSentRequests,
} from "@/api/hooks/useGetFriends";
import breakpoints from "@/variants/variants";
import { Friend, SentRequest, ReceivedRequest } from "@/types/types";

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
  flex-wrap: wrap;
`;

const buttonContainerStyles = css`
  display: flex;
  gap: 10px;
  margin-left: auto;
`;

const buttonStyles = css`
  width: 100px;
  height: 50px;
  padding: 8px 24px;
  border-radius: 16px;
  font-size: 16px;
  font-weight: 700;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  box-sizing: border-box;
`;

const primaryButtonStyles = css`
  ${buttonStyles}
  background: #39A7F7;
  color: white;
  box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.25);
  border: none;
  outline: none;
`;

const secondaryButtonStyles = css`
  ${buttonStyles}
  background: white;
  color: #39a7f7;
  border: 1.5px solid #39a7f7;
  box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.25);
  outline: none;
  margin-right: 10px;
`; // button을 list에 포함예정

// List 아이템을 렌더링하는 컴포넌트
const FriendItem = ({ friend }: { friend: Friend }) => (
  <div key={friend.friend_id} css={friendItemStyles}>
    <List
      profileSrc={friend.friend_profile_image}
      name={friend.friend_name}
      date={new Date(friend.created_at).toLocaleString()}
    />
    <div css={buttonContainerStyles}>
      <button type="button" css={primaryButtonStyles}>
        방문
      </button>
      <button type="button" css={secondaryButtonStyles}>
        삭제
      </button>
    </div>
  </div>
);

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
}) => (
  <div key={request.id} css={friendItemStyles}>
    <List
      profileSrc="https://example.com/default.jpg"
      name={
        isSentRequest(request) ? request.receiver_name : request.requester_name
      }
      date={request.status}
    />
    <div css={buttonContainerStyles}>
      <button type="button" css={primaryButtonStyles}>
        {type === "sent" ? "취소" : "수락"}
      </button>
      {type === "received" && (
        <button type="button" css={secondaryButtonStyles}>
          거절
        </button>
      )}
    </div>
  </div>
);

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
            <span css={searchIconStyles}>&#128269;</span>
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
