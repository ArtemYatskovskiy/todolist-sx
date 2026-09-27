import React from "react";

const ListItemComponent = (props) => {
  return (
    <>
      <li className={`${props.className}`} key={`${props.id}`}>
        <p>{props.name}</p>
        {props.children}
      </li>
    </>
  );
};

export default ListItemComponent;
