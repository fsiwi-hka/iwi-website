import Link from 'next/link'

function Footer() {
    return (
        <footer className="container">
            <div className="grid grid-cols-3 gap-4 my-4">
                <ul className="flex items-center justify-around">
                    <li><Link href="/impressum"><a>Impressum</a></Link></li>
                    <li><Link href="/werwirsind"><a>Kontakt</a></Link></li>
                </ul>
                <Link href="/"><a className="flex items-center justify-evenly" >
                    <img src="/assets/iwi-logo.svg" alt="IWI-Logo" className="h-24"/>
                </a></Link>
                <ul  className="flex items-center justify-around">
                    <li><Link href="/werwirsind"><a>Wer sind wir?</a></Link></li>
                    <li><Link href="/faq"><a>Hast du Fragen?</a></Link></li>
                </ul>
            </div>
            <hr className="border-t-4 border-gray-300 my-4" />
            <div className="my-8">
                <Link href=""><a className="fa fa-facebook"></a></Link>
                <Link href=""><a className="fa fa-twitter"></a></Link>
                <Link href=""><a className="fa fa-instagram"></a></Link>
                <Link href=""><a className="fa fa-github"></a></Link>
            </div>
            <p className="copyright my-4">
                &copy; { new Date().getFullYear() } Fachschaft IWI<br /> 
                <Link href=""><a>Privacy</a></Link> &mdash;
                <Link href=""><a>Terms</a></Link>
            </p>
        </footer>
    )
}

export default Footer