import { Server } from "@rahoot/common/types/game/socket";
import BroadcastOptimizer from "@rahoot/socket/utils/broadcastOptimizer";

/**
 * Service pour gérer les mises à jour par lot
 * Regroupe plusieurs mises à jour en un seul broadcast
 */
class BatchUpdateManager {
  private pendingUpdates: Map<
    string,
    Map<string, { data: any; priority: number }>
  > = new Map();
  private updateTimeout: Map<string, NodeJS.Timeout> = new Map();
  private readonly BATCH_WINDOW_MS = 50; // Regrouper les mises à jour sur 50ms

  /**
   * Ajoute une mise à jour à la file d'attente
   * Les mises à jour avec priorité haute sont envoyées immédiatement
   */
  scheduleUpdate(
    io: Server,
    room: string,
    eventKey: string,
    data: any,
    priority: "low" | "high" = "low",
  ): void {
    if (!this.pendingUpdates.has(room)) {
      this.pendingUpdates.set(room, new Map());
    }

    const roomUpdates = this.pendingUpdates.get(room)!;
    roomUpdates.set(eventKey, { data, priority: priority === "high" ? 1 : 0 });

    // Annuler le timeout existant s'il y en a un
    if (this.updateTimeout.has(room)) {
      clearTimeout(this.updateTimeout.get(room)!);
    }

    // Envoyer immédiatement si priorité haute
    if (priority === "high") {
      this.flushUpdates(io, room);
      return;
    }

    // Sinon, envoyer après BATCH_WINDOW_MS
    const timeout = setTimeout(() => {
      this.flushUpdates(io, room);
    }, this.BATCH_WINDOW_MS);

    this.updateTimeout.set(room, timeout);
  }

  /**
   * Envoie toutes les mises à jour en attente pour une room
   */
  private flushUpdates(io: Server, room: string): void {
    const updates = this.pendingUpdates.get(room);
    if (!updates || updates.size === 0) {
      return;
    }

    // Envoyer chaque mise à jour
    updates.forEach(({ data }, eventKey) => {
      (io.to(room) as any).emit(eventKey, data);
    });

    this.pendingUpdates.delete(room);
    this.updateTimeout.delete(room);
  }

  /**
   * Force l'envoi des mises à jour en attente
   */
  flush(io: Server, room: string): void {
    this.flushUpdates(io, room);
  }

  /**
   * Nettoie une room
   */
  cleanup(room: string): void {
    const timeout = this.updateTimeout.get(room);
    if (timeout) {
      clearTimeout(timeout);
      this.updateTimeout.delete(room);
    }
    this.pendingUpdates.delete(room);
  }
}

export default BatchUpdateManager;
