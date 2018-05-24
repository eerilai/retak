import React from "react";
import { Header, Icon, Image, Container, } from "semantic-ui-react";
import shu from './Shu.jpeg'
import joz from './joz.jpeg'
import evan from './evan.jpeg'
import './about.css'
const About = props => (
  <div className="takless">
    <div className="main">
      <div className='backGround'>
        <h2 className='aboutheader1'>WE LOVE TAK</h2>

        <h3 className='aboutheader'>What is Tak?</h3>
        <p>Tak is an abstract strategy game in a similar style to Chess or Go (Baduk). The game is simple to play and enjoyable at all levels, but complex in strategy.</p>
        <h3 className='aboutheader'> Who we are? </h3>
        <p>We are four software engineers who love playing tak in our spare time. Although playing with friends in person is a great experience, sometimes it is hard to find an opponent. </p>
        <p>With that in mind along with the growing tak community, we decided to build this website to support and promote the game worldwide. </p>
        <p>Hope everyone can enjoy our site and if you are interested in contributing to our site, please get on our github  <a className='github' href="https://github.com/s-a-j-e"><Icon name='github' size='large' /></a></p>

        <div className='imageGroup'>
          <img className='us' src={joz} />
          <img className='us' src={evan} />
          <img className='us' src={shu} />
        </div>
      </div>
    </div>

    <div className='table'>




    </div>
  </div>
);

export default About;
