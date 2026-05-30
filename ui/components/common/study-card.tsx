import Button from "./button";

interface Button {
    text: string;
    url: string;
    buttonNewTab?: boolean;
}

interface StudyCardProps {
    title: string;
    subtitle: string;
    listElements: string[]
    buttons: Button[];
}

const StudyCard: React.FC<StudyCardProps> = ({ title, subtitle, listElements, buttons }) => {
    return (
        <div className="bg-[#F4F6F7] rounded-lg px-4 py-6 flex flex-col h-full">
            <h4>{title}</h4>
            {subtitle && <p className={"m-0"}>{subtitle}</p>}
            {listElements.length > 0 && (
                <ul className={"text-[#6C6C6C]"}>
                    {listElements.map((elem: string, index: number) => (
                        <li
                            key={index}
                        >
                            {elem}
                        </li>
                    ))}
                </ul>
            )}
            <div className={"flex flex-col md:flex-row gap-4 mt-auto pt-2"}>
                {buttons.map((button, index) => (
                        <Button
                            key={index}
                            type={"small-petrol-pale"}
                            text={button.text}
                            url={button.url}
                            newtab = {button.buttonNewTab}
                        />
                ))}
            </div>
        </div>
    )
}

export default StudyCard;