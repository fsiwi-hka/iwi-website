import React, {useEffect, useState} from "react";
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
        a: ({ children, href }) => {
          const text = React.Children.toArray(children).join("");
          const parts = text.split("|").map((p) => p.trim());
          if (parts.length >= 2) {
            const [name, newtab] = parts;
            if (newtab === "true" || newtab === "false") {
              return <FooterLink href={href || "#"} name={name} newtab={newtab} />;
            }
          }

          return <a href={href}>{children}</a>;
        },
      }}
    >
      {content}
    </ReactMarkdown>
  );
};

export default MarkdownSection;
