import type { Quizz, QuizzWithId } from "@rahoot/common/types/game";
import { STATUS } from "@rahoot/common/types/game/status";
import CreateQuizz from "@rahoot/web/features/game/components/create/CreateQuizz";
import ManagerPassword from "@rahoot/web/features/game/components/create/ManagerPassword";
import SelectQuizz from "@rahoot/web/features/game/components/create/SelectQuizz";
import {
  useEvent,
  useSocket,
} from "@rahoot/web/features/game/contexts/socketProvider";
import { useManagerStore } from "@rahoot/web/features/game/stores/manager";
import clsx from "clsx";
import { useState } from "react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router";

type Tab = "select" | "create";

const ManagerAuthPage = () => {
  const { setGameId, setStatus, setMusic } = useManagerStore();
  const navigate = useNavigate();
  const { socket } = useSocket();

  const [isAuth, setIsAuth] = useState(false);
  const [quizzList, setQuizzList] = useState<QuizzWithId[]>([]);
  const [activeTab, setActiveTab] = useState<Tab>("select");

  useEvent("manager:quizzList", (quizzList) => {
    setIsAuth(true);
    setQuizzList(quizzList);
  });

  useEvent("manager:gameCreated", ({ gameId, inviteCode, music }) => {
    setGameId(gameId);
    setMusic(music);
    setStatus(STATUS.SHOW_ROOM, {
      text: "Waiting for the players",
      inviteCode,
    });
    navigate(`/party/manager/${gameId}`);
  });

  useEvent("manager:quizzSaved", (quizz) => {
    toast.success(`Quizz "${quizz.subject}" saved!`);
    setActiveTab("select");
  });

  useEvent("manager:quizzDeleted", () => {
    toast.success("Quizz deleted!");
  });

  useEvent("manager:errorMessage", (message) => {
    toast.error(message);
  });

  const handleAuth = (password: string) => {
    socket?.emit("manager:auth", password);
  };

  const handleSelectQuizz = (quizzId: string) => {
    console.log("quizzId", quizzId);
    socket?.emit("game:create", quizzId);
  };

  const handleSaveQuizz = (quizz: Quizz) => {
    console.log("Saving quizz:", quizz);
    socket?.emit("manager:saveQuizz", quizz);
  };

  const handleDeleteQuizz = (quizzId: string) => {
    socket?.emit("manager:deleteQuizz", quizzId);
  };

  if (!isAuth) {
    return <ManagerPassword onSubmit={handleAuth} />;
  }

  return (
    <div className="z-10 flex w-full items-center justify-center max-w-6xl flex-col gap-4">
      {/* Tabs */}
      <div className="flex gap-2 rounded-md bg-white p-2 shadow-sm">
        <button
          onClick={() => setActiveTab("select")}
          className={clsx(
            "flex-1 rounded-md px-4 py-2 text-lg font-semibold transition-colors",
            activeTab === "select"
              ? "bg-primary text-white"
              : "bg-gray-100 text-gray-700 hover:bg-gray-200",
          )}
        >
          Select Quizz
        </button>
        <button
          onClick={() => setActiveTab("create")}
          className={clsx(
            "flex-1 rounded-md px-4 py-2 text-lg font-semibold transition-colors",
            activeTab === "create"
              ? "bg-primary text-white"
              : "bg-gray-100 text-gray-700 hover:bg-gray-200",
          )}
        >
          Create Quizz
        </button>
      </div>

      {/* Content */}
      {activeTab === "select" ? (
        <SelectQuizz
          quizzList={quizzList}
          onSelect={handleSelectQuizz}
          onDelete={handleDeleteQuizz}
        />
      ) : (
        <CreateQuizz
          onSubmit={handleSaveQuizz}
          onCancel={() => setActiveTab("select")}
        />
      )}
    </div>
  );
};

export default ManagerAuthPage;
