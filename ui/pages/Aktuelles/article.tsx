import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Head from "next/head";
import ReactMarkdown from "react-markdown";

import ResponsiveWrapper from "../../components/common/responsive-wrapper";
import HeaderNews from "../../components/common/header-news";
import { GetStaticProps } from "next";

import { faShare, faLink } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

function convertDate(date) {
  return new Intl.DateTimeFormat("de-DE", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  }).format(new Date(date));
}

export default function NewsPage() {
  const router = useRouter();
  const { query, isReady, replace } = router;

  const [newsItems, setNewsItems] = useState([]);
  const [loading, setLoading] = useState(true);

  const [canShare, setCanShare] = useState(false);
  const [showToast, setShowToast] = useState(false);

  useEffect(() => {
    if (!isReady) return; // Warten bis router.query verfügbar ist

    fetch(`/api/loader_news?uuid=${query.item}`)
      .then((res) => res.json())
      .then((data) => {
        if (!data) {
          replace("/404");
        } else {
          setNewsItems([data.article]);
        }

        setLoading(false);
      })
      .catch((err) => {
        console.error("Fehler beim Abrufen:", err);
        replace("/404");
      });
  }, [isReady, query.item, replace]);

  useEffect(() => {
    if (typeof navigator !== "undefined" && navigator.share) {
      setCanShare(true);
    }
  }, []);

  const newsItem = newsItems[0];

  if (loading || !newsItem) {
    return <div>Beitrag wird geladen…</div>;
  }

  return (
    <>
      {!loading && newsItem && (
        <Head>
          <title>{newsItem.title} | Fachschaft IWI</title>
          <meta name="description" content={newsItem.title} />
        </Head>
      )}

      <HeaderNews
        title={newsItem.title}
        image={newsItem.image}
        date={newsItem.eventinfos.date}
        time={newsItem.eventinfos.time}
        location={newsItem.eventinfos.location}
        locationlink={newsItem.eventinfos.locationlink}
      />
      <ResponsiveWrapper>
        <div className="md:w-[60%] mx-auto">
          <ReactMarkdown>{newsItem.content}</ReactMarkdown>

          <div className="md:mt-12 mb-6 w-full flex flex-col md:flex-row justify-between justify-center">
            <div className="flex mt- md:mt-0 flex-wrap items-center">
              {newsItem.tags?.map((tag) => (
                <a
                  key={tag}
                  href={`/Aktuelles/search?tag=${encodeURIComponent(tag)}`}
                  style={{ marginRight: "0.5rem" }}
                  className="hover:underline primary_blue"
                >
                  #{tag}
                </a>
              ))}
            </div>
            {canShare && (
              <div className="flex mt-8 md:mt-0 gap-4 primary_blue items-center justify-center cursor-pointer">
                <div
                  onClick={async () => {
                    try {
                      await navigator.share({
                        title: newsItem.title + " || Fachschaft IWI",
                        url: window.location.href,
                      });
                    } catch (err) {
                      console.error("Teilen fehlgeschlagen:", err.message);
                    }
                  }}
                  style={{ cursor: "pointer" }}
                >
                  Beitrag teilen <FontAwesomeIcon icon={faShare} size={"1x"} />
                </div>
              </div>
            )}
            {!canShare &&(
              <div
                className="flex mt-8 md:mt-0 gap-4 primary_blue items-center justify-center cursor-pointer"
                onClick={async () => {
                  if (navigator.clipboard && navigator.clipboard.writeText) {
                    try {
                      await navigator.clipboard.writeText(window.location.href);
                      setShowToast(true);
                      setTimeout(() => setShowToast(false), 2000);
                    } catch (err) {
                      console.error("Fehler beim Kopieren:", err);
                    }
                  } else {
                    alert(
                      "Dein Browser unterstützt das automatische Kopieren leider nicht. Bitte kopiere den Link manuell."
                    );
                  }
                }}
              >
                <div>
                  Link kopieren <FontAwesomeIcon icon={faLink} size={"1x"} />
                </div>
              </div>
            )}
          </div>

          {showToast && (
            <div
              style={{
                position: "fixed",
                top: "20px",
                right: "20px",
                backgroundColor: "#00aa66",
                color: "#fff",
                padding: "10px 20px",
                borderRadius: "5px",
                opacity: 0.9,
                zIndex: 1000,
                pointerEvents: "none",
              }}
            >
              Link wurde in die Zwischenablage kopiert!
            </div>
          )}

          <div
            className="white_bg flex flex-col md:flex-row justify-between p-4 border-l-[16px] mb-12 primary_grey"
            style={{ borderLeftColor: "var(--primary_blue)" }}
          >
            <div>
              Verfasst von{" "}
              <a
                className="hover:underline primary_blue"
                href={`/Aktuelles/search?author=${encodeURIComponent(newsItem.author)}`}
              >
                {newsItem.author}
              </a>
            </div>

            <div>Veröffentlicht am {convertDate(newsItem.publishDate)}</div>
          </div>
        </div>
      </ResponsiveWrapper>
    </>
  );
}

