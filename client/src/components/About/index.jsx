import React from 'react';
import { Header, Icon, Image, Container, } from 'semantic-ui-react';
import { SITE_TITLE, SITE_GITHUB, SITE_LEGACY_GITHUB, EERILAI_GITHUB, TAK_CHEAPASS_SITE } from '../../copy.js';
import './about.css';

const About = props => (
  <div className="takless">
    <div className="main">
      <div className="about">
        <h1>About { SITE_TITLE }</h1>
        <p className="about-text">
          { SITE_TITLE } is a unofficial, free, open source Tak server and interface.
          The live project can be accessed <a className="github" href={SITE_GITHUB}>here<Icon name="github" size="large" style={{ color: 'black' }} /></a>
          and is open to contributors.
        </p>
        <p>
          <a href={TAK_CHEAPASS_SITE}>Tak</a> is a board game created by <a href="https://en.wikipedia.org/wiki/James_Ernest">James Ernest</a> and <a href="https://en.wikipedia.org/wiki/Patrick_Rothfuss">Patrick Rothfuss</a>.
          Tak itself is inspired by the fantasy series <em><a href="https://en.wikipedia.org/wiki/The_Kingkiller_Chronicle">The Kingkiller Chronicle</a></em> by Patrick Rothfuss.
          { ` ${SITE_TITLE}` } implements the rules publiclly available <a href="https://cheapass.com/wp-content/uploads/2018/04/UniversityRulesSM.pdf">here.</a>
        </p>
        <p>
          { SITE_TITLE } is currently being ran and updated erratically by <a href={EERILAI_GITHUB}>eerilai</a> in her spare time.
        </p>
        <p>
          The site began as a student project at <a href="https://www.hackreactor.com/">Hack Reactor</a>, a software engineering immersive program, by a team of 4.
          The legacy code at the end of the course is available on the original groups <a href={SITE_LEGACY_GITHUB}>github organization</a>.
        </p>
      </div>
    </div>
  </div>
);

export default About;
