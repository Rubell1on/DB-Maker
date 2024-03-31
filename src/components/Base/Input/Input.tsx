import './Input.style.css'
import {InputHTMLAttributes} from "react";
import concat from "../../../utils/concat";

function Input({className, ...props}: InputHTMLAttributes<HTMLInputElement>) {
  let _className = concat(['custom-input'], className).join(' ');

  return (
    <input className={_className} {...props}/>
  )
}

export default Input;