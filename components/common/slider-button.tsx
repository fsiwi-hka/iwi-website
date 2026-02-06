import Icon from "@mdi/react";
import { mdiChevronLeft, mdiChevronRight } from "@mdi/js";

interface ButtonProps {
  arrow?: "left" | "right";
  number?: number;
  active?: boolean;
  onClick?: () => void;
  disabled?: boolean;
  inverted?: boolean;
}

const buttonClassBase = "rounded-lg aspect-square flex items-center justify-center";
const buttonClassActive = "primary_blue_bg opacity-100";
const buttonClassInactive = "primary_blue_bg opacity-40";
const symbolClass = "transition w-[40px] h-[40px] duration-300";

const SliderButton: React.FC<ButtonProps> = ({
  arrow,
  number,
  active = true,
  onClick,
  disabled = false,
  inverted = false,
}) => {
  const isArrow = !!arrow;

  const baseClasses = "w-10 h-10 rounded-md flex items-center justify-center transition-all duration-200";

  const hoverable = disabled ? " opacity-10 cursor-not-allowed" : " hover:bg-blue-100 cursor-pointer";

  if (isArrow) {
    const bgClass = inverted ? "bg-white" : "primary_blue_bg";
    const iconColorClass = inverted ? "text-[#3999BF]" : "text-white group-hover:text-[#3999BF]";

    return (
      <div className={`${baseClasses} ${bgClass} ${hoverable}`} onClick={!disabled ? onClick : undefined}>
        <Icon
          className={`${symbolClass} ${iconColorClass}`}
          path={arrow === "left" ? mdiChevronLeft : mdiChevronRight}
          size={1.5}
        />
      </div>
    );
  } else if (number !== undefined) {
    const bgClass = active ? buttonClassActive : buttonClassInactive;

    return (
      <div className={`${baseClasses} ${bgClass} ${hoverable}`} onClick={!disabled ? onClick : undefined}>
        <span className={`text-white font-medium text-xl`}>{number + 1}</span>
      </div>
    );
  }

  return null;
};

export default SliderButton;
