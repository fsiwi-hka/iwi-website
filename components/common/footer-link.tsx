import React from "react";

import Icon from "@mdi/react";
import { mdiArrowTopRight } from "@mdi/js";

const FooterLink = ({ href, name, newtab }) => {
  return (
    <div className="max-w-max group">
      <a
        className="hover:underline hover:cursor-pointer inline"
        href={href}
        target={newtab == "true" ? "_blank" : undefined}
        rel={newtab ? "noopener noreferrer" : undefined}
      >
        <span>{name}</span>
        <span className="ml-1 whitespace-nowrap">
          <Icon className="inline-flex group-hover:rotate-45 transition duration-300" path={mdiArrowTopRight} size={0.7} />
        </span>
      </a>
    </div>
  );
};

export default FooterLink;
