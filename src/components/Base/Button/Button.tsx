import './Button.style.css'
import {ButtonHTMLAttributes} from "react";
import concat from "../../../utils/concat";

function Button({className, ...props}: ButtonHTMLAttributes<HTMLButtonElement>) {
  const initialClasses = ['custom-button'];

  if (props.type === 'submit') {
    initialClasses.push('custom-button__submit');
  }

  let _className = concat(initialClasses, className).join(' ');

  return (
    <button {...props} className={_className}>{props.value}</button>
  )
}

export default Button;