import Link from 'next/link'

function Header() {
    return (
        <header className="container">
            <Link href="/">
                <p className="title">IWI Website</p>
            </Link>
            <p className="subtitle">This page is currently under construction.</p>
        </header>
    )
}

export default Header