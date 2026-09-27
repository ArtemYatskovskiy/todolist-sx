import React from "react";

const ListItemComponent = (props) => {
  return (
    <>
      <li key={`${props.id}`}>{props.name}</li>
      {props.children}
    </>
  );
};

export default ListItemComponent;
