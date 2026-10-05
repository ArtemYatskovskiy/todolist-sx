const ButtonComponent = (props) => {
  return (
    <button
      className={`${props.className}`}
      type={props.type}
      onClick={props.onClick}
    >
      {props.text}
    </button>
  );
};

export default ButtonComponent;
