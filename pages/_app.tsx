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

            <section className="main w-full mx-auto px-8 py-8" style={{ background: `#3999bf` }}>
                <div className="text-gray-400 mx-auto max-w-screen-lg text-sm">
                    <p className="my-0">
                        <strong>Registrierung für das StudiBoard:</strong> Kommt bei uns in der <strong>Fachschaftssitzung (E013) mittwochs um 11:30 Uhr</strong> 
                        vorbei, zeigt euren Studentenausweis nach der Sitzung vor, um euer RZ-Kürzel zu verifizieren <strong>ODER</strong> sendet
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
