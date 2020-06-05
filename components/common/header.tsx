import Link from 'next/link'

function Header() {
    return (
        <header
            className="flex items-center flex-col justify-center mb-16"
            style={{
                height: "550px",
                background: "linear-gradient(rgba(57, 153, 191, 0.7), rgba(57, 153, 191, 0.7)), url('/assets/backgrounds/homepage.jpg') no-repeat 50%",
                backgroundSize: "cover"
            }}>
            <Link href="/">
                <p className="title">Was gibt es Neues?</p>
            </Link>
            <p className="subtitle">
                Auf dieser Seite findest du Ankündigungen, die<br/>
                aktuellsten News und Veranstaltungen der Fachschaft<br />
                Informatik &amp; Wirtschaftsinformatik.
            </p>
        </header>
    )
}

export default Header