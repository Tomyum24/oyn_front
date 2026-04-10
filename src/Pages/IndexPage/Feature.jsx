import { FaLaptopCode, FaChalkboardTeacher, FaPlayCircle, FaChartLine } from "react-icons/fa";

const iconMap = {
  practical: <FaLaptopCode />,
  live: <FaChalkboardTeacher />,
  recorded: <FaPlayCircle />,
  career: <FaChartLine />,
};

function Feature({ photo, title, text }) {
  return (
    <div className="feature-card">
      <div className="feature-icon">{iconMap[photo]}</div>
      <h3 className="feature-title">{title}</h3>
      <p className="feature-text">{text}</p>
    </div>
  );
}

export default Feature;