import { useState } from "react";
import Icon from "@mdi/react";
import { mdiArrowUp } from "@mdi/js";

interface AccordionProps {
  title: string;
  children: React.ReactNode;
}

function Accordion({ title, children }: AccordionProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="mb-4">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full text-left flex justify-between items-center p-5 white_bg hover:bg-[#e0e0e0] rounded-md"
      >
        <h4 className="text-lg font-bold uppercase text-center w-full flex items-center justify-center gap-2 ">
          {title}
          <Icon
            className={`transition duration-300 ${isOpen ? "rotate-[180deg]" : "rotate-[0deg]"}`}
            path={mdiArrowUp}
            size={0.7}
          />
        </h4>
      </button>

      {isOpen && <div className="mt-4">{children}</div>}
    </div>
  );
}

export default Accordion;
