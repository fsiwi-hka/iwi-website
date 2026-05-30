import Link from "next/link";
import { useRouter } from "next/router";

type BreadcrumbProps = {
  siteName?: string;
};

const Breadcrumb = ({ siteName }: BreadcrumbProps) => {
  const router = useRouter();
  const pathArray = router.pathname.split("/").filter((path) => path);

  return (
    <div aria-label="breadcrumb" className="flex text-white mb-2 flex-wrap">
      <span>
        <Link href="/Startseite" className="text-blue-500 hover:underline">
          Startseite
        </Link>
      </span>
      {pathArray.map((segment, index) => {
        const path = "/" + pathArray.slice(0, index + 1).join("/");
        const name = segment;

        if (index != pathArray.length - 1) {
          return (
            <span key={path} className="flex items-center">
              <span className="mx-2">&gt;</span>
              <Link href={path} className="text-blue-500 hover:underline">
                {name}
              </Link>
            </span>
          );
        } else {
          /*Link der aktuellen Seite soll nicht klickbar sein*/
          return (
            <span key={path} className="flex items-center">
              <span className="mx-2">&gt;</span>
              {siteName ? siteName : name} {/* Es kann auch ein optionaler Seitenname mitgegeben werden (benötigt für header-news) */}
            </span>
          );
        }
      })}
    </div>
  );
};

export default Breadcrumb;
