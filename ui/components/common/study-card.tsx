import Button from "./button";
import {LinkButton} from "../../pages/studies";

/**
 * Wo ein Link funktioniert. "intern" und "extern" gehören paarweise zusammen,
 * wenn ein Dienst unter zwei Adressen liegt; "both" ist der Normalfall - eine
 * Adresse, die überall funktioniert, und deshalb keiner Erklärung bedarf.
 * Die Beschriftung ergibt sich automatisch aus der Kategorie.
 */
export type LinkScope = "intern" | "extern" | "both";

const SCOPE_LABEL: Record<LinkScope, string> = {
    intern: "Im HKA-Netz",
    extern: "Von außerhalb",
    both: "Öffnen",
};

const SCOPE_TITLE: Record<LinkScope, string> = {
    intern: "Nur aus dem Hochschulnetz oder über VPN erreichbar.",
    extern: "Von außerhalb des Hochschulnetzes erreichbar.",
    both: "",
};

export interface StudyCardProps {
    title: string;
    subtitle: string;
    listElements: string[]
    buttons: LinkButton[];
}

function buttonTitle(button: LinkButton): string | undefined {
    const parts = [
        button.scope ? SCOPE_TITLE[button.scope] || undefined : undefined
    ].filter(Boolean);
    return parts.length > 0 ? parts.join(" ") : undefined;
}

const StudyCard: React.FC<StudyCardProps> = ({ title, subtitle, listElements, buttons }) => {
    const hasScopes = buttons.some((b) => b.scope);

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
            <div className={"mt-auto pt-4"}>
                <div className={"flex flex-wrap gap-2"}>
                    {buttons.map((button, index) => (
                        <Button
                            key={index}
                            // Zugangswege sind gleichwertig und werden beide hervorgehoben.
                            // Sonst ist der erste Eintrag die Hauptaktion, der Rest ordnet sich unter.
                            type={
                                button.scope || (!hasScopes && index === 0)
                                    ? "small-petrol-pale"
                                    : "small-outline"
                            }
                            text={button.getText()}
                            title={buttonTitle(button)}
                            url={button.url}
                            newtab={button.buttonNewTab}
                        />
                    ))}
                </div>
            </div>
        </div>
    )
}

export default StudyCard;
