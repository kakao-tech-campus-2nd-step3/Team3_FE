import { useState, useMemo } from "react";
import styled from "@emotion/styled";
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
import breakpoints from "@/variants/breakpoints";

// Styled Components
const PageContainer = styled.div`
  width: 100%;
  padding: 32px;
  display: flex;
  flex-direction: column;
  align-items: center;
  box-sizing: border-box;
  overflow-x: hidden;
  background-color: #ffffff;

  ${breakpoints.mobile} {
    padding: 10px;
  }
`;

const Heading = styled.h1`
  font-size: 24px;
  font-weight: 600;
  margin-bottom: 24px;
  color: #2d3748;
  margin-right: auto;

  ${breakpoints.mobile} {
    font-size: 20px;
    margin-bottom: 16px;
  }
`;

const TabsContainer = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 28px;
  width: 100%;
  margin-bottom: 20px;
  box-sizing: border-box;
  flex-wrap: wrap;

  ${breakpoints.mobile} {
    justify-content: center;
    gap: 16px;
  }
`;

const Tab = styled.div<{ active: boolean }>`
  font-size: 15px;
  font-weight: ${(props) => (props.active ? 600 : 400)};
  color: ${(props) => (props.active ? "#39a7f7" : "#9b9b9b")};
  cursor: pointer;
  transition: color 0.3s ease;

  ${breakpoints.mobile} {
    font-size: 14px;
  }
`;

const SearchBarWrapper = styled.div`
  width: 100%;

  ${breakpoints.mobile} {
    margin-bottom: 12px;
  }
`;
const SearchBar = styled.div`
  display: flex;
  flex: 1;
  align-items: center;
  padding: 10px;
  border-radius: 8px;
  margin-bottom: 20px;
  width: 100%;
  box-sizing: border-box;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  background-color: #ffffff;

  ${breakpoints.mobile} {
    padding: 8px;
  }
`;

const SearchIconStyled = styled(Search)`
  color: #aab2c8;
  font-size: 20px;
  margin-right: 10px;

  ${breakpoints.mobile} {
    font-size: 18px;
  }
`;

const SearchInput = styled.input`
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

  ${breakpoints.mobile} {
    font-size: 14px;
  }
`;

const SearchButton = styled.span`
  color: #39a7f7;
  cursor: pointer;
  font-weight: bold;
  margin-left: 10px;
`;

const FriendListContainer = styled.div`
  grid-template-columns: 1fr 1fr;
  width: 100%;
    display: grid;
    box-sizing: border-box;
    gap:16px;
  ${breakpoints.tablet} {
    grid-template-columns: 1fr;
    width: 100%;
    display: grid;
    box-sizing: border-box;
  }

  ${breakpoints.mobile} {
    gap: 12px;
    width: 100%;
    display: grid;
    box-sizing: border-box;
    grid-template-columns: 1fr;
  }
`;

const FriendItemContainer = styled.div`
  display: flex;
  align-items: center;
  background-color: #ffffff;
  border-radius: 8px;
  box-sizing: border-box;
  padding: 16px;
  gap: 16px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  transition: box-shadow 0.2s;
  &:hover {
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.15);
  }
  border: 1px solid #e5e7eb;
  ${breakpoints.mobile} {
    padding: 12px;
    gap: 12px;
  }
`;

const ProfileImageWrapper = styled.div`
  margin-right: 16px;

  ${breakpoints.mobile} {
    margin-right: 12px;
  }
`;

const ButtonContainer = styled.div`
  display: flex;
  gap: 10px;
  margin-left: auto;

  ${breakpoints.mobile} {
    flex-direction: column;
    gap: 6px;
  }
`;

const EmptyMessage = styled.p`
  text-align: center;
  color: #999;
  font-size: 16px;
  margin-top: 20px;

  ${breakpoints.mobile} {
    font-size: 14px;
    margin-top: 16px;
  }
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
      return <EmptyMessage>친구가 없습니다.</EmptyMessage>;
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
      return <EmptyMessage>보낸 요청이 없습니다.</EmptyMessage>;
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
      return <EmptyMessage>받은 요청이 없습니다.</EmptyMessage>;
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
    <PageContainer>
      <Heading>친구</Heading>
      <TabsContainer>
        <Tab
          active={activeTab === "friendSearch"}
          onClick={() => setActiveTab("friendSearch")}
        >
          친구 검색
        </Tab>
        <Tab
          active={activeTab === "friendList"}
          onClick={() => setActiveTab("friendList")}
        >
          친구 목록
        </Tab>
        <Tab
          active={activeTab === "receivedRequests"}
          onClick={() => setActiveTab("receivedRequests")}
        >
          받은 요청
        </Tab>
        <Tab
          active={activeTab === "sentRequests"}
          onClick={() => setActiveTab("sentRequests")}
        >
          보낸 요청
        </Tab>
      </TabsContainer>

      {activeTab === "friendSearch" && (
        <SearchBarWrapper>
          <SearchBar>
            <SearchIconStyled />
            <SearchInput
              placeholder="검색"
              value={searchQuery}
              onChange={handleSearchInputChange}
            />
            <SearchButton
              onClick={handleSearch}
              role="button"
              tabIndex={0}
              onKeyPress={(e) => {
                if (e.key === "Enter") handleSearch();
              }}
            >
              검색
            </SearchButton>
          </SearchBar>
          {searched && !searchResults && (
            <EmptyMessage>검색 결과가 없습니다.</EmptyMessage>
          )}
          {searchResults && (
            <SearchResultItem
              friend={searchResults}
              refetchSentRequests={refetchSentRequests}
            />
          )}
        </SearchBarWrapper>
      )}

      {activeTab !== "friendSearch" && (
        <FriendListContainer>
          {activeTab === "friendList" &&
            !isLoadingFriends &&
            renderedFriendList}
          {activeTab === "sentRequests" &&
            !isLoadingSent &&
            renderedSentRequests}
          {activeTab === "receivedRequests" &&
            !isLoadingReceived &&
            renderedReceivedRequests}
        </FriendListContainer>
      )}
    </PageContainer>
  );
};

// Components

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
    <FriendItemContainer>
      <ProfileImageWrapper>
        <ProfileImage src={friend.profileImage} alt={friend.nickname} />
      </ProfileImageWrapper>
      <UserInfo name={friend.nickname} />
      <ButtonContainer>
        <Button
          size="small"
          theme="primary"
          onClick={handleFriendRequest}
          disabled={isLoading}
        >
          친구 요청
        </Button>
      </ButtonContainer>
    </FriendItemContainer>
  );
};

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
    <FriendItemContainer>
      <ProfileImageWrapper>
        <ProfileImage src={friend.profileImage} alt={friend.nickname} />
      </ProfileImageWrapper>
      <UserInfo name={friend.nickname} />
      <ButtonContainer>
        <Button size="small" theme="primary" onClick={handleVisitClick}>
          방문
        </Button>
        <Button size="small" theme="secondary" onClick={handleDeleteClick}>
          삭제
        </Button>
      </ButtonContainer>
    </FriendItemContainer>
  );
};

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
        },
      });
    }
  };

  return (
    <FriendItemContainer>
      <ProfileImageWrapper>
        <ProfileImage
          src={request.profileImage}
          alt={
            isSentRequest(request)
              ? request.receiverName
              : request.requesterName
          }
        />
      </ProfileImageWrapper>
      <UserInfo
        name={
          isSentRequest(request) ? request.receiverName : request.requesterName
        }
      />
      <ButtonContainer>
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
      </ButtonContainer>
    </FriendItemContainer>
  );
};

export default FriendPage;
