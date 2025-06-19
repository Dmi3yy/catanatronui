import React from "react";
import cn from "classnames";

import "./PlayerStateBox.scss";
import { Paper } from "@mui/material";
import deskclock from "../assets/icons/deskclock.fill.svg";
import medalStar from "../assets/icons/medal.star.svg";
import star from "../assets/icons/star.svg";
import roadLanes from "../assets/icons/road.lanes.curved.right.svg";
import fencing from "../assets/icons/figure.fencing.svg";

export function ResourceCards({ playerState, playerKey }) {
  const amount = (card) => playerState[`${playerKey}_${card}_IN_HAND`];
  return (
    <div className="resource-cards" title="Resource Cards">
      {amount("WOOD") !== 0 && (
        <div className="wood-cards center-text card">
          <Paper>{amount("WOOD")}</Paper>
        </div>
      )}
      {amount("BRICK") !== 0 && (
        <div className="brick-cards center-text card">
          <Paper>{amount("BRICK")}</Paper>
        </div>
      )}
      {amount("SHEEP") !== 0 && (
        <div className="sheep-cards center-text card">
          <Paper>{amount("SHEEP")}</Paper>
        </div>
      )}
      {amount("WHEAT") !== 0 && (
        <div className="wheat-cards center-text card">
          <Paper>{amount("WHEAT")}</Paper>
        </div>
      )}
      {amount("ORE") !== 0 && (
        <div className="ore-cards center-text card">
          <Paper>{amount("ORE")}</Paper>
        </div>
      )}
      <div className="separator"></div>
      {amount("VICTORY_POINT") !== 0 && (
        <div
          className="dev-cards center-text card"
          title={amount("VICTORY_POINT") + " Victory Point Card(s)"}
        >
          <Paper>
            <span>{amount("VICTORY_POINT")}</span>
            <span>VP</span>
          </Paper>
        </div>
      )}
      {amount("KNIGHT") !== 0 && (
        <div
          className="dev-cards center-text card"
          title={amount("KNIGHT") + " Knight Card(s)"}
        >
          <Paper>
            <span>{amount("KNIGHT")}</span>
            <span>KN</span>
          </Paper>
        </div>
      )}
      {amount("MONOPOLY") !== 0 && (
        <div
          className="dev-cards center-text card"
          title={amount("MONOPOLY") + " Monopoly Card(s)"}
        >
          <Paper>
            <span>{amount("MONOPOLY")}</span>
            <span>MO</span>
          </Paper>
        </div>
      )}
      {amount("YEAR_OF_PLENTY") !== 0 && (
        <div
          className="dev-cards center-text card"
          title={amount("YEAR_OF_PLENTY") + " Year of Plenty Card(s)"}
        >
          <Paper>
            <span>{amount("YEAR_OF_PLENTY")}</span>
            <span>YP</span>
          </Paper>
        </div>
      )}
      {amount("ROAD_BUILDING") !== 0 && (
        <div
          className="dev-cards center-text card"
          title={amount("ROAD_BUILDING") + " Road Building Card(s)"}
        >
          <Paper>
            <span>{amount("ROAD_BUILDING")}</span>
            <span>RB</span>
          </Paper>
        </div>
      )}
    </div>
  );
}

export default function PlayerStateBox({ playerState, playerKey, color, name }) {
  const actualVps = playerState[`${playerKey}_ACTUAL_VICTORY_POINTS`];
  return (
      <div className={cn("player-state-box foreground", color)}>

          <div className="player-state-box-inner">
          <div className="player-avatar">
              <img src="https://i.pravatar.cc/50" alt="Avatar"/>
          </div>
          <div className="player-info">
            <div className="player-name-block">
              <span className="player-name">{name}</span>
              <sup className="player-name-ai">gpt-4.1-nano</sup>
            </div>
            <div className="player-stats-row">
              <div className="player-stat-block">
                <img src={star} alt="Star" className="player-icon" />
                <div className="player-stat-text">
                  <span className="player-stat-value">{actualVps}</span>
                </div>
              </div>
              <div className="player-stat-block">
                <img src={medalStar} alt="Rating" className="player-icon" />
                <div className="player-stat-text">
                  <span className="player-stat-value">212</span>
                </div>
              </div>
              <div className="player-stat-block">
                <img src={fencing} alt="Knights" className="player-icon" />
                <div className="player-stat-text">
                  <span className="player-stat-value">{playerState[`${playerKey}_PLAYED_KNIGHT`]}</span>
                </div>
              </div>
              <div className="player-stat-block">
                <img src={roadLanes} alt="Roads" className="player-icon" />
                <div className="player-stat-text">
                  <span className="player-stat-value">{playerState[`${playerKey}_LONGEST_ROAD_LENGTH`]}</span>
                </div>
              </div>
              <div className="player-stat-block">
                <img src={deskclock} alt="Timer" className="player-icon" />
                <div className="player-stat-text">
                  <span className="player-stat-value">3:31</span>
                </div>
              </div>
            </div>
          </div>
          </div>

          <ResourceCards playerState={playerState} playerKey={playerKey}/>

      </div>
  );
}
