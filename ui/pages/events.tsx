import {GetStaticProps} from "next";
import {useEffect, useState} from "react";
import Icon from "@mdi/react";
import {mdiCalendarSync, mdiContentCopy} from "@mdi/js";

import Header from "../components/common/header";
import ResponsiveWrapper from "../components/common/responsive-wrapper";
import MonthView from "../components/common/calendar/MonthView";
import CalendarService from "@services/calendar-service";

function Events() {
    // Abo-Link zeigt direkt auf den oeffentlichen Nextcloud-Kalender, die URL steht in der Backend-Config.
    const [subscribeUrl, setSubscribeUrl] = useState<string | null>(null);
    const [copied, setCopied] = useState(false);

    useEffect(() => {
        const controller = new AbortController();
        CalendarService.getSubscribeUrl(controller.signal)
            .then(setSubscribeUrl)
            .catch((error) => {
                if (!controller.signal.aborted) console.error("Error loading calendar subscription:", error);
            });
        return () => controller.abort();
    }, []);

    // webcal:// oeffnet direkt die Kalender-App (iOS/macOS/Outlook/Thunderbird) und legt ein Abo an.
    const webcalUrl = subscribeUrl?.replace(/^https?:\/\//, "webcal://");

    const copy = async () => {
        if (!subscribeUrl) return;
        try {
            await navigator.clipboard.writeText(subscribeUrl);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        } catch {
            window.prompt("Kalender-Link kopieren:", subscribeUrl);
        }
    };

    return (
        <>
            <Header
                title="Termine"
                subtitle="Sitzungen, Partys, Spieleabende und alles andere, was bei der Fachschaft IWI ansteht. Abonnier den Kalender, dann hast du die Termine immer automatisch in deiner Kalender-App."
            ></Header>

            <ResponsiveWrapper>
                <div className="w-full mb-24">
                    {webcalUrl && <div className="flex flex-wrap gap-2 mb-8">
                        <a
                            href={webcalUrl}
                            className="primary_blue_bg text-white no-underline rounded-full px-4 py-2 text-sm font-semibold inline-flex items-center gap-2"
                        >
                            <Icon path={mdiCalendarSync} size={0.8}/>
                            Kalender abonnieren
                        </a>
                        <button
                            type="button"
                            onClick={copy}
                            className="bg-white petrol_pale_text border border-gray-400 hover:border-gray-700 rounded-full px-4 py-2 text-sm font-semibold inline-flex items-center gap-2"
                        >
                            <Icon path={mdiContentCopy} size={0.8}/>
                            {copied ? "Link kopiert" : "Link kopieren"}
                        </button>
                    </div>}

                    <MonthView/>
                </div>
            </ResponsiveWrapper>
        </>
    );
}

export default Events;

export const getStaticProps: GetStaticProps = async () => {
    return {
        props: {
            data: {
                title: "Termine",
            },
        },
    };
};
