interface ImageProps {
  url?: string;
  name?: string;
  width?: number | string;
  height?: number | string;
}
function Image(props: ImageProps) {
  return (
    <img
      src={props.url}
      alt={props.name}
      width={props.width}
      height={props.height}
      style={{ display: 'block' }}
    />
  );
}
export default Image;
