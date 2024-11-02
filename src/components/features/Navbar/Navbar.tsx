import styled from "@emotion/styled";
import logoSVG from "@/assets/logo.svg";
import breakpoints from "@/variants/breakpoints";

const NavBar = styled.div`
  position: fixed;
  top: 0px;
  width: 100%;
  height: 120px;
  background-color: white;
  display: flex;
  align-items: center;
  justify-content: space-between;
  box-sizing: border-box;
  padding: 0 40px;
  z-index: 100;

  ${breakpoints.tablet} {
    height: 100px;
    padding: 0 20px;
  }
`;

const Logo = styled.img`
  height: 70px;
  ${breakpoints.tablet} {
    height: 40px;
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
