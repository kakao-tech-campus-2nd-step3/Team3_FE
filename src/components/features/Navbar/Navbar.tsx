import styled from "@emotion/styled";
import logoSVG from "@/assets/logo.svg";

const NavBar = styled.div`
  position: fixed;
  top: 0;
  width: 100%;
  height: 120px;
  background-color: white;
  display: flex;
  align-items: center;
  justify-content: space-between;
  box-sizing: border-box;
  z-index: 2;
`;

const Logo = styled.img`
  height: 70px;
`;
const Navbar = () => {
  return (
    <NavBar>
      <Logo src={logoSVG} alt="로고" />
    </NavBar>
  );
};

export default Navbar;
