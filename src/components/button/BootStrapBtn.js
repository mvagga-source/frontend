import styles from './BootStrapBtn.module.css';

/** 
 * 변수명과 CSS 모듈 클래스 매핑
 */
const VARIANTS = {
  primary: styles.primary,
  danger: styles.danger,
  neon: styles.neon, // 네온 스타일 추가
  verify: styles.verify,
  sky: styles.sky,
  // 필요한 테마를 module.css의 클래스명과 매핑하세요
};

const SIZES = {
  sm: styles.sm,
  md: styles.md,
  lg: styles.lg,
};

const BootStrapBtn = ({ 
  children, 
  type = 'button', 
  variant = 'neon', // 기본값을 네온으로 설정 가능
  size = 'md', 
  className = '', 
  onClick, 
  disabled = false,
  ...props
}) => {
  // 모듈 클래스 결합 (undefined 방지)
  const variantClass = VARIANTS[variant] || '';
  const sizeClass = SIZES[size] || '';
  
  // 외부에서 들어오는 className과 모듈 클래스를 합침
  const combinedClassName = `${styles.btn} ${variantClass} ${sizeClass} ${className}`.trim();

  return (
    <button
      type={type}
      className={combinedClassName}
      onClick={onClick}
      disabled={disabled}
      {...props}
    >
      {children}
    </button>
  );
};

export default BootStrapBtn;