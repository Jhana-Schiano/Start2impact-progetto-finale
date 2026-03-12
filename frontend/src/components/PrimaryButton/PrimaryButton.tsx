import type { ButtonHTMLAttributes, FC, ReactNode } from "react";
import "./PrimaryButton.css";

type PrimaryButtonProps = Omit<
  ButtonHTMLAttributes<HTMLButtonElement>,
  "className"
> & {
  children: ReactNode;
};

const PrimaryButton: FC<PrimaryButtonProps> = ({
  children,
  type = "button",
  ...rest
}) => {
  return (
    <button type={type} className="primary-button" {...rest}>
      {children}
    </button>
  );
};

export default PrimaryButton;
