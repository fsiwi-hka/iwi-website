import Link from "next/link"
import { useRouter } from 'next/router'
import { faBars, faCloud, faTimes, faUserPlus } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"

const mainMenuItems = [
    { title: "Erstsemester", slug: "/erstiinfos/" },
    { title: "Wer sind wir?", slug: "/werwirsind/" },
    { title: "Wissenswertes", slug: "/faq/" },
    { title: "Sponsoring & Kooperation", slug: "/unternehmen/" },
    { title: "Kontakt", slug: "/kontakt/" },
]

const userMenuItems = [
    { title: 'Nextcloud', link: 'https://cloud.iwi-hka.de', icon: faCloud },
    { title: 'Registrierung', link: 'https://registration.iwi-hka.de', icon: faUserPlus },
]

function Menu() {
    return (
        <>
            <nav className="w-full max-w-screen-lg mx-auto flex items-center justify-between">
                <Link href="/" legacyBehavior>
                    <img src="/assets/iwi-logo.svg" alt="IWI-Logo" className="h-16 md:h-24"/>
                </Link>
                <ul className="flex list-none">
                    { mainMenuItems.map(item => { return menuItem(item.title, item.slug)}) }
                </ul>
                <div className="dropdown hidden md:block relative">
                    <img src="/assets/user.png" alt="Zugang zum internen Bereich" className="md:h-8"/>
                    <div className="dropdown-menu top-0 right-0 absolute h-auto flex pt-4 mt-8 hidden w-[220px]">
                        <ul className="block w-full bg-white list-none border-t-4 border-red-700">
                            { userMenuItems.map(item => { return userMenuItem(item.title, item.link, item.icon)}) }
                        </ul>
                    </div>
                </div>
                <a className="text-2xl mx-2 block md:hidden text-red-700 cursor-pointer modal-open">
                <FontAwesomeIcon icon={faBars} />
                </a>
            </nav>
            { mobileMenu() }
        </>
    );
}

function menuItem(title, href) {
    const classes = determineClasses(title, href)
    return (
        <li key={ href } className={ classes }>
            <Link
                href={ href }
                className="text-gray-700 no-underline font-heading font-bold"
                legacyBehavior>

                { title }

            </Link>
        </li>
    );
}

function mobileMenu() {
    return (
        <div className="modal opacity-0 pointer-events-none fixed w-screen h-screen top-0 left-0 flex items-center justify-center">
            <div className="modal-overlay absolute w-screen h-screen bg-white opacity-95"></div>
            <div className="modal-container fixed w-screen h-screen z-50 overflow-y-auto ">
                
                <div className="modal-close absolute top-0 right-0 cursor-pointer flex flex-col items-center mt-4 mr-4 text-red-700 text-sm z-50">
                    <a className="text-2xl mx-2 block md:hidden text-red-700 cursor-pointer">
                    <FontAwesomeIcon icon={faTimes} />
                    </a>
                </div>
                <div className="modal-content container mx-auto h-auto text-center pt-8">
                    <ul className="list-none">
                        { mainMenuItems.map(item => { return mobileMenuItem(item.title, item.slug)}) }
                    </ul>
                    <hr className="border-t-2 border-gray-400 mt-4 mb-8 w-3/4 m-auto" />
                    <ul className="list-none">
                        { userMenuItems.map(item => { return mobileMenuItem(item.title, item.link)}) }
                    </ul>
                </div>
            </div>
        </div>
    )
}

function mobileMenuItem(title, href) {
    return (
        <li key={ href } className="py-4 modal-close">
            <Link
                href={ href }
                className="text-xl text-gray-700 no-underline font-heading font-bold"
                legacyBehavior>

                { title }

            </Link>
        </li>
    );
}

function userMenuItem(title, href, icon) {
    return (
        <li key={ href } className="px-8 py-4">
            <Link href={ href } passHref title={title} legacyBehavior>

                <span className="block cursor-pointer text-gray-700 no-underline font-heading font-bold">
                    <FontAwesomeIcon icon={ icon } className="mr-4" fixedWidth />
                    { title }
                </span>

            </Link>
        </li>
    );
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