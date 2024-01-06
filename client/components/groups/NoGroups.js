import React, { useState } from "react";
import { useTranslation } from "react-i18next";

import CreateGroupForm from "./CreateGroupForm";

export default function NoGroups() {
  const [t] = useTranslation();
  const [isCreateNewGroupVisible, setIsCreateNewGroupVisible] = useState(false);

  return (
    <div className="container">
      <div className="row">
        <div className="col-xs-10 col-xs-offset-1 col-lg-8 col-lg-offset-2">
          <div className="GroupsPanel-dashedBox">
            <h1 className="GroupsPanel-title">
              {t("groups.no-groups-title", "Et kuulu vielä Kehu-yhteisöön")}
            </h1>
            <div className="GroupsPanel-emptyText">
              <p>
                {t(
                  "groups.no-groups-text-1",
                  "Yhteisöt ovat Kehun työkalu tiimeille, kavereille ja muille porukoille. Yhteisön sisällä voitte kehua toisianne julkisesti tai yksityisesti sekä kehua koko porukkaa.",
                )}
              </p>
              <p>
                {t(
                  "groups.no-groups-text-2",
                  "Luo ensimmäinen yhteisösi nyt ja kutsu kehurinki koolle!",
                )}
              </p>
              <button
                className="Button GroupsPanel-addGroupButton"
                onClick={() => setIsCreateNewGroupVisible(true)}
              >
                {t("groups.new-group-button", "Luo uusi yhteisö")}
              </button>
            </div>
          </div>
        </div>
      </div>
      {isCreateNewGroupVisible && (
        <CreateGroupForm closeModal={() => setIsCreateNewGroupVisible(false)} />
      )}
    </div>
  );
}
