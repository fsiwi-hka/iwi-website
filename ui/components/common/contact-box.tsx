import Image from "next/image";
import { Icon } from "@mdi/react";

interface ContactList {
  title: string;
  contactItems: ContactItem[];
}

interface ContactItem {
  imageSrc: string;
  items: string[];
  isLink?: boolean;
}

interface ContactBoxProps {
  title: string;
  contactLists: ContactList[];
  direction: "horizontal" | "vertical";
}

const ContactBox: React.FC<ContactBoxProps> = ({ title, contactLists, direction }) => {
  return (
    <div className="bg-[#F4F6F7] rounded-lg flex flex-col">
      {title && <h2 className={"px-4"}>{title}</h2>}
      <div className={`flex flex-col ${direction == "horizontal" && "xl:flex-row justify-between"}`}>
        {contactLists.map((contactList, listIndex) => (
          <div className={"py-4 px-4"} key={`list-${listIndex}`}>
            <h4>{contactList.title}</h4>
            <div className={`flex flex-col gap-4 pt-2`}>
              {contactList.contactItems.map((contactItem, itemIndex) => (
                <div className={"flex flex-row items-start gap-6"} key={`contact-${listIndex}-${itemIndex}`}>
                  {contactItem.imageSrc.endsWith(".png") || contactItem.imageSrc.endsWith(".svg") ? (
                    <Image src={contactItem.imageSrc} alt="" width={24} height={24} className="mt-1" />
                  ) : (
                    <Icon className="primary_blue mt-1" size={1} path={contactItem.imageSrc} />
                  )}
                  <div className="flex flex-col gap-1">
                    {contactItem.items.map((item, pIndex) =>
                      contactItem.isLink ? (
                        <a
                          href={item.startsWith("http") ? item : `https://${item}`}
                          key={`item-${listIndex}-${itemIndex}-${pIndex}`}
                          className={"mb-0 pt-1 text-blue-600 hover:text-blue-800 underline"}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          {item}
                        </a>
                      ) : (
                        <p key={`item-${listIndex}-${itemIndex}-${pIndex}`} className={"mb-0 pt-1"}>
                          {item}
                        </p>
                      )
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ContactBox;
