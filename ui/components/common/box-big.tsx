import Button from "./button";

interface BoxProps {
  title: string;
  subtitle: string;
  bgcolor: "primary_blue_bg" | "petrol_pale_bg";
  buttontext: string;
  buttonlink: string;
  newTab?: boolean;
}

const BoxBig: React.FC<BoxProps> = ({ title, subtitle, bgcolor, buttontext, buttonlink, newTab }) => {
  return (
    <div className={`flex justify-between flex-col rounded-xl text-white p-6 ${bgcolor}`}>
      <div>
        <h4 className="text-white mb-4">{title}</h4>
        <p className="text-white">{subtitle}</p>
      </div>
      <Button type={"small-white"} text={buttontext} url={buttonlink} newtab={newTab}></Button>
    </div>
  );
};

export default BoxBig;
