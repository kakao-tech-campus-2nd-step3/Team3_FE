import styled from "@emotion/styled";
import breakpoints from "@/variants/breakpoints";

type ResponseGridStyle = {
  sm?: number;
  lg?: number;
};

type Props = {
  height?: ResponseGridStyle | number; // 숫자나 반응형 스타일 모두 허용
  backgroundColor?: string;
} & React.HTMLAttributes<HTMLDivElement>;

const Wrapper = styled.div<Pick<Props, "height" | "backgroundColor">>(
  {
    width: "100%",
  },
  ({ backgroundColor }) => ({ backgroundColor }),
  ({ height }) => {
    if (typeof height === "number") {
      // 숫자일 경우에는 그 값을 그대로 사용
      return `height: ${height}px;`;
    }

    // 반응형 객체일 경우
    return `
      height: ${height?.sm || 16}px; /* 기본값을 16px로 설정 */
      ${breakpoints.tablet} {
        height: ${height?.lg || 32}px; /* 기본값을 32px로 설정 */
      }
    `;
  },
);

const Spacing = ({
  height = { sm: 16, lg: 32 },
  backgroundColor = "inherit",
  ...props
}: Props) => {
  return (
    <Wrapper height={height} backgroundColor={backgroundColor} {...props} />
  );
};

export default Spacing;
