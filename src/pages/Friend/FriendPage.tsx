/** @jsxImportSource @emotion/react */
import { useState, useMemo } from "react";
import { css } from "@emotion/react";
import { useNavigate } from "react-router-dom";
import { Search } from "@mui/icons-material";
import ProfileImage from "@/components/common/ProfileImage/ProfileImage";
import UserInfo from "@/components/common/UserInfo/UserInfo";
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
  padding: 32px; /* Adjusted padding */
  display: flex;
  flex-direction: column;
  align-items: center;
  font-family: "Inter", sans-serif;
  box-sizing: border-box;
  overflow-x: hidden;
  background-color: #ffffff;
`;

const headingStyles = css`
  font-size: 24px; /* text-3xl */
  font-weight: 600; /* font-semibold */
  margin-bottom: 24px; /* mb-6 */
  color: #2d3748; /* text-gray-800 */
  margin-right: auto;
`;

const searchBarStyles = css`
  display: flex;
  align-items: center;
  padding: 10px;
  border-radius: 8px;
  margin-bottom: 20px;
  width: 100%;
  box-sizing: border-box;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  background-color: #ffffff;
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
  color: #4a5568;
  outline: none;
  &::placeholder {
    color: #aab2c8;
  }
`;

const searchButtonStyles = css`
  color: #39a7f7;
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
  flex-wrap: wrap;
`;

const tabStyles = css`
  font-size: 15px;
  font-weight: 400;
  color: #9b9b9b;
  cursor: pointer;
  transition: color 0.3s ease;

  &.active {
    color: #39a7f7;
    font-weight: 600;
  }
`;

const friendListStyles = css`
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 16px; /* Adjusted gap */
  box-sizing: border-box;
`;

const friendItemStyles = css`
  display: flex;
  align-items: center;
  background-color: #ffffff;
  border-radius: 8px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  padding: 16px;
  transition: box-shadow 0.2s;
  &:hover {
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.15);
  }
`;

const profileImageWrapperStyles = css`
  margin-right: 16px;
`;

const buttonContainerStyles = css`
  display: flex;
  gap: 10px;
  margin-left: auto;
`;

const emptyMessageStyles = css`
  text-align: center;
  color: #999;
  font-size: 16px;
  margin-top: 20px;
