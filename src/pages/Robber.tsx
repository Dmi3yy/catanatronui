import {
  SQRT3,
  tilePixelVector,
  type CubeCoordinate,
} from "../utils/coordinates";
import { Paper } from "@mui/material";
import RobberIcon from "../assets/icons/figure.and.child.holdinghands.svg";

type RobberProps = {
  center: [number, number];
  size: number;
  coordinate: CubeCoordinate;
};

export default function Robber({ center, size, coordinate }: RobberProps) {
  const [centerX, centerY] = center;
  const w = SQRT3 * size;
  const [tileX, tileY] = tilePixelVector(coordinate, size, centerX, centerY);
  const [deltaX, deltaY] = [-w / 2 + w / 8, 0];
  const x = tileX + deltaX;
  const y = tileY + deltaY;

  return (
    <Paper
      elevation={3}
      className="robber number-token"
      style={{
        left: x,
        top: y,
      }}
    >
      <img src={RobberIcon} alt="Robber" style={{ width: '100%', height: '100%' }} />
    </Paper>
  );
}
