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
  useGetFriendByNickname,
} from "@/api/hooks/useGetFriends";
import {
  useFriendRequest,
  useAcceptFriendRequest,
  useRejectFriendRequest,
  useCancelFriendRequest,
} from "@/api/hooks/useFriendRequest";
import useDeleteFriend from "@/api/hooks/useDeleteFriend";
import breakpoints from "@/variants/breakpoints";
import {
  Friend,
  SentRequest,
  ReceivedRequest,
  SearchResult,
} from "@/types/types";
import Button from "@/components/common/Button/Button";
import useUserData from "@/api/hooks/useUserData";

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

const searchButtonStyles = css`
  color: #aab2c8;
  cursor: pointer;
  font-weight: bold;
  margin-left: 10px;
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
  gap: 10px;
  margin-left: auto;
  margin-right: 20px;
`;

// 검색 결과 아이템 컴포넌트
const SearchResultItem = ({ friend }: { friend: SearchResult }) => {
  const { sendFriendRequest, isLoading } = useFriendRequest();

  const handleFriendRequest = () => {
    sendFriendRequest(friend.id);
  };

  return (
    <div css={friendItemStyles}>
      <List profileSrc={friend.profileImage} name={friend.nickname} />
      <div css={buttonContainerStyles}>
        <Button
          size="small"
          theme="primary"
          onClick={handleFriendRequest}
          disabled={isLoading}
        >
          친구 요청
        </Button>
      </div>
    </div>
  );
};

// List 아이템을 렌더링하는 컴포넌트
const FriendItem = ({ friend }: { friend: Friend }) => {
  const navigate = useNavigate();
  const deleteFriendMutation = useDeleteFriend(friend.userId);
  const { userData } = useUserData();
  const handleVisitClick = () => {
    navigate(`/friend/${friend.userId}`, {
      state: { friendName: friend.nickname, userId: userData.id },
    });
  };

  const handleDeleteClick = () => {
    if (window.confirm("정말로 삭제하시겠습니까?")) {
      deleteFriendMutation.mutate();
    }
  };

  return (
    <div key={friend.userId} css={friendItemStyles}>
      <List profileSrc={friend.profileImage} name={friend.nickname} />
      <div css={buttonContainerStyles}>
        <Button size="small" theme="primary" onClick={handleVisitClick}>
          방문
        </Button>
        <Button size="small" theme="secondary" onClick={handleDeleteClick}>
          삭제
        </Button>
      </div>
    </div>
  );
};

function isSentRequest(
  request: SentRequest | ReceivedRequest,
): request is SentRequest {
  return (request as SentRequest).receiverName !== undefined;
} // 타입가드

const RequestItem = ({
  request,
  type,
}: {
  request: SentRequest | ReceivedRequest;
  type: "sent" | "received";
}) => {
  const acceptFriendRequestMutation = useAcceptFriendRequest(request.id);
  const rejectFriendRequestMutation = useRejectFriendRequest(request.id);
  const cancelFriendRequestMutation = useCancelFriendRequest(request.id);

  const handleAcceptClick = () => {
    if (window.confirm("이 친구 요청을 수락하시겠습니까?")) {
      acceptFriendRequestMutation.mutate();
    }
  };

  const handleRejectClick = () => {
    if (window.confirm("이 친구 요청을 거절하시겠습니까?")) {
      rejectFriendRequestMutation.mutate();
    }
  };

  const handleCancelClick = () => {
    if (window.confirm("이 친구 요청을 취소하시겠습니까?")) {
      cancelFriendRequestMutation.mutate();
    }
  };

  return (
    <div key={request.id} css={friendItemStyles}>
      <List
        profileSrc={request.profileImage}
        name={
          isSentRequest(request) ? request.receiverName : request.requesterName
        }
      />
      <div css={buttonContainerStyles}>
        {type === "sent" ? (
          <Button
            style={{ marginRight: "10px" }}
            size="small"
            theme="primary"
            onClick={handleCancelClick}
          >
            취소
          </Button>
        ) : (
          <>
            <Button size="small" theme="primary" onClick={handleAcceptClick}>
              수락
            </Button>
            <Button size="small" theme="secondary" onClick={handleRejectClick}>
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
  const [searchResults, setSearchResults] = useState<SearchResult | null>(null);
  const [searched, setSearched] = useState(false);

  // React Query 훅 사용
  const { data: friendList = [], isLoading: isLoadingFriends } =
    useGetFriends();
  const { data: receivedRequests = [], isLoading: isLoadingReceived } =
    useGetReceivedRequests();
  const { data: sentRequests = [], isLoading: isLoadingSent } =
    useGetSentRequests();
  const { refetch: fetchFriendByNickname } =
    useGetFriendByNickname(searchQuery);

  const handleSearch = async () => {
    setSearched(true);
    if (searchQuery.trim()) {
      const { data } = await fetchFriendByNickname();
      if (data) {
        setSearchResults({
          id: data.id,
          nickname: data.nickname,
          profileImage: data.profileImage,
        });
      } else {
        setSearchResults(null);
      }
    } else {
      alert("검색어를 입력해주세요.");
    }
  };

  const handleSearchInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
    setSearched(false);
  };

  const renderedFriendList = useMemo(
    () =>
      friendList.map((friend) => (
        <FriendItem key={friend.userId} friend={friend} />
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
          <div>
            <div css={searchBarStyles}>
              <Search css={searchIconStyles} />
              <input
                css={searchInputStyles}
                placeholder="검색"
                value={searchQuery}
                onChange={handleSearchInputChange}
              />
              <span
                css={searchButtonStyles}
                onClick={handleSearch}
                role="button"
                tabIndex={0}
                onKeyPress={(e) => {
                  if (e.key === "Enter") handleSearch();
                }}
              >
                검색
              </span>
            </div>
            {searched && !searchResults && <p>검색 결과가 없습니다.</p>}
            {searchResults && <SearchResultItem friend={searchResults} />}
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
