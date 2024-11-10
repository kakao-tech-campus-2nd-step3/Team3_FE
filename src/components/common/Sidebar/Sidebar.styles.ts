// src/components/common/Sidebar/Sidebar.styles.tsx
import styled from "@emotion/styled";
import breakpoints from "@/variants/breakpoints";

export const SidebarContainer = styled.div<{ isOpen: boolean }>(
  ({ isOpen }) => ({
    width: "225px", // 16rem
    height: "100vh",
    padding: "24px", // 1.5rem
    backgroundColor: "#F0F4FA",
    display: "flex",
    flexDirection: "column",
    boxSizing: "border-box",
    overflow: "hidden",
    position: "fixed",
    left: 0,
    top: 0,
    zIndex: 1000,
    transition: "height 0.3s ease, width 0.3s ease",

    // 모바일 스타일
    [breakpoints.mobile]: {
      width: "100%",
      height: isOpen ? "auto" : "60px",
      justifyContent: "flex-start",
      padding: 0,
    },
  }),
);

export const MobileHeader = styled.div({
  display: "none",
  [breakpoints.mobile]: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    height: "70px",
    backgroundColor: "#F0F4FA",
    position: "fixed",
    top: 0,
    left: 0,
    width: "100%",
    boxSizing: "border-box",
  },
});

export const HamburgerMenu = styled.div({
  cursor: "pointer",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  width: "40px",
  height: "40px",
});

export const MenuItemsContainer = styled.div<{ isOpen: boolean }>(
  ({ isOpen }) => ({
    flexGrow: 1,
    width: "100%",
    boxSizing: "border-box",
    marginTop: "16px",
    [breakpoints.mobile]: {
      paddingTop: "70px",
      maxHeight: isOpen ? "500px" : "0",
      opacity: isOpen ? 1 : 0,
      visibility: isOpen ? "visible" : "hidden",
      transition: "max-height 0.3s ease, opacity 0.3s ease",
    },
  }),
);

export const MenuItem = styled.div<{ selected: boolean }>(({ selected }) => ({
  width: "100%",
  padding: "12px 16px",
  display: "flex",
  alignItems: "center",
  borderRadius: "8px",
  backgroundColor: selected ? "rgba(255, 255, 255, 0.8)" : "transparent",
  color: selected ? "#39A7F7" : "#4A4A4A",
  fontSize: "16px",
  fontWeight: 500,
  cursor: "pointer",
  boxSizing: "border-box",
  transition: "all 0.3s ease-in-out",
  marginBottom: "8px",
  boxShadow: selected ? "0 1px 2px 0 rgba(0,0,0,0.05)" : "none",
  "&:hover": {
    backgroundColor: "rgba(255, 255, 255, 0.5)",
    color: "#39A7F7",
  },
}));

export const MenuItemIcon = styled.div<{ selected: boolean }>(
  ({ selected }) => ({
    display: "flex",
    alignItems: "center",
    marginRight: "12px",
    width: "20px",
    height: "20px",
    color: selected ? "#39A7F7" : "#6B7280",
    transition: "color 0.3s ease-in-out",
  }),
);

export const MenuItemText = styled.span<{ selected: boolean }>(
  ({ selected }) => ({
    fontSize: "16px",
    color: selected ? "#39A7F7" : "#4A4A4A",
    transition: "color 0.3s ease-in-out",
  }),
);

export const TimeDisplay = styled.div({
  fontSize: "14px",
  color: "#718096",
  marginTop: "8px",
});

export const DateDisplay = styled.div({
  fontSize: "14px",
  color: "#718096",
});
