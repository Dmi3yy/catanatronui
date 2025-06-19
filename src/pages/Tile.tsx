import cn from "classnames";
import Paper from "@mui/material/Paper";

import "./Tile.scss";
import brickTile from "../assets/tiles/brick1.png";
import desertTile from "../assets/tiles/desert.png";
import grainTile from "../assets/tiles/wheat1.png";
import lumberTile from "../assets/tiles/wood1.png";
import oreTile from "../assets/tiles/ore1.png";
import oreTile1 from "../assets/tiles/ore1.png";
import woolTile from "../assets/tiles/sheep1.png";
import maritimeTile from "../assets/tiles/water.png";
import { SQRT3, tilePixelVector, type Direction } from "../utils/coordinates";
import number2 from "../assets/numbers/2.circle.fill.svg";
import number3 from "../assets/numbers/3.circle.fill.svg";
import number4 from "../assets/numbers/4.circle.fill.svg";
import number5 from "../assets/numbers/5.circle.fill.svg";
import number6 from "../assets/numbers/6.circle.fill.svg";
import number8 from "../assets/numbers/8.circle.fill.svg";
import number9 from "../assets/numbers/9.circle.fill.svg";
import number10 from "../assets/numbers/10.circle.fill.svg";
import number11 from "../assets/numbers/11.circle.fill.svg";
import number12 from "../assets/numbers/12.circle.fill.svg";
import brickTile1 from "../assets/tiles/brick1.png";
import woodTile1 from "../assets/tiles/wood1.png";

type NumberTokenProps = {
  number: number;
  className?: string;
  style?: Partial<React.CSSProperties>;
  flashing?: boolean;
};

const NUMBER_SVGS: Record<number, string> = {
  2: number2,
  3: number3,
  4: number4,
  5: number5,
  6: number6,
  8: number8,
  9: number9,
  10: number10,
  11: number11,
  12: number12,
};

export function NumberToken({
  number,
  className,
  style,
  flashing,
}: NumberTokenProps) {
  const svg = NUMBER_SVGS[number];
  const bgClass = number === 6 || number === 8 ? "number-bg-red" : "number-bg-black";
  return (
    <Paper
      elevation={3}
      className={cn("number-token", className, { flashing: flashing })}
      style={style}
    >
      {svg ? (
        <span className={cn("number-svg-bg", bgClass)}>
          <img src={svg} alt={number.toString()} className="number-svg" />
        </span>
      ) : null}
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
            height: 40,
            backgroundSize: "contain",
            width: 40,
            backgroundRepeat: "no-repeat",
          }}
        >
          {ratio}
        </div>
}

// Calculate opacity based on pip index (1-6)
const calculateOpacity = (number: number): number => {
  const pipIndex = numberToPipIndex(number);
  return 0.72 + (pipIndex * 0.03);
};

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
  let opacity = 1;

  if (tile.type === "RESOURCE_TILE") {
    if (tile.resource === "ORE") {
      const oreImages = [oreTile1, oreTile1, oreTile1, oreTile1, oreTile1, oreTile1];
      const idx = numberToPipIndex(tile.number) - 1;
      resourceTile = oreImages[idx];
      opacity = calculateOpacity(tile.number);
    } else if (tile.resource === "BRICK") {
      const brickImages = [brickTile1, brickTile1, brickTile1, brickTile1, brickTile1, brickTile1];
      const idx = numberToPipIndex(tile.number) - 1;
      resourceTile = brickImages[idx];
      opacity = calculateOpacity(tile.number);
    } else if (tile.resource === "WOOD") {
      const woodImages = [woodTile1, woodTile1, woodTile1, woodTile1, woodTile1, woodTile1];
      const idx = numberToPipIndex(tile.number) - 1;
      resourceTile = woodImages[idx];
      opacity = calculateOpacity(tile.number);
    } else {
      resourceTile = RESOURCES[tile.resource];
      opacity = calculateOpacity(tile.number);
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
        backgroundPositionX: "1px",
        opacity: Math.min(opacity, 1) // Ensure opacity never exceeds 1
      }}
      onClick={onClick}
    >
      {contents}
    </div>
  );
}
