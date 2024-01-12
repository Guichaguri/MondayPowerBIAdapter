
export interface MondayColumnValueProxy {
  id: string;
  text: string;
  value?: string;

  //#region Type specific properties

  // time_tracking
  duration?: number;

  // date
  date?: string;
  time?: string;

  // numbers
  number?: number;

  // dependency, mirror, board_relation
  display_value?: string;

  //#endregion
}
