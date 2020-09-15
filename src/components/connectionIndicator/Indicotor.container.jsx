import React from 'react';
import Indicator from './Indicator';

import { connect } from 'react-redux';

const IndicatorContainer = (props) => {
  return <Indicator {...props} />;
};

const mapStateToProps = ({ connection }) => {
  return {
    status: connection.status,
  };
};

export default connect(mapStateToProps)(IndicatorContainer);
