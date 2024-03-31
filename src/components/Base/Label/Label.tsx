import './Label.style.css'
import concat from "../../../utils/concat";
import {LabelHTMLAttributes} from "react";
function Label({
  title,
  className,
  ...props
}: LabelHTMLAttributes<HTMLLabelElement>) {
  let _className = concat(['custom-label'], className).join(' ')
  return (
    <label
      className={_className} {...props}>{title}</label>
  )
}

export default Label;