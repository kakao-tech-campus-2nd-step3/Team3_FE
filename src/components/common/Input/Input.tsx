// src/components/common/Input/Input.tsx
import StyledInputContainer, { StyledInput } from "./StyledInput.styles";

export type Props = {
  onChange?: React.ChangeEventHandler<HTMLTextAreaElement>;
  value?: string;
  placeholder?: string;
  disabled?: boolean;
  className? :string;
};

const Input: React.FC<Props> = ({ value, placeholder, onChange,className, ...props }) => {
  return (
    <StyledInputContainer className={className}>
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
