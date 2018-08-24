import PropTypes from 'prop-types';
import Link from 'next/link';
import styled from 'styled-components';

const getColor = ({ theme, secondary }) => {
  if (secondary) {
    return theme.colors.default;
  } else {
    return theme.colors.link;
  }
};

const A = styled.a`
  color: ${getColor};
  text-decoration: none;
  &:hover {
    color: ${getColor};
    text-decoration: none;
  }
  &:active {
    color: ${getColor};
    text-decoration: none;
  }
  &:visited {
    color: ${getColor};
    text-decoration: none;
  }
  &:focus {
    color: ${getColor};
    text-decoration: none;
  }
`;

const LinkComponent = props => {
  const { children, href, external, primary, secondary } = props;
  return (
    <Link href={href} passHref>
      <A target={external ? '_blank' : '_self'} primary={primary} secondary={secondary} {...props}>
        {children}
      </A>
    </Link>
  );
};

LinkComponent.displayName = 'LinkComponent';

LinkComponent.propTypes = {
  href: PropTypes.string.isRequired,
  external: PropTypes.bool,
  primary: PropTypes.bool,
  secondary: PropTypes.bool,
};

LinkComponent.defaultProps = {
  external: false,
  primary: true,
  secondary: false,
};

export default LinkComponent;
