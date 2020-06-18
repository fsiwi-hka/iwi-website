import Link from 'next/link'
import { faFacebook } from "@fortawesome/free-brands-svg-icons"
import { faTwitter } from "@fortawesome/free-brands-svg-icons"
import { faDiscord } from "@fortawesome/free-brands-svg-icons"
import { faInstagram } from "@fortawesome/free-brands-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"

function Footer() {
    return (
        <footer className="container">
            <div className="flex items-center justify-center">
                <ul className="flex items-center justify-end">
                    { socialIcon(faFacebook, '') }
                    { socialIcon(faTwitter, '') }
                </ul>
                <Link href="/"><a className="flex items-center justify-evenly mx-8" >
                    <img src="/assets/iwi-logo.svg" alt="IWI-Logo" className="h-32"/>
                </a></Link>
                <ul  className="flex items-center justify-start">
                    { socialIcon(faInstagram, '') }
                    { socialIcon(faDiscord, '') }
                </ul>
            </div>
            <p className="copyright my-4">
                &copy; { new Date().getFullYear() } Fachschaft IWI<br /> 
                <Link href="/impressum"><a>Impressum</a></Link>
            </p>
        </footer>
    )
}

function socialIcon(icon, href) {
    return (
        <li className="text-4xl mx-4 text-red-600 cursor-pointer">
            <Link href={ href }>
                <FontAwesomeIcon icon={ icon } />
            </Link>
        </li>
    )
}

export default Footer