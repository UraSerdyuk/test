import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import List from '@material-ui/core/List';

import NavPanel from '../navPanel';
import Entry from '../entry';

const useStyles = makeStyles((theme) => ({
  root: {
    width: '100%',
  },
  createPost: {
    display: 'flex',
    padding: '2%',
  },
}));

export default function NestedGrid(props) {
  const { entries, createEntry, diary } = props;
  const classes = useStyles();
  return (
    <>
      <NavPanel />
      <div className={classes.createPost}>
        <Typography variant="h5" gutterBottom>
          Create new entry.
        </Typography>
        <Button variant="contained" color="primary" onClick={createEntry}>
          Create
        </Button>
        <p>{diary.length}</p>
      </div>
      <List component="ul" className={classes.root} aria-label="mailbox folders">
        {entries.map((el) => (
          <>
            <Entry isCriate={true} {...el} {...props} />
          </>
        ))}

        {diary.map((el) => (
          <>
            <Entry {...el} {...props} />
          </>
        ))}
      </List>
    </>
  );
}
