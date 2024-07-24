export type RootStackParamList = {
  Home: undefined;
  EnterName: undefined;
  Quiz: { playerName: string };
  Test: undefined;
  Leaderboard: { playerName: string; score: number };
};