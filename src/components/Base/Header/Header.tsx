import {HeaderProps} from "./Header.types";
import './Header.style.css'

function Header(props: HeaderProps) {
  let className = '';

  if (props?.class) {
    className = Array.isArray(props.class)
      ? props.class.join(' ')
      : props.class
  }

  return (
    <div className={`custom-header ${className}`}>{props?.title}</div>
  )
}

export default Header;