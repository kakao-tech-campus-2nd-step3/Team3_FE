import { useState, useEffect } from "react";
import { breakpoints } from "@/variants";
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

import {
  Home,
  CalendarMonth,
  Diversity3,
  Person,
  People,
  Menu,
} from "@mui/icons-material";
import logo from "@/assets/logo.svg";

export default function Sidebar() {
  const [time, setTime] = useState(new Date());
  const [isOpen, setIsOpen] = useState(false);
  const [selectedMenu, setSelectedMenu] = useState("메인");

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  //화면 크기 변경 시 실행되는 효과
  useEffect(() => {
    const handelResize = () => {
      // 화면 크기가 768px 이상일 때 햄버거 메뉴를 닫기
      if (window.innerWidth >= parseInt(breakpoints.tablet) && isOpen) {
        setIsOpen(false);
      }
    };

    //윈도우 크기 변화 감지
    window.addEventListener("resize", handelResize);

    return () => {
      window.removeEventListener("resize", handelResize);
    };
  }, [isOpen]);

  const getFormattedTime = (date: Date) => {
    return date.toLocaleTimeString("ko-KR", {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: false,
    });
  };

  const menuItems = [
    { name: "메인", icon: <Home />, path: "/main" },
    { name: "개인 플랜", icon: <CalendarMonth />, path: "/plan" },
    { name: "팀 플랜", icon: <Diversity3 />, path: "/team-plan" },
    { name: "친구", icon: <People />, path: "/friend" },
    { name: "마이페이지", icon: <Person />, path: "/mypage" },
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
            <StyledLink to={item.path} selected={selectedMenu === item.name}>
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
}
