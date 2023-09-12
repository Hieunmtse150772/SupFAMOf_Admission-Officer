import { ConfigProvider } from 'antd';
import en_US from 'antd/es/locale/en_US'; // for American English
import { store } from "app/store";
import "nprogress/nprogress.css";
import { StrictMode } from "react";
import ReactDOM from "react-dom";
import "react-image-lightbox/style.css";
import { Provider } from "react-redux";
import { BrowserRouter } from "react-router-dom";
import "simplebar/dist/simplebar.min.css";
import App from "./App";
import "./__fakeApi__";
import * as serviceWorker from './serviceWorker';

ReactDOM.render(
  <StrictMode>
    <Provider store={store}>
      <BrowserRouter>
        <ConfigProvider locale={en_US}>
          <App />
        </ConfigProvider>
      </BrowserRouter>
    </Provider>
  </StrictMode>,
  document.getElementById("root")
);

serviceWorker.unregister();
