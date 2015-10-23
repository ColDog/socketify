import React from 'react';
import CommentBox from 'Comments';

class Home extends React.Component {
  render() {
    return (
      <div>
        Home! HELLO!
        <CommentBox />
      </div>
    );
  }
}

module.exports = Home;
