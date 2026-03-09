//import 'bootstrap/dist/css/bootstrap.min.css';
import React from 'react';

/** 
 * 부트스트랩 버튼 색상 테마 맵핑 
 * @constant 
 */
const VARIANTS = {
  primary: 'btn-primary',
  secondary: 'btn-secondary',
  success: 'btn-success',
  danger: 'btn-danger',
  warning: 'btn-warning',
  info: 'btn-info',
  light: 'btn-light',
  dark: 'btn-dark',
  link: 'btn-link',
  'outline-primary': 'btn-outline-primary',
  'outline-secondary': 'btn-outline-secondary',
};

/** 
 * 부트스트랩 버튼 크기 맵핑 
 * @constant 
 */
const SIZES = {
  sm: 'btn-sm',
  lg: 'btn-lg',
  md: '', // 기본 크기
};

/**
 * @component BootStrapBtn
 * @description 부트스트랩 CSS 클래스를 기반으로 한 범용 버튼 컴포넌트
 * 
 * @param {Object} props
 * @param {React.ReactNode} props.children - 버튼 내부 요소 (텍스트, 아이콘 등)
 * @param {'button'|'submit'|'reset'} [props.type='button'] - 버튼의 HTML 타입
 * @param {keyof typeof VARIANTS} [props.variant='primary'] - 버튼 색상 테마 (부트스트랩 클래스 대응)
 * @param {keyof typeof SIZES} [props.size='md'] - 버튼 크기 (sm, md, lg)
 * @param {string} [props.className=''] - 추가적인 커스텀 CSS 클래스
 * @param {function} [props.onClick] - 클릭 이벤트 핸들러
 * @param {boolean} [props.disabled=false] - 버튼 비활성화 여부
 * @param {Object} [props...props] - 기타 표준 HTML 버튼 속성 (id, title, aria-label 등)
 */
const BootStrapBtn = ({ 
  children, 
  type = 'button', 
  variant = 'primary', 
  size = 'md', 
  className = '', 
  onClick, 
  disabled = false,
  ...props
}) => {
  const variantClass = VARIANTS[variant] || VARIANTS.primary;
  const sizeClass = SIZES[size] || '';

  return (
    <button
      type={type}
      className={`btn ${variantClass} ${sizeClass} ${className}`}
      onClick={onClick}
      disabled={disabled}
      {...props}
    >
      {children}
    </button>
  );
};

export default BootStrapBtn;