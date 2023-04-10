import React, { Component } from "react";


class Footer extends Component {
  render() {
    return (
      <>
      <br />
      <footer>
          <div className="centertexts footer">
              <br />
              <div>
                <a href="https://github.com/tmickleydoyle/forecast"><span role="img" aria-label="link emoji">🔗</span> to code on GitHub</a>
                <a className='greytext'> | </a>
                <a href="https://github.com/tmickleydoyle/forecast/issues/new"><span role="img" aria-label="bug emoji">🐛</span> report a bug</a>
                <a className='greytext'> | </a>
                <a href="https://tmickleydoyle.vercel.app"><span role="img" aria-label="author">👨🏻‍🎨</span> Thomas Mickley-Doyle</a>
              </div>
              <br />
          </div>
        </footer>
      </>
    );
  }
}

export default Footer;