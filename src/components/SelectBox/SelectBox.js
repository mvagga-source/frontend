import React, { useState, useRef, useEffect } from "react";
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

// 검색바 내부 전용 셀렉트 박스 (기존 것과 별도로 생성)
export const SearchSelectBar = ({ options = [], placeholder = "전체", name = "category" }) => {
  const [open, setOpen] = React.useState(false);
  const [value, setValue] = React.useState("");
  const ref = React.useRef();

  const selectedOption = options.find(opt => opt.value === value);

  React.useEffect(() => {
    const handleClickOutside = (e) => {
      if (ref.current && !ref.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div ref={ref} className={`${styles.customSelect} ${open ? styles.open : ""}`}>
      <input type="hidden" name={name} value={value} />
      <div className={styles.selected} onClick={() => setOpen(!open)}>
        {selectedOption ? selectedOption.label : placeholder}
      </div>

      <div className={styles.dropdown}>
        {options.map(opt => (
          <div
            key={opt.value}
            className={`${styles.option} ${value === opt.value ? styles.active : ""}`}
            onClick={() => {
              setValue(opt.value);  // 부모에 전달할 필요 없으면 여기서만 상태 처리
              setOpen(false);
            }}
          >
            {opt.label}
          </div>
        ))}
      </div>
    </div>
  );
};