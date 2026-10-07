import { MdDarkMode, MdOutlineDarkMode } from 'react-icons/md';
import { useTheme } from '../../../../context/ThemeContext';

const ChangeTheme = () => {
  const { theme, toggleTheme } = useTheme();
  return (
    <div className="d-flex justify-content-center align-items-center">
      <div onClick={toggleTheme} className="px-2" style={{ cursor: 'pointer' }}>
        {theme === 'light' ? (
          <MdOutlineDarkMode size={24} />
        ) : (
          <MdDarkMode size={24} />
        )}
      </div>
    </div>
  );
};
export default ChangeTheme;
