import { Server } from "@rahoot/common/types/game/socket";
import { inviteCodeValidator } from "@rahoot/common/validators/auth";
import Config from "@rahoot/socket/services/config";
import Game from "@rahoot/socket/services/game";
import Registry from "@rahoot/socket/services/registry";
import { withGame } from "@rahoot/socket/utils/game";
import { Server as ServerIO } from "socket.io";

const WS_PORT = 3003;

// Get allowed origin from environment or use default
const ALLOWED_ORIGINS = (
  process.env.ALLOWED_ORIGINS ||
  "https://rahoot.multiycat.fr,http://localhost:8008,http://localhost:3000"
)
  .split(",")
  .map((origin) => origin.trim());

const io: Server = new ServerIO({
  cors: {
    origin: ALLOWED_ORIGINS,
    credentials: true,
  },
  path: "/ws",
  maxHttpBufferSize: 100 * 1024 * 1024, // 100MB to allow large audio files in base64
});
Config.init();

const registry = Registry.getInstance();

// Display splash screen
const splashScreen = `
╔════════════════════════════════════════════════════╗
║                                                    ║
║          ██████╗  █████╗ ██╗  ██╗ ██████╗ ██████╗ ║
║          ██╔══██╗██╔══██╗██║  ██║██╔═══██╗██╔══██╗║
║          ██████╔╝███████║███████║██║   ██║██████╔╝║
║          ██╔══██╗██╔══██║██╔══██║██║   ██║██╔══██╗║
║          ██║  ██║██║  ██║██║  ██║╚██████╔╝██║  ██║║
║          ╚═╝  ╚═╝╚═╝  ╚═╝╚═╝  ╚═╝ ╚═════╝ ╚═╝  ╚═╝║
║                                                    ║
║                  by Multiycat                     ║
║                                                    ║
╚════════════════════════════════════════════════════╝
`;

console.log(splashScreen);
console.log(`Socket server running on port ${WS_PORT}`);
io.listen(WS_PORT);

