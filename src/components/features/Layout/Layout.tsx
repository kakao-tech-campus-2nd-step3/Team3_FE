import styled from "@emotion/styled";
import { Outlet, useLocation } from "react-router-dom";
import Sidebar from "@/components/common/Sidebar/Sidebar";
import breakpoints from "@/variants/breakpoints";

const Wrapper = styled.div`
  flex-direction: row;

  ${breakpoints.mobile} {
    flex-direction: column;
    display: flex;
    width: 100%;
    height: 100vh;
  }
`;

const ContentWrapper = styled.div`
  padding-left: 225px;
  padding-top: 60px;

  ${breakpoints.mobile} {
    flex-grow: 1;
    padding: 60px 20px;
  }
`;
const hideSidebarPaths = ["/", "/login", "/plan/preview"];

const Layout: React.FC = () => {
  const location = useLocation();

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
