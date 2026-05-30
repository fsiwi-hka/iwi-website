import { faTwitch, faDiscord, faInstagram, faLinkedin } from "@fortawesome/free-brands-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import FooterLink from "./footer-link";
import Button from "./button";
import Obfuscate from "react-obfuscate";

function Footer() {
  return (
    <footer className="w-full p-6 md:py-6 primary_blue_bg flex flex-col justify-center">
      <div className="max-w-screen-xl w-full m-auto text-white flex align-center flex-col md:flex-row gap-10">
        <div className="flex flex-row justify-between md:justify-start md: gap-5 align-center text-center md:flex-col ">
          {socialIcon(faTwitch, "https://www.twitch.tv/iwi_hska")}
          {socialIcon(faInstagram, "https://www.instagram.com/iwi_fachschaft/?hl=de")}
          {socialIcon(faDiscord, "https://discord.com/invite/Ud5KQnz")}
          {socialIcon(faLinkedin, "https://www.linkedin.com/in/fachschaft-iwi-40768a254/")}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-5 gap-x-4 gap-y-16 w-full justify-between auto-cols-max">
          <div className="flex flex-col">
            <h5 className="mb-2 md:mb-5 text-white">Kontakt</h5>
            <p className="text-white">
              Fachschaft IWI
              <br />
              Gebäude E – Raum 013
              <br />
              Moltkestraße 30
              <br />
              76133 Karlsruhe
            </p>
            <p className="mb-0 text-white">
              <Obfuscate email="kontakt@hka.iwi.de"></Obfuscate>
              <br />
              <Obfuscate tel="+49 721 925-1449"></Obfuscate>
            </p>
          </div>

          <div className="flex flex-col gap-1">
            <h5 className="mb-2 md:mb-5 text-white">Studierende</h5>
            <FooterLink href="/Erstsemester" newtab="false" name="Erstsemester" />
            <FooterLink href="/Aktuelles" newtab="false" name="Aktuelles" />
            <FooterLink
              href="https://cloud.iwi-hka.de/apps/files/files/525?dir=/StudiBoard"
              newtab="true"
              name="StudiBoard"
            />
            <FooterLink href="/Programmiervorkurs/" newtab="false" name="Programmiervorkurs" />
            <FooterLink href="/Studium" newtab="false" name="Studium" />
          </div>

          <div className="flex flex-col gap-1">
            <h5 className="mb-2 md:mb-5 text-white">Fachschaft</h5>
            <FooterLink newtab="false" href="/Fachschaft/#mitmachen" name="Mitmachen" />
            <FooterLink newtab="false" href="/Fachbereiche" name="Fachbereiche" />
            <FooterLink newtab="false" href="/Fachschaft/#sitzungsprotokolle" name="Sitzungsprotokolle" />
          </div>

          <div className="flex flex-col gap-1">
            <h5 className="mb-2 md:mb-5 text-white">Unternehmen</h5>
            <FooterLink newtab="false" href="/Sponsoring-und-Kooperation" name="Sponsoring & Kooperation" />
          </div>

          <div className="flex flex-col gap-1">
            <h5 className="mb-2 md:mb-5 text-white">Sitzung</h5>
            <p className="mb-1 text-white">Mittwochs um 11:30 Uhr in E004</p>
            <Button
              type="small-white"
              text="Online teilnehmen"
              url="https://h-ka-de.zoom-x.de/j/64304270469"
              newtab={true}
            ></Button>
          </div>
        </div>
      </div>

      <div className="max-w-screen-xl w-full m-auto mt-10 md:gap-5 text-white text-center md:text-left flex md:justify-between items-center flex-col md:flex-row">
        <span className="my-auto mb-5 md:mb-auto">
          &copy; {new Date().getFullYear()} Fachschaft Informatik und Wirtschaftsinformatik
        </span>
        <a className="hidden md:block" href="/Startseite">
          <img src="/assets/iwi-logo-white.png" className="w-20" alt="IWI-Logo" />
        </a>
        <span className="my-auto text-right">
          <a 
            href="/assets/downloads/fachschaftsordnung-iwi.pdf" 
            target="_blank"
            className="hover:underline">
            Fachschaftsordnung
          </a>{" "}
          |{" "}
          <a href="/Impressum" className="hover:underline">
            Impressum
          </a>
        </span>
        <a className="block md:hidden " href="/Startseite">
          <img src="/assets/iwi-logo-white.png" className="w-20 mx-auto" alt="IWI-Logo" />
        </a>
      </div>
    </footer>
  );
}

function socialIcon(icon, href) {
  return (
    <div className="text-2xl md:text-2xl text-white cursor-pointer hover:scale-125 duration-300">
      <a href={href} target="_blank" rel="noopener noreferrer">
        <FontAwesomeIcon icon={icon} />
      </a>
    </div>
  );
}

export default Footer;
