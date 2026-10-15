import {GetStaticProps} from "next";
import {useEffect, useState} from "react";
import Icon from "@mdi/react";
import {mdiCalendarSync, mdiContentCopy} from "@mdi/js";

import Header from "../components/common/header";
import ResponsiveWrapper from "../components/common/responsive-wrapper";
import MonthView from "../components/common/calendar/MonthView";
import CalendarService from "@services/calendar-service";

function Events() {
    // Die URLs haengen am window.location und stehen erst im Browser fest (statischer Export).
    const [urls, setUrls] = useState<{ https: string; webcal: string } | null>(null);
    const [copied, setCopied] = useState(false);

    useEffect(() => {
        setUrls({https: CalendarService.getSubscribeUrl(), webcal: CalendarService.getWebcalUrl()});
    }, []);

    const copy = async () => {
        if (!urls) return;
        try {
            await navigator.clipboard.writeText(urls.https);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        } catch {
            window.prompt("Kalender-Link kopieren:", urls.https);
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
                    <div className="flex flex-wrap gap-2 mb-8">
                        <a
                            href={urls?.webcal ?? "#"}
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
                    </div>

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
