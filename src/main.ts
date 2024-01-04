import 'dotenv/config';
import { connect } from 'mongoose';

import { addGame } from './services/games.service.js';
import {bot, runGameNotifier} from './services/bot.service.js';
import {
  createGameSceneRun,
  setCreateGameSceneListener,
} from './scenes/game/create-game.scene.js';
import { Scenes, session } from 'telegraf';
import {
  joinGameSceneRun,
  setJoinGameSceneListener,
} from './scenes/game/join-game.scene.js';
import {
  setShowParticipantsSceneListener,
  showParticipantsSceneRun,
} from './scenes/participant/show-participants.scene.js';
import { message } from 'telegraf/filters';
import { GAMES } from './data.js';
import {
  setShowGamesSceneListener,
  showGamesSceneRun,
} from './scenes/game/show-games.scene.js';
import {
  setShowMyGamesSceneListener,
  showMyGamesSceneRun,
} from './scenes/game/show-my-games.scene.js';
import {
  leaveGameSceneRun,
  setLeaveGameSceneListener,
} from './scenes/game/leave-game.scene.js';
import {isAdmin} from "./services/utils.js";
import {
  removeGameSceneRun,
  setRemoveGameSceneListener
} from "./scenes/game/remove-game.scene.js";

dbConnection().catch((err) => console.log('mongoose', err));

async function dbConnection(): Promise<void> {
  await connect(`mongodb://localhost:27017/${process.env.DB_NAME}`);
}

// set all scenes
const stage = new Scenes.Stage<Scenes.SceneContext>([
  createGameSceneRun(),
  joinGameSceneRun(),
  showParticipantsSceneRun(),
  showGamesSceneRun(),
  showMyGamesSceneRun(),
  leaveGameSceneRun(),
  removeGameSceneRun(),
]);
bot.use(session());
bot.use(stage.middleware());

// set all scenes listeners
setCreateGameSceneListener(bot);
setJoinGameSceneListener(bot);
setShowParticipantsSceneListener(bot);
setShowGamesSceneListener(bot);
setShowMyGamesSceneListener(bot);
setLeaveGameSceneListener(bot);
setRemoveGameSceneListener(bot);

runGameNotifier();

bot.start(async (ctx) => {
  const commands = [
    { command: 'show_games', description: 'Показать доступные игры' },
    { command: 'my_games', description: 'Показать мои игры' },
  ];

  // if user is admin
  if (isAdmin(ctx.update.message.from.username)) {
    commands.push({
      command: 'create_game', description: 'Создать игру'
    });
  }

  await ctx.setMyCommands(commands);
});

bot.on(message('text'), async (ctx) => {
  if (ctx.message.text === 'mock games') {
    GAMES.forEach((game) => {
      addGame(game);
    });
  }
});

bot.launch();

// Enable graceful stop
process.once('SIGINT', () => bot.stop('SIGINT'));
process.once('SIGTERM', () => bot.stop('SIGTERM'));
