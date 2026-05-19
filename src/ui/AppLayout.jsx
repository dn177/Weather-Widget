import { Outlet } from "react-router-dom";
import Navbar from "../sections/navbar/Navbar";
import LanguageHandler from "../components/LanguageHandler";

const AppLayout = () => {
  return (
    <div>
      <LanguageHandler />
      <Navbar />
      <main>
        <Outlet />
      </main>
    </div>
  );
};

export default AppLayout;
