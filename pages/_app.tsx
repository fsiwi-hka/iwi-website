import PageHead from './../components/common/page-head'
import Header from './../components/common/header'
import Footer from './../components/common/footer'
import Menu from './../components/common/menu'
import 'react-calendar/dist/Calendar.css'
import '../styles/index.css'

import { config } from '@fortawesome/fontawesome-svg-core'
import '@fortawesome/fontawesome-svg-core/styles.css'
config.autoAddCss = false 

function IWIWebsite({ Component, pageProps }) {
    const og = pageProps.data?.og
    const title = pageProps.data?.title

    return (
        <>
            <PageHead title={title} og={og} />

            <Menu />

            <section className="main w-full mx-auto px-8 py-8 bg-black">
                <div className="text-gray-400 mx-auto max-w-screen-lg text-sm">
                    <p>
                        Aufgrund eines <strong>Cyberangriffs (<a href={"https://h-ka.statusinfo.live/"}>
                        <strong>https://h-ka.statusinfo.live/</strong></a>)</strong>  auf die HKA sind nun sämtliche
                        Plattformen nicht erreichbar. Eine <strong>Ausweichlösung</strong> für INFB, MINB und INFM,
                        um auf die Stundenpläne zuzugreifen, ist hier zu finden: <a href={"https://intranet.hka-iwi.de/iwii/info/timetable/INFB/1"}>
                        <strong>https://intranet.hka-iwi.de/iwii/info/timetable/INFB/1</strong></a>
                    </p>

                    <br></br>

                    <p className="my-0">
                        Aufgrund des Ausfalls funktioniert auch unsere <strong>Registrierung für das StudiBoard</strong> nicht,
                        da diese an die API der HKA angebunden ist. Es wurde eine <strong>Lösung </strong> hierzu erarbeitet:
                        Kommt bei uns in der <strong>Fachschaftssitzung (E013) mittwochs um 11:30 Uhr</strong> vorbei, zeigt
                        euren Studentenausweis nach der Sitzung vor, um euer RZ-Kürzel  zu verifizieren <strong>ODER</strong> sendet
                        euren Studentenausweis, euer RZ-Kürzel sowie eine private Email-Adresse an <a href="/scripts/email.php?address=kontakt">
                        <strong>kontakt[at]iwi-hka.de</strong></a>. Anschließend wird euer Account manuell freigeschalten.
                    </p>
                </div>
            </section>

            <Header {...pageProps.data.header} />

            <section className="main w-full max-w-screen-lg mx-auto px-8">
                <Component {...pageProps} />
            </section>

            <Footer />

            <script src="/scripts/menu.js"></script>
        </>
    )
}

export default IWIWebsite
