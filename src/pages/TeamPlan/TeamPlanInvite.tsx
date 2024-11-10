// src/pages/TeamPlan/TeamInvitePage.tsx
/** @jsxImportSource @emotion/react */
import { useState } from "react";
import styled from "@emotion/styled";
import { useLocation, useNavigate } from "react-router-dom";
import Button from "@/components/common/Button/Button";
import { apiClient } from "@/api/instance";
import RouterPath from "@/router/RouterPath";

const PageContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 32px;
  min-height: 100vh;
  box-sizing: border-box;
`;

const Title = styled.h1`
  font-size: 28px;
  font-weight: bold;
  margin-bottom: 24px;
  text-align: center;
`;

const SearchBar = styled.div`
  display: flex;
  align-items: center;
  padding: 12px 16px;
  background: #f0f4fa;
  border-radius: 8px;
  width: 100%;
  max-width: 400px;
  margin-bottom: 16px;
`;

const SearchInput = styled.input`
  flex: 1;
  border: none;
  background: transparent;
  font-size: 16px;
  color: #2d3748;
  outline: none;

  &::placeholder {
    color: #a0aec0;
  }
`;

const ErrorMessage = styled.div`
  color: red;
  margin-bottom: 16px;
  text-align: center;
`;

const InviteList = styled.div`
  width: 100%;
  max-width: 400px;
  margin-top: 24px;
`;

const InviteeItem = styled.div`
  padding: 8px 12px;
  background: #f0f4fa;
  border-radius: 8px;
  margin-bottom: 8px;
  font-size: 16px;
  color: #2d3748;
`;

const FinishButton = styled(Button)`
  margin-top: 32px;
`;

export default function TeamInvitePage() {
  const { state } = useLocation();
  const { teamId } = state || {};
  const navigate = useNavigate();

  const [searchQuery, setSearchQuery] = useState("");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [inviteList, setInviteList] = useState<string[]>([]);

  const handleInvite = async () => {
    if (!searchQuery.trim()) {
      setErrorMessage("닉네임을 입력해주세요.");
      return;
    }
    try {
      await apiClient.post(`/api/teams/${teamId}/invite`, null, {
        params: { nickname: searchQuery.trim() },
      });
      setInviteList((prevList) => [...prevList, searchQuery.trim()]);
      setSearchQuery("");
      setErrorMessage(null);
    } catch (error: any) {
      if (error.response) {
        switch (error.response.status) {
          case 400:
            setErrorMessage("해당 유저는 이미 팀에 속해 있습니다.");
            break;
          case 403:
            setErrorMessage("권한이 없습니다.");
            break;
          case 404:
            setErrorMessage("팀 또는 유저를 찾을 수 없습니다.");
            break;
          default:
            setErrorMessage("초대 중 오류가 발생했습니다.");
        }
      } else {
        setErrorMessage("네트워크 오류가 발생했습니다.");
      }
    }
  };

  const handleSearchInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
    setErrorMessage(null);
  };

  return (
    <PageContainer>
      <Title>초대할 팀원을 검색해주세요</Title>
      <SearchBar>
        <SearchInput
          placeholder="닉네임 입력"
          value={searchQuery}
          onChange={handleSearchInputChange}
        />
        <Button size="small" onClick={handleInvite}>
          추가
        </Button>
      </SearchBar>

      {errorMessage && <ErrorMessage>{errorMessage}</ErrorMessage>}

      <InviteList>
        <h3>초대한 사람들:</h3>
        {inviteList.length > 0 ? (
          inviteList.map((nickname) => (
            <InviteeItem key={nickname}>{nickname}</InviteeItem>
          ))
        ) : (
          <p>초대한 팀원이 없습니다.</p>
        )}
      </InviteList>

      <FinishButton onClick={() => navigate(RouterPath.TEAM_PLAN)}>
        마침
      </FinishButton>
    </PageContainer>
  );
}
