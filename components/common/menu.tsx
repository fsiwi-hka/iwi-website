import Link from "next/link";

function Menu() {
    return (
        <nav className="container flex items-center justify-between">
            <Link href="/"><a>
                <img src="/assets/iwi-logo.svg" alt="IWI-Logo" className="h-24"/>
            </a></Link>
            <ul>
                <li><Link href="/"><a>Aktuell/Startseite</a></Link></li>
                <li><Link href="/werwirsind"><a>Wer sind wir?</a></Link></li>
                <li><Link href="/faq"><a>Was du wissen solltest</a></Link></li>
                <li><Link href="/unternehmen"><a>Kooperation &amp; Sponsoring</a></Link></li>
            </ul>
            <Link href="/"><a>
                <img src="/assets/user.png" alt="Zugang zum internen Bereich" className="h-8"/>
            </a></Link>
        </nav>
    )
}

export default Menu