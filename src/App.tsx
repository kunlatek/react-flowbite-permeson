import AppRouter from "./router/app-router";
import { KuToast } from "./components/common";

function App() {
  return (
    <>
      <AppRouter />
      <KuToast />
    </>
  );
}

export default App;
