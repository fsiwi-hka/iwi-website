import { useEffect, useState } from "react";

function InstagramFeed() {
  const [postings, setPostings] = useState([]);
  const count = 4;

  useEffect(() => {
    async function loadPostings() {
      try {
        const res = await fetch(`/api/loader_instagram?count=${count}`);
        const data = await res.json();
        setPostings(data.postings);
      } catch (error) {
        console.error("Error loadings Instagram postings:", error);
      }
    }
    loadPostings();
  }, [count]);

  return (
    <div className="md:px-6 white_bg p-6 pb-10">
      <div className="md:px-0 gap-y-4 max-w-screen-xl mx-auto my-6 relative">
        <h2 className="petrol_pale_text mt-0">
          Die Fachschaft IWI <br></br>auf Instagram
        </h2>
        <p className="primary_grey sm:mb-12">Bleib up to date mit Events, News und vielem mehr!</p>

        {postings && postings.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-6 gap-y-6">
            {postings.map((posting, index) => (
              <InstagramPost key={index} imageURL={posting} />
            ))}
          </div>
        ) : (
          <div className="rounded-xl p-5 bg-white text-center">Instagram Feed konnte nicht geladen werden.</div>
        )}

        <img className="absolute top-0 right-0 invisible sm:visible w-24" src="/images/Shape-2.svg"></img>
      </div>
    </div>
  );
}

export default InstagramFeed;

function InstagramPost({ imageURL }) {
  return (
    <div className="overflow-hidden rounded-xl ">
      <a href="https://www.instagram.com/iwi_fachschaft/?hl=de">
        <img className="aspect-square hover:scale-105 duration-300" src={imageURL}></img>
      </a>
    </div>
  );
}
