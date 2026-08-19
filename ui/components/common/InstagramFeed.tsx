import {useEffect, useState} from "react";

const PROFILE = {username: "iwi_fachschaft", url: "https://www.instagram.com/iwi_fachschaft/?hl=de"};

function InstagramFeed() {
    const [postings, setPostings] = useState([]);
    const [user, setUser] = useState(null);
    const count = 4;

    useEffect(() => {
        async function loadPostings() {
            // Immer zur Laufzeit laden: das Backend spiegelt die Bilder und liefert
            // eigene, dauerhaft gueltige URLs. Die Original-URLs der Graph API sind
            // signiert und laufen nach wenigen Stunden ab - ein zur Buildzeit
            // eingebackener Snapshot waere nach dem Deploy sofort kaputt.
            try {
                const res = await fetch(`/api/content/insta-posts?limit=${count}`);
                if (!res.ok) throw new Error(`HTTP ${res.status}`);

                const feed = await res.json();
                if (!feed?.data?.length) throw new Error("leerer Feed");

                if (feed.user) setUser(feed.user);
                setPostings(feed.data.slice(0, count));
            } catch (error) {
                console.error("Error loading Instagram postings:", error);
                setPostings([]);
            }
        }

        loadPostings();
    }, [count]);

    return (
        <div className="md:px-6 white_bg p-6 pb-10">
            <div className="md:px-0 gap-y-4 max-w-screen-xl mx-auto my-6 relative">
                <h2 className="petrol_pale_text mt-0">
                    Die Fachschaft IWI <br/>auf Instagram
                </h2>
                <p className="primary_grey sm:mb-12">Bleib up to date mit Events, News und vielem mehr!</p>

                {postings && postings.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-6 gap-y-6">
                        {postings.map((post) => (
                            <InstagramPost key={post.id} post={post} user={user}/>
                        ))}
                    </div>
                ) : (
                    <div className="rounded-xl p-5 bg-white text-center">Instagram Feed konnte nicht geladen
                        werden.</div>
                )}

                <img className="absolute top-0 right-0 invisible sm:visible w-24" src="/images/Shape-2.svg" alt=""/>
            </div>
        </div>
    );
}

export default InstagramFeed;

function InstagramPost({post, user}) {
    const isVideo = post.media_type === "VIDEO";
    const isAlbum = post.media_type === "CAROUSEL_ALBUM";
    const src = post.media_url ?? post.thumbnail_url;
    // Instagram-Posts sind 4:5, 1:1 oder 1.91:1. Die Kachel bleibt quadratisch,
    // damit das Raster gleichmaessig bleibt, das Bild wird darin aber vollstaendig
    // eingepasst statt beschnitten. Nicht-quadratische Posts bekommen die freien
    // Raender mit einer unscharfen Kopie gefuellt, sonst klaffen weisse Balken.
    const hasSize = Boolean(post.width && post.height);
    const needsBackdrop = hasSize && Math.abs(post.width / post.height - 1) > 0.02;
    const date = post.timestamp ? new Date(post.timestamp).toLocaleDateString("de-DE", {
        day: "numeric",
        month: "long"
    }) : "";

    return (
        <div className="flex flex-col overflow-hidden rounded-xl border border-gray-400 bg-white shadow-sm">
            <div className="flex items-center gap-2 px-3 py-2.5">
                {user?.profile_picture_url
                    ? <img src={user.profile_picture_url} alt="" className="h-8 w-8 rounded-full object-cover"/>
                    : <span className="h-8 w-8 rounded-full bg-gray-400"/>}
                <div className="flex flex-col leading-tight">
                    <a href={PROFILE.url}
                       className="text-sm font-semibold text-gray-900 hover:underline">{user?.username ?? PROFILE.username}</a>
                    {date && <span className="text-xs text-gray-400">{date}</span>}
                </div>
                <span className="ml-auto text-gray-500">···</span>
            </div>

            <a href={post.permalink} target="_blank" rel="noopener noreferrer"
               className="relative block aspect-square overflow-hidden bg-gray-400">
                {needsBackdrop && (
                    <img src={src} alt="" aria-hidden="true"
                         className="absolute inset-0 h-full w-full scale-110 object-cover blur-xl"/>
                )}
                <img
                    src={src}
                    alt={post.caption ? post.caption.split("\n")[0].slice(0, 120) : ""}
                    width={hasSize ? post.width : undefined}
                    height={hasSize ? post.height : undefined}
                    className="relative h-full w-full object-contain duration-300 hover:opacity-95"
                />
                {(isVideo || isAlbum) && (
                    <span className="absolute right-2 top-2 text-white drop-shadow">{isVideo ? <PlayIcon/> :
                        <AlbumIcon/>}</span>
                )}
            </a>

            <div className="flex items-center gap-4 px-3 pt-3 text-gray-800">
                <HeartIcon className="hover:opacity-60" url={post.permalink}/>
                <CommentIcon className="hover:opacity-60" url={post.permalink}/>
                <ShareIcon className="hover:opacity-60" url={post.permalink}/>
                <BookmarkIcon className="ml-auto hover:opacity-60" url={post.permalink}/>
            </div>

            <div className="px-3 pb-3 pt-2 text-sm">
                {typeof post.like_count === "number" && (
                    <p className="font-semibold text-gray-900">{post.like_count.toLocaleString("de-DE")} Likes</p>
                )}
                {typeof post.comments_count === "number" && (
                    <a href={post.permalink} target="_blank" rel="noopener noreferrer"
                       className="text-gray-500 hover:underline">
                        Alle {post.comments_count.toLocaleString("de-DE")} Kommentare ansehen
                    </a>
                )}
            </div>
        </div>
    );
}

function HeartIcon({url, className = ""}) {
    return <a href={url} target="_blank" rel="noopener noreferrer" className={className}>
        <svg
            width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path
                d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.7l-1-1a5.5 5.5 0 0 0-7.8 7.8l1 1L12 21l7.8-7.6 1-1a5.5 5.5 0 0 0 0-7.8z"/>
        </svg>
    </a>
        ;
}

function CommentIcon({url, className = ""}) {
    return <a href={url} target="_blank" rel="noopener noreferrer" className={className}>
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path
                d="M21 11.5a8.4 8.4 0 0 1-8.5 8.5 8.5 8.5 0 0 1-3.8-.9L3 21l1.9-5.7a8.4 8.4 0 0 1-.9-3.8A8.5 8.5 0 0 1 12.5 3 8.4 8.4 0 0 1 21 11.5z"/>
        </svg>
    </a>;
}

function ShareIcon({url, className = ""}) {
    return <a href={url} target="_blank" rel="noopener noreferrer" className={className}>
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <line x1="22" y1="2" x2="11" y2="13"/>
            <polygon points="22 2 15 22 11 13 2 9 22 2"/>
        </svg>
    </a>;
}

function BookmarkIcon({url, className = ""}) {
    return <a href={url} target="_blank" rel="noopener noreferrer" className={className}>
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"/>
        </svg>
    </a>;
}

function PlayIcon() {
    return <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
        <path d="M8 5v14l11-7z"/>
    </svg>;
}

function AlbumIcon() {
    return <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <rect x="8" y="8" width="12" height="12" rx="2"/>
        <path d="M4 16V6a2 2 0 0 1 2-2h10"/>
    </svg>;
}