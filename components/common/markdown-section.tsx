import React, { useEffect, useState } from "react";
import ReactMarkdown from "react-markdown";
import FooterLink from "./footer-link";

interface MarkdownProps {
  fileUrl: string;
}

const MarkdownSection: React.FC<MarkdownProps> = ({ fileUrl }) => {
  const [content, setContent] = useState<string>("");

  useEffect(() => {
    fetch(fileUrl)
      .then((res) => res.text())
      .then(setContent)
      .catch((err) => console.error("Fehler beim Laden der Datei:", err));
  }, [fileUrl]);

  return (
    <ReactMarkdown
      components={{
        a: ({ href, children }) => {
          const text = children?.toString() || "";

          if (text) {
            const match = text.split("|");
            if (match) {
              const name = match[0].trim(); // Name des Links
              const newtab = match[1].trim(); // true | false für newtab

              return (
                <FooterLink href={href || "#"} name={name} newtab={newtab} />
              );
            }
          }

          // Falls nicht erkannt, normalen Link rendern
          return <a href={href}>{text}</a>;
        },
      }}
    >
      {content}
    </ReactMarkdown>
  );
};

export default MarkdownSection;
