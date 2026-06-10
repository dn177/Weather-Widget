import { Outlet } from "react-router-dom";
import Navbar from "../sections/navbar/Navbar";

const AppLayout = () => {
  return (
    <div>
      <Navbar />
      <main>
        <Outlet />
      </main>
    </div>
  );
};

export default AppLayout;
