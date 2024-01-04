import { Markup } from 'telegraf';
import {GameDocument, GameLevel, GameType} from '../schemas/game.schema.js';
import {add, format} from "date-fns";

export const renderAdminGameButtons = (game: GameDocument) => ([Markup.button.callback('Удалить', `remove_game__${game.id}`)]);

export const renderJoinGameButtons = (game: GameDocument) => {
  return {
    ...Markup.inlineKeyboard([
      Markup.button.callback('Записаться', `join__${game.id}`),
      Markup.button.callback('Участники', `participants__${game.id}`),
    ]),
  };
};

export const renderMyGameButtons = (game: GameDocument) => {
  return {
    ...Markup.inlineKeyboard([
      Markup.button.callback('Участники', `participants__${game.id}`),
      Markup.button.callback('Отменить участие', `leave__${game.id}`),
    ]),
  };
};

export const renderYesNoButtons = (buttonsName: string[], key: string) => {
  const [yes, no] = buttonsName;

  return {
    ...Markup.inlineKeyboard([
      Markup.button.callback(yes, `${key}__yes`),
      Markup.button.callback(no, `${key}__no`),
    ]),
  };
};

export const renderDateButtons = (startDate: Date = new Date(), days: number = 7) => {
  const dateFormat = 'dd.MM';
  const dateButtons = new Array(days)
      .fill(startDate)
      .map((startDate, index) => {
        const date = add(startDate, { days: index });
        const formattedDate = format(date, dateFormat);
        return Markup.button.callback(formattedDate, `date_enter__${formattedDate}`)
      });

  return { ...Markup.inlineKeyboard(dateButtons) };
}

export const renderTimeButtons = () => {
  const timeList = ['10','11','12','17','18','19','20','21','22'];

  return {
    ...Markup.inlineKeyboard([
      timeList.map(time => Markup.button.callback(time, `time_enter__${time}`))
    ])
  }
};

export const renderGameTypeButtons = () => {

  return {
    ...Markup.inlineKeyboard([
      Object.values(GameType).map(type => Markup.button.callback(type, `type_enter__${type}`))
    ])
  }
};

export const renderGameLevelButtons = () => {

  return {
    ...Markup.inlineKeyboard([
      Object.values(GameLevel).map(level => Markup.button.callback(level, `level_enter__${level}`))
    ])
  }
};

export const renderCapacityButtons = () => {
  const capacityLimit = ['1','2','3','4','5','6','7','8'];

  return {
    ...Markup.inlineKeyboard([
      capacityLimit.map(participants => Markup.button.callback(participants, `capacity_enter__${participants}`))
    ])
  }
};
