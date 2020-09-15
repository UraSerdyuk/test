import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import ExpansionPanel from '@material-ui/core/ExpansionPanel';
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary';
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails';
import Typography from '@material-ui/core/Typography';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import Button from '@material-ui/core/Button';
import Divider from '@material-ui/core/Divider';
import ExpansionPanelActions from '@material-ui/core/ExpansionPanelActions';
import FolderOpenOutlinedIcon from '@material-ui/icons/FolderOpenOutlined';

const useStyles = makeStyles((theme) => ({
  root: {
    width: '100%',
  },
  heading: {
    fontSize: theme.typography.pxToRem(15),
    fontWeight: theme.typography.fontWeightRegular,
  },
}));

export default function SimpleExpansionPanel({ userData = [] }) {
  const classes = useStyles();

  return (
    <div className={classes.root}>
      {userData.map((element) => (
        <>
          <ExpansionPanel>
            <ExpansionPanelSummary
              expandIcon={<ExpandMoreIcon />}
              aria-controls="panel1a-content"
              id="panel1a-header"
            >
              <Typography className={classes.heading}>
                <FolderOpenOutlinedIcon /> name: {element.name}
              </Typography>
            </ExpansionPanelSummary>

            <ExpansionPanelDetails>
              <Typography>size:{element.size} ||</Typography>
              <Typography>type:{element.type} ||</Typography>
              <Typography>lastModifiedDate:{element.lastModifiedDate} ||</Typography>
            </ExpansionPanelDetails>
            <Divider />
            <ExpansionPanelActions>
              <Button
                size="small"
                color="primary"
                onClick={() => {
                  alert('Will be in thefuture');
                }}
              >
                Delete
              </Button>
            </ExpansionPanelActions>
          </ExpansionPanel>
        </>
      ))}
    </div>
  );
}
