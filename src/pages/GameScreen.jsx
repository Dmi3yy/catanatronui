import React, { useEffect, useState, useContext } from "react";
import { useParams } from "react-router-dom";
import PropTypes from "prop-types";
import { GridLoader } from "react-spinners";
import { useSnackbar } from "notistack";
import ZoomableBoard from "./ZoomableBoard";
import ActionsToolbar from "./ActionsToolbar";
import "./GameScreen.scss";
import { store } from "../store";
import ACTIONS from "../actions";
import { getState, postAction, getMctsAnalysis } from "../utils/apiClient";
import { dispatchSnackbar } from "../components/Snackbar";
import { getHumanColor, playerKey } from "../utils/stateUtils";
import PlayerStateBox from "../components/PlayerStateBox";
import Divider from "@mui/material/Divider";
import cn from "classnames";
import { humanizeAction } from "../components/Prompt";
import { CircularProgress, Button } from "@mui/material";
import AssessmentIcon from "@mui/icons-material/Assessment";

const ROBOT_THINKING_TIME = 300;

function LeftContent({ gameState }) {
  // Типи гравців у порядку кольорів (якщо поле players відсутнє, використовуємо HUMAN/CATANATRON/RANDOM за замовчуванням)
  const playerTypes = gameState.players || gameState.player_types || gameState.colors.map((color, idx) => {
    if (idx === 0) return "HUMAN";
    if (gameState.bot_colors && gameState.bot_colors.includes(color)) return "CATANATRON";
    return "RANDOM";
  });
  const playerTypeToName = {
    HUMAN: "HUMAN",
    CATANATRON: "CATANATRON",
    RANDOM: "RANDOM"
  };
  return (
    <div className="left-content">
      <div className="player-state-list">
        {gameState.colors.map((color, idx) => {
          const key = playerKey(gameState, color);
          // Find player by color
          const player = gameState.players?.find(p => p.color === color);
          // Get name from player, fallback to 'Unknown' if not found
          const name = player?.name || "Unknown";
          return (
            <React.Fragment key={color}>
                <PlayerStateBox
                  playerState={gameState.player_state}
                  playerKey={key}
                  color={color}
                  name={name}
                />
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
}

function RightContent({ gameId, gameState }) {
  const [mctsResults, setMctsResults] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const handleAnalyzeClick = async () => {
    if (!gameId || !gameState || gameState.winning_color) return;
    try {
      setLoading(true);
      setError(null);
      const result = await getMctsAnalysis(gameId);
      if (result.success) {
        setMctsResults(result.probabilities);
      } else {
        setError(result.error || "Analysis failed");
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="right-content analysis-box">
      <div className="analysis-header">
        <h3>Win Probability Analysis</h3>
        <Button
          variant="contained"
          color="primary"
          onClick={handleAnalyzeClick}
          disabled={loading || gameState?.winning_color}
          startIcon={loading ? <CircularProgress size={20} /> : <AssessmentIcon />}
        >
          {loading ? "Analyzing..." : "Analyze"}
        </Button>
      </div>
      {error && <div className="error-message">{error}</div>}
      {mctsResults && !loading && !error && (
        <div className="probability-bars">
          {Object.entries(mctsResults).map(([color, probability]) => (
            <div key={color} className={`probability-row ${color.toLowerCase()}`}>
              <span className="player-color">{color}</span>
              <span className="probability-bar">
                <div className="bar-fill" style={{ width: `${probability}%` }} />
              </span>
              <span className="probability-value">{probability}%</span>
            </div>
          ))}
        </div>
      )}
      <Divider />
      <div className="log">
        {gameState.actions.slice().reverse().map((action, i) => (
          <div key={i} className={cn("action foreground", action[0])}>
            {humanizeAction(gameState, action)}
          </div>
        ))}
      </div>
    </div>
    
  );
}

function GameScreen({ replayMode }) {
  const { gameId, stateIndex } = useParams();
  const { state, dispatch } = useContext(store);
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();
  const [isBotThinking, setIsBotThinking] = useState(false);

  // Load game state
  useEffect(() => {
    if (!gameId) {
      return;
    }

    (async () => {
      const gameState = await getState(gameId, stateIndex);
      dispatch({ type: ACTIONS.SET_GAME_STATE, data: gameState });
    })();
  }, [gameId, stateIndex, dispatch]);

  // Maybe kick off next query?
  useEffect(() => {
    if (!state.gameState || replayMode) {
      return;
    }
    if (
      state.gameState.bot_colors.includes(state.gameState.current_color) &&
      !state.gameState.winning_color
    ) {
      // Make bot click next action.
      (async () => {
        setIsBotThinking(true);
        const start = new Date();
        const gameState = await postAction(gameId);
        const requestTime = new Date() - start;
        setTimeout(() => {
          // simulate thinking
          setIsBotThinking(false);
          dispatch({ type: ACTIONS.SET_GAME_STATE, data: gameState });
          if (getHumanColor(gameState)) {
            dispatchSnackbar(enqueueSnackbar, closeSnackbar, gameState);
          }
        }, ROBOT_THINKING_TIME - requestTime);
      })();
    }
  }, [
    gameId,
    replayMode,
    state.gameState,
    dispatch,
    enqueueSnackbar,
    closeSnackbar,
  ]);

  if (!state.gameState) {
    return (
      <main>
        <GridLoader
          className="loader"
          color="#000000"
          height={100}
          width={100}
        />
      </main>
    );
  }

  return (
    <main>
      <div>
        <LeftContent gameState={state.gameState} />
        <div className="center-content">
          <div className="map-square-wrapper">
            <ZoomableBoard replayMode={replayMode} />
          </div>
          <ActionsToolbar isBotThinking={isBotThinking} replayMode={replayMode} />
        </div>
        <RightContent gameId={gameId} gameState={state.gameState} />
      </div>
    </main>
  );
}

GameScreen.propTypes = {
  /**
   * Injected by the documentation to work in an iframe.
   * You won't need it on your project.
   */
  window: PropTypes.func,
};

export default GameScreen;
