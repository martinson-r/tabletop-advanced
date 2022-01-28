import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useParams } from "react-router-dom";
import {
    useQuery, useLazyQuery
  } from "@apollo/client";
import { GET_CURRENT_ACCOUNT } from "../../gql"
import { GET_PAGINATED_GAMES, GET_GENRES } from "../../gql"
import { v4 as uuidv4 } from 'uuid';
import './footer.css';

function Footer() {
    return (
        <div>
            <p>Developed by Rihana Martinson</p>
        </div>
    )
}

export default Footer;
