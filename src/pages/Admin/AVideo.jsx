
import React, { useEffect, useState } from "react";
import { formatDate, formatDateTime } from "./ACommon";

import AVideoList from "./AVideoList";
import AVideoInput from "./AVideoInput";

import "./AVideo.css";
import "./ACommon.css";


function AVideo () {

  const [isOpen, setIsOpen] = useState(false);

  return (

      <div className="av-main-list">

        <div>
          <button onClick={() => setIsOpen(true)}>등록</button>
        </div>

        <AVideoList/>

        {/* 모달 */}
        {isOpen && (
          <div className="modal">
            <div className="modal-content">
              <AVideoInput onClose={() => setIsOpen(false)} />
            </div>
          </div>
        )}

      </div>
  );
}

export default AVideo;