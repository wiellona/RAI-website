import { ButtonHTMLAttributes } from "react";

export default function GradientButton(
  props: ButtonHTMLAttributes<HTMLButtonElement>
) {
  const { className = "", ...rest } = props;
  return (
    <button
      className={`btn btn-accent hover:opacity-95 ${className}`}
      {...rest}
    />
  );
}
