import cn from "classnames";
import Paper from "@mui/material/Paper";

import "./Tile.scss";
import brickTile from "../assets/tile_brick.svg";
import desertTile from "../assets/tile_desert.svg";
import grainTile from "../assets/tile_wheat.png";
import lumberTile from "../assets/tile_wood.png";
import oreTile from "../assets/tile_ore.png";
import oreTile1 from "../assets/tiles/ore1.png";
import oreTile2 from "../assets/tiles/ore2.png";
import oreTile3 from "../assets/tiles/ore3.png";
import oreTile4 from "../assets/tiles/ore4.png";
import oreTile5 from "../assets/tiles/ore5.png";
import oreTile6 from "../assets/tiles/ore6.png";
import woolTile from "../assets/tile_sheep.png";
import maritimeTile from "../assets/tile_maritime.svg";
import { SQRT3, tilePixelVector, type Direction } from "../utils/coordinates";

type NumberTokenProps = {
  number: number;
  className?: string;
  style?: Partial<React.CSSProperties>;
  flashing?: boolean;
};

export function NumberToken({
  number,
  className,
  style,
  flashing,
}: NumberTokenProps) {
  return (
    <Paper
      elevation={3}
      className={cn("number-token", className, { flashing: flashing })}
      style={style}
    >
      <div>{number}</div>
      <div className="pips">{numberToPips(number)}</div>
    </Paper>
  );
}

// Map number to pip index (1-6)
const numberToPipIndex = (number: number) => {
  switch (number) {
    case 2:
    case 12:
      return 1;
    case 3:
    case 11:
      return 2;
    case 4:
    case 10:
      return 3;
    case 5:
    case 9:
      return 4;
    case 6:
      return 5;
    case 8:
      return 6;
    default:
      return 1; // fallback
  }
};

// Map number to pip string for display
const numberToPips = (number: number) => {
  switch (number) {
    case 2:
    case 12:
      return "•";
    case 3:
    case 11:
      return "••";
    case 4:
    case 10:
      return "•••";
    case 5:
    case 9:
      return "••••";
    case 6:
    case 8:
      return "•••••";
    default:
      return "";
  }
};

const RESOURCES = {
  BRICK: brickTile,
  SHEEP: woolTile,
  ORE: oreTile,
  WOOD: lumberTile,
  WHEAT: grainTile,
} as const;

type Resource = keyof typeof RESOURCES;

type ResourceTile = {
  type: "RESOURCE_TILE";
  resource: Resource;
  number: number;
};

type DesertTile = {
  type: "DESERT";
};

type PortTile = {
  type: "PORT";
  direction: Direction;
  resource: Resource;
};

const calculatePortPosition = (direction: Direction, size: number): { x: number;  y : number } => {
    let x = 0;
    let y = 0;
    if (direction.includes("SOUTH")) {
      y += size / 3;
    } else if (direction.includes("NORTH")) {
      y -= size / 3;
    }
    if (direction.includes("WEST")) {
      x -= size / 4;
      if (direction === "WEST") {
        x = -size / 3;
      }
    } else if (direction.includes("EAST")) {
      x += size / 4;
      if (direction === "EAST") {
        x = size / 3;
      }
    }
    return { x, y }
}

const Port = ({ resource, style }: { resource: Resource; style: Partial<React.CSSProperties> }) => {
  let ratio;
  let tile;
  if (resource in RESOURCES) {
    ratio = "2:1";
    tile = RESOURCES[resource];
  } else {
    ratio = "3:1";
    tile = maritimeTile;
  }

  return  <div
          className="port"
          style={{
            ...style,
            backgroundImage: `url("${tile}")`,
            height: 60,
            backgroundSize: "contain",
            width: 52,
            backgroundRepeat: "no-repeat",
          }}
        >
          {ratio}
        </div>
}

type TileProps = {
  center: any;
  coordinate: any;
  tile: ResourceTile | PortTile | DesertTile;
  size: any;
  onClick: React.MouseEventHandler<HTMLDivElement>;
  flashing: boolean;
};

export default function Tile({
  center,
  coordinate,
  tile,
  size,
  onClick,
  flashing,
}: TileProps) {
  const w = SQRT3 * size;
  const h = 2 * size;
  const [centerX, centerY] = center;
  const [x, y] = tilePixelVector(coordinate, size, centerX, centerY);

  let contents;
  let resourceTile;
  if (tile.type === "RESOURCE_TILE") {
    if (tile.resource === "ORE") {
      const oreImages = [oreTile1, oreTile2, oreTile3, oreTile4, oreTile5, oreTile6];
      const idx = numberToPipIndex(tile.number) - 1;
      resourceTile = oreImages[idx];
    } else {
      resourceTile = RESOURCES[tile.resource];
    }
    contents = <NumberToken number={tile.number} flashing={flashing} />;
  } else if (tile.type === "DESERT") {
    resourceTile = desertTile;
  } else if (tile.type === "PORT") {
    const { x, y } = calculatePortPosition(tile.direction, size);
    contents = (<Port resource={tile.resource} style={{ left: x, top: y }}  />)
    }

  return (
    <div
      key={coordinate}
      className="tile"
      style={{
        left: x - w / 2,
        top: y - h / 2,
        width: w,
        height: h,
        backgroundImage: `url("${resourceTile}?v=2")`,
        backgroundSize: "contain",
        backgroundRepeat: "no-repeat",
        backgroundPositionY: "6px",
        backgroundPositionX: "1px"

      }}
      onClick={onClick}
    >
      {contents}
    </div>
  );
}
