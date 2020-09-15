import React, { useState } from 'react';
import IconButton from '@material-ui/core/IconButton';
import AssignmentIndIcon from '@material-ui/icons/AssignmentInd';
import PersonOutlineIcon from '@material-ui/icons/PersonOutline';

import SelectInput from '../selectInput';

const Role = (props) => {
  const { isUserAdmin, setTeamValue, team, role, member } = props;
  const [isRoleSelected, setIsRoleSelected] = useState(false);
  return (
    <>
      {isUserAdmin && (
        <>
          <IconButton
            onClick={() => {
              setIsRoleSelected(!isRoleSelected);
            }}
            color="primary"
            // className={classes.iconButtonAdd}
            aria-label="directions"
          >
            <AssignmentIndIcon />
          </IconButton>

          {isRoleSelected && (
            <>
              <SelectInput isOnlyOperatorMember={true} {...props} />
              <IconButton
                onClick={() => {
                  setTeamValue(
                    'Role',
                    { memberId: member.userId, userEmail: member.userEmail, role },
                    team,
                  );
                  setIsRoleSelected(false);
                }}
                color="primary"
                // className={classes.iconButtonAdd}
                aria-label="directions"
              >
                <PersonOutlineIcon />
              </IconButton>
            </>
          )}
        </>
      )}
    </>
  );
};

export default Role;
