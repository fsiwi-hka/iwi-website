import { GetStaticProps } from "next";
import { useEffect, useRef, useState } from "react";

import EventElement from "../components/common/event-preview-element";
import Header from "../components/common/header";
import InfoBox from "../components/common/infobox";
import NewsPreviewElement from "../components/common/news-preview-element";
import ResponsiveWrapper from "../components/common/responsive-wrapper";
import SliderButton from "../components/common/slider-button";
import { strings } from "@lib/strings";
import BulletinService, {BulletinDto} from "./api/bulletin-service";

const BOARD = "STUDENT_COUNCILS";
const NEWS_PAGE_SIZE = 5;

function Index() {
  const [newsVisible, setNewsVisible] = useState<[number, number]>([0, NEWS_PAGE_SIZE]);
  const [displayedNews, setDisplayedNews] = useState<BulletinDto[]>([]);
  const [totalNewsCount, setTotalNewsCount] = useState(0);
  const cachedNewsRef = useRef<Record<number, BulletinDto>>({});

  const loadNewsIfMissing = async (start: number, end: number) => {
    const missingIndices = [];
    for (let i = start; i < end; i++) {
      if (!cachedNewsRef.current[i]) missingIndices.push(i);
    }

    if (missingIndices.length > 0) {
      let {items, count} = await BulletinService.getBulletinPosts(BOARD, NEWS_PAGE_SIZE, Math.floor(start / NEWS_PAGE_SIZE));

      if (Array.isArray(items)) {
        for (let i = 0; i < items.length; i++) {
          cachedNewsRef.current[start + i] = items[i];
        }
        setTotalNewsCount(Number(count ?? items.length));
      }
    }

    const visible = [];
    for (let i = start; i < end; i++) {
      if (cachedNewsRef.current[i]) visible.push(cachedNewsRef.current[i]);
    }
    return visible;
  };

  useEffect(() => {
    loadNewsIfMissing(newsVisible[0], newsVisible[1]).then(setDisplayedNews);
  }, [newsVisible]);

  const handleButtonClickNews = (id: string) => {
    if (id === "right") {
      setNewsVisible(([start, end]) => [start + NEWS_PAGE_SIZE, end + NEWS_PAGE_SIZE]);
    } else if (id === "left") {
      setNewsVisible(([start, end]) => [
        Math.max(0, start - NEWS_PAGE_SIZE),
        Math.max(NEWS_PAGE_SIZE, end - NEWS_PAGE_SIZE),
      ]);
    } else if (!isNaN(Number(id))) {
      const page = Number(id);
      setNewsVisible([page * NEWS_PAGE_SIZE, page * NEWS_PAGE_SIZE + NEWS_PAGE_SIZE]);
    }
  };

  const [eventsVisible, setEventsVisible] = useState<[number, number]>([0, 3]);
  const [displayedEvents, setDisplayedEvents] = useState<any[]>([]);
  const [totalEventsCount, setTotalEventsCount] = useState(0);

  const handleButtonClickEvents = (id: string) => {
    if (id === "right") {
      setEventsVisible(([start, end]) => [start + 3, end + 3]);
    } else if (id === "left") {
      setEventsVisible(([start, end]) => [Math.max(0, start - 3), Math.max(3, end - 3)]);
    } else if (!isNaN(Number(id))) {
      const page = Number(id);
      setEventsVisible([page * 3, page * 3 + 3]);
    }
  };

  // TODO: Events Endpunkt

  return (
      <>
        <Header
            title="Wichtige Ankündigungen"
            subtitle="Hier findest du alle aktuellen Informationen und Updates rund um die Fachschaft. Bleib auf dem Laufenden über bevorstehende Veranstaltungen, wichtige Ankündigungen, neue Projekte und alles, was das Studium an unserer Fakultät noch spannender macht."
        ></Header>

        <ResponsiveWrapper>
          <div>
            {displayedNews.length > 0 && (
                <>
                  <h2>Aktuelles</h2>

                  {/* feste Mindesthöhe -> Seite springt beim Blättern nicht */}
                  <div className="min-h-[40rem] flex flex-col gap-4 mb-4">
                    {displayedNews.map((item, index) => (
                        <NewsPreviewElement key={index} title={item.title} content={item.content} />
                    ))}
                  </div>

                  <div className="flex gap-1 w-full justify-center mx-auto mb-12 xl:mb-24">
                    <SliderNavigation
                        current={newsVisible[0] / NEWS_PAGE_SIZE}
                        total={Math.ceil(totalNewsCount / NEWS_PAGE_SIZE)}
                        onClick={(id) => handleButtonClickNews(id)}
                        mobile={false}
                    />
                  </div>
                </>
            )}

            {displayedEvents.length > 0 && (
                <>
                  <h2>Zukünftige Veranstaltungen</h2>
                  <span style={{ color: "red" }}>
                Es gibt Stand jetzt keine aktuelleren Events, daher alle ab 01.05.2025
              </span>
                  <br></br>
                  <br></br>
                  <div className="flex flex-col gap-0 mb-20">
                    <div className="flex flex-col gap-6 mb-4 xl:mb-8">
                      {displayedEvents.map(({ date, time, title, location, locationLink, buttonLink }) => (
                          <EventElement
                              key={`${title}-${date}`}
                              date={date}
                              time={time}
                              title={title}
                              location={location}
                              locationLink={locationLink}
                              buttonLink={buttonLink}
                          ></EventElement>
                      ))}
                    </div>
                    <SliderNavigation
                        current={eventsVisible[0] / 3}
                        total={Math.ceil(totalEventsCount / 3)}
                        onClick={(id) => handleButtonClickEvents(id)}
                        mobile={false}
                    />
                  </div>
                </>
            )}

            <InfoBox
                icon={"exclamation"}
                buttonlink={strings.participate.online.url}
                buttontext={strings.participate.online.title}
                buttonNewTab={true}
            >
              Aktuell finden die Sitzungen sowohl in Präsenz als auch remote statt. Wenn du Interesse hast, Teil der
              aktiven Fachschaft zu werden, komm einfach zur Fachschaftssitzung. Immer mittwochs ab 11:30 Uhr im Raum E004
              oder auf Discord.
            </InfoBox>
          </div>
        </ResponsiveWrapper>
      </>
  );
}

