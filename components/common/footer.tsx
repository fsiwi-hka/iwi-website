import Link from 'next/link'
import { faFacebook } from "@fortawesome/free-brands-svg-icons"
import { faTwitter } from "@fortawesome/free-brands-svg-icons"
import { faDiscord } from "@fortawesome/free-brands-svg-icons"
import { faInstagram } from "@fortawesome/free-brands-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"

function Footer() {
    return (
        <footer className="w-full max-w-screen-lg mx-auto text-center text-gray-500 py-12">
            <hr className="border-t-2 border-gray-300 my-3 w-1/2 m-auto" />
            <div className="flex items-center justify-center">
                <ul className="flex items-center justify-end list-none font-heading">
                    { socialIcon(faFacebook, '') }
                    { socialIcon(faTwitter, '') }
                </ul>
                <Link href="/"><a className="flex items-center justify-evenly mx-8" >
                    <img src="/assets/iwi-logo.svg" alt="IWI-Logo" className="h-32"/>
                </a></Link>
                <ul  className="flex items-center justify-start list-none font-heading">
                    { socialIcon(faInstagram, '') }
                    { socialIcon(faDiscord, '') }
                </ul>
            </div>
            <p className="copyright my-4">
                &copy; { new Date().getFullYear() } Fachschaft IWI<br /> 
                <Link href="/impressum"><a className="text-gray-500 no-underline">Impressum</a></Link>
            </p>
        </footer>
    )
}

function socialIcon(icon, href) {
    return (
        <li className="text-4xl mx-4 mb-0 text-red-600 cursor-pointer">
            <Link href={ href }>
                <FontAwesomeIcon icon={ icon } />
            </Link>
        </li>
    )
}

export default Footer