io.on("connection", (socket) => {
  console.log(
    `A user connected: socketId: ${socket.id}, clientId: ${socket.handshake.auth.clientId}`,
  );

  socket.on("player:reconnect", ({ gameId }) => {
    const game = registry.getPlayerGame(gameId, socket.handshake.auth.clientId);

    if (game) {
      game.reconnect(socket);

      return;
    }

    socket.emit("game:reset", "Game not found");
  });

  socket.on("manager:reconnect", ({ gameId }) => {
    const game = registry.getManagerGame(
      gameId,
      socket.handshake.auth.clientId,
    );

    if (game) {
      game.reconnect(socket);

      return;
    }

    socket.emit("game:reset", "Game expired");
  });

  socket.on("manager:auth", (password) => {
    try {
      const config = Config.game();

      if (config.managerPassword === "PASSWORD") {
        socket.emit(
          "manager:errorMessage",
          "Manager password is not configured",
        );

        return;
      }

      if (password !== config.managerPassword) {
        socket.emit("manager:errorMessage", "Invalid password");

        return;
      }

      socket.emit("manager:quizzList", Config.quizz());
    } catch (error) {
      console.error("Failed to read game config:", error);
      socket.emit("manager:errorMessage", "Failed to read game config");
    }
  });

  socket.on("game:create", (quizzId) => {
    const quizzList = Config.quizz();
    const quizz = quizzList.find((q) => q.id === quizzId);

    if (!quizz) {
      socket.emit("game:errorMessage", "Quizz not found");

      return;
    }

    const game = new Game(io, socket, quizz, quizzId);
    registry.addGame(game);
  });

  socket.on("manager:saveQuizz", (quizz) => {
    // Validate the quizz
    if (
      !quizz ||
      !quizz.subject ||
      !quizz.questions ||
      quizz.questions.length === 0
    ) {
      socket.emit("manager:errorMessage", "Invalid quizz data");

      return;
    }

    // Validate each question
    for (const question of quizz.questions) {
      if (
        !question.question ||
        !question.answers ||
        question.answers.length < 2
      ) {
        socket.emit("manager:errorMessage", "Invalid question data");

        return;
      }

      if (
        question.solution < 0 ||
        question.solution >= question.answers.length
      ) {
        socket.emit("manager:errorMessage", "Invalid solution index");

        return;
      }
    }

    try {
      const savedQuizz = Config.saveQuizz(quizz);
      socket.emit("manager:quizzSaved", savedQuizz);

      // Also send updated quizz list
      socket.emit("manager:quizzList", Config.quizz());

      console.log(
        `Quizz saved: ${quizz.subject} with ${quizz.questions.length} questions`,
      );
    } catch (error) {
      console.error("Failed to save quizz:", error);
      socket.emit("manager:errorMessage", "Failed to save quizz");
    }
  });

  socket.on("manager:getQuestionBank", () => {
    socket.emit("manager:questionBankList", Config.questionBank());
  });

  socket.on("manager:saveQuestionBankItem", (question) => {
    if (
      !question ||
      !question.question ||
      !question.answers ||
      question.answers.length < 2
    ) {
      socket.emit("manager:errorMessage", "Invalid question for bank");

      return;
    }

    const item = Config.saveQuestionBankItem(question);
    socket.emit("manager:questionBankSaved", item);
    socket.emit("manager:questionBankList", Config.questionBank());
  });

  socket.on("manager:deleteQuestionBankItem", (id) => {
    const deleted = Config.deleteQuestionBankItem(id);

    if (!deleted) {
      socket.emit("manager:errorMessage", "Question bank item not found");

      return;
    }

    socket.emit("manager:questionBankDeleted", id);
    socket.emit("manager:questionBankList", Config.questionBank());
  });

  socket.on("manager:updateQuizz", ({ quizzId, quizz }) => {
    if (!quizzId) {
      socket.emit("manager:errorMessage", "Invalid quizz id");

      return;
    }

    if (
      !quizz ||
      !quizz.subject ||
      !quizz.questions ||
      quizz.questions.length === 0
    ) {
      socket.emit("manager:errorMessage", "Invalid quizz data");

      return;
    }

    for (const question of quizz.questions) {
      if (
        !question.question ||
        !question.answers ||
        question.answers.length < 2
      ) {
        socket.emit("manager:errorMessage", "Invalid question data");

        return;
      }

      if (
        question.solution < 0 ||
        question.solution >= question.answers.length
      ) {
        socket.emit("manager:errorMessage", "Invalid solution index");

        return;
      }
    }

    try {
      const updatedQuizz = Config.updateQuizz(quizzId, quizz);

      if (!updatedQuizz) {
        socket.emit("manager:errorMessage", "Quizz not found");

        return;
      }

      socket.emit("manager:quizzUpdated", updatedQuizz);
      socket.emit("manager:quizzList", Config.quizz());

      console.log(`Quizz updated: ${quizz.subject} (${quizzId})`);
    } catch (error) {
      console.error("Failed to update quizz:", error);
      socket.emit("manager:errorMessage", "Failed to update quizz");
    }
  });

  socket.on("manager:deleteQuizz", (quizzId) => {
    try {
      const deleted = Config.deleteQuizz(quizzId);

      if (!deleted) {
        socket.emit("manager:errorMessage", "Quizz not found");

        return;
      }

      socket.emit("manager:quizzDeleted", quizzId);

      // Also send updated quizz list
      socket.emit("manager:quizzList", Config.quizz());

      console.log(`Quizz deleted: ${quizzId}`);
    } catch (error) {
      console.error("Failed to delete quizz:", error);
      socket.emit("manager:errorMessage", "Failed to delete quizz");
    }
  });

  socket.on("player:join", (inviteCode) => {
    const result = inviteCodeValidator.safeParse(inviteCode);

    if (result.error) {
      socket.emit("game:errorMessage", result.error.issues[0].message);

      return;
    }

    const game = registry.getGameByInviteCode(inviteCode);

    if (!game) {
      socket.emit("game:errorMessage", "Game not found");

      return;
    }

    socket.emit("game:successRoom", game.gameId);
  });

  socket.on("player:login", ({ gameId, data }) =>
    withGame(gameId, socket, (game) => game.join(socket, data.username)),
  );

  socket.on("manager:kickPlayer", ({ gameId, playerId }) =>
    withGame(gameId, socket, (game) => game.kickPlayer(socket, playerId)),
  );

  socket.on("manager:startGame", ({ gameId }) =>
    withGame(gameId, socket, (game) => game.start(socket)),
  );

  socket.on("player:selectedAnswer", ({ gameId, data }) =>
    withGame(gameId, socket, (game) =>
      game.selectAnswer(socket, data.answerKey),
    ),
  );

  socket.on("manager:abortQuiz", ({ gameId }) =>
    withGame(gameId, socket, (game) => game.abortRound(socket)),
  );

  socket.on("manager:nextQuestion", ({ gameId }) =>
    withGame(gameId, socket, (game) => game.nextRound(socket)),
  );

  socket.on("manager:showLeaderboard", ({ gameId }) =>
    withGame(gameId, socket, (game) => game.showLeaderboard()),
  );

  socket.on("manager:requestFeedback", ({ gameId, data }) =>
    withGame(gameId, socket, (game) => game.requestFeedback(socket, data.question)),
  );

   socket.on("player:feedback", ({ gameId, data }) =>
     withGame(gameId, socket, (game) => game.recordFeedback(socket, data.rating)),
   );

   socket.on("manager:closeFeedback", ({ gameId }) =>
     withGame(gameId, socket, (game) => game.closeFeedback(socket)),
   );

   socket.on("manager:setQuizzTheme", ({ gameId, theme }) =>
     withGame(gameId, socket, (game) => game.setTheme(socket, theme)),
   );

  socket.on("disconnect", () => {
    console.log(`A user disconnected : ${socket.id}`);

    const managerGame = registry.getGameByManagerSocketId(socket.id);

    if (managerGame) {
      managerGame.manager.connected = false;
      registry.markGameAsEmpty(managerGame);

      if (!managerGame.started) {
        console.log("Reset game (manager disconnected)");
        managerGame.abortCooldown();
        io.to(managerGame.gameId).emit("game:reset", "Manager disconnected");
        registry.removeGame(managerGame.gameId);

        return;
      }
    }

    const game = registry.getGameByPlayerSocketId(socket.id);

    if (!game) {
      return;
    }

    const player = game.players.find((p) => p.id === socket.id);

    if (!player) {
      return;
    }

    if (!game.started) {
      game.players = game.players.filter((p) => p.id !== socket.id);

      io.to(game.manager.id).emit("manager:removePlayer", player.id);
      io.to(game.gameId).emit("game:totalPlayers", game.players.length);

      console.log(`Removed player ${player.username} from game ${game.gameId}`);

      return;
    }

    player.connected = false;
    io.to(game.gameId).emit("game:totalPlayers", game.players.length);
  });
});

process.on("SIGINT", () => {
  Registry.getInstance().cleanup();
  process.exit(0);
});

process.on("SIGTERM", () => {
  Registry.getInstance().cleanup();
  process.exit(0);
});
