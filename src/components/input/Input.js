import styles from "./Input.module.css";

export const SearchInput = ({ className, ...props }) => {
  return (
    <input
      type="text"
      className={`${styles.neonInput} ${className || ""}`}
      {...props}
    />
  );
};