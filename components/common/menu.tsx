import Link from "next/link"
import { useRouter } from 'next/router'
import { faBars } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"

// TODO: https://www.tailwindtoolbox.com/components/fullscreen-modal

function Menu() {
    return (
        <nav className="w-full max-w-screen-lg mx-auto flex items-center justify-between">
            <Link href="/"><a>
                <img src="/assets/iwi-logo.svg" alt="IWI-Logo" className="h-16 md:h-24"/>
            </a></Link>
            <ul className="flex list-none">
                { menuItem("Aktuelles","/") }
                { menuItem("Erstsemester","/erstiinfos/") }
                { menuItem("Wer sind wir?","/werwirsind/") }
                { menuItem("Wissenswertes","/faq/",) }
                { menuItem("Sponsoring & Kooperation","/unternehmen/",) }
                { menuItem("Kontakt","/kontakt/",) }
            </ul>
            <Link href="/"><a className="hidden md:block">
                <img src="/assets/user.png" alt="Zugang zum internen Bereich" className="md:h-8"/>
            </a></Link>
            <a className="text-2xl mx-2 block md:hidden text-red-700 cursor-pointer">
              <FontAwesomeIcon icon={faBars} />
            </a>
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
        return "md:mr-6 md:my-0 active"
    }
    
    return "hidden md:block md:mr-6 md:my-0"
}

export default Menu