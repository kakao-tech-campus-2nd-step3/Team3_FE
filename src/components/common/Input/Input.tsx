import StyledInput from "./StyledInput.styles";

export type Props = {
  onChange?: React.ChangeEventHandler<HTMLTextAreaElement>;
  value?: string;
  placeholder?: string;
  disabled?: boolean;
};

const Input: React.FC<Props> = ({ value, placeholder, onChange, ...props }) => {
  return (
    <StyledInput
      onChange={onChange}
      value={value}
      placeholder={placeholder}
      {...props}
    />
  );
};

export default Input;
