import type { StylesConfig } from 'react-select';
export const selectCustomStyles: StylesConfig<any, boolean> = {
  control: (provided, state) => ({
    ...provided,
    background: 'var(--tblr-bg-forms)',
    borderColor: state.isFocused
      ? 'var(--tblr-primary)'
      : 'var(--tblr-border-color)',
    boxShadow: undefined,
    cursor: 'pointer',
  }),
  container: (provided) => ({
    ...provided,
    width: '100%',
  }),
  valueContainer: (provided) => ({
    ...provided,
    whiteSpace: 'nowrap',
    flexWrap: 'nowrap',
    maxWidth: '90%',
    overflow: 'hidden',
  }),
  singleValue: (provided) => ({
    ...provided,
    color: 'var(--tblr-body-color)',
  }),
  input: (provided) => ({
    ...provided,
    color: 'var(--tblr-body-color)',
  }),
  placeholder: (provided) => ({
    ...provided,
    color: 'var(--tblr-muted)',
  }),
  menu: (base) => {
    const { width, ...css } = base;
    return {
      ...css,
      minWidth: width || '300px',
      background: 'var(--tblr-bg-surface)',
      border: '1px solid var(--tblr-border-color)',
    };
  },
  option: (provided, state) => ({
    ...provided,
    background: state.isSelected
      ? 'var(--tblr-primary)'
      : state.isFocused
      ? 'var(--tblr-active-bg)'
      : 'transparent',
    color: state.isSelected ? '#fff' : 'var(--tblr-body-color)',
    cursor: 'pointer',
  }),
};