export default Index;

export const getStaticProps: GetStaticProps = async (context) => {
  return {
    props: {
      data: {
        title: "Aktuelles",
      },
    },
  };
};

function SliderNavigation({ current, total, onClick, mobile }) {
  const renderButtons = () => {
    const buttons = [];

    if (total <= 6) {
      for (let i = 0; i < total; i++) {
        buttons.push(<SliderButton key={i} number={i} active={current === i} onClick={() => onClick(i, mobile)} />);
      }
      return buttons;
    }

    if (current > 2) {
      buttons.push(
          <span key="start-dots" className="px-2">
          ...
        </span>
      );
    }

    const start = Math.max(0, Math.min(current - 2, total - 5));
    const end = Math.min(total, start + 5);

    for (let i = start; i < end; i++) {
      buttons.push(<SliderButton key={i} number={i} active={current === i} onClick={() => onClick(i, mobile)} />);
    }

    if (end < total - 1) {
      buttons.push(
          <span key="end-dots" className="px-2">
          ...
        </span>
      );
    }

    return buttons;
  };

  return (
      <div className="col-span-full flex gap-1 w-full justify-center mx-auto mb-8 items-center">
        <SliderButton
            arrow="left"
            disabled={current <= 0}
            onClick={() => {
              if (current > 0) onClick("left", mobile);
            }}
        />
        {renderButtons()}
        <SliderButton
            arrow="right"
            disabled={current >= total - 1}
            onClick={() => {
              if (current < total - 1) onClick("right", mobile);
            }}
        />
      </div>
  );
}