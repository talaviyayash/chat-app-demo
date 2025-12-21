import { BrowserRouter } from "react-router-dom";
import Routes from "./router/Routes";
import store from "./store/store";
import { Provider } from "react-redux";
import { Toaster } from "react-hot-toast";

function App() {
  return (
    <>
      <Provider store={store}>
        <BrowserRouter>
          <Routes />
          <Toaster />
        </BrowserRouter>
      </Provider>
    </>
  );
}
export default App;
