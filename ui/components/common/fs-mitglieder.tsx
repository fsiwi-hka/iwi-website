import React from "react";

interface Mitglied {
  img: string; // image of the member
  position: string; // position of the member, f.e. "Vorstand"
  name: string; // name of the member
}

interface FsMitgliederProps {
  mitglieder: (Mitglied | null)[]; // Das Array kann auch null-Werte enthalten
}

const FsMitglieder: React.FC<FsMitgliederProps> = ({ mitglieder }) => {
  return (
    <div className="max-w-screen-xl w-full md:m-auto">
      <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-8 mb-4 md:mb-12">
        {mitglieder.map((mitglied, index) => (
          <div
            key={index}
            className="flex flex-col items-center justify-start"
          >
            {mitglied ? (
              <>
                {/* img */}
                <img
                  src={mitglied.img}
                  alt={mitglied.name}
                  className="w-full h-auto rounded-full object-cover mb-2"
                />
                {/* position */}
                <p className="text-center font-bold petrol_text no-margin">{mitglied.position}</p>
                {/* name */}
                <p className="text-center text-gray-700">{mitglied.name}</p>
              </>
            ) : (
              <div className="w-full h-full rounded-full mb-4"></div> 
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default FsMitglieder;
