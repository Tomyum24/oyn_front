import { useDispatch, useSelector } from "react-redux";
import { toggleTheme } from "../redux/themeSlice";

function ThemeToggle() {
  const dispatch = useDispatch();
  const theme = useSelector((state) => state.theme.theme);
  const isDark = theme === "dark";

  const handleToggle = () => {
    dispatch(toggleTheme());
  };

  return (
    <div className="theme">
      <span className="theme__toggle-wrap">
        <input
          id="theme"
          className="theme__toggle"
          type="checkbox"
          role="switch"
          name="theme"
          value="dark"
          checked={isDark}
          onChange={handleToggle}
        />
        <span className="theme__fill"></span>
        <span className="theme__icon">
          {[...Array(9)].map((_, i) => (
            <span key={i} className="theme__icon-part"></span>
          ))}
        </span>
      </span>
    </div>
  );

}

export default ThemeToggle;
