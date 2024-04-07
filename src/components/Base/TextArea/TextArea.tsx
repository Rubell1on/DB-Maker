import concat from "../../../utils/concat";
import {TextareaHTMLAttributes} from "react";

function TextArea({className, ...props}: TextareaHTMLAttributes<HTMLTextAreaElement>) {
  let _className = concat(['custom-textarea'], className).join(' ');
  return (
    <textarea className={_className} {...props} />
  )
}

export default TextArea;