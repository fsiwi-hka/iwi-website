import Icon from "@mdi/react";
import { mdiExclamationThick, mdiHeart } from "@mdi/js";
import Button from "./button";

interface InfoBoxProps {
  icon: "exclamation" | "heart";
  buttontext?: string;
  buttonlink?: string;
  buttonNewTab?: boolean;
  children: React.ReactNode;
}

const iconMap = {
  exclamation: mdiExclamationThick,
  heart: mdiHeart,
};

function InfoBox({
  icon,
  buttontext,
  buttonlink,
  buttonNewTab = false,
  children,
}: InfoBoxProps) {
  return (
    <div className="w-full flex flex-col md:flex-row border-l-8 border-[#3999BF] p-4 mb-4 items-center white_bg">
      <Icon color="var(--primary_blue)" path={iconMap[icon]} size={3} style={{ minWidth: '3em', maxWidth: '3em' }} />
      <p className="mb-0 md:pl-4 petrol_text">{children}</p>
      {buttontext && buttonlink && (
        <div className="flex-none mt-6 pd:mt-0 justify-end md:ml-6 md:mt-0">
          <Button
            type={"small-blue1"}
            text={buttontext}
            url={buttonlink}
            newtab={buttonNewTab}
          ></Button>
        </div>
      )}
    </div>
  );
}

export default InfoBox;
