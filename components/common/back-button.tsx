import Link from 'next/link'
import { faChevronLeft } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

function BackButton({ href }) {
    return (
        <Link href={ href }>
            <p className="flex text-red-600 text-4xl items-center cursor-pointer mt-8">
                <FontAwesomeIcon icon={ faChevronLeft } />
                <span className="text-gray-500 text-xl ml-4">
                    Zurück
                </span>
            </p>
        </Link>
    )
}

export default BackButton