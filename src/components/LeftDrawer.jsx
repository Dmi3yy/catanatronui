import React, { useCallback, useContext } from "react";
import cn from "classnames";
import SwipeableDrawer from "@mui/material/SwipeableDrawer";
import Divider from "@mui/material/Divider";
import Drawer from "@mui/material/Drawer";

import Hidden from "./Hidden";
import PlayerStateBox from "./PlayerStateBox";
import { humanizeAction } from "./Prompt";
import { store } from "../store";
import ACTIONS from "../actions";
import { playerKey } from "../utils/stateUtils";

import "./LeftDrawer.scss";

function DrawerContent({ gameState }) {
  // Типи гравців у порядку кольорів (якщо поле players відсутнє, використовуємо HUMAN/CATANATRON/RANDOM за замовчуванням)
  const playerTypes = gameState.players || gameState.player_types || gameState.colors.map((color, idx) => {
    if (idx === 0) return "HUMAN";
    if (gameState.bot_colors && gameState.bot_colors.includes(color)) return "CATANATRON";
    return "RANDOM";
  });
  const playerTypeToName = {
    HUMAN: "Ти",
    CATANATRON: "Catanatron",
    RANDOM: "Бот"
  };
  const playerSections = gameState.colors.map((color, idx) => {
    const key = playerKey(gameState, color);
    // Знаходимо гравця за кольором
    const player = gameState.players?.find(p => p.color === color);
    // Беремо ім'я з гравця, якщо нема — fallback на тип
    const name = player?.name || "Unknown";
    return (
      <React.Fragment key={color}>
        <PlayerStateBox
          playerState={gameState.player_state}
          playerKey={key}
          color={color}
          name={name}
        />
        <Divider />
      </React.Fragment>
    );
  });

  return (
    <>
      {playerSections}
      <div className="log">
        {gameState.actions
          .slice()
          .reverse()
          .map((action, i) => (
            <div key={i} className={cn("action foreground", action[0])}>
              {humanizeAction(gameState, action)}
            </div>
          ))}
      </div>
    </>
  );
}

export default function LeftDrawer() {
  const { state, dispatch } = useContext(store);
  const iOS = /iPad|iPhone|iPod/.test(navigator.userAgent);

  const openLeftDrawer = useCallback(
    (event) => {
      if (
        event &&
        event.type === "keydown" &&
        (event.key === "Tab" || event.key === "Shift")
      ) {
        return;
      }

      dispatch({ type: ACTIONS.SET_LEFT_DRAWER_OPENED, data: true });
    },
    [dispatch]
  );
  const closeLeftDrawer = useCallback(
    (event) => {
      if (
        event &&
        event.type === "keydown" &&
        (event.key === "Tab" || event.key === "Shift")
      ) {
        return;
      }

      dispatch({ type: ACTIONS.SET_LEFT_DRAWER_OPENED, data: false });
    },
    [dispatch]
  );

  return (
    <>
      <Hidden breakpoint={{ size: "md", direction: "up" }} implementation="js">
        <SwipeableDrawer
          className="left-drawer"
          anchor="left"
          open={state.isLeftDrawerOpen}
          onClose={closeLeftDrawer}
          onOpen={openLeftDrawer}
          disableBackdropTransition={!iOS}
          disableDiscovery={iOS}
          onKeyDown={closeLeftDrawer}
        >
          <DrawerContent gameState={state.gameState} />
        </SwipeableDrawer>
      </Hidden>
      <Hidden breakpoint={{size: "sm", direction: "down" }} implementation="css">
        <Drawer className="left-drawer" anchor="left" variant="permanent" open>
          <DrawerContent gameState={state.gameState} />
        </Drawer>
      </Hidden>
    </>
  );
}
