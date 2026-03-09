import Header from "./Header";
import Footer from "./Footer";
import "./Layout.css"
import { Outlet } from "react-router-dom";

function Layout() {
  return (
    <div className="main-container">
      <Header />
      <main><Outlet /></main>
      <Footer />
    </div>
  );
}

export default Layout;