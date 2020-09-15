import React, { useState, useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import Avatar from '@material-ui/core/Avatar';
import ImageIcon from '@material-ui/icons/Image';
import DeleteIcon from '@material-ui/icons/Delete';
import AddBoxIcon from '@material-ui/icons/AddBox';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import List from '@material-ui/core/List';
import IconButton from '@material-ui/core/IconButton';
import Divider from '@material-ui/core/Divider';
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails';
import Paper from '@material-ui/core/Paper';
import InputBase from '@material-ui/core/InputBase';
import AddCircleOutlineSharpIcon from '@material-ui/icons/AddCircleOutlineSharp';
import Switch from '@material-ui/core/Switch';
import BorderColorIcon from '@material-ui/icons/BorderColor';
import ColorizeIcon from '@material-ui/icons/Colorize';
import ColorPicker from 'material-ui-color-picker';

import SelectInput from '../selectInput';
import Role from './Role';

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
  teamName: {
    display: 'flex',
  },
  teamDescription: {
    display: 'flex',
  },
  input: {
    width: 400,
  },
  teamColor: {
    display: 'flex',
    justifyContent: 'flex-end',
    height: 30,
  },
}));

const TeamItem = (props) => {
  const {
    deleteTeam,
    team,
    addMemberInToTeam,
    deleteMemberFromTeam,
    setActiveInactive,
    user,
    setTeamValue,
  } = props;

  const classes = useStyles();
  const [isInveteMember, setIsInviteMember] = useState(false);
  const [memberRoleInTheTeam, setMemberRoleInTheTeam] = useState('');
  const [inputAddUserValue, setInputAddUserValue] = React.useState('');
  const [inputName, setInputName] = useState(team.teamName);
  const [inputColor, setInputColer] = useState(team.color);
  const [inputDescription, setInputDescription] = useState(team.description);
  const isUserAdmin = user.role === 'Admin';
  const isUserOperator = user.role === 'Operator' || memberRoleInTheTeam === 'Operator';
  const isUserMember = user.role === 'Member';

  useEffect(() => {
    const memberInTheTeam = team.users.find((el) => el.userEmail === user.email);
    setMemberRoleInTheTeam(memberInTheTeam?.role);
  }, []);

  return (
    <ListItem>
      <div className={classes.teamGroup}>
        {isUserAdmin && (
          <>
            <Button
              disabled={false}
              variant="contained"
              color="secondary"
              startIcon={<DeleteIcon />}
              onClick={() => {
                deleteTeam(team.teamId, team);
              }}
            >
              Delete team
            </Button>
            <Button
              disabled={false}
              variant="contained"
              color="primary"
              startIcon={<AddBoxIcon />}
              onClick={() => {
                setIsInviteMember(!isInveteMember);
              }}
            >
              Invite member
            </Button>
          </>
        )}
        {isUserOperator && (
          <>
            <Button
              disabled={false}
              variant="contained"
              color="primary"
              startIcon={<AddBoxIcon />}
              onClick={() => {
                setIsInviteMember(!isInveteMember);
              }}
            >
              Invite member
            </Button>
          </>
        )}
        <div className={classes.teamColor}>
          <div style={{ backgroundColor: team.color, width: '80%' }}></div>
          {isUserAdmin && (
            <>
              <div
                style={{
                  width: '20%',
                  background:
                    'linear-gradient(90deg, rgba(36,35,0,1) 0%, rgba(48,122,140,0.7021183473389356) 25%, rgba(247,255,0,0.9206057422969187) 100%)',
                }}
              >
                {' '}
                <ColorPicker
                  name="color"
                  defaultValue="press for change color"
                  value={inputColor}
                  onChange={(color) => setInputColer(color)}
                ></ColorPicker>
              </div>
              <IconButton
                onClick={() => {
                  setTeamValue('Color', inputColor, team);
                }}
                color="primary"
                className={classes.iconButtonAdd}
                aria-label="directions"
              >
                <ColorizeIcon />
              </IconButton>
            </>
          )}
        </div>
        <div className={classes.teamName}>
          <Typography variant="h6" className={classes.teamTitle}>
            Name :{' '}
            <InputBase
              // id="li"
              className={classes.input}
              value={inputName}
              onChange={(e) => {
                isUserAdmin && setInputName(e.target.value);
              }}
            />
          </Typography>
          {isUserAdmin && (
            <IconButton
              onClick={() => {
                setTeamValue('Name', inputName, team);
              }}
              color="primary"
              className={classes.iconButtonAdd}
              aria-label="directions"
            >
              <BorderColorIcon />
            </IconButton>
          )}
        </div>
        <div className={classes.teamDescription}>
          <Typography variant="h6" className={classes.teamTitle}>
            description:{' '}
            <InputBase
              // id="li"
              className={classes.input}
              value={inputDescription}
              onChange={(e) => {
                isUserAdmin && setInputDescription(e.target.value);
              }}
            />
          </Typography>
          {isUserAdmin && (
            <IconButton
              onClick={() => {
                setTeamValue('Description', inputDescription, team);
              }}
              color="primary"
              className={classes.iconButtonAdd}
              aria-label="directions"
            >
              <BorderColorIcon />
            </IconButton>
          )}
        </div>

        <Divider variant="inset" component="li" />
        {isInveteMember && (
          <ExpansionPanelDetails className={classes.details}>
            <Paper component="div" className={classes.rootAdd}>
              <InputBase
                value={inputAddUserValue}
                onChange={(e) => {
                  setInputAddUserValue(e.target.value);
                }}
                className={classes.inputAdd}
                placeholder="add users to project"
                inputProps={{ 'aria-label': 'search google maps' }}
              />
              <IconButton className={classes.iconButtonAdd}></IconButton>
              <Divider className={classes.dividerAdd} orientation="vertical" />
              <IconButton
                onClick={() => {
                  addMemberInToTeam(team.teamId, inputAddUserValue, setInputAddUserValue, team);
                  setIsInviteMember(false);
                }}
                color="primary"
                className={classes.iconButtonAdd}
                aria-label="directions"
              >
                <AddCircleOutlineSharpIcon />
              </IconButton>
            </Paper>

            {isUserAdmin && <SelectInput isOnlyOperatorMember={true} {...props} />}
          </ExpansionPanelDetails>
        )}
        <Divider variant="inset" component="li" />
        <div className={classes.teamUsers}>
          <List className={classes.teamUsers}>
            {team.users.map((member, ind) => {
              return (
                <>
                  <ListItem>
                    <ListItemAvatar>
                      <Avatar>
                        <ImageIcon />
                      </Avatar>
                    </ListItemAvatar>
                    <ListItemText
                      primary={`userId: ${member.userId}`}
                      secondary={` Role: ${member.role} `}
                    />
                    <Role isUserAdmin={isUserAdmin} member={member} {...props} />
                    <Switch
                      checked={member.isActive}
                      onChange={() => {
                        setActiveInactive(member.userId, member.userEmail, team.teamId, team);
                      }}
                      disabled={
                        (isUserMember && !isUserOperator) ||
                        (isUserOperator && member.role === 'Admin')
                      }
                      color="primary"
                      name="checkedB"
                      inputProps={{ 'aria-label': 'primary checkbox' }}
                    />
                    <ListItemText
                      primary={`${member.userEmail}`}
                      // secondary={`invite at: ${member.invitedAt.email}`}
                    />
                    <IconButton
                      aria-label="delete"
                      onClick={() => {
                        deleteMemberFromTeam(team.teamId, member, team);
                      }}
                    >
                      {isUserAdmin && <DeleteIcon />}
                      {!isUserMember && isUserOperator && member.role !== 'Admin' && <DeleteIcon />}
                      {isUserMember && user.id === member.userId && !isUserOperator && (
                        <DeleteIcon />
                      )}
                      {isUserMember && isUserOperator && member.role !== 'Admin' && <DeleteIcon />}
                    </IconButton>
                  </ListItem>
                  <Divider variant="inset" component="li" />
                </>
              );
            })}
          </List>
        </div>
      </div>
    </ListItem>
  );
};

export default TeamItem;
