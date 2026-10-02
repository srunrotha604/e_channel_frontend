import type { ChangeEventHandler } from 'react';
import SearchIcon from '../Icons/SearchIcon';
interface SearchBoxProps {
  onChange?: ChangeEventHandler<HTMLInputElement>;
}
const SearchBox = (props: SearchBoxProps) => {
  const { onChange } = props;
  return (
    <div className="ms-auto text-secondary">
      <div className="input-icon">
        <span className="input-icon-addon">
          <SearchIcon />
        </span>
        <input
          type="text"
          className="form-control"
          placeholder="Search …"
          onChange={onChange}
        />
      </div>
    </div>
  );
};
export default SearchBox;
