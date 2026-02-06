interface InfoTileProps {
  title: string;
  text: string;
}

export default function InfoTile({ title, text }: InfoTileProps) {
  return (
    <div className="white_bg rounded-lg p-4 w-full">
      <p className="font-semibold petrol_pale_text mb-1">{title}</p>
      <p className="text-primary_grey">{text}</p>
    </div>
  );
}
