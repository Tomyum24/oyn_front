import { useParams } from "react-router-dom";
import PhotographerProfile from "../Pages/PhotographerPage/PhotographerProfile";
import CompanyProfile from "../Pages/CompanyPage/CompanyProfile";
import UserProfile from "../Pages/UserPage/UserProfile";

function ProfileSwitch() {
  const { role } = useParams();

  if (role === "company") return <CompanyProfile />;
  if (role === "professor") return <PhotographerProfile />;
  if (role === "user") return <UserProfile />;

  return <p>404 — Unknown role</p>;
}

export default ProfileSwitch;
