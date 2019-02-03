import React, { Component } from "react";

export default class SendKehuSuccessPanel extends Component {
  render() {
    return (
      <div className="SendKehuSuccess">
        <img
          src="/images/kehu-sent-thumb.png"
          className="SendKehuSuccess-image"
        />
        <h3 className="SendKehuSuccess-title success-title-nw">
          Kehu lähetetty!
        </h3>
        <p className="SendKehuSuccess-text">Hienoa, jatka samaan malliin.</p>
      </div>
    );
  }
}
