import React from "react";
import ButtonButBigger from "./button-but-bigger";

interface BoxTextButtonProps {
  heading?: string;
  text: React.ReactNode;
  boxText: string;
  boxLink: string;
  newTab?: boolean;
  note?: React.ReactNode;
}

const BoxTextButton: React.FC<BoxTextButtonProps> = ({
  heading,
  text,
  boxText,
  boxLink,
  newTab = false,
  note,
}) => {
  return (
    <div className="w-full">
      {heading && (
        <h4 className="text-xl mb-2">{heading}</h4>
      )}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center space-x-4 mb-4">
        <div className="w-full lg:w-8/12 mb-4 lg:mb-0">
          <p>{text}</p>
        </div>
        <div className="w-full lg:w-4/12 flex justify-center lg:justify-end flex-col items-center lg:items-end">
          <ButtonButBigger
            text={boxText}
            link={boxLink}
            newTab={newTab}
            bgcolor="red"
          />

          {note && (
            <div className="mt-2 text-xs text-gray-500">
              <p>{note}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default BoxTextButton;