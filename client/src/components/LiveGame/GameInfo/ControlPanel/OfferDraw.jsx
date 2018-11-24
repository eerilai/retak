import React from 'react';
import { Popup, Icon } from 'semantic-ui-react';
import '../../../../styles/controlpanel.css';

const OfferDraw = (props) => {
  const { drawOffered, offerDraw, acceptDraw } = props;
  if (drawOffered) {
    return (
      <td className="draw-offered">
        <Popup
          content="Accept Draw"
          position="top center"
          size="tiny"
          trigger={
            <div
              className="draw-button"
              onClick={acceptDraw}
            >
              <Icon name="handshake" />
            </div>
          }
        />
      </td>
    );
  }
  return (
    <Popup
      content="Offer Draw"
      position="top center"
      size="tiny"
      trigger={
        <td
          className="draw-button"
          onClick={offerDraw}
        >
          <Icon name="handshake" />
        </td>
      }
    />
  );
};

export default OfferDraw;
