import { useState, useEffect } from "react";
import { breakpoints } from "@/variants";
import styled from "@emotion/styled";
import {
  Home,
  CalendarMonth,
  Diversity3,
  Person,
  People,
  Menu,
} from "@mui/icons-material";
import logo from "@/assets/logo.svg";

// 사이드바 컨테이너
const SidebarContainer = styled.div<{ isOpen: boolean }>(({ isOpen }) => ({
  width: "100%",
  height: isOpen ? "auto" : "60px",
  backgroundColor: "#f5f5f5",
  position: "fixed",
  boxSizing: "border-box",
  top: 0,
  left: 0,
  display: "flex",
  flexDirection: "column",
  justifyContent: "flex-start",
  padding: 0,
  overflow: "hidden",
  transition: "height 0.3s ease, width 0.3s ease",
  zIndex: 1000,

  [breakpoints.tablet]: {
    width: "200px",
    height: "100%",
    justifyContent: "space-between",
    padding: "15px",
  },

  [breakpoints.desktop]: {
    width: "265px",
  },
}));

// 메뉴 아이템 컨테이너
const MenuItemsContainer = styled.div<{ isOpen: boolean }>(({ isOpen }) => ({
  display: "flex",
  flexDirection: "column",
  flexGrow: 1,
  justifyContent: "flex-start",
  width: "100%",
  boxSizing: "border-box",
  padding: "10px",
  paddingTop: "70px", // 헤더 아래에서 시작하도록 여백 추가
  maxHeight: isOpen ? "500px" : "0",
  opacity: isOpen ? 1 : 0,
  visibility: isOpen ? "visible" : "hidden",
  transition: "max-height 0.3s ease, opacity 0.3s ease",

  [breakpoints.tablet]: {
    padding: 0,
    paddingTop: 0,
    maxHeight: "none",
    opacity: 1,
    visibility: "visible",
  },
}));

// 메뉴 아이템 스타일
const MenuItem = styled.div<{ selected: boolean }>(({ selected }) => ({
  width: "100%",
  padding: "10px 17px",
  display: "flex",
  alignItems: "center",
  borderRadius: "15px",
  backgroundColor: selected ? "#39A7F7" : "transparent",
  color: selected ? "#FFFFFF" : "#000000",
  fontSize: "14px",
  fontWeight: 600,
  lineHeight: "22.52px",
  cursor: "pointer",
  boxSizing: "border-box",
  transition: "background-color 0.3s ease, box-shadow 0.3s ease",
  marginBottom: "10px",

  "&:hover": {
    backgroundColor: selected ? "#39A7F7" : "#E0E0E0",
    boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.1)",
  },

  ".icon": {
    marginRight: "8px",
    color: selected ? "#FFFFFF" : "#000000",
  },
}));

// 시간 및 날짜 표시
const TimeDisplay = styled.div({
  fontSize: "40px",
  fontWeight: 700,
  textAlign: "center",
  marginTop: "auto",
  width: "100%",
});

const DateDisplay = styled.div({
  fontSize: "18px",
  fontWeight: 700,
  textAlign: "center",
  width: "100%",
});

// 모바일 헤더
const MobileHeader = styled.div({
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  padding: "10px",
  height: "70px",
  backgroundColor: "#f5f5f5",
  position: "fixed",
  top: 0,
  left: 0,
  width: "100%",
  boxSizing: "border-box",

  [breakpoints.tablet]: {
    display: "none",
  },
});

// 햄버거 메뉴
const HamburgerMenu = styled.div({
  cursor: "pointer",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  width: "40px",
  height: "40px",
});

export default function Sidebar() {
  const [time, setTime] = useState(new Date());
  const [isOpen, setIsOpen] = useState(false);
  const [selectedMenu, setSelectedMenu] = useState("메인");

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const getFormattedTime = (date: Date) => {
    return date.toLocaleTimeString("ko-KR", {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: false,
    });
  };

  const menuItems = [
    { name: "메인", icon: <Home /> },
    { name: "개인 플랜", icon: <CalendarMonth /> },
    { name: "팀 플랜", icon: <Diversity3 /> },
    { name: "친구", icon: <People /> },
    { name: "마이페이지", icon: <Person /> },
  ];

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
            onClick={() => setSelectedMenu(item.name)}
          >
            <div className="icon">{item.icon}</div>
            {item.name}
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
