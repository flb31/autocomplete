import { createRoot } from "react-dom/client";
import AutoComplete from "./components/AutoComplete";
import { dummyJson } from "./services/dummyJson";
import { GlobalStyle, MainWrapperStyled } from "./styles";

const container = document.getElementById("root");
const root = createRoot(container);

const App = () => (
  <MainWrapperStyled>
    <GlobalStyle />
    <AutoComplete onFetch={dummyJson} placeholder="Search by something..." />
  </MainWrapperStyled>
);

root.render(<App />);
