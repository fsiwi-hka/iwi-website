import Button from "./button";

function NewsPreviewElement({ title, subtitle, image, link }) {
  return (
    <div className="relative w-full">
      {/* Mobile*/}
      <a href={link} className="block md:hidden relative rounded-xl overflow-hidden aspect-[3/2]">
        <img src={image} alt={title} className="w-full h-full object-cover grayscale brightness-50" />
        <div className="absolute inset-0 primary_blue_bg opacity-25 z-10"></div>
        <div className="absolute inset-0 flex flex-col justify-end p-4 text-white z-20">
          <h4 className="text-lg font-semibold white_text">{title}</h4>
          <p className="text-sm line-clamp-2 white_text">{subtitle}</p>
        </div>
      </a>

      {/* Desktop*/}
      <a href={link}>
        <div className="hidden md:flex primary_blue_bg text-white rounded-xl flex-col justify-between group/image h-full">
          <div>
            <div className="relative">
              <div className="overflow-hidden rounded-t-xl aspect-[3/2]">
                <img
                  src={image}
                  className="rounded-t-xl h-full group-hover/image:scale-105 object-cover transition duration-300 grayscale"
                />
                <div className="primary_blue_bg opacity-25 rounded-t-xl absolute left-0 top-0 w-full h-full z-30"></div>
              </div>
            </div>

            <div className="p-4">
              <h4 className="text-white mb-4">{title}</h4>
              <p className="text-white m-0">{subtitle}</p>
            </div>
          </div>

          <div className="pb-4 px-4">
            <Button type={"small-white"} text={"Erfahre mehr"} url={link} />
          </div>
        </div>
      </a>
    </div>
  );
}

export default NewsPreviewElement;
