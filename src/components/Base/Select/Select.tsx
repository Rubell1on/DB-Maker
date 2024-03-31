import './Select.style.css'
import concat from "../../../utils/concat";
import {SelectHTMLAttributes} from "react";

function Select({
  className,
  children,
  ...props
}: SelectHTMLAttributes<HTMLSelectElement>) {
  let _className = concat(['custom-select'], className).join(' ');
  return (
    <select className={_className} {...props}>
      {children}
    </select>
  )
}

export default Select