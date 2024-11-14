// src/components/common/Input/Input.tsx
import StyledInputContainer, { StyledInput } from "./StyledInput.styles";

export type Props = {
  onChange?: React.ChangeEventHandler<HTMLTextAreaElement>;
  value?: string;
  placeholder?: string;
  disabled?: boolean;
};

const Input: React.FC<Props> = ({ value, placeholder, onChange, ...props }) => {
  return (
    <StyledInputContainer>
      <StyledInput
        onChange={onChange}
        value={value}
        placeholder={placeholder}
        {...props}
      />
    </StyledInputContainer>
  );
};

export default Input;
