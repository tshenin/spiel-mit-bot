import {Scenes, Telegraf} from "telegraf";
import {getGames} from "./games.service.js";
import {getParticipants} from "./participants.service.js";
import {format, getTime} from "date-fns";

export const bot = new Telegraf<Scenes.SceneContext>(process.env.TOKEN);

let gameNotifier;

export const runGameNotifier = async () => {
  const HOUR = 3600000;
  const HALF_HOUR = 180000;

  if (!gameNotifier) {
    try {
      gameNotifier = setInterval(async () => {
        const games = await getGames();

        games.forEach(async ({_id, date}) => {
          if (getTime(date) < (getTime(new Date()) + HOUR)) {
            const participant = await getParticipants(_id);

            const dateFormated = format(date, 'dd.MM k:mm')
            bot.telegram.sendMessage(
              participant.at(0).chatId,
                `${dateFormated} начинается тренировка, удачной игры`
            )
          }
        });
        }, HALF_HOUR)
    }
    catch (e) {
      console.error('Ошибка уведомления', e);
    }
  }
}
