import "./App.css";

import CustomHistoryRouter from "./routes/CustomHistoryRoutes";
import AppRoutes from "./routes/Router";
import { history } from "./services/history";

function App() {
  return (
    <CustomHistoryRouter history={history}>
      <Layout />
    </CustomHistoryRouter>
  );
}

function Layout() {
  return (
    <>
      <div className="flex flex-col">
        <AppRoutes />
      </div>
    </>
  );
}

export default App;
