import Icon from "@mdi/react";
import { mdiClockTimeFourOutline, mdiMapMarkerRadiusOutline } from "@mdi/js";
import Button from "./button";

function EventElement({ date, time, title, location, locationLink, buttonLink }) {
  return (
    <div className="rounded-xl flex flex-col md:flex-row white_bg petrol_pale_text">
      {/* Datum – nur Desktop */}
      <div className="hidden md:flex items-center justify-center primary_blue_bg rounded-t-xl md:rounded-tr-none md:rounded-l-xl text-white font-bold px-6 py-6 md:py-12 text-xl md:w-[15%]">
        {date}
      </div>

      {/* Titel – sichtbar auf allen Geräten */}
      <div className="flex flex-1 md:items-center text-xl font-bold px-5 py-4 md:py-0">{title}</div>

      {/* Button – nur Desktop */}
      {buttonLink && (
        <div className="hidden md:flex flex-none justify-center items-center ml-4 md:ml-0 mb-4 md:mb-0">
          <Button type={"small-petrol-pale"} text={"Link"} url={buttonLink} newtab={true} />
        </div>
      )}

      <div className="flex flex-col gap-2 md:justify-center md:w-[16%] mx-4 md:ml-12 mb-4 md:my-0 md:pr-6">
        {/* Datum + Uhrzeit – nur Mobile */}
        <div className="inline-flex items-center text-sm md:hidden">
          <Icon path={mdiClockTimeFourOutline} size={0.8} />
          <span className="pr-1 pl-2">{date}</span>
          <span className="px-1">|</span>
          <span className="px-1">{time}</span>
        </div>

        {/* Uhrzeit – nur Desktop */}
        <div className="inline-flex items-center text-sm hidden md:flex">
          <Icon path={mdiClockTimeFourOutline} size={0.8} />
          <span className="pl-2">{time}</span>
        </div>

        {/* Ort – sichtbar auf allen Geräten */}
        {location && (
          <div className="inline-flex items-center">
            <Icon path={mdiMapMarkerRadiusOutline} size={0.8} />
            {locationLink ? (
              <span className="pl-2">
                <a href={locationLink} className="hover:underline">
                  {location}
                </a>
              </span>
            ) : (
              <span className="pl-2">{location}</span>
            )}
          </div>
        )}

        {/* Button – nur Mobile */}
        {buttonLink && (
          <div className="flex md:hidden pt-2">
            <Button type={"small-petrol-pale"} text={"Link"} url={buttonLink} newtab={true} />
          </div>
        )}
      </div>
    </div>
  );
}

export default EventElement;
