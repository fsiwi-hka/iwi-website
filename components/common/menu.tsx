import Link from "next/link";

function Menu() {
    return (
        <nav className="w-full max-w-screen-lg mx-auto flex items-center justify-between">
            <Link href="/"><a>
                <img src="/assets/iwi-logo.svg" alt="IWI-Logo" className="h-24"/>
            </a></Link>
            <ul className="flex list-none">
                { menuItem("Aktuell/Startseite","/") }
                { menuItem("Wer sind wir?","/werwirsind") }
                { menuItem("Wissenswertes","/faq",) }
                { menuItem("Kooperation & Sponsoring","/unternehmen",) }
                { menuItem("Kontakt","/kontakt",) }
            </ul>
            <Link href="/"><a>
                <img src="/assets/user.png" alt="Zugang zum internen Bereich" className="h-8"/>
            </a></Link>
        </nav>
    )
}

function menuItem(title, href) {
    return (
        <li className="mr-6 my-0">
            <Link href={ href }>
                <a className="text-gray-500 no-underline font-heading font-bold">
                    { title }
                </a>
            </Link>
        </li>
    )
}

export default Menu