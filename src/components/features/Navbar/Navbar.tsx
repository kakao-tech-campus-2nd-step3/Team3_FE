import styled from "@emotion/styled";
import logoSVG from "@/assets/logo.svg";
import breakpoints from "@/variants/breakpoints";

const NavBar = styled.div`
  position: fixed;
  top: 0px;
  width: 100%;
  height: 80px;
  background-color: white;
  display: flex;
  align-items: center;
  justify-content: space-between;
  box-sizing: border-box;
  z-index: 2;
  padding: 0 20px;

  ${breakpoints.desktop} {
    height: 120px;
    padding: 0 40px;
  }
`;

const Logo = styled.img`
  height: 40px;
  ${breakpoints.desktop} {
    height: 70px;
  }
`;
const Navbar = () => {
  return (
    <NavBar>
      <Logo src={logoSVG} alt="로고" />
    </NavBar>
  );
};

export default Navbar;
