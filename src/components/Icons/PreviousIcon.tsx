const PreviousIcon = (props: { label: string }) => {
  const { label } = props;
  return (
    <div>
      <svg
        className="icon"
        width={24}
        height={24}
        viewBox="0 0 24 24"
        strokeWidth={2}
        stroke="currentColor"
        fill="none"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path stroke="none" d="M0 0h24v24H0z" fill="none" />
        <polyline points="15 6 9 12 15 18" />
      </svg>
      {!label ? '' : label}
    </div>
  );
};
export default PreviousIcon;
