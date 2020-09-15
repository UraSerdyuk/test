const { PORT = 9988 } = process.env;
const express = require('express');
const app = express();
const server = require('http').Server(app);
const path = require('path');
const jwt = require('jsonwebtoken');
const io = require('socket.io')(server);
const fs = require('fs');
const uniqid = require('uniqid');
const moment = require('moment');
const fsData = fs.readFileSync('./database/database.json');
const aes256 = require('aes256');
const {
  regType,
  ROLE,
  APP_ENDPOINTS,
  API_ENDPOINTS,
  SOCKET_PROXI,
  SNACKBAR_MESSAGE_TYPES,
} = require('./utils/constants');
const { getUserIndexByEmail } = require('./utils/helpers');
let database = JSON.parse(fsData).users;

app.use(express.urlencoded());
app.use(express.json());

//how many pescon connection to the site
const activeConnections = [];

const checkLogedUsersByEmail = (obj) => database.find((user) => user.email === obj.email);

// --socket.io section
io.on(SOCKET_PROXI.CONNECTION, (socket) => {
  const wfToDatabase = (userIndex, snackbarMessage) => {
    fs.writeFile(
      './database/database.json',
      JSON.stringify({ users: database }, null, 2),
      async (err) => {
        if (err) {
          snackbarMessage &&
            socket.emit(SOCKET_PROXI.SNACKBAR_MESSAGE, {
              text: snackbarMessage.text + 'with error',
              variant: SNACKBAR_MESSAGE_TYPES.ERROR,
            });
          throw err;
        }
        //deley
        await new Promise((res, rej) => {
          setTimeout(() => {
            res();
          }, 300);
        });
        //dearies without keys
        const diaryWithOutKey = database[userIndex].diary.map((el) => {
          const encryption = { ...el.encryption, key: '' };
          const images = el.images.map((image) => ({ ...image, key: '' }));
          return { ...el, encryption, images };
        });

        socket.emit('FilesChanged', {
          user: {
            email: database[userIndex].email,
            id: database[userIndex].id,
            role: database[userIndex].role,
          },
          uploadFiles: database[userIndex].uploadFiles,

          diary: diaryWithOutKey,
          teams: database[userIndex].teams,
          invitedToTeams: database[userIndex].invitedToTeams,
        });
        snackbarMessage &&
          socket.emit(SOCKET_PROXI.SNACKBAR_MESSAGE, {
            text: snackbarMessage.text,
            variant: snackbarMessage.variant,
          });
        console.log('The file has been saved!');
      },
    );
  };

  socket.emit(SOCKET_PROXI.CONNECT, socket.id);

  socket.broadcast.emit(SOCKET_PROXI.ONLIINE, activeConnections);

  socket.on(SOCKET_PROXI.SET_CLIENT, (user) => {
    activeConnections.push(user);
  });

  socket.on(SOCKET_PROXI.SAVE_ENTRY, (data) => {
    try {
      const userIndex = database.map((e) => e.email).indexOf(data.user.email);
      const userDiaryEntryIndex = database[userIndex].diary.map((e) => e.id).indexOf(data.id);

      //saved new entry
      if (userDiaryEntryIndex === -1) {
        database[userIndex].diary.push({
          id: data.id,
          text: data.text,
          encryption: data.encryption,
          images: data.images,
          dateCreated: data.dateCreated,
          dateLastUpdated: data.dateLastUpdated,
        });
      } else {
        //update entry
        //encrypting enrtie's text
        if (data.encryption.encrypt) {
          // in case there is no key
          if (!data.encryption.key) {
            data.encryption.key = database[userIndex].diary[userDiaryEntryIndex].encryption.key;
          } else {
            data.text = aes256.encrypt(data.encryption.key, data.text);
          }
        }

        //encrypt images
        data.images.map((image, index) => {
          if (image.encrypt) {
            if (!database[userIndex].diary[userDiaryEntryIndex].images[index].encrypt) {
              data.images[index].base64 = aes256.encrypt(
                data.images[index].key,
                data.images[0].base64,
              );
            } else {
              //dont revrite image key
              data.images[index].key =
                database[userIndex].diary[userDiaryEntryIndex].images[index].key;
            }
          }
        });

        database[userIndex].diary = [
          ...database[userIndex].diary.slice(0, userDiaryEntryIndex),
          {
            id: data.id,
            text: data.text,
            encryption: data.encryption,
            images: data.images,
            dateCreated: data.dateCreated,
            dateLastUpdated: data.dateLastUpdated,
          },
          ...database[userIndex].diary.slice(userDiaryEntryIndex + 1),
        ];
      }
      const snackbarMessage = {
        text: 'The entry saved',
        variant: SNACKBAR_MESSAGE_TYPES.SUCCESS,
      };

      wfToDatabase(userIndex, snackbarMessage);
    } catch (error) {
      socket.emit(SOCKET_PROXI.SNACKBAR_MESSAGE, {
        text: 'HEPPENED SOME ERROR IN THE SAVE_ENTRY FUNCTION ',
        variant: SNACKBAR_MESSAGE_TYPES.ERROR,
      });
    }
  });

  socket.on(SOCKET_PROXI.GET_ENTRY, (data) => {
    const user = database[getUserIndexByEmail(database, data.user.email)];
    socket.emit(
      'GetEntryFromServer',
      user.diary.find((entry) => entry.id === data.entryId),
    );
  });

  socket.on(SOCKET_PROXI.DECRYPT_ENTRY_TEXT, (data) => {
    try {
      const user = database[getUserIndexByEmail(database, data.user.email)];
      const diary = user.diary.find((entry) => entry.id === data.entryId);
      const userIndex = database.map((e) => e.email).indexOf(data.user.email);
      const userDiaryEntryIndex = database[userIndex].diary.map((e) => e.id).indexOf(data.entryId);

      if (diary.encryption.key === data.decryptKey) {
        const entry = database[userIndex].diary[userDiaryEntryIndex];

        database[userIndex].diary = [
          ...database[userIndex].diary.slice(0, userDiaryEntryIndex),
          {
            ...entry,
            text: aes256.decrypt(data.decryptKey, diary.text),
            encryption: { type: 'TEXT', encrypt: false, key: '' },
          },
          ...database[userIndex].diary.slice(userDiaryEntryIndex + 1),
        ];
        // socket.emit('decrypt-text', aes256.decrypt(data.decryptKey, diary.text));

        const snackbarMessage = {
          text: 'The entry decrypted',
          variant: SNACKBAR_MESSAGE_TYPES.SUCCESS,
        };

        wfToDatabase(userIndex, snackbarMessage);
      } else {
        socket.emit(SOCKET_PROXI.SNACKBAR_MESSAGE, {
          text: 'WRONG DECRYPT KEY',
          variant: SNACKBAR_MESSAGE_TYPES.WORNING,
        });
      }
    } catch (error) {
      socket.emit(SOCKET_PROXI.SNACKBAR_MESSAGE, {
        text: 'HEPPENED SOME ERROR IN THE DECRYPT_ENTRY_TEXT FUNCTION ',
        variant: SNACKBAR_MESSAGE_TYPES.ERROR,
      });
    }
  });

  socket.on(SOCKET_PROXI.DECRYPT_IMAGE, (data) => {
    try {
      const user = database[getUserIndexByEmail(database, data.user.email)];
      const diary = user.diary.find((entry) => entry.id === data.entryId);
      const image = diary.images.find((image) => image.id === data.imageId);
      const userIndex = database.map((e) => e.email).indexOf(data.user.email);

      if (image.key === data.decryptImageKey) {
        image.base64 = aes256.decrypt(data.decryptImageKey, image.base64);
        image.encrypt = false;
        image.key = '';
        const entryIndex = user.diary.map((entry) => entry.id).indexOf(data.entryId);
        const imageImdex = diary.images.map((image) => image.id).indexOf(data.imageId);

        database[userIndex].diary[entryIndex].images = [
          ...database[userIndex].diary[entryIndex].images.slice(0, imageImdex),
          image,
          ...database[userIndex].diary[entryIndex].images.slice(imageImdex + 1),
        ];

        const snackbarMessage = {
          text: 'The image  decrypted',
          variant: SNACKBAR_MESSAGE_TYPES.SUCCESS,
        };

        wfToDatabase(userIndex, snackbarMessage);
      } else {
        socket.emit(SOCKET_PROXI.SNACKBAR_MESSAGE, {
          text: 'WRONG DECRYPT IMAGE KEY',
          variant: SNACKBAR_MESSAGE_TYPES.WORNING,
        });
      }
    } catch (error) {
      socket.emit(SOCKET_PROXI.SNACKBAR_MESSAGE, {
        text: 'HEPPENED SOME ERROR IN THE DECRYPT_ENTRY_TEXT FUNCTION ',
        variant: SNACKBAR_MESSAGE_TYPES.ERROR,
      });
    }
  });

  socket.on(SOCKET_PROXI.DISCONNECT, (data) => {
    try {
      socket.broadcast.emit('change-online', activeConnections);
      const user = activeConnections
        .map(function (e) {
          return e.soketId;
        })
        .indexOf(socket.id);

      if (user !== 'undefined' && user >= 0) {
        activeConnections.splice(user, 1);
      }
    } catch (error) {
      socket.emit(SOCKET_PROXI.SNACKBAR_MESSAGE, {
        text: 'HEPPENED SOME ERROR IN THE DISCONNECT FUNCTION ',
        variant: SNACKBAR_MESSAGE_TYPES.ERROR,
      });
    }
  });

  socket.on(SOCKET_PROXI.POST_UPLOADED_DATA, (data) => {
    try {
      let dir = `./server/fileSave/${data.user.id}`;
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir);
      }

      let filepath = `./server/fileSave/${data.user.id}/${[data.name]}`;
      let dataNew = data.base64.replace(regType[data.base64Type], '');
      const buf = new Buffer(dataNew, 'base64');
      fs.writeFile(filepath, buf, (err) => {
        if (err) throw err;
        console.log('The file was succesfully saved!');
      });

      // copy from this
      const userIndex = database.map((e) => e.email).indexOf(data.user.email);
      database[userIndex].uploadFiles.push({
        name: data.name,
        size: data.size,
        type: data.type,
        lastModified: data.lastModified,
        lastModifiedDate: data.lastModifiedDate,
      });
      const snackbarMessage = {
        text: 'The file saved',
        variant: SNACKBAR_MESSAGE_TYPES.SUCCESS,
      };

      wfToDatabase(userIndex, snackbarMessage);
    } catch (error) {
      socket.emit(SOCKET_PROXI.SNACKBAR_MESSAGE, {
        text: 'HEPPENED SOME ERROR IN THE POST_UPLOADED_DATA FUNCTION ',
        variant: SNACKBAR_MESSAGE_TYPES.ERROR,
      });
    }
  });

  socket.on(SOCKET_PROXI.IS_HAS_USER_IN_BASE, (user) => {
    try {
      const UserInDatabase = checkLogedUsersByEmail(user);
      socket.emit('userEmail', UserInDatabase && UserInDatabase.id);
    } catch (error) {
      socket.emit(SOCKET_PROXI.SNACKBAR_MESSAGE, {
        text: 'HEPPENED SOME ERROR IN THE IS_HAS_USER_IN_BASE FUNCTION ',
        variant: SNACKBAR_MESSAGE_TYPES.ERROR,
      });
    }
  });

  socket.on(SOCKET_PROXI.CREATE_TEAM, (data) => {
    try {
      const userIndex = database.map((e) => e.email).indexOf(data.user.email);
      database[userIndex].teams.push({
        teamOvner: data.user,
        teamId: data.teamId,
        teamName: data.teamName,
        description: data.description,
        color: data.color,
        users: data.users,
        dateOfCreation: moment().format('LLLL'),
      });
      const snackbarMessage = {
        text: 'The team create',
        variant: SNACKBAR_MESSAGE_TYPES.SUCCESS,
      };

      wfToDatabase(userIndex, snackbarMessage);
    } catch (error) {
      socket.emit(SOCKET_PROXI.SNACKBAR_MESSAGE, {
        text: 'HEPPENED SOME ERROR IN THE CREATE_TEAM FUNCTION ',
        variant: SNACKBAR_MESSAGE_TYPES.ERROR,
      });
    }
  });

  socket.on(SOCKET_PROXI.DELETE_TEAM, (data) => {
    try {
      const teamOwnerIndex = getUserIndexByEmail(database, data.team.teamOvner.email);
      const teamOwner = database[teamOwnerIndex];
      const OwnerTeam = teamOwner.teams.find((team) => team.teamId === data.teamId);

      // can't delete team with active users
      if (OwnerTeam.users.find((user) => user.isActive === true)) {
        socket.emit(SOCKET_PROXI.SNACKBAR_MESSAGE, {
          text: 'YOU CAN"T DELETE TEAM WITH ACTIVE MEMBER',
          variant: SNACKBAR_MESSAGE_TYPES.WORNING,
        });
        return;
      }

      // clear invitedToTheTeam field in all users  who has invited in the team
      OwnerTeam.users.forEach((user) => {
        const userIndex = getUserIndexByEmail(database, user.userEmail);
        const invitedToTeamsIndex = database[userIndex].invitedToTeams
          .map((e) => e.teamId)
          .indexOf(data.teamId);
        if (invitedToTeamsIndex >= 0) {
          database[userIndex].invitedToTeams = [
            ...database[userIndex].invitedToTeams.slice(0, invitedToTeamsIndex),
            ...database[userIndex].invitedToTeams.slice(invitedToTeamsIndex + 1),
          ];
        }
      });

      // delete team
      const userIndex = getUserIndexByEmail(database, data.user.email);
      const teamIndex = teamOwner.teams.map((e) => e.teamId).indexOf(data.teamId);
      teamOwner.teams = [
        ...database[teamOwnerIndex].teams.slice(0, teamIndex),
        ...database[teamOwnerIndex].teams.slice(teamIndex + 1),
      ];

      const snackbarMessage = {
        text: 'The team delete',
        variant: SNACKBAR_MESSAGE_TYPES.SUCCESS,
      };

      wfToDatabase(userIndex, snackbarMessage);
    } catch (error) {
      socket.emit(SOCKET_PROXI.SNACKBAR_MESSAGE, {
        text: 'HEPPENED SOME ERROR IN THE DELETE_TEAM FUNCTION ',
        variant: SNACKBAR_MESSAGE_TYPES.ERROR,
      });
    }
  });

  socket.on(SOCKET_PROXI.INVITE_MEMBER, (data) => {
    try {
      const { user, teamId, memberEmail, memberRole, isTeamOwner, team } = data;
      const userRoleWhoInvite = user.role;

      const inviteMember = database[getUserIndexByEmail(database, memberEmail)];
      //check if invited user don't exist in database
      if (!inviteMember) {
        console.log('USER DONT EXIST IN TO DATA BASE');
        socket.emit(SOCKET_PROXI.SNACKBAR_MESSAGE, {
          text: 'USER DONT EXIST IN TO DATA BASE',
          variant: SNACKBAR_MESSAGE_TYPES.WORNING,
        });
        return;
      }
      const owner = database[getUserIndexByEmail(database, team.teamOvner.email)];
      const ownersTeam = owner.teams.find((team) => team.teamId === teamId);
      const invitedAt = moment().format('LLLL');
      if (userRoleWhoInvite === ROLE.ADMIN) {
        //check if has member in user team
        const memberInDataBase = database[getUserIndexByEmail(database, memberEmail)];
        const member = ownersTeam.users.find((e) => e.userEmail === memberEmail);
        if (member) {
          socket.emit(SOCKET_PROXI.SNACKBAR_MESSAGE, {
            text: 'The user already exist in to the team',
            variant: SNACKBAR_MESSAGE_TYPES.WORNING,
          });
          return;
        }
        data.team.teamOvner.email !== data.memberEmail &&
          memberInDataBase.invitedToTeams.push({
            user,
            team,
            teamId: teamId,
          });

        ownersTeam.users.push({
          userEmail: memberEmail,
          userId: memberInDataBase.id,
          role: memberInDataBase.role === 'Admin' ? 'Admin' : memberRole,
          isTeamOwner: isTeamOwner,
          invitedFrom: user,
          invitedAt,
          isActive: true,
        });
        const snackbarMessage = {
          text: 'Invite member',
          variant: SNACKBAR_MESSAGE_TYPES.SUCCESS,
        };

        wfToDatabase(getUserIndexByEmail(database, user.email), snackbarMessage);
      } else {
        const isMemberInTeam = team.users.find((e) => e.userEmail === memberEmail);

        if (isMemberInTeam) {
          console.log(' THE MEMBER EXIST IN  THE TEAM');
          socket.emit(SOCKET_PROXI.SNACKBAR_MESSAGE, {
            text: ' THE MEMBER EXIST IN  THE TEAM',
            variant: SNACKBAR_MESSAGE_TYPES.WORNING,
          });
          return;
        }

        const index = getUserIndexByEmail(database, memberEmail);
        const getUser = database[index];
        if (getUser.role === ROLE.ADMIN || getUser.role === ROLE.OPERATOR) {
          console.log('You CAN"T ADD  ADMIN OR OPERATOR');
          socket.emit(SOCKET_PROXI.SNACKBAR_MESSAGE, {
            text: 'YOU CAN"T ADD  ADMIN OR OPERATOR',
            variant: SNACKBAR_MESSAGE_TYPES.WORNING,
          });
          return;
        }

        getUser.invitedToTeams.push({
          user: user,
          team,
          teamId: teamId,
        });

        ownersTeam.users.push({
          userEmail: getUser.email,
          userId: getUser.id,
          role: memberRole,
          isTeamOwner: isTeamOwner,
          invitedFrom: user,
          invitedAt,
          isActive: true,
        });
        const snackbarMessage = {
          text: 'Invite member',
          variant: SNACKBAR_MESSAGE_TYPES.SUCCESS,
        };

        wfToDatabase(getUserIndexByEmail(database, user.email), snackbarMessage);
      }
    } catch (error) {
      socket.emit(SOCKET_PROXI.SNACKBAR_MESSAGE, {
        text: 'HEPPENED SOME ERROR IN THE INVITE_MEMBER FUNCTION ',
        variant: SNACKBAR_MESSAGE_TYPES.ERROR,
      });
    }
  });

  socket.on(SOCKET_PROXI.DELETE_MEMBER_FROM_TEAM, (data) => {
    try {
      const { user, member, teamId, teamSection, team } = data;

      //can remove himself or Manager only if at least one other Manager is in that team
      if (user.role === 'Admin' && member.role === 'Admin') {
        const getTeamOwnerIndexInDatabase = getUserIndexByEmail(database, team.teamOvner.email);
        //need to find index owner team;
        const teamInDatabase = database[getTeamOwnerIndexInDatabase].teams.find(
          (team) => team.teamId === teamId,
        );

        if ([...teamInDatabase.users].filter((user) => user.role === 'Admin').length === 1) {
          socket.emit(SOCKET_PROXI.SNACKBAR_MESSAGE, {
            text: 'MANEGER CAN"T DELETE THE LAST ONE MANAGER IN THE TEAM',
            variant: SNACKBAR_MESSAGE_TYPES.WORNING,
          });
          return;
        }
      }

      if (!teamSection.invitedToTeams.length) {
        // get user index
        const userIndex = database.map((e) => e.email).indexOf(user.email);
        // get team index
        const teamIndex = database[userIndex].teams.map((team) => team.teamId).indexOf(teamId);
        // get team
        const team = database[userIndex].teams.find((team) => team.teamId === teamId);
        // revrite users in the team
        const memberIndex = team.users.map((e) => e.userId).indexOf(member.userId);

        database[userIndex].teams[teamIndex].users = [
          ...database[userIndex].teams[teamIndex].users.slice(0, memberIndex),
          ...database[userIndex].teams[teamIndex].users.slice(memberIndex + 1),
        ];
        const memberIdx = getUserIndexByEmail(database, member.userEmail);
        const invitedToTeamsMebberIndex = database[memberIdx].invitedToTeams
          .map((e) => e.teamId)
          .indexOf(teamId);
        database[memberIdx].invitedToTeams = [
          ...database[memberIdx].invitedToTeams.slice(0, invitedToTeamsMebberIndex),
          ...database[memberIdx].invitedToTeams.slice(invitedToTeamsMebberIndex + 1),
        ];
        const snackbarMessage = {
          text: 'The user deleted',
          variant: SNACKBAR_MESSAGE_TYPES.SUCCESS,
        };
        // // rewrite base
        wfToDatabase(userIndex, snackbarMessage);
      } else {
        //delete Operator or member
        const ownerIndex = getUserIndexByEmail(database, data.team.teamOvner.email);

        const teamIndex = database[ownerIndex].teams.map((team) => team.teamId).indexOf(teamId);
        const teamInDatabase = database[ownerIndex].teams.find((team) => team.teamId === teamId);

        const memberIndex = teamInDatabase.users.map((e) => e.userId).indexOf(member.userId);
        database[ownerIndex].teams[teamIndex].users = [
          ...database[ownerIndex].teams[teamIndex].users.slice(0, memberIndex),
          ...database[ownerIndex].teams[teamIndex].users.slice(memberIndex + 1),
        ];

        const memberIdx = getUserIndexByEmail(database, member.userEmail);
        const invitedToTeamsMebberIndex = database[memberIdx].invitedToTeams
          .map((e) => e.teamId)
          .indexOf(teamId);
        database[memberIdx].invitedToTeams = [
          ...database[memberIdx].invitedToTeams.slice(0, invitedToTeamsMebberIndex),
          ...database[memberIdx].invitedToTeams.slice(invitedToTeamsMebberIndex + 1),
        ];
        const snackbarMessage = {
          text: 'The user deleted',
          variant: SNACKBAR_MESSAGE_TYPES.SUCCESS,
        };

        // rewrite base
        wfToDatabase(getUserIndexByEmail(database, user.email), snackbarMessage);
      }
    } catch (error) {
      socket.emit(SOCKET_PROXI.SNACKBAR_MESSAGE, {
        text: 'HEPPENED SOME ERROR IN THE DELETE_MEMBER_FROM_TEAM FUNCTION ',
        variant: SNACKBAR_MESSAGE_TYPES.ERROR,
      });
    }
  });

  socket.on(SOCKET_PROXI.GET_TEAM_BY_ID, (team) => {
    try {
      const ownerIndex = getUserIndexByEmail(database, team.team.teamOvner.email);
      const teamIndex = database[ownerIndex].teams.map((team) => team.teamId).indexOf(team.teamId);
      socket.emit('setTeamById', database[ownerIndex].teams[teamIndex]);
    } catch (error) {
      socket.emit(SOCKET_PROXI.SNACKBAR_MESSAGE, {
        text: 'HEPPENED SOME ERROR IN THE GET_TEAM_BY_ID FUNCTION ',
        variant: SNACKBAR_MESSAGE_TYPES.ERROR,
      });
    }
  });

  socket.on(SOCKET_PROXI.SET_ACTIVE_INACTIVE, (data) => {
    try {
      const { user, memberEmail, teamId, team } = data;

      const teamOwnerTeams = database[getUserIndexByEmail(database, team.teamOvner.email)].teams;
      const teamIndex = teamOwnerTeams.map((e) => e.teamId).indexOf(teamId);
      const memberIndex = teamOwnerTeams[teamIndex].users
        .map((e) => e.userEmail)
        .indexOf(memberEmail);

      teamOwnerTeams[teamIndex].users[memberIndex].isActive = !teamOwnerTeams[teamIndex].users[
        memberIndex
      ].isActive;
      const snackbarMessage = {
        text: 'The status changed',
        variant: SNACKBAR_MESSAGE_TYPES.SUCCESS,
      };

      wfToDatabase(getUserIndexByEmail(database, user.email), snackbarMessage);
    } catch (error) {
      socket.emit(SOCKET_PROXI.SNACKBAR_MESSAGE, {
        text: 'HEPPENED SOME ERROR IN THE SET_ACTIVE_INACTIVE FUNCTION ',
        variant: SNACKBAR_MESSAGE_TYPES.ERROR,
      });
    }
  });

  socket.on(SOCKET_PROXI.SET_NEW_TEAM_NAME, (data) => {
    console.log('SET_NEW_TEAM_NAME', data);
    try {
      const ownerIndex = getUserIndexByEmail(database, data.team.teamOvner.email);
      const userIndex = getUserIndexByEmail(database, data.user.email);
      const owner = database[ownerIndex];
      owner.teams.find((team) => team.teamId === data.team.teamId).teamName = data.value;

      const snackbarMessage = {
        text: 'The name changed',
        variant: SNACKBAR_MESSAGE_TYPES.SUCCESS,
      };

      wfToDatabase(userIndex, snackbarMessage);
    } catch (error) {
      socket.emit(SOCKET_PROXI.SNACKBAR_MESSAGE, {
        text: 'HEPPENED SOME ERROR IN THE SET_NEW_TEAM_NAME FUNCTION ',
        variant: SNACKBAR_MESSAGE_TYPES.ERROR,
      });
    }
  });
  socket.on(SOCKET_PROXI.SET_NEW_TEAM_DESCRIPTION, (data) => {
    try {
      const ownerIndex = getUserIndexByEmail(database, data.team.teamOvner.email);
      const userIndex = getUserIndexByEmail(database, data.user.email);
      const owner = database[ownerIndex];
      owner.teams.find((team) => team.teamId === data.team.teamId).description = data.value;

      const snackbarMessage = {
        text: 'The description changed',
        variant: SNACKBAR_MESSAGE_TYPES.SUCCESS,
      };

      wfToDatabase(userIndex, snackbarMessage);
    } catch (error) {
      socket.emit(SOCKET_PROXI.SNACKBAR_MESSAGE, {
        text: 'HEPPENED SOME ERROR IN THE SET_NEW_TEAM_DESCRIPTION FUNCTION ',
        variant: SNACKBAR_MESSAGE_TYPES.ERROR,
      });
    }
  });

  socket.on(SOCKET_PROXI.SET_NEW_TEAM_COLOR, (data) => {
    try {
      const ownerIndex = getUserIndexByEmail(database, data.team.teamOvner.email);
      const userIndex = getUserIndexByEmail(database, data.user.email);
      const owner = database[ownerIndex];
      owner.teams.find((team) => team.teamId === data.team.teamId).color = data.value;

      const snackbarMessage = {
        text: 'The color changed',
        variant: SNACKBAR_MESSAGE_TYPES.SUCCESS,
      };

      wfToDatabase(userIndex, snackbarMessage);
    } catch (error) {
      socket.emit(SOCKET_PROXI.SNACKBAR_MESSAGE, {
        text: 'HEPPENED SOME ERROR IN THE SET_NEW_TEAM_COLOR FUNCTION ',
        variant: SNACKBAR_MESSAGE_TYPES.ERROR,
      });
    }
  });

  socket.on(SOCKET_PROXI.SET_NEW_TEAM_ROLE, (data) => {
    try {
      const invitedMember = database[getUserIndexByEmail(database, data.value.userEmail)];
      if (invitedMember.role === ROLE.ADMIN) {
        socket.emit(SOCKET_PROXI.SNACKBAR_MESSAGE, {
          text: 'YOU CANNOT CHANGE THE ADMIN ROLE ',
          variant: SNACKBAR_MESSAGE_TYPES.WORNING,
        });
        return;
      }

      const ownerIndex = getUserIndexByEmail(database, data.team.teamOvner.email);
      const owner = database[ownerIndex];
      const team = owner.teams.find((team) => team.teamId === data.team.teamId);
      team.users.find((user) => user.userId === data.value.memberId).role = data.value.role;

      const snackbarMessage = {
        text: `The role ${data.value.memberId} changed`,
        variant: SNACKBAR_MESSAGE_TYPES.SUCCESS,
      };

      wfToDatabase(getUserIndexByEmail(database, data.user.email), snackbarMessage);
    } catch (error) {
      socket.emit(SOCKET_PROXI.SNACKBAR_MESSAGE, {
        text: 'HEPPENED SOME ERROR IN THE SET_NEW_TEAM_ROLE FUNCTION ',
        variant: SNACKBAR_MESSAGE_TYPES.ERROR,
      });
    }
  });
});

