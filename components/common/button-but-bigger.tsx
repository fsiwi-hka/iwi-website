import { mdiArrowTopRight } from "@mdi/js";
import Icon from "@mdi/react";

interface ButtonButBiggerProps {
  text: React.ReactNode;
  subtext?: React.ReactNode;
  link: string;
  newTab?: boolean;
  bgcolor: "petrol" | "red";
}

const ButtonButBigger: React.FC<ButtonButBiggerProps> = ({
  text,
  subtext,
  link,
  newTab = false,
  bgcolor,
}) => {
  const styles: Record<ButtonButBiggerProps["bgcolor"], string> = {
    petrol: "petrol_bg text-white",
    red: "secondary_red_bg text-white",
  };

  return (
    <a
      href={link}
      className={`rounded-xl font-medium p-6 relative group hover:cursor-pointer min-w-[230px] ${styles[bgcolor]}`}
      target={newTab ? "_blank" : undefined}
      rel={newTab ? "noopener noreferrer" : undefined}
    >
      <div className={`w-3/4 m-0 ${styles[bgcolor]}`}>
        <p className="m-0 font-semibold text-white">{text}</p>
        {subtext && <p className="m-0 text-sm text-white">{subtext}</p>}
      </div>
      <Icon
        className="absolute top-6 right-6 group-hover:rotate-45 transition duration-300"
        color="white"
        path={mdiArrowTopRight}
        size={1}
      />
    </a>
  );
};

export default ButtonButBigger;