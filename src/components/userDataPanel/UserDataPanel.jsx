import React from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';
import SimpleExpansionPanel from '../expansionPanel';

function TabPanel(props) {
  const { children, value, index } = props;

  return (
    <div
      role="tabpanel"
      style={{ width: '100%', overflow: 'scroll' }}
      hidden={value !== index}
      id={`vertical-tabpanel-${index}`}
      aria-labelledby={`vertical-tab-${index}`}
    >
      {value === index && (
        <Box p={3}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
}

TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.any.isRequired,
  value: PropTypes.any.isRequired,
};

function a11yProps(index) {
  return {
    id: `vertical-tab-${index}`,
    'aria-controls': `vertical-tabpanel-${index}`,
  };
}

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
    backgroundColor: theme.palette.background.paper,
    display: 'flex',
    height: '70vh',
  },
  verticalTabpanel: {
    width: '100%',
    backgroundColor: 'red',
  },
  tabs: {
    borderRight: `1px solid ${theme.palette.divider}`,
  },
}));

export default function VerticalTabs(props) {
  const classes = useStyles();
  const [value, setValue] = React.useState(0);
  const { userData = [] } = props;
  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  return (
    <div className={classes.root}>
      <Tabs
        orientation="vertical"
        variant="scrollable"
        value={value}
        onChange={handleChange}
        aria-label="Vertical tabs example"
        className={classes.tabs}
      >
        <Tab label="All Files" {...a11yProps(0)} />
        <Tab label="Images" {...a11yProps(1)} />
        <Tab label="Video" {...a11yProps(2)} />
        <Tab label="Audio" {...a11yProps(3)} />
        <Tab label="Text" {...a11yProps(4)} />
        <Tab label="Application" {...a11yProps(5)} />
      </Tabs>
      <TabPanel value={value} index={0}>
        {userData.length ? <SimpleExpansionPanel userData={userData} /> : 'No data'}
      </TabPanel>

      <TabPanel value={value} index={1}>
        {[].length ? <SimpleExpansionPanel userData={[]} /> : 'No Images data'}
      </TabPanel>
      <TabPanel value={value} index={2}>
        <div>{[].length ? <SimpleExpansionPanel userData={[]} /> : 'No Video  data'}</div>
      </TabPanel>
      <TabPanel value={value} index={3}>
        <div>{[].length ? <SimpleExpansionPanel userData={[]} /> : 'No Audio data'}</div>
      </TabPanel>
      <TabPanel value={value} index={4}>
        <div>{[].length ? <SimpleExpansionPanel userData={[]} /> : 'No Audio data'}</div>
      </TabPanel>
      <TabPanel value={value} index={5}>
        <div>{[].length ? <SimpleExpansionPanel userData={[]} /> : 'No Audio data'}</div>
      </TabPanel>
    </div>
  );
}