//--API section
app.post(API_ENDPOINTS.LOGIN, function (request, response) {
  const user = checkLogedUsersByEmail(request.body.user);
  if (user) {
    //TOTO check walidate on correct pasword
    const userIndex = database.map((e) => e.email).indexOf(request.body.user.email);
    const token = jwt.sign({ userId: user.id }, 'RANDOM_TOKEN_SECRET', {
      expiresIn: '24h',
    });
    //todo
    //meke check on correct pasword
    if (database[userIndex].password !== request.body.user.password) {
      return response.status(401).json({
        error: new Error('Wrong password'),
      });
    }

    //dearies without keys
    const diaryWithOutKey = database[userIndex].diary.map((el) => {
      const encryption = { ...el.encryption, key: '' };
      const images = el.images.map((image) => ({ ...image, key: '' }));
      return { ...el, encryption, images };
    });

    response.status(200).json({
      user: { email: user.email, id: user.id, role: user.role },
      token: token,
      uploadFiles: database[userIndex].uploadFiles,
      diary: diaryWithOutKey,
      teams: database[userIndex].teams,
      invitedToTeams: database[userIndex].invitedToTeams,
      snackbarMessage: { text: 'SUCCESSFOLY LOGIN', variant: SNACKBAR_MESSAGE_TYPES.SUCCESS },
    });
  } else {
    return response.status(401).json({
      error: new Error('User not found!'),
    });
  }
});

