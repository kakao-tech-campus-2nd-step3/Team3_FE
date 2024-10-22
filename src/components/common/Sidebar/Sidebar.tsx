import { useState, useEffect, useCallback } from "react";
import {
  Home,
  CalendarMonth,
  Diversity3,
  Person,
  People,
  Menu,
} from "@mui/icons-material";
import breakpoints from "@/variants/variants";
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
  MenuItemText
} from "./Sidebar.styles";

import logo from "@/assets/logo.svg";
import { useNavigate } from "react-router-dom";

// 고정된 메뉴 항목
const menuItems = [
  { name: "메인", icon: <Home />, path: "/main" },
  { name: "개인 플랜", icon: <CalendarMonth />, path: "/plan" },
  { name: "팀 플랜", icon: <Diversity3 />, path: "/team-plan" },
  { name: "친구", icon: <People />, path: "/friend" },
  { name: "마이페이지", icon: <Person />, path: "/mypage" },
];

// 시간을 포맷팅
const getFormattedTime = (date: Date) => {
  return date.toLocaleTimeString("ko-KR", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
  });
};

export default function Sidebar() {
  const navigate = useNavigate();
  const [time, setTime] = useState(() => new Date());
  const [isOpen, setIsOpen] = useState(false);
  const [selectedMenu, setSelectedMenu] = useState("메인");

  // 시간 업데이트
  useEffect(() => {
    const timer = setInterval(() => {
      setTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const handleResize = useCallback(() => {
    if (window.innerWidth >= breakpoints.sm && isOpen) {
      setIsOpen(false);
    }
  }, [isOpen]);

  // 윈도우 크기 변화 감지
  useEffect(() => {
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, [handleResize]);

  const handleMenuClick = useCallback((menuName: string, path: string) => {
    setSelectedMenu(menuName);
    navigate(path); // 페이지 이동 처리
  }, [navigate]);

  return (
    <SidebarContainer isOpen={isOpen}>
      <MobileHeader>
        {/* 모바일에서 로고와 햄버거 메뉴 */}
        <img
          src={logo}
          alt="Logo"
          width="170"
          height="59"
          style={{ paddingTop: "10px" }}
        />
        <HamburgerMenu onClick={() => setIsOpen(!isOpen)}>
          <Menu />
        </HamburgerMenu>
      </MobileHeader>

      {!isOpen && (
        // 데스크탑에서 사이드바의 로고
        <img
          src={logo}
          alt="Logo"
          width="170"
          height="59"
          style={{ marginBottom: "15px" }}
        />
      )}

      <MenuItemsContainer isOpen={isOpen}>
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

      {!isOpen && (
        <>
          <TimeDisplay>{getFormattedTime(time)}</TimeDisplay>
          <DateDisplay>
            {time.toLocaleDateString("ko-KR", {
              weekday: "short",
              year: "numeric",
              month: "2-digit",
              day: "2-digit",
            })}
          </DateDisplay>
        </>
      )}
    </SidebarContainer>
  );
}
