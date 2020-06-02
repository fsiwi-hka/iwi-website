import Link from "next/link";

function Menu() {
    return (
        <nav className="container">
            <ul>
                <li><Link href="/"><a>Home</a></Link></li>
                <li><Link href="/werwirsind"><a>Wer wir sind</a></Link></li>
                <li><Link href="/faq"><a>FAQ</a></Link></li>
                <li><Link href="/unternehmen"><a>Unternehmen</a></Link></li>
            </ul>
        </nav>
    )
}

export default Menu