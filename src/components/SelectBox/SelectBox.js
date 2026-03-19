import React from "react";
import styles from "./SelectBox.module.css";

export const SearchSelect = ({ options, className, ...props }) => {
  return (
    <div className={`${styles.neonSelectContainer} ${className || ""}`}>
      <select className={styles.neonSelect} {...props}>
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
      
      {/* 커스텀 SVG 화살표 아이콘 */}
      <div className={styles.selectArrow}>
        <svg 
          xmlns="http://www.w3.org" /* URL 오타 수정 */
          width="14" 
          height="14" 
          viewBox="0 0 24 24" 
          fill="none" 
          stroke="#00f3ff" 
          strokeWidth="3" 
          strokeLinecap="round" 
          strokeLinejoin="round"
        >
          <path d="m6 9 6 6 6-6" />
        </svg>
      </div>
    </div>
  );
};