import React, { useState, useEffect } from 'react';
import io from 'socket.io-client';
import { connect } from 'react-redux';
import { useSnackbar } from 'notistack';

import Team from './Team';
import { updateUserData } from '../../store/action/user.action';

const uniqid = require('uniqid');

const TeamContainer = (props) => {
  const { enqueueSnackbar } = useSnackbar();
  const socket = io(window.location.origin);
  const { teamSection, user, updateUserData, invitedToTeams } = props;
  const [teamName, setTeamName] = useState('');
  const [description, setDescription] = useState('');
  const [role, setRole] = React.useState('Member');
  const [inputAddUserValue, setInputAddUserValue] = React.useState('');
  const [color, setColor] = useState('#B9EAEA');
  const [users, setUsers] = useState([
    {
      userId: user.id,
      userEmail: user.email,
      role: 'Admin',
      isTeamOwner: true,
      allowed: { a: true },
      isActive: true,
    },
  ]);
  const [invitedStateToTeams, setInvitedStateToTeams] = useState([]);

  useEffect(() => {
    // display snackbarMessages message soket interaction
    socket.on('snackbarMessages', ({ text, variant }) => {
      enqueueSnackbar(text, { variant });
    });
  }, [enqueueSnackbar, socket]);

  useEffect(() => {
    const arr = [];
    (() => {
      const isValid = invitedToTeams && invitedToTeams.length;
      isValid &&
        invitedToTeams.map((team) => {
          socket.emit('getTeamById', team);
        });

      socket.on('setTeamById', (data) => {
        arr.push(data);
      });
      setTimeout(() => {
        setInvitedStateToTeams(arr);
      }, 500);
    })();
  }, [invitedToTeams]);

  useEffect(() => {
    socket.on('FilesChanged', (updateUserFiles) => {
      updateUserData(updateUserFiles);
    });
  }, [socket, updateUserData]);

  const addUserToTeam = () => {
    socket.emit('isHasUserInDataBase', { email: inputAddUserValue });
    socket.on('userEmail', (ID) => {
      if (ID) {
        setUsers([
          ...users,
          {
            userId: ID,
            role: role,
            email: '',
            isTeamOwner: false,
            allowed: { a: true },
            invitedFrom: user,
          },
        ]);
        setInputAddUserValue('');
      } else {
        setInputAddUserValue('');
      }
    });
  };

  const addMemberInToTeam = (teamId, userEmail, setUserValue, team) => {
    socket.emit('inviteMember', {
      user,
      team,
      invitedToTeams,
      teamId: teamId,
      memberEmail: userEmail,
      memberRole: role,
    });
    setUserValue('');
  };

  const createTeam = () => {
    socket.emit('createTeam', {
      teamId: uniqid(),
      user,
      teamName,
      description: description,
      color: color,
      users: users,
    });
    // set to default settings ↓
    setTeamName('');
    setDescription('');
    setColor('#B9EAEA');
    setUsers([
      {
        userId: user && user.id,
        userEmail: user.email,
        role: 'Admin',
        isTeamOwner: true,
        allowed: { a: true },
        isActive: true,
      },
    ]);
  };

  const deleteTeam = (ID, team) => {
    const isTeam = teamSection.teams.find((e) => e.teamId === ID);
    //if delete owner team
    if (isTeam) {
      socket.emit('deleteTeam', {
        user: user,
        teamId: ID,
        team,
        inviteUsers: isTeam.users,
        teamOvner: isTeam.teamOvner,
      });
    }
    // // if delete admin ,but not ovner team
    if (!isTeam) {
      const team = invitedToTeams.find((e) => e.teamId === ID);
      socket.emit('deleteTeam', {
        user: user,
        teamId: ID,
        team: team.team,
        inviteUsers: team.team.users,
        teamOvner: team.team.teamOvner,
      });
    }
  };

  const deleteMemberFromTeam = (teamId, member, team) => {
    socket.emit('deleteMemberFromTeam', {
      user,
      team,
      teamId,
      member,
      teamSection,
    });
  };
  const setActiveInactive = (memberId, memberEmail, teamId, team) => {
    socket.emit('setActiveInactive', {
      user,
      team,
      memberId,
      memberEmail,
      teamId,
      teamSection: teamSection,
    });
  };
  const setTeamValue = (indificator, value, team) => {
    socket.emit(`setNewTeam${indificator}`, { value, team, user });
  };

  return (
    <Team
      teamName={teamName}
      setTeamName={setTeamName}
      createTeam={createTeam}
      teamSection={teamSection}
      description={description}
      setDescription={setDescription}
      color={color}
      setColor={setColor}
      addUserToTeam={addUserToTeam}
      role={role}
      setRole={setRole}
      countOfUsers={users.length}
      inputAddUserValue={inputAddUserValue}
      setInputAddUserValue={setInputAddUserValue}
      deleteTeam={deleteTeam}
      addMemberInToTeam={addMemberInToTeam}
      deleteMemberFromTeam={deleteMemberFromTeam}
      invitedStateToTeams={invitedStateToTeams}
      setActiveInactive={setActiveInactive}
      setTeamValue={setTeamValue}
      {...props}
    />
  );
};

const mapStateToProps = ({ userData }) => {
  return {
    user: userData.user,
    teamSection: userData.teamSection,
    invitedToTeams: userData.teamSection.invitedToTeams,
  };
};
const mapDispatchToProps = { updateUserData };

export default connect(mapStateToProps, mapDispatchToProps)(TeamContainer);
