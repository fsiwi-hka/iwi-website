import { useEffect, useState } from "react";
import { useRouter } from "next/router";

import ResponsiveWrapper from "../../components/common/responsive-wrapper";
import NewsPreviewElement from "../../components/common/news-preview-element";
import { GetStaticProps } from "next";

export default function NewsPage() {
  const router = useRouter();
  const { query, isReady, replace } = router;

  const [newsItems, setNewsItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isReady) return;

    if (!query.tag && !query.author) {
      replace("/404");
      return;
    }

    // URL abhängig von query
    let url = "/api/loader_news";
    if (query.tag) {
      url += `?tag=${encodeURIComponent(query.tag as string)}`;
    } else if (query.author) {
      url += `?author=${encodeURIComponent(query.author as string)}`;
    }

    fetch(url)
      .then((res) => res.json())
      .then((data) => {
        setNewsItems(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Fehler beim Abrufen:", err);
        setNewsItems([]);
        setLoading(false);
      });
  }, [isReady, query.tag, query.author, replace]);

  if (loading) {
    return <div>Beiträge werden geladen…</div>;
  }

  //Anzeigen für Suchergebnisse von Tags
  if (query.tag) {
    return (
      <ResponsiveWrapper>
        <div>
          <h2>Suchergebnisse für das Stichwort "{query.tag}"</h2>

          {newsItems.length === 0 ? (
            <p>Keine Beiträge mit diesem Tag gefunden.</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12 xl:mb-24">
              {newsItems.map((item, index) => (
                <NewsPreviewElement
                  key={index}
                  title={item.title}
                  subtitle={item.content.split(" ").slice(0, 10).join(" ") + "..."}
                  image={item.image}
                  link={`/Aktuelles/article?item=${item.uuid}`}
                />
              ))}
            </div>
          )}
        </div>
      </ResponsiveWrapper>
    );

    //Anzeigen für Suchergebnisse von Autoren
  } else if (query.author) {
    return (
      <ResponsiveWrapper>
        <div>
          <h2>Alle Beiträge von {query.author}</h2>

          {newsItems.length === 0 ? (
            <p>Dieser Autor hat noch keine Beiträge veröffentlicht</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12 xl:mb-24">
              {newsItems.map((item, index) => (
                <NewsPreviewElement
                  key={index}
                  title={item.title}
                  subtitle={item.content.split(" ").slice(0, 10).join(" ") + "..."}
                  image={item.image}
                  link={`/Aktuelles/article?item=${item.uuid}`}
                />
              ))}
            </div>
          )}
        </div>
      </ResponsiveWrapper>
    );
  }
}

export const getStaticProps: GetStaticProps = async (context) => {
  return {
    props: {
      data: {
        title: "Suche",
      },
    },
  };
};