app.post(API_ENDPOINTS.SIGN_UP, function (request, response) {
  const newUser = {
    email: request.body.email,
    password: request.body.password,
    role: request.body.role,
    teams: [],
    invitedToTeams: [],
    id: uniqid(),
    uploadFiles: [],
    diary: [],
    images: [],
  };

  database.push(newUser);

  fs.writeFile('./database/database.json', JSON.stringify({ users: database }, null, 2), (err) => {
    if (err)
      return response.status(400).json({
        error: new Error('User not found!'),
      });

    const user = checkLogedUsersByEmail({ email: request.body.email });
    const userIndex = database.map((e) => e.email).indexOf(request.body.email);
    const token = jwt.sign({ userId: user.id }, 'RANDOM_TOKEN_SECRET', {
      expiresIn: '24h',
    });
    //dearies without keys
    const diaryWithOutKey = database[userIndex].diary.map((el) => {
      const encryption = { ...el.encryption, key: '' };
      const images = el.images.map((image) => ({ ...image, key: '' }));
      return { ...el, encryption, images };
    });

    response.status(200).json({
      user: { email: user.email, id: user.id, role: user.role },
      token: token,
      uploadFiles: database[userIndex].uploadFiles,
      diary: diaryWithOutKey,
      teams: database[userIndex].teams,
      invitedToTeams: database[userIndex].invitedToTeams,
      snackbarMessage: { text: 'SUCCESSFOLY LOGIN', variant: SNACKBAR_MESSAGE_TYPES.SUCCESS },
    });

    console.log('The user has been saved!');
  });
});

//redirect siction
app.get(APP_ENDPOINTS.LOGIN, (req, res) => res.redirect('/'));
app.get(APP_ENDPOINTS.HOME, (req, res) => res.redirect('/'));
app.get(APP_ENDPOINTS.DIARY, (req, res) => res.redirect('/'));
app.get(APP_ENDPOINTS.SIGN_UP, (req, res) => res.redirect('/'));
app.get(APP_ENDPOINTS.TEAM, (req, res) => res.redirect('/'));

app.use(express.static('./build'));

//--Server listen
server.listen(PORT, () => {
  console.log(`Server is started on port №${PORT}`);
});
