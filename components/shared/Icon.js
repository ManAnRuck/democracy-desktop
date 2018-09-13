import styled from 'styled-components';
import PropTypes from 'prop-types';

const Icon = styled.i.attrs({})`
  &:before {
    font-size: ${({ fontSize }) => `${fontSize}px`};
    position: relative;
    top: 4px;
  }
`;

const IconComponent = ({ type, fontSize, className, style }) => {
  return <Icon className={`icon-${type} ${className}`} fontSize={fontSize} style={style} />;
};

IconComponent.propTypes = {
  type: PropTypes.string.isRequired,
  fontSize: PropTypes.number,
  className: PropTypes.string,
  style: PropTypes.shape,
};

IconComponent.defaultProps = {
  fontSize: 22,
  className: '',
  style: {},
};

export default IconComponent;
