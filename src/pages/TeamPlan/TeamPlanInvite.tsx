/** @jsxImportSource @emotion/react */
import { useState } from "react";
import { css } from "@emotion/react";
import styled from "@emotion/styled";
import { useLocation, useNavigate } from "react-router-dom";
import Button from "@/components/common/Button/Button";
import { apiClient } from "@/api/instance";
import RouterPath from "@/router/RouterPath";

// Styles
const PageContainer = styled.div`
  width: 100%;
  max-width: 1200px;
  padding: 20px;
  margin: 0 auto;
`;

const Title = styled.h2`
  font-size: 24px;
  font-weight: bold;
  text-align: center;
  margin-bottom: 20px;
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

const errorMessageStyles = css`
  color: red;
  margin-top: 10px;
  text-align: center;
`;

const InviteList = styled.div`
  margin-top: 20px;
  font-weight: bold;
`;

const InviteeItem = styled.div`
  margin-top: 5px;
  font-size: 16px;
`;

export default function TeamInvitePage() {
  const { state } = useLocation();
  const { teamId } = state || {};
  const navigate = useNavigate();

  const [searchQuery, setSearchQuery] = useState("");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [inviteList, setInviteList] = useState<string[]>([]); // 초대된 닉네임 목록

  const handleInvite = async () => {
    if (!searchQuery.trim()) {
      setErrorMessage("닉네임을 입력해주세요.");
      return;
    }
    try {
      await apiClient.post(`/api/teams/${teamId}/invite`, null, {
        params: { nickname: searchQuery.trim() },
      });
      setInviteList((prevList) => [...prevList, searchQuery.trim()]); // 초대된 인원 목록 업데이트
      setSearchQuery(""); // 입력창 초기화
      setErrorMessage(null); // 에러 메시지 초기화
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
    setErrorMessage(null); // 입력할 때 에러 메시지 초기화
  };

  return (
    <PageContainer>
      <Title>초대할 팀원을 검색해주세요</Title>
      <div css={searchBarStyles}>
        <input
          css={searchInputStyles}
          placeholder="닉네임 입력"
          value={searchQuery}
          onChange={handleSearchInputChange}
        />
        <Button size="small" onClick={handleInvite}>
          추가
        </Button>
      </div>

      {errorMessage && <div css={errorMessageStyles}>{errorMessage}</div>}

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

      <Button onClick={() => navigate(RouterPath.TEAM_PLAN)}>마침</Button>
    </PageContainer>
  );
}