`;

const FriendPage = () => {
  const [activeTab, setActiveTab] = useState("friendList");
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<SearchResult | null>(null);
  const [searched, setSearched] = useState(false);

  // React Query hooks
  const {
    data: friendList = [],
    isLoading: isLoadingFriends,
    refetch: refetchFriends,
  } = useGetFriends();

  const {
    data: receivedRequests = [],
    isLoading: isLoadingReceived,
    refetch: refetchReceivedRequests,
  } = useGetReceivedRequests();

  const {
    data: sentRequests = [],
    isLoading: isLoadingSent,
    refetch: refetchSentRequests,
  } = useGetSentRequests();

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

  const renderedFriendList = useMemo(() => {
    if (friendList.length === 0) {
      return <p css={emptyMessageStyles}>친구가 없습니다.</p>;
    }
    return friendList.map((friend) => (
      <FriendItem
        key={friend.userId}
        friend={friend}
        refetchFriends={refetchFriends}
      />
    ));
  }, [friendList, refetchFriends]);

  const renderedSentRequests = useMemo(() => {
    if (sentRequests.length === 0) {
      return <p css={emptyMessageStyles}>보낸 요청이 없습니다.</p>;
    }
    return sentRequests.map((request) => (
      <RequestItem
        key={request.id}
        request={request}
        type="sent"
        refetchFriends={refetchFriends}
        refetchReceivedRequests={refetchReceivedRequests}
        refetchSentRequests={refetchSentRequests}
      />
    ));
  }, [
    sentRequests,
    refetchFriends,
    refetchReceivedRequests,
    refetchSentRequests,
  ]);

  const renderedReceivedRequests = useMemo(() => {
    if (receivedRequests.length === 0) {
      return <p css={emptyMessageStyles}>받은 요청이 없습니다.</p>;
    }
    return receivedRequests.map((request) => (
      <RequestItem
        key={request.id}
        request={request}
        type="received"
        refetchFriends={refetchFriends}
        refetchReceivedRequests={refetchReceivedRequests}
        refetchSentRequests={refetchSentRequests}
      />
    ));
  }, [
    receivedRequests,
    refetchFriends,
    refetchReceivedRequests,
    refetchSentRequests,
  ]);

  return (
    <div css={pageStyles}>
      <h1 css={headingStyles}>친구</h1>
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
            {searched && !searchResults && (
              <p css={emptyMessageStyles}>검색 결과가 없습니다.</p>
            )}
            {searchResults && (
              <SearchResultItem
                friend={searchResults}
                refetchSentRequests={refetchSentRequests}
              />
            )}
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
};

// Components

// 검색 결과 아이템 컴포넌트
const SearchResultItem = ({
  friend,
  refetchSentRequests,
}: {
  friend: SearchResult;
  refetchSentRequests: () => void;
}) => {
  const { sendFriendRequest, isLoading } = useFriendRequest();

  const handleFriendRequest = async () => {
    await sendFriendRequest(friend.id);
    refetchSentRequests();
  };

  return (
    <div css={friendItemStyles}>
      <div css={profileImageWrapperStyles}>
        <ProfileImage src={friend.profileImage} alt={friend.nickname} />
      </div>
      <UserInfo name={friend.nickname} />
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

// 친구 아이템 컴포넌트
const FriendItem = ({
  friend,
  refetchFriends,
}: {
  friend: Friend;
  refetchFriends: () => void;
}) => {
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
      deleteFriendMutation.mutate(undefined, {
        onSuccess: () => {
          refetchFriends();
          alert("친구를 삭제했습니다.");
        },
      });
    }
  };

  return (
    <div css={friendItemStyles}>
      <div css={profileImageWrapperStyles}>
        <ProfileImage src={friend.profileImage} alt={friend.nickname} />
      </div>
      <UserInfo name={friend.nickname} />
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

// 요청 아이템 컴포넌트
function isSentRequest(
  request: SentRequest | ReceivedRequest,
): request is SentRequest {
  return (request as SentRequest).receiverName !== undefined;
}

const RequestItem = ({
  request,
  type,
  refetchFriends,
  refetchReceivedRequests,
  refetchSentRequests,
}: {
  request: SentRequest | ReceivedRequest;
  type: "sent" | "received";
  refetchFriends: () => void;
  refetchReceivedRequests: () => void;
  refetchSentRequests: () => void;
}) => {
  const acceptFriendRequestMutation = useAcceptFriendRequest(request.id);
  const rejectFriendRequestMutation = useRejectFriendRequest(request.id);
  const cancelFriendRequestMutation = useCancelFriendRequest(request.id);

  const handleAcceptClick = () => {
    if (window.confirm("이 친구 요청을 수락하시겠습니까?")) {
      acceptFriendRequestMutation.mutate(undefined, {
        onSuccess: () => {
          refetchFriends();
          refetchReceivedRequests();
          alert("친구 요청을 수락했습니다.");
        },
      });
    }
  };

  const handleRejectClick = () => {
    if (window.confirm("이 친구 요청을 거절하시겠습니까?")) {
      rejectFriendRequestMutation.mutate(undefined, {
        onSuccess: () => {
          refetchReceivedRequests();
          alert("친구 요청을 거절했습니다.");
        },
      });
    }
  };

  const handleCancelClick = () => {
    if (window.confirm("이 친구 요청을 취소하시겠습니까?")) {
      cancelFriendRequestMutation.mutate(undefined, {
        onSuccess: () => {
          refetchSentRequests();
          alert("친구 요청을 취소했습니다.");
        },
      });
    }
  };

  return (
    <div css={friendItemStyles}>
      <div css={profileImageWrapperStyles}>
        <ProfileImage
          src={request.profileImage}
          alt={
            isSentRequest(request)
              ? request.receiverName
              : request.requesterName
          }
        />
      </div>
      <UserInfo
        name={
          isSentRequest(request) ? request.receiverName : request.requesterName
        }
      />
      <div css={buttonContainerStyles}>
        {type === "sent" ? (
          <Button size="small" theme="primary" onClick={handleCancelClick}>
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

export default FriendPage;
