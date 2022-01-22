import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useParams, Link, useHistory } from "react-router-dom";
import {
    useLazyQuery, useMutation
  } from "@apollo/client";
import charactersheet from "../../../../backend/db/models/charactersheet";

import "./charactersheet.css";

function CharacterSheet() {

    return (
        <div className="gray-backdrop">
            <div className="container">
                {/* TODO: display Character Sheet data */}
                {/* TODO: form to create and save Character Sheet */}
                {/* TODO: way to hook Character Sheet up to Character */}
            </div>
        </div>
    )
}

export default CharacterSheet;
