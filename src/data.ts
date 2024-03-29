import {GameLevel, GameType, IGame} from './schemas/game.schema.js';
import {add, sub} from 'date-fns';

export const GAMES: IGame[] = [
  {
    coach: 'Сашка',
    price: 100,
    duration: '1:00',
    place: 'корт',
    capacity: 3,
    type: GameType.training,
    level: GameLevel.ab,
    date: sub(new Date(), { days: 3 }),
    participants: [],
  },
  {
    coach: 'Тимка',
    price: 100,
    duration: '1:30',
    capacity: 5,
    place: 'корт',
    type: GameType.training,
    level: GameLevel.cd,
    date: add(new Date(), { months: 2 }),
    participants: [],
  },
  {
    coach: 'Сашка',
    price: 100,
    place: 'корт',
    duration: '2:00',
    type: GameType.training,
    capacity: 3,
    level: GameLevel.bc,
    date: add(new Date(), { months: 3 }),
    participants: [],
  },
  {
    coach: 'Тимка',
    capacity: 5,
    price: 100,
    place: 'корт',
    type: GameType.training,
    duration: '1:30',
    level: GameLevel.de,
    date: add(new Date(), { months: 3, days: 5 }),
    participants: [],
  },
];
