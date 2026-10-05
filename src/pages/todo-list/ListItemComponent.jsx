const ListItemComponent = (props) => {
  return (
    <>
      <li className={`${props.className}`} key={`${props.id}`}>
        <p className={props.completed ? "line-through text-gray-500" : ""}>
          {props.name}
        </p>
        {props.children}
      </li>
    </>
  );
};

export default ListItemComponent;
