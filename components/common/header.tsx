import Link from 'next/link'

function Header({image, title, subtitle}) {
    return (
        <header
            className="flex items-center flex-col justify-center mb-16"
            style={{
                height: "550px",
                background: `linear-gradient(
                        rgba(57, 153, 191, 0.7),
                        rgba(57, 153, 191, 0.7)
                    ), 
                    url('${ image }') 
                    no-repeat
                    50%`,
                backgroundSize: "cover"
            }}>
            <h1 className="text-6xl text-center text-white py-8 font-heading font-bold max-w-4xl">
                { title }
            </h1>
            <p className="text-xl text-center text-white max-w-2xl">
                { subtitle }
            </p>
        </header>
    )
}

export default Header