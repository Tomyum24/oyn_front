import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function CompanyList() {
  const [companies, setCompanies] = useState([]);
  const [activeIndex, setActiveIndex] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchCompanies() {
      try {
        const response = await fetch("http://localhost:3001/users");
        if (response.ok) {
          const data = await response.json();
          const companyUsers = data.filter(user => user.role === "company");
          setCompanies(companyUsers);
        }
      } catch (error) {
        console.error("Error fetching companies:", error);
      }
    }

    fetchCompanies();
  }, []);

  const handleClick = (index) => {
    setActiveIndex(index);
  };

  const handleViewProfile = (id) => {
    navigate(`/profile/company/${id}`);
  };

  return (
    <section className="slider-container">
      <div className="slider-images">
        {companies.map((company, index) => (
          <div
            key={company.id}
            className={`slider-img ${index === activeIndex ? "active" : ""}`}
            onClick={() => handleClick(index)}
          >
            <img
              src={`./img/IndexPage/${company.logo || "default-logo.jpg"}`}
              alt={company.companyName || company.username}
            />
            <h1>{company.companyName || company.username}</h1>
            <div className="details">
              <h2>{company.companyName || company.username}</h2>
              <p>
                <strong>Website:</strong>{" "}
                {company.website ? (
                  <a href={company.website} target="_blank" rel="noreferrer">
                    {company.website}
                  </a>
                ) : (
                  "No website provided"
                )}
              </p>
              {index === activeIndex && (
                <button
                  className="animated-button show-button"
                  onClick={() => handleViewProfile(company.id)}
                >
                  <span>View Profile</span><span></span>
                </button>)}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

export default CompanyList;