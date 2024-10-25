import StyledInput from "./StyledInput.styles";

interface Props {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const Input: React.FC<Props> = ({ value, onChange }) => {
  return <StyledInput value={value} onChange={onChange} />;
};

export default Input;
