import Button from "./button";

interface ProtokollBoxProps {
  buttontext?: string;
  buttonlink?: string;
  buttonNewTab?: boolean;
  children: React.ReactNode;
  subtext?: string;
}

function ProtokollBox({
  buttontext,
  buttonlink,
  buttonNewTab = false,
  children,
  subtext,
}: ProtokollBoxProps) {
  return (
    <div className="w-full flex flex-col md:flex-row p-4 mb-4 items-center white_bg rounded-md">
      <div className="flex-grow">
        <p className="mb-0 font-bold uppercase petrol_text">{children}</p>
        {subtext && (
          <p className="text-sm white_bg mt-1 no-margin">{subtext}</p>
        )}
      </div>
      {buttontext && buttonlink && (
        <div className="flex mt-6 md:mt-0 md:ml-6 h-full item-center">
          <Button
            type={"small-petrol-pale"}
            text={buttontext}
            url={buttonlink}
            newtab={buttonNewTab}
          />
        </div>
      )}
    </div>
  );
}

export default ProtokollBox;