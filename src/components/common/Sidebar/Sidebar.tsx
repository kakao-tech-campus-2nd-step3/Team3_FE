import { useState, useEffect, useCallback } from "react";
import {
  Home,
  CalendarMonth,
  Diversity3,
  Person,
  People,
  Menu,
} from "@mui/icons-material";
import { useLocation } from "react-router-dom";
import breakpoints from "@/variants/breakpoints";
import {
  SidebarContainer,
  MobileHeader,
  HamburgerMenu,
  MenuItemsContainer,
  MenuItem,
  TimeDisplay,
  DateDisplay,
  StyledLink,
} from "./Sidebar.styles";

import logo from "@/assets/logo.svg";

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

const Sidebar = () => {
  const [time, setTime] = useState(() => new Date());
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

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

  // URL 이 특정 경로를 포함하는지 확인하는 함수
  const isPathActive = (path: string) => {
    return location.pathname.startsWith(path);
  };

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
            selected={isPathActive(item.path)}
            onClick={() => setIsOpen(false)}
          >
            <div className="icon">{item.icon}</div>
            <StyledLink to={item.path} selected={isPathActive(item.path)}>
              {item.name}
            </StyledLink>
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
};

export default Sidebar;
