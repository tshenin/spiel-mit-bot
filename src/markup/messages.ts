import {GameDocument} from '../schemas/game.schema.js';
import {ParticipantDocument} from '../schemas/participant.schema.js';
import {addMinutes, format } from 'date-fns';

export const renderGameMessage = (game: GameDocument): string => {

  const [hours, minutes] = game.duration.split(':');
  const addedTime =  Number(hours) * 60 + (Number(minutes) || 0);
  const finishedTime = format(addMinutes(game.date, addedTime), 'k:mm');

  let message = `Тренер: <b>${game.coach}</b> - <b>${game.price}</b>\n`;
  message += `Дата: <b>${format(game.date, 'dd.MM.yyyy k:mm')}</b> - <b>${finishedTime}</b>\n`;
  message += `Место: <b>${game.place}</b>\n`;
  message += `Уровень: <b>${game.level}</b>\n`;
  message += `Участников: <b>${game.participants?.length}/${game.capacity}</b>`;
  return message;
};

export const renderQueueMessage = (game: GameDocument): string => {
  let message = `Вы были переведены из листа ожидания в основную группу участиков.`;
  message += `Дата: <b>${format(game.date, 'dd.MM.yyyy k:mm')}</b>\n`;
  message += `Участников: <b>${game.participants?.length}/${game.capacity}</b>`;
  return message;
};

export const renderParticipantsMessage = (
  game: GameDocument,
  participants: ParticipantDocument[],
): string => {
  if (!participants.length) {
    return 'Пока никого нет';
  }
  let message = renderGameMessage(game) + '\n\n';
  message += participants
    .map((p, index) => {
      let message = index === 0 ? '<b>Участники</b>\n' : '';
      message += index === game.capacity ? '<b>В листе ожидания</b>\n' : '';
      message += p.name;
      return message;
    })
    .join('\n');

  return message;
};
