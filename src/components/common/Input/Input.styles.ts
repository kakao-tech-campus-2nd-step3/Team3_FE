// Input.styles.ts
import styled from "@emotion/styled";
import breakpoints from "@/variants/variants";

const StyledInput = styled.textarea`
  border-radius: 16px;
  padding: 10px;
  border: 3px solid #d5d5d5;
  font-family: "Inter, system-ui, Avenir, Helvetica, Arial, sans-serif";
  font-weight: 600;
  width: 80%;
  margin: 0 30px;
  text-align: left;
  vertical-align: top;
  max-width: 100%;
  max-height: 300px;
  height: 450px;
  font-size: 20px;
  resize: none;

  // 모바일
  @media (max-width: 768px) {
    height: 250px;
    font-size: 16px;
  }
`;

export default StyledInput;
