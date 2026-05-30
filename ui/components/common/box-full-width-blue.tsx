import Button from "./button";
import ResponsiveWrapper from "./responsive-wrapper";

interface BoxFullWidthBlueProps {
  title: string;
  subtitle: string;
  buttontext: string;
  buttonlink: string;
  belowText?: string;
}

const BoxFullWidthBlue: React.FC<BoxFullWidthBlueProps> = ({ title, subtitle, buttontext, buttonlink, belowText }) => {
  return (
    <div className="w-full md:h-100 flex flex-col justify-center primary_blue_bg overflow-hidden items-center mb-12">
      <ResponsiveWrapper>
        <div className="flex flex-col justify-between py-6 xl:py-12">
          <div className="flex flex-col items-center">
            <h1 className="text-white text-3xl md:text-5xl mb-6 text-center">{title}</h1>
            <p className="text-white mb-6 text-center md:w-3/4">{subtitle}</p>
            <div className="flex justify-center">
              <Button type="large-petrol-pale" text={buttontext} url={buttonlink} />
            </div>
            {belowText && (
              <p className="text-white text-sm text-center mt-4 md:w-3/4">{belowText}</p>
            )}
          </div>
        </div>
      </ResponsiveWrapper>
    </div>
  );
};

export default BoxFullWidthBlue;