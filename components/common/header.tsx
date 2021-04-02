import Link from 'next/link'

function Header({image, title, subtitle}) {
    return (
        <header
            className="flex items-center flex-col justify-center mb-16 bg-cover px-8"
            style={{
                background: `linear-gradient(
                        rgba(57, 153, 191, 0.7),
                        rgba(57, 153, 191, 0.7)
                    ), 
                    url('${ image }') 
                    no-repeat
                    50% / cover`
            }}>
            <h1 className="text-4xl md:text-6xl text-center text-white py-4 md:py-8 mt-4 md:mt-16 font-heading font-bold max-w-4xl">
                { title }
            </h1>
            <p className="text-xl text-center text-white mb-8 md:mb-32 max-w-2xl">
                { subtitle }
            </p>
        </header>
    )
}

export default Header