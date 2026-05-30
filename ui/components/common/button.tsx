import { mdiArrowTopRight } from "@mdi/js";
import Icon from "@mdi/react";

interface ButtonProps {
  type:
    | "large-blue1"
    | "large-blue2"
    | "large-gray"
    | "large-red"
    | "large-petrol-pale"
    | "small-blue1"
    | "small-blue2"
    | "small-gray"
    | "small-white"
    | "small-petrol-pale";
  text: string;
  url: string;
  newtab?: boolean;
}

const Button: React.FC<ButtonProps> = ({ type, text, url, newtab=false }) => {
  const baseStyles =
    "rounded-full font-semibold transition duration-100 max-w-max";

  const styles: Record<ButtonProps["type"], string> = {
    "large-blue1": "primary_blue_bg text-white px-6 py-3 text-md",
    "large-blue2": "secondary_blue_bg text-white px-6 py-3 text-md",
    "large-gray": "secondary_grey_bg text-white px-6 py-3 text-md",
    "large-red": "secondary_red_bg text-white px-6 py-3 text-md",
    "large-petrol-pale": "petrol_pale_bg text-white px-6 py-3 text-md",
    "small-blue1": "primary_blue_bg text-white px-4 py-2 text-sm",
    "small-blue2": "secondary_blue_bg text-white px-4 py-2 text-sm",
    "small-gray": "secondary_grey_bg text-white px-4 py-2 text-sm",
    "small-white": "bg-white secondary_grey px-4 py-2 text-sm",
    "small-petrol-pale": "petrol_pale_bg text-white px-4 py-2 text-sm",
  };

  return (
    <a
      href={url}
      className="max-w-max group"
      target={newtab ? "_blank" : undefined}
      rel={newtab ? "noopener noreferrer" : undefined}
    >
      <div className={`${baseStyles} ${styles[type]}`}>
        <div className="flex items-center text-left gap-2">
          <span>{text}</span>
          <Icon
            className="group-hover:rotate-45 transition duration-300"
            path={mdiArrowTopRight}
            size={0.7}
          />
        </div>
      </div>
    </a>
  );
};

export default Button;
