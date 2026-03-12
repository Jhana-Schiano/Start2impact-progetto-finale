import type { FC } from "react";
import { HiArrowLeft } from "react-icons/hi2";
import { useNavigate, type To } from "react-router-dom";
import "./BackButton.css";

type BackButtonProps = {
  ariaLabel?: string;
  title?: string;
  to?: To;
};

const BackButton: FC<BackButtonProps> = ({
  ariaLabel = "Indietro",
  title = "Indietro",
  to,
}) => {
  const navigate = useNavigate();

  const handleClick = () => {
    if (to != null) {
      navigate(to);
      return;
    }

    navigate(-1);
  };

  return (
    <button
      type="button"
      className="back-nav-icon"
      onClick={handleClick}
      aria-label={ariaLabel}
      title={title}
    >
      <HiArrowLeft aria-hidden="true" size={16} />
    </button>
  );
};

export default BackButton;
