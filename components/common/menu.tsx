import Link from "next/link";
import { useRouter } from "next/router";
import { faBars, faTimes } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Button from "./button";

const mainMenuItems = [
  { title: "Startseite", slug: "/Startseite/" },
  { title: "Erstsemester", slug: "/Erstsemester" },
  { title: "Fachschaft", slug: "/Fachschaft/" },
  { title: "Aktuelles", slug: "/Aktuelles/" },
  { title: "Studium", slug: "/Studium/" },
  { title: "Kontakt", slug: "/Kontakt/" },
];

function Menu() {
  return (
    <>
      <nav className="w-full max-w-screen-xl mx-auto px-6 flex items-center justify-between flex-wrap">
        <Link href="/Startseite">
          <img src="/assets/iwi-logo.svg" alt="IWI-Logo" className="h-16 md:h-18 lg:h-24" />
        </Link>
        <div className="flex gap-1 md:gap-8 mx-auto">
          {mainMenuItems.map((item) => {
            return menuItem(item.title, item.slug);
          })}
        </div>
        <div className="hidden md:flex flex-row lg:flex-col my-6 xl:flex-row gap-2 justify-center">
          <Button
            type={"small-petrol-pale"}
            text={"StudiBoard"}
            url={"https://cloud.iwi-hka.de/apps/files/files/525?dir=/StudiBoard"}
            newtab={true}
          ></Button>
          <Button type={"small-blue1"} text={"für Unternehmen"} url={"/Sponsoring-und-Kooperation"}></Button>
        </div>

        <a className="text-2xl mx-2 block md:hidden primary_blue cursor-pointer modal-open">
          <FontAwesomeIcon icon={faBars} />
        </a>
      </nav>
      {mobileMenu()}
    </>
  );
}

function menuItem(title, href) {
  const classes = determineClasses(title, href, false);
  return (
    <span key={href} className={classes}>
      <Link href={href} className="petrol_text no-underline font-heading font-medium">
        {title}
      </Link>
    </span>
  );
}

function mobileMenu() {
  return (
    <div className="modal opacity-0 pointer-events-none fixed w-screen h-screen top-0 left-0 flex items-center justify-center">
      <div className="modal-container fixed w-screen h-screen z-0 overflow-y-auto ">
        <div className="modal-close absolute top-0 right-0 cursor-pointer flex flex-col items-center mt-4 mr-6 text-red-700 text-sm">
          <a className="text-2xl mx-auto mr-6 block md:hidden text-white cursor-pointer">
            <FontAwesomeIcon icon={faTimes} />
          </a>
        </div>
        <div className="modal-content container mx-0 w-full h-full text-center pt-8 primary_blue_bg text-white">
          <ul className="list-none m-0 p-0">
            {mainMenuItems.map((item) => {
              return mobileMenuItem(item.title, item.slug);
            })}
          </ul>
          <div className="flex flex-col gap-2 items-center">
            <Button
              type={"small-petrol-pale"}
              text={"StudiBoard"}
              url={"https://cloud.iwi-hka.de/apps/files/files/525?dir=/StudiBoard"}
            ></Button>
            <Button type={"small-blue1"} text={"für Unternehmen"} url={"/Sponsoring-und-Kooperation"}></Button>
          </div>
        </div>
      </div>
    </div>
  );
}

function mobileMenuItem(title, href) {
  const classes = determineClasses(title, href, true);
  return (
    <li key={href} className="py-4 px-6 modal-close">
      <Link href={href} className={classes}>
        {title}
      </Link>
    </li>
  );
}

function determineClasses(title, href, mobile) {
  // Using the router allows us to check which page
  // we're on, so we can style the active link
  const router = useRouter();
  if (
    // we need to append the trailing slash because the router
    // pathname doesn't contain it (it's added in the NextJS config)
    router.pathname + "/" === href ||
    (router.pathname.startsWith(href) && href != "/") ||
    (router.pathname.startsWith("/news") && href === "/")
  ) {
    if (mobile) {
      return "text-xl text-white underline font-heading font-medium";
    } else return "menu_element md:mr-0 md:my-0 active";
  }
  if (mobile) {
    return "text-xl text-white no-underline font-heading font-medium";
  } else return "menu_element hidden md:block md:mr-0 md:my-0";
}

export default Menu;
