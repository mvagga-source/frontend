import { useEffect, useState } from "react";
import "./ScrollToTopButton.css";

const ScrollToTopButton = () => {

  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 200) {
        setVisible(true);
      } else {
        setVisible(false);
      }
    };

    window.addEventListener("scroll", handleScroll);

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  return (
    visible && (
      <button onClick={scrollToTop} className="scrollToTop scrollToTop-ongoing-all">
        ↑
      </button>
    )
  );
};

export default ScrollToTopButton;