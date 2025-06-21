import { createRoot } from "react-dom/client";
import App from "./routes.tsx";
import { BrowserRouter } from "react-router";
import { Provider } from "react-redux";
import { store } from "./store/store";
import "./main.css";
import { Toaster } from "react-hot-toast";
import { OwnerProvider } from "./context/ownerContext.tsx";


createRoot(document.getElementById("root")!).render(
  <Provider store={store}>
    <BrowserRouter>
    <OwnerProvider>
        <App />
        <Toaster/>
  
    </OwnerProvider>
        
    </BrowserRouter>
  </Provider>
);
