import { useEffect, useState } from "react";
import "./ScrollToTopButton.css";

const ScrollToTopButton = () => {

  const [visible, setVisible] = useState(false);

  const UpArrow = () => (
    <svg width="24" height="30" viewBox="0 0 24 24" fill="none">
        <path d="M12 19V5" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
        <path d="M5 12L12 5L19 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );

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
        <UpArrow/>
      </button>
    )
  );
};

export default ScrollToTopButton;