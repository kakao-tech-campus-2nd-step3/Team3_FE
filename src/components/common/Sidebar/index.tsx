import { useState, useEffect } from "react";
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
const SidebarContainer = styled.div<{ isOpen: boolean }>`
  width: 100%;
  height: ${(props) => (props.isOpen ? "auto" : "60px")};
  background-color: #f5f5f5;
  position: fixed;
  box-sizing: border-box;
  top: 0;
  left: 0;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  padding: 0;
  overflow: hidden;
  transition:
    height 0.3s ease,
    width 0.3s ease;
  z-index: 1000;

  @media (min-width: 768px) {
    width: 200px;
    height: 100%;
    justify-content: space-between;
    padding: 15px;
  }

  @media (min-width: 1280px) {
    width: 265px;
  }
`;

// 메뉴 아이템 컨테이너
const MenuItemsContainer = styled.div<{ isOpen: boolean }>`
  display: flex;
  flex-direction: column;
  flex-grow: 1;
  justify-content: flex-start;
  width: 100%;
  box-sizing: border-box;
  padding: 10px;
  padding-top: 70px; /* 헤더 아래에서 시작하도록 여백 추가 */
  max-height: ${(props) => (props.isOpen ? "500px" : "0")};
  opacity: ${(props) => (props.isOpen ? 1 : 0)};
  visibility: ${(props) => (props.isOpen ? "visible" : "hidden")};
  transition:
    max-height 0.3s ease,
    opacity 0.3s ease;

  @media (min-width: 768px) {
    padding: 0;
    padding-top: 0;
    max-height: none;
    opacity: 1;
    visibility: visible;
  }
`;

// 메뉴 아이템 스타일
const MenuItem = styled.div<{ selected: boolean }>`
  width: 100%;
  padding: 10px 17px;
  display: flex;
  align-items: center;
  border-radius: 15px;
  background-color: ${(props) => (props.selected ? "#39A7F7" : "transparent")};
  color: ${(props) => (props.selected ? "#FFFFFF" : "#000000")};
  font-size: 14px;
  font-weight: 600;
  line-height: 22.52px;
  cursor: pointer;
  box-sizing: border-box;
  transition:
    background-color 0.3s ease,
    box-shadow 0.3s ease;
  margin-bottom: 10px;

  &:hover {
    background-color: ${(props) => (props.selected ? "#39A7F7" : "#E0E0E0")};
    box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.1);
  }

  .icon {
    margin-right: 8px;
    color: ${(props) => (props.selected ? "#FFFFFF" : "#000000")};
  }
`;

// 시간 및 날짜 표시
const TimeDisplay = styled.div`
  font-size: 40px;
  font-weight: 700;
  text-align: center;
  margin-top: auto;
  width: 100%;
`;

const DateDisplay = styled.div`
  font-size: 18px;
  font-weight: 700;
  text-align: center;
  width: 100%;
`;

// 모바일 헤더
const MobileHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px;
  height: 70px;
  background-color: #f5f5f5;
  position: fixed; /* 로고와 햄버거 메뉴가 고정되도록 설정 */
  top: 0;
  left: 0;
  width: 100%;
  box-sizing: border-box;

  @media (min-width: 768px) {
    display: none;
  }
`;

// 햄버거 메뉴
const HamburgerMenu = styled.div`
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
`;

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
