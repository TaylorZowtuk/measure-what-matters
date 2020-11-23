import Player from "./player";

export type touchesDTO = {
  firstHalfTouches: playerTouchDTO[];
  secondHalfTouches: playerTouchDTO[];
  fullGameTouches: playerTouchDTO[];
};

export type playerTouchDTO = {
  player: Player;
  touches: number;
};
