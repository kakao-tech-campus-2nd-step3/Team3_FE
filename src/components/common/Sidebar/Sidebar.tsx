import { useState, useEffect, useCallback } from "react";
import {
  Home,
  CalendarMonth,
  Diversity3,
  Person,
  People,
  Menu,
} from "@mui/icons-material";
import { useNavigate, useLocation } from "react-router-dom";
import {
  SidebarContainer,
  MobileHeader,
  HamburgerMenu,
  MenuItemsContainer,
  MenuItem,
  TimeDisplay,
  DateDisplay,
  StyledLink,
  MenuItemIcon,
  MenuItemText,
} from "./Sidebar.styles";
import logo from "@/assets/logo.svg";

const menuItems = [
  { name: "메인", icon: <Home />, path: "/main" },
  { name: "개인 플랜", icon: <CalendarMonth />, path: "/plan" },
  { name: "팀 플랜", icon: <Diversity3 />, path: "/team-plan" },
  { name: "친구", icon: <People />, path: "/friend" },
  { name: "마이페이지", icon: <Person />, path: "/mypage" },
];

const getFormattedTime = (date: Date) => {
  return date.toLocaleTimeString("ko-KR", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
  });
};

const useIsDesktop = () => {
  const [isDesktop, setIsDesktop] = useState(window.innerWidth > 1280);

  useEffect(() => {
    const handleResize = () => {
      setIsDesktop(window.innerWidth > 1280);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return isDesktop;
};

export default function Sidebar() {
  const navigate = useNavigate();
  const location = useLocation();
  const isDesktop = useIsDesktop();
  const [time, setTime] = useState(() => new Date());
  const [isOpen, setIsOpen] = useState(false);
  const [selectedMenu, setSelectedMenu] = useState("메인");

  useEffect(() => {
    const currentItem = menuItems.find(
      (item) => item.path === location.pathname,
    );
    if (currentItem) setSelectedMenu(currentItem.name);
  }, [location.pathname]);

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const handleMenuClick = useCallback(
    (menuName: string, path: string) => {
      setSelectedMenu(menuName);
      navigate(path);
      if (!isDesktop) setIsOpen(false); // 모바일에서 메뉴 클릭 시 닫힘
    },
    [navigate, isDesktop],
  );

  return isDesktop ? (
    <SidebarContainer isOpen>
      <img
        src={logo}
        alt="Logo"
        width="170"
        height="59"
        style={{ marginBottom: "15px", cursor: "pointer" }}
        onClick={() => navigate("/main")}
      />
      <MenuItemsContainer isOpen>
        {menuItems.map((item) => (
          <MenuItem
            key={item.name}
            selected={selectedMenu === item.name}
            onClick={() => handleMenuClick(item.name, item.path)}
          >
            <MenuItemIcon>{item.icon}</MenuItemIcon>
            <MenuItemText>
              <StyledLink to={item.path} selected={selectedMenu === item.name}>
                {item.name}
              </StyledLink>
            </MenuItemText>
          </MenuItem>
        ))}
      </MenuItemsContainer>
      <TimeDisplay>{getFormattedTime(time)}</TimeDisplay>
      <DateDisplay>
        {time.toLocaleDateString("ko-KR", {
          weekday: "short",
          year: "numeric",
          month: "2-digit",
          day: "2-digit",
        })}
      </DateDisplay>
    </SidebarContainer>
  ) : (
    <>
      <MobileHeader>
        <img
          src={logo}
          alt="Logo"
          width="170"
          height="59"
          style={{ paddingTop: "10px", cursor: "pointer" }}
          onClick={() => navigate("/main")}
        />
        <HamburgerMenu onClick={() => setIsOpen(!isOpen)}>
          <Menu />
        </HamburgerMenu>
      </MobileHeader>
      {isOpen && (
        <SidebarContainer
          isOpen={isOpen}
          style={{
            position: "fixed",
            top: "70px",
            left: 0,
            width: "100%",
            height: "auto",
            zIndex: 1000,
            backgroundColor: "#f5f5f5",
          }}
        >
          <MenuItemsContainer isOpen>
            {menuItems.map((item) => (
              <MenuItem
                key={item.name}
                selected={selectedMenu === item.name}
                onClick={() => handleMenuClick(item.name, item.path)}
              >
                <MenuItemIcon>{item.icon}</MenuItemIcon>
                <MenuItemText>
                  <StyledLink
                    to={item.path}
                    selected={selectedMenu === item.name}
                  >
                    {item.name}
                  </StyledLink>
                </MenuItemText>
              </MenuItem>
            ))}
          </MenuItemsContainer>
        </SidebarContainer>
      )}
    </>
  );
}
