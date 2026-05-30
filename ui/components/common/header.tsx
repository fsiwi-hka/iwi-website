import Breadcrumb from "./breadcrumb";
import ResponsiveWrapper from "./responsive-wrapper";

interface HeaderProps {
  title: string;
  subtitle: string;
  showBreadcrumbs?: boolean;
}

const Header: React.FC<HeaderProps> = ({
  title,
  subtitle,
  showBreadcrumbs = true,
}) => {
  return (
    <div className="w-full md:h-100 flex flex-col justify-center primary_blue_bg overflow-hidden">
      <ResponsiveWrapper>
        {" "}
        <div className="flex flex-col justify-between py-6 xl:py-12">
          <div>
            {showBreadcrumbs ? <Breadcrumb></Breadcrumb> : ""}
            <h1 className="text-white mb-6 md:w-3/4vw ">{title}</h1>
            <p className="text-white mb-0 md:w-4/5vw">{subtitle}</p>
          </div>
        </div>
      </ResponsiveWrapper>
    </div>
  );
};

export default Header;
