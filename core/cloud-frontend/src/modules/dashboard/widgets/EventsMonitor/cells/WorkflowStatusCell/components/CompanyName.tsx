import { Link } from "react-router-dom";

interface CompanyNameProps {
  name: string;
  companyId?: number;
}

export const CompanyName = ({ name, companyId }: CompanyNameProps) => {
  if (companyId) {
    return (
      <Link
        to={`/company/${companyId}`}
        className="line-clamp-1 hover:underline"
      >
        {name}
      </Link>
    );
  }

  return <span className="line-clamp-1">{name}</span>;
};
