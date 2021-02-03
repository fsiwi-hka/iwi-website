import Link from "next/link"
import { useRouter } from 'next/router'

function Menu() {
    return (
        <nav className="w-full max-w-screen-lg mx-auto flex items-center justify-between">
            <Link href="/"><a>
                <img src="/assets/iwi-logo.svg" alt="IWI-Logo" className="h-24"/>
            </a></Link>
            <ul className="flex list-none">
                { menuItem("Aktuelles","/") }
                { menuItem("Erstsemester","/erstiinfos/") }
                { menuItem("Wer sind wir?","/werwirsind/") }
                { menuItem("Wissenswertes","/faq/",) }
                { menuItem("Sponsoring & Kooperation","/unternehmen/",) }
                { menuItem("Kontakt","/kontakt/",) }
            </ul>
            <Link href="/"><a>
                <img src="/assets/user.png" alt="Zugang zum internen Bereich" className="h-8"/>
            </a></Link>
        </nav>
    )
}

function menuItem(title, href) {
    const classes = determineClasses(title, href)
    return (
        <li className={classes}>
            <Link href={ href }>
                <a className="text-gray-700 no-underline font-heading font-bold">
                    { title }
                </a>
            </Link>
        </li>
    )
}

function determineClasses(title, href) {
    // Using the router allows us to check which page
    // we're on, so we can style the active link
    const router = useRouter()
    if(
        // we need to append the trailing slash because the router
        // pathname doesn't contain it (it's added in the NextJS config)
        router.pathname + '/' === href ||
        router.pathname.startsWith(href) && href != "/" ||
        router.pathname.startsWith("/news") && href === "/"
    ) {
        return "mr-6 my-0 active"
    }
    
    return "mr-6 my-0"
}

export default Menu