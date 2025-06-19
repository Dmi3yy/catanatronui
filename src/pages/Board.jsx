import React from "react";
import classnames from "classnames";

import Tile from "./Tile";
import Node from "./Node";
import Edge from "./Edge";
import Robber from "./Robber";
import DiceRoll from "../components/DiceRoll";
import "./Board.scss";

/**
 * Math comes from https://www.redblobgames.com/grids/hexagons/.
 */
function computeDefaultSize(divWidth, divHeight) {
  const numLevels = 6; // 3 rings + 1/2 a tile for the outer water ring
  // divHeight = numLevels * (3h/4) + (h/4), implies:
  const maxSizeThatRespectsHeight = (4 * divHeight) / (3 * numLevels + 1) / 2;

  // divWidth = (2 * w) + (w/2) * (numLevels - 1), implies:
  const maxSizeThatRespectsWidth = divWidth / (2 + (numLevels - 1) / 2);

  return Math.min(maxSizeThatRespectsWidth, maxSizeThatRespectsHeight);
}

export default function Board({
  gameState,
  width,
  show,
  replayMode,
  isMovingRobber,
  handleTileClick,
  buildOnNodeClick,
  buildOnEdgeClick,
  nodeActions,
  edgeActions,
}) {
  // Get the last roll values from game state
  const diceValues = gameState.last_roll || null;
  console.log('Game state last_roll:', gameState.last_roll);
  console.log('Dice values in Board:', diceValues);

  // TODO: Keep in sync with CSS
  const containerHeight = width-20;
  const containerWidth = width-20;
  const center = [containerWidth / 2, containerHeight / 2];
  const size = computeDefaultSize(containerWidth, containerHeight);
  if (!size) {
    return null;
  }

  const tiles = gameState.tiles.map(({ coordinate, tile }) => (
    <Tile
      key={coordinate}
      center={center}
      coordinate={coordinate}
      tile={tile}
      size={size}
      flashing={isMovingRobber}
      onClick={() => handleTileClick(coordinate)}
    />
  ));
  const nodes = Object.values(gameState.nodes).map(
    ({ color, building, direction, tile_coordinate, id }) => (
      <Node
        key={id}
        id={id}
        center={center}
        size={size}
        coordinate={tile_coordinate}
        direction={direction}
        building={building}
        color={color}
        flashing={!replayMode && id in nodeActions}
        onClick={buildOnNodeClick(id, nodeActions[id])}
      />
    )
  );
  const edges = Object.values(gameState.edges).map(
    ({ color, direction, tile_coordinate, id }) => (
      <Edge
        id={id}
        key={id}
        center={center}
        size={size}
        coordinate={tile_coordinate}
        direction={direction}
        color={color}
        flashing={id in edgeActions}
        onClick={buildOnEdgeClick(id, edgeActions[id])}
      />
    )
  );
  return (
    <div className={classnames("board", { show })}>
      <DiceRoll values={diceValues} />
      {tiles}
      {edges}
      {nodes}
      <Robber
        center={center}
        size={size}
        coordinate={gameState.robber_coordinate}
      />
    </div>
  );
}
