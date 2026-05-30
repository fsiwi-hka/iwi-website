import Breadcrumb from "./breadcrumb";
import Icon from "@mdi/react";
import { mdiCalendar, mdiClockTimeFourOutline, mdiMapMarkerRadiusOutline } from "@mdi/js";
import ResponsiveWrapper from "./responsive-wrapper";

interface HeaderProps {
  title: string;
  image: string;
  date?: string;
  time?: string;
  location?: string;
  locationlink?: string;
  showBreadcrumbs?: boolean;
}

function formatDate(dateString: string): string {
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return dateString;

  return new Intl.DateTimeFormat("de-DE", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  }).format(date);
}

const Header: React.FC<HeaderProps> = ({
  title,
  image,
  showBreadcrumbs = true,
  date,
  time,
  location,
  locationlink,
}) => {
  return (
    <div className="w-full md:h-full flex flex-col justify-center primary_blue_bg overflow-hidden">
      <ResponsiveWrapper>
        <div className="flex flex-row gap-6 justify-between py-6 xl:py-12 items-stretch">
          <div>
            {showBreadcrumbs ? <Breadcrumb siteName={title}></Breadcrumb> : ""}

            <h1 className="text-white mb-6 md:w-3/4vw text-balance">{title}</h1>

            {/* Event-Details werden nur angezeigt, wenn Datum, Zeit und Ort gesetzt sind */}
            {date && time && location ? (
              <div className="flex flex-col md:flex-row gap-6 text-white text-balance">
                <div className="flex gap-2">
                  <Icon path={mdiCalendar} size={1}></Icon>
                  {formatDate(date)}
                </div>
                <div className="flex gap-2">
                  <Icon path={mdiClockTimeFourOutline} size={1}></Icon>Ab {time}
                </div>
                <div className="flex gap-2 hover:underline">
                  <Icon path={mdiMapMarkerRadiusOutline} size={1}></Icon>
                  <a href={locationlink} target="_blank" rel="noopener noreferrer">
                    {location}
                  </a>
                </div>
              </div>
            ) : (
              <></>
            )}
          </div>
        </div>
        {/* Bild */}
        <div className="w-1/2 hidden md:block">
          <div className="relative w-full">
            <div className="absolute left-0 top-0 w-full h-full rounded-md primary_blue_bg opacity-25 z-30" />
            <img className="w-full h-full object-cover grayscale rounded-md" src={image} alt={`Event: ${title}`} />
          </div>
        </div>
      </ResponsiveWrapper>
    </div>
  );
};

export default Header;
