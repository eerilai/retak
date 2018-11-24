import React from 'react';
import { Popup, Icon } from 'semantic-ui-react';
import '../../../../styles/controlpanel.css';

const Resign = (props) => {
  const { resigning, handleResign } = props;
  if (resigning) {
    return (
      <td className="resigning">
        <Popup
          content="Resign"
          position="top left"
          size="tiny"
          trigger={
            <div
              className="resign-button"
              onClick={() => { handleResign(true); }}
            >
              <Icon name="flag" />
            </div>
          }
        />
        <Popup
          content="Cancel"
          position="top right"
          size="tiny"
          trigger={
            <div
              className="cancel-resign-button"
              onClick={() => { handleResign(false); }}
            >
              <Icon name="ban" />
            </div>
          }
        />
      </td>
    );
  }
  return (
    <Popup
      content="Resign"
      position="top center"
      size="tiny"
      trigger={
        <td
          className="resign-button"
          onClick={() => { handleResign(true); }}
        >
          <Icon name="flag" />
        </td>
      }
    />
  );
};

export default Resign;
