import concat from "../../../utils/concat";
import {OptionHTMLAttributes} from "react";

function Option({
  className,
  children: value,
  ...props
}: OptionHTMLAttributes<HTMLOptionElement>) {
  let _className = concat(['custom-option'], className).join(' ');

  return (
    <option className={_className} {...props}>{value}</option>
  )
}

export default Option