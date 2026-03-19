import styles from "./Input.module.css";

// 네온 입력창
export const SearchInput = ({ className, ...props }) => {
  return (
    <input
      type="text"
      className={`${styles.neonInput} ${className || ""}`}
      {...props}
    />
  );
};