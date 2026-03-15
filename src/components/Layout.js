import Header from "./Header";
import Footer from "./Footer";
import "./Layout.css"

function Layout({ children }) {
  return (
    <div className="main-container">
      <Header />
      <main>{children}</main>
      <Footer />
    </div>
  );
}

export default Layout;