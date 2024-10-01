import "./App.css";
import Button from "./components/common/Button";
import "normalize.css";

function App() {
  return (
    <div>
      <h1>버튼 사용 예시</h1>
      {/* 취소 버튼을 사용하는 부분 */}
      <Button size="responsive" theme="primary">
        취소
      </Button>
    </div>
  );
}
export default App;
