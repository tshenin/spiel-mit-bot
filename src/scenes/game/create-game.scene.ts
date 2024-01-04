import {Scenes, Telegraf} from "telegraf";
import {getYear, setHours} from "date-fns";
import {
  renderCapacityButtons,
  renderDateButtons,
  renderGameLevelButtons,
  renderGameTypeButtons,
  renderTimeButtons,
  renderYesNoButtons,
} from "../../markup/buttons.js";
import {GameLevel, GameType} from "../../schemas/game.schema.js";
import {addGame} from "../../services/games.service.js";

export const createGameSceneRun = () => {
  // todo coach это тот кто создает игру
  const createGameScene = new Scenes.BaseScene<Scenes.SceneContext>("create_game");
  // todo показать кнопки даты
  createGameScene.enter(ctx => {
    ctx.session['myData'] = {}
    ctx.reply("Выберите день", {
          ...renderDateButtons(new Date())
        })
  });

  // todo показать кнопки времени
  createGameScene.action(/date_enter__(.+)/, (ctx) => {
    const day = ctx.match.at(1);
    ctx.session['myData'].day = day;

    ctx.reply("Выберите время", renderTimeButtons());
  });

  // todo показать типы игр
  createGameScene.action(/time_enter__(.+)/, (ctx) => {
    ctx.session['myData'].time = ctx.match.at(1);

    ctx.reply("Выберите тип игры", renderGameTypeButtons());
  });

  // todo показать кнопки уровней
  createGameScene.action(/type_enter__(.+)/, (ctx) => {
    ctx.session['myData'].type = ctx.match.at(1) as GameType;

    ctx.reply("Выберите уровень", renderGameLevelButtons());
  });

  // todo показать кнопки кол-ва мест 1-10
  createGameScene.action(/level_enter__(.+)/, (ctx) => {
    ctx.session['myData'].level = ctx.match.at(1) as GameLevel;
    ctx.reply("Сколько мест", renderCapacityButtons())
  });

  // todo показать кнопку создать и все описание тренировки
  createGameScene.action(/capacity_enter__(.+)/, async ctx => {
    ctx.session['myData'].capacity = Number(ctx.match.at(1));

    const { first_name, last_name } = ctx.update.callback_query.from;
    ctx.session['myData'].coach = `${first_name} ${last_name}`

    const { day, time, coach, level, type, capacity } = ctx.session['myData'];

    let message = `Дата: ${day} ${time}:00\n`;
    message =  message + `Тренер: ${coach}\n`
    message = message + `Уровень: ${level}\n`
    message = message + `Тип: ${type}\n`
    message = message + `Численность: ${capacity}\n`

    await ctx.reply(message, renderYesNoButtons(['Создать', 'Отменить'], 'create'));
  });

  createGameScene.action("create__yes", async ctx => {
    const { day, time, coach, level, type, capacity } = ctx.session['myData'];

    try {
      const [dayOfMonth, month] = day.split('.');
      const year = getYear(new Date());
      const date = setHours(new Date(year, month - 1, dayOfMonth), time);

      await addGame({ date, coach, capacity, type, level, participants: [] });

      ctx.reply("Сохранено");
    } catch (e) {
      console.error(e)
      ctx.reply("Что-то пошло не так, попробуйте повторить");
    }

    ctx.scene.leave();
  });

  createGameScene.action("create__no", (ctx) => {
    ctx.reply("Отменено");
    ctx.scene.leave();
  });

  return createGameScene;
}

export const setCreateGameSceneListener = (bot: Telegraf<Scenes.SceneContext>) => {
  bot.command('create_game', ctx => ctx.scene.enter('create_game'));
}
