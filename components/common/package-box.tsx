
interface PackageBoxProps {
    title: string;
    subtitle: string;
    color: "primary_blue_bg" | "petrol_pale_bg"
    services: string[];
    children: React.ReactNode;
}


const PackageBox: React.FC<PackageBoxProps> = ({ title, subtitle, color, services, children}) => {
    return (
        <div className={"flex flex-col"}>
            <div className={`${color} + " rounded-t-lg`}>
            <h4 className="p-6 text-white text-center">
                {title}
            </h4>
            </div>
            <div className={"white_bg p-6 rounded-b-lg  petrol_text"}>
                {children}
                <h5>{subtitle}</h5>
                <ul className={"pl-4"}>
                    {services.map(service => (
                        <li key={service} className="petrol_text">
                            {service}
                        </li>
                    ))}
                </ul>
            </div>

        </div>
    )
}

export default PackageBox;