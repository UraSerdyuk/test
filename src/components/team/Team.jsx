import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import ExpansionPanel from '@material-ui/core/ExpansionPanel';
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails';
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary';
import ExpansionPanelActions from '@material-ui/core/ExpansionPanelActions';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import Divider from '@material-ui/core/Divider';
import ColorPicker from 'material-ui-color-picker';
import List from '@material-ui/core/List';

// import Paper from '@material-ui/core/Paper';
// import InputBase from '@material-ui/core/InputBase';
// import IconButton from '@material-ui/core/IconButton';
// import GroupAddSharpIcon from '@material-ui/icons/GroupAddSharp';
// import Badge from '@material-ui/core/Badge';
// import AddCircleOutlineSharpIcon from '@material-ui/icons/AddCircleOutlineSharp';

import NavPanel from '../navPanel';
// import SelectInput from '../selectInput';
import TeamItem from './TeamItem';

const useStyles = makeStyles((theme) => ({
  root: {
    width: '100%',
  },
  heading: {
    fontSize: theme.typography.pxToRem(15),
  },
  secondaryHeading: {
    fontSize: theme.typography.pxToRem(15),
    color: theme.palette.text.secondary,
  },
  icon: {
    verticalAlign: 'bottom',
    height: 20,
    width: 20,
  },
  details: {
    alignItems: 'center',
    justifyContent: 'space-around',
  },
  column: {
    flexBasis: '33.33%',
  },
  container: {
    height: '100vh',
    display: 'flex',
    flexDirection: 'column',
  },
  teamContainer: {
    display: 'flex',
    flexGrow: 1,
    flexDirection: 'column',
  },
  team: {
    flex: 1,
    backgroundColor: '#80808024',
  },
  naw: { flexGrow: 0 },
  reaateTeam: {
    padding: '2%',
  },
  teamTitle: {
    flexGrow: 1,
  },
  teamGroup: {
    width: '100%',
    border: '1px solid grey',
    padding: '2%',
  },
  rootAdd: {
    padding: '2px 4px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-around',
    width: 400,
  },
  inputAdd: {
    marginLeft: theme.spacing(1),
    flex: 1,
  },
  iconButtonAdd: {
    padding: 10,
  },
  dividerAdd: {
    height: 28,
    margin: 4,
  },
}));

const Team = (props) => {
  const classes = useStyles();
  const {
    teamSection,
    createTeam,
    teamName,
    setTeamName,
    description,
    setDescription,
    color,
    setColor,
    // addUserToTeam,
    // countOfUsers,
    // inputAddUserValue,
    // setInputAddUserValue,
    user,
    invitedToTeams,
    invitedStateToTeams,
  } = props;

  const { teams } = teamSection;
  return (
    <div className={classes.container}>
      <div className={classes.naw}>
        <NavPanel />
      </div>
      <div className={classes.teamContainer}>
        <div className={classes.team}>
          {user.role === 'Admin' && (
            <>
              <div className={classes.reaateTeam}>
                <div className={classes.root}>
                  <ExpansionPanel>
                    <ExpansionPanelSummary
                      expandIcon={<ExpandMoreIcon />}
                      aria-controls="panel1c-content"
                      id="panel1c-header"
                    >
                      <div className={classes.column}>
                        <Typography className={classes.secondaryHeading}>
                          Create New Team
                        </Typography>
                      </div>
                    </ExpansionPanelSummary>
                    <ExpansionPanelDetails className={classes.details}>
                      <TextField
                        id="create-team"
                        value={teamName}
                        label="Name of team"
                        variant="outlined"
                        name="create-team"
                        onChange={(e) => {
                          setTeamName(e.target.value);
                        }}
                      />
                      <TextField
                        id="description"
                        value={description}
                        label="Add description"
                        variant="outlined"
                        name="description"
                        onChange={(e) => {
                          setDescription(e.target.value);
                        }}
                      />
                    </ExpansionPanelDetails>
                    <ExpansionPanelDetails>
                      <ColorPicker
                        name="color"
                        defaultValue="#####"
                        value={color}
                        onChange={(color) => setColor(color)}
                      />
                    </ExpansionPanelDetails>
                    {/* <>
                    <Divider />
                    <ExpansionPanelDetails className={classes.details}>
                      <Paper component="form" className={classes.rootAdd}>
                        <InputBase
                          value={inputAddUserValue}
                          onChange={(e) => {
                            setInputAddUserValue(e.target.value);
                          }}
                          className={classes.inputAdd}
                          placeholder="add users to project"
                          inputProps={{ 'aria-label': 'search google maps' }}
                        />
                        <IconButton className={classes.iconButtonAdd}>
                          <Badge badgeContent={countOfUsers} color="error">
                            <GroupAddSharpIcon />
                          </Badge>
                        </IconButton>
                        <Divider className={classes.dividerAdd} orientation="vertical" />
                        <IconButton
                          onClick={addUserToTeam}
                          color="primary"
                          className={classes.iconButtonAdd}
                          aria-label="directions"
                        >
                          <AddCircleOutlineSharpIcon />
                        </IconButton>
                      </Paper>

                      <SelectInput {...props} />
                    </ExpansionPanelDetails>
                    </> */}
                    <Divider />
                    <ExpansionPanelActions>
                      <Button variant="contained" onClick={createTeam} color="primary">
                        Create New Team
                      </Button>
                    </ExpansionPanelActions>
                  </ExpansionPanel>
                </div>
              </div>
            </>
          )}
          <List>
            {invitedToTeams &&
              !!invitedToTeams.length &&
              !!invitedStateToTeams[0] &&
              invitedStateToTeams.map((team) => <TeamItem team={team} {...props} />)}

            {!teams.length && invitedToTeams && !invitedToTeams.length ? (
              <Typography variant="h2">You don't have a team yet</Typography>
            ) : (
              teams.map((team) => <TeamItem team={team} {...props} />)
            )}
          </List>
        </div>
      </div>
    </div>
  );
};

export default Team;
