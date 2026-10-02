const NextIcon = (props: { label: string }) => {
  const { label } = props;
  return (
    <div>
      {!label ? '' : label}
      <svg
        xmlns="http://www.w3.org/2000/svg"
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
        <polyline points="9 6 15 12 9 18" />
      </svg>
    </div>
  );
};
export default NextIcon;
