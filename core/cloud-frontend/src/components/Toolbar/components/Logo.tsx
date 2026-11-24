import { Link } from "react-router-dom";
import { routes } from "@utils/routes";

export const Logo = () => (
  <Link to={routes.homePage()}>
    <img
      src={import.meta.env.BASE_URL + "brand-full.svg"}
      alt="Brand Logo"
      width={80}
      height={32}
      className="h-11 py-2 pr-5 items-start"
    />
  </Link>
);
