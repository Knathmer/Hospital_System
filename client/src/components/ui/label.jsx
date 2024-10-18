import React from 'react';
import PropTypes from 'prop-types';

const Label = (props) => {
  return (
    <label htmlFor={props.htmlFor} className={props.className}>
      {props.children}
    </label>
  );
};
Label.propTypes = {
  htmlFor: PropTypes.string,
  className: PropTypes.string,
  children: PropTypes.node.isRequired,
};

export default Label;
