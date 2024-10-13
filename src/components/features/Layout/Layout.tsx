import styled from "@emotion/styled";
import { Outlet, useLocation } from "react-router-dom";
import Sidebar from "@/components/common/Sidebar/Sidebar";
import breakpoints from "@/variants/variants";

const Wrapper = styled.div`
  display: flex;
  width: 100%;
  height: 100vh;

  ${breakpoints.tablet} {
    flex-direction: row; /* 태블릿 이상에서는 가로 정렬 */
  }

  flex-direction: column; /* 기본값은 세로 정렬 (모바일) */
`;

const ContentWrapper = styled.div`
  flex-grow: 1;
  padding: 60px 20px;

  ${breakpoints.tablet} {
    padding-left: 225px;
  }
`;

const Layout: React.FC = () => {
  const location = useLocation();

  // 사이드바를 숨길 경로 목록
  const hideSidebarPaths = ["/", "/login", "/plan/preview"];

  return (
    <Wrapper>
      {!hideSidebarPaths.includes(location.pathname) && <Sidebar />}
      <ContentWrapper>
        <Outlet />
      </ContentWrapper>
    </Wrapper>
  );
};

export default Layout;
