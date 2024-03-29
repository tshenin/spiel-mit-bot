import {GameDocument} from '../schemas/game.schema.js';
import {ParticipantDocument} from '../schemas/participant.schema.js';
import {add, format} from 'date-fns';

export const renderGameMessage = (game: GameDocument): string => {
  const [hours, minutes] = game.duration.split(':');
  const finishedTime = format(add(game.date, { hours: Number(hours), minutes: Number(minutes) }), 'k:mm');

  let message = `Тренер: <b>${game.coach}</b>\n`;
  message += `Дата: <b>${format(game.date, 'dd.MM.yyyy k:mm')}</b> - <b>${finishedTime}</b>\n`;
  message += `Место: <b>${game.place}</b>\n`;
  message += `Уровень: <b>${game.level}</b>\n`;
  message += `Стоимость: <b>${game.price}</b>\n`;
  message += `Тип: <b>${game.type}</b>\n`;
  message += `Участников: <b>${game.participants?.length}/${game.capacity}</b>`;
  return message;
};

export const renderQueueMessage = (game: GameDocument): string => {
  let message = `Вы были переведены из листа ожидания в основную группу участиков.\n`;
  message += `Дата: <b>${format(game.date, 'dd.MM.yyyy k:mm')}</b>\n`;
  message += `Место: <b>${game.place}</b>\n`;
  
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
      message += `${p.name}`;

      return message;
    })
    .join('\n');

  return message;
};
