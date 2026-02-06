import React from "react";

interface WrapperProps {
  children: React.ReactNode;
}

//everything put inside this container will be displayed with the correct margins/paddings concerning every screen size

const ResponsiveWrapper: React.FC<WrapperProps> = ({ children }) => {
  return (
    //outer wrapper
    <div className="md:px-6 h-full">
      {/* inner wrapper */}
      <div className="flex flex-col justify-between md:flex-row md:px-0 gap-y-4 max-w-screen-xl mx-4 md:mx-auto my-6 h-full">{children}</div>
    </div>
  );
};

export default ResponsiveWrapper;