export const getStaticProps: GetStaticProps = async (context) => {
  return {
    props: {
      data: {
        title: "Aktuelles",
      },
    },
  };
};

export function Fa6BrandsSignalMessenger(props) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={16 * props.size}
      height={16 * props.size}
      viewBox="0 0 640 512"
      {...props}
    >
      {/* Icon from Font Awesome Brands by Dave Gandy - https://creativecommons.org/licenses/by/4.0/ */}
      <path
        fill="currentColor"
        d="M256 0c13.3 0 26.3 1 39.1 3l-3.7 23.7C279.9 24.9 268 24 256 24s-23.9.9-35.4 2.7L216.9 3c12.8-2 25.8-3 39.1-3m60.8 7.3l-5.7 23.3c23.4 5.7 45.4 14.9 65.4 27.1L389 37.2c-22.1-13.4-46.4-23.6-72.2-29.9m90.5 42.2l-14.2 19.3c19.1 14 36 30.9 50.1 50.1l19.4-14.2C447 83.6 428.4 65 407.3 49.5m67.5 73.6l-20.5 12.5c12.2 20 21.4 42 27.1 65.4l23.3-5.7c-6.3-25.8-16.5-50.1-29.9-72.2m34.2 93.8l-23.7 3.7c1.8 11.5 2.7 23.4 2.7 35.4s-.9 23.9-2.7 35.4l23.7 3.7c1.9-12.7 3-25.8 3-39.1s-1-26.3-3-39.1m-54.7 159.6c12.2-20 21.4-42 27.1-65.4l23.3 5.7c-6.3 25.8-16.5 50.1-29.9 72.2zm-11.1 16.6l19.4 14.2c-15.5 21.1-34.1 39.8-55.2 55.2l-14.2-19.4c19.1-14 36-30.9 50.1-50.1zm-66.7 61.2l12.5 20.5c-22.1 13.4-46.4 23.6-72.2 29.9l-5.7-23.3c23.4-5.7 45.4-14.9 65.4-27.1m-85.1 31l3.7 23.7c-12.7 1.9-25.8 3-39.1 3s-26.3-1-39.1-3l3.7-23.7c11.5 1.8 23.4 2.7 35.4 2.7s23.9-.9 35.4-2.7m-90.5-3.9l-5.7 23.3c-19.4-4.7-37.9-11.6-55.3-20.5l-24.3 5.7l-5.5-23.4l32.8-7.7l7.8 4c15.7 8 32.5 14.3 50.1 18.6zM90 471.3l5.5 23.4l-41.6 9.7C26 510.8 1.2 486 7.6 458.2l9.7-41.6l23.4 5.4l-9.7 41.7c-2.4 10.4 6.9 19.7 17.3 17.3zm-44.5-69.5l-23.4-5.5l5.7-24.3c-8.9-17.3-15.8-35.9-20.5-55.3l23.3-5.7c4.3 17.6 10.6 34.4 18.6 50.1l4 7.8l-7.7 32.8zM26.7 291.4L3 295.1c-2-12.8-3-25.8-3-39.1s1-26.3 3-39.1l23.7 3.7C24.9 232.1 24 244 24 256s.9 23.9 2.7 35.4m3.9-90.5l-23.3-5.7c6.3-25.8 16.5-50.1 29.9-72.2l20.5 12.5c-12.2 20-21.4 42-27.1 65.4m38.3-82.1l-19.4-14.1C65 83.6 83.6 65 104.7 49.5l14.2 19.4c-19.1 14-36 30.9-50.1 50.1zm66.7-61.2l-12.5-20.4c22.1-13.4 46.4-23.6 72.2-29.9l5.7 23.3c-23.4 5.7-45.4 14.9-65.4 27.1zM464 256c0 114.9-93.1 208-208 208c-36.4 0-70.7-9.4-100.5-25.8c-2.9-1.6-6.2-2.1-9.4-1.4l-92.5 21.6l21.6-92.5c.7-3.2.2-6.5-1.4-9.4C57.4 326.7 48 292.4 48 256c0-114.9 93.1-208 208-208s208 93.1 208 208"
      ></path>
    </svg>
  );
}
