import { mdiArrowTopRight } from "@mdi/js";
import Icon from "@mdi/react";

interface CooperationBoxProps {
  logo: string;
  description: string;
  link: string;
}

function CooperationBox({ logo, description, link }: CooperationBoxProps) {
  return (
    <div className="w-full flex flex-col p-8 lg:p-12 white_bg rounded-xl">
      <img src={logo} className="h-8 w-min object-contain w-auto mb-4"></img>
      <p>{description}</p>
      <a href={link} target="_blank" rel="noopener noreferrer" className="group flex md:justify-between petrol_text">
        <span className="font-medium">Zum Kooperationspartner</span>
        <Icon
          className="group-hover:rotate-45 transition duration-300"
          path={mdiArrowTopRight}
          size={1}
        />
      </a>
    </div>
  );
}

export default CooperationBox;
