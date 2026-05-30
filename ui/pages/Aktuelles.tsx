import { GetStaticProps } from "next";
import { useEffect, useRef, useState } from "react";

import EventElement from "../components/common/event-preview-element";
import Header from "../components/common/header";
import InfoBox from "../components/common/infobox";
import NewsPreviewElement from "../components/common/news-preview-element";
import ResponsiveWrapper from "../components/common/responsive-wrapper";
import SliderButton from "../components/common/slider-button";

function Index() {
  const handleButtonClickNews = (id: string, mobile: boolean) => {
    if (mobile) {
      if (id === "right") {
        setMobileNewsVisible((v) => Math.min(v + 1, totalNewsCount - 1));
      } else if (id === "left") {
        setMobileNewsVisible((v) => Math.max(0, v - 1));
      } else if (!isNaN(Number(id))) {
        const page = Number(id);
        setMobileNewsVisible(page);
      }
    } else {
      if (id === "right") {
        setDesktopNewsVisible(([start, end]) => [start + 3, end + 3]);
      } else if (id === "left") {
        setDesktopNewsVisible(([start, end]) => [Math.max(0, start - 3), Math.max(3, end - 3)]);
      } else if (!isNaN(Number(id))) {
        const page = Number(id);
        setDesktopNewsVisible([page * 3, page * 3 + 3]);
      }
    }
  };

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

  //NEWS
  const [desktopNewsVisible, setDesktopNewsVisible] = useState<[number, number]>([0, 3]); //the indexes of the articles currently visible on the desktop (3)
  const [mobileNewsVisible, setMobileNewsVisible] = useState<number>(0); //the index of the article currently visible on mobile devices (1)
  const [displayedNewsDesktop, setDisplayedNewsDesktop] = useState<any[]>([]); //News currently displayed on desktop (the actual objects)
  const [displayedNewsMobile, setDisplayedNewsMobile] = useState<any[]>([]); //News currently displayed on mobile devices (the actual objects)
  const [totalNewsCount, setTotalNewsCount] = useState(0); //Total number of news articles reported by the server (for pagination)
  const cachedNewsRef = useRef<Record<string, any>>({}); //Cache so that the articles do not have to be fetched again when changing pages

  const loadNewsIfMissing = async (start: number, end: number) => {
    const missingIndices = [];

    for (let i = start; i < end; i++) {
      if (!cachedNewsRef.current[i]) {
        missingIndices.push(i);
      }
    }

    if (missingIndices.length > 0) {
      const res = await fetch(`/api/loader_news?start=${start}&end=${end}`);
      const data = await res.json();

      for (let i = 0; i < data.news.length; i++) {
        const index = start + i;
        cachedNewsRef.current[index] = data.news[i];
      }

      setTotalNewsCount(data.total);
    }

    const visible = [];
    for (let i = start; i < end; i++) {
      if (cachedNewsRef.current[i]) {
        visible.push(cachedNewsRef.current[i]);
      }
    }

    return visible;
  };

  useEffect(() => {
    loadNewsIfMissing(desktopNewsVisible[0], desktopNewsVisible[1]).then(setDisplayedNewsDesktop);
  }, [desktopNewsVisible]);

  useEffect(() => {
    loadNewsIfMissing(mobileNewsVisible, mobileNewsVisible + 1).then(setDisplayedNewsMobile);
  }, [mobileNewsVisible]);

  //EVENTS
  const [eventsVisible, setEventsVisible] = useState<[number, number]>([0, 3]); //the indexes of the articles currently visible on the desktop / mobile devices (3)
  const [displayedEvents, setDisplayedEvents] = useState<any[]>([]); //events currently displayed (the actual objects)
  const [totalEventsCount, setTotalEventsCount] = useState(0); //total number of events reported by the server (for pagination)
  const cachedEventsRef = useRef<Record<string, any>>({}); //Cache so that the events do not have to be fetched again when changing pages

  const loadEventsIfMissing = async (start: number, end: number) => {
    const missingIndices = [];

    for (let i = start; i < end; i++) {
      if (!cachedEventsRef.current[i]) {
        missingIndices.push(i);
      }
    }

    if (missingIndices.length > 0) {
      const res = await fetch(`/api/loader_events?start=${start}&end=${end}`);
      const data = await res.json();

      for (let i = 0; i < data.events.length; i++) {
        const index = start + i;
        cachedEventsRef.current[index] = data.events[i];
      }

      setTotalEventsCount(data.total);
    }

    const visible = [];
    for (let i = start; i < end; i++) {
      if (cachedEventsRef.current[i]) {
        visible.push(cachedEventsRef.current[i]);
      }
    }

    return visible;
  };

  useEffect(() => {
    loadEventsIfMissing(eventsVisible[0], eventsVisible[1]).then(setDisplayedEvents);
  }, [eventsVisible]);

  return (
    <>
      <Header
        title="Wichtige Ankündigungen"
        subtitle="Hier findest du alle aktuellen Informationen und Updates rund um die Fachschaft. Bleib auf dem Laufenden über bevorstehende Veranstaltungen, wichtige Ankündigungen, neue Projekte und alles, was das Studium an unserer Fakultät noch spannender macht."
      ></Header>

      <ResponsiveWrapper>
        <div>
          {/* Only display if there is at least one news item */}
          {displayedNewsDesktop.length > 0 && displayedNewsMobile.length > 0 ? (
            <>
              <h2>Aktuelles</h2>
              {/* Desktop */}
              <div className="hidden md:grid grid-cols-3 gap-6 mb-12 xl:mb-24">
                {displayedNewsDesktop.map((item, index) => (
                  <NewsPreviewElement
                    key={index}
                    title={item.title}
                    subtitle={item.excerpt}
                    image={item.image}
                    link={`/Aktuelles/article?item=${item.uuid}`}
                  />
                ))}

                <div className="col-span-full flex gap-1 w-full justify-center mx-auto">
                  <SliderNavigation
                    current={desktopNewsVisible[0] / 3}
                    total={Math.ceil(totalNewsCount / 3)}
                    onClick={(id) => handleButtonClickNews(id, false)}
                    mobile={false}
                  />
                </div>
              </div>

              {/* Mobile */}
              <div className="grid md:hidden grid-cols-1 gap-6 mb-12 xl:mb-24">
                {displayedNewsMobile.length > 0 ? (
                  <NewsPreviewElement
                    title={displayedNewsMobile[0].title}
                    subtitle={displayedNewsMobile[0].excerpt}
                    image={displayedNewsMobile[0].image}
                    link={`/Aktuelles/article?item=${displayedNewsMobile[0].uuid}`}
                  />
                ) : null}

                <div className="col-span-full flex gap-1 w-full justify-center mx-auto">
                  <SliderNavigation
                    current={mobileNewsVisible}
                    total={totalNewsCount}
                    onClick={(id) => handleButtonClickNews(id, true)}
                    mobile={true}
                  />
                </div>
              </div>
            </>
          ) : null}

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
            buttonlink="https://h-ka-de.zoom-x.de/j/64304270469"
            buttontext="Online teilnehmen"
            buttonNewTab={true}
          >
            Aktuell finden die Sitzungen sowohl online, als auch in Präsenz statt. Wenn du Interesse hast, Teil der
            aktiven Fachschaft zu werden, komm einfach zur Fachschaftssitzung. Immer mittwochs ab 11:30 Uhr im Raum E004
            oder auf Zoom.
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

    // Less than or equal to 6 pages → show all buttons
    if (total <= 6) {
      for (let i = 0; i < total; i++) {
        buttons.push(<SliderButton key={i} number={i} active={current === i} onClick={() => onClick(i, mobile)} />);
      }
      return buttons;
    }

    // More than 6 pages → "intelligent" display with dots on the left/right side
    if (current > 2) {
      buttons.push(
        <span key="start-dots" className="px-2">
          ...
        </span>
      );
    }

    // Determine the center: display a maximum of 5 buttons around current
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
