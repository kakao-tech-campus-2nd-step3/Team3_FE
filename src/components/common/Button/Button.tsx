import StyledButton from "./StyledButton.styles";
import { Props } from "./Button.types";

const Button: React.FC<Props> = ({ theme = "primary", ...props }) => {
  return <StyledButton theme={theme} {...props} />;
};

export default Button;
