import { Server, Socket } from "@rahoot/common/types/game/socket";

/**
 * Service pour optimiser les broadcasts WebSocket
 * - Throttle les messages fréquents
 * - Batch les mises à jour
 * - Déduplique les messages
 */
class BroadcastOptimizer {
  private lastBroadcast: Map<string, { time: number; data: any }> = new Map();
  private throttleMs: number = 100; // Minimal 100ms entre les broadcasts du même type

  /**
   * Envoie un message avec throttling
   * Évite d'envoyer le même type de message trop souvent
   */
  throttledBroadcast(
    io: Server,
    room: string,
    event: string,
    data: any,
  ): boolean {
    const key = `${room}:${event}`;
    const now = Date.now();
    const last = this.lastBroadcast.get(key);

    // Si pas d'envoi précédent ou throttle expiré
    if (!last || now - last.time >= this.throttleMs) {
      this.lastBroadcast.set(key, { time: now, data });
      (io.to(room) as any).emit(event, data);
      return true;
    }

    // Si les données sont différentes, forcer l'envoi
    if (JSON.stringify(last.data) !== JSON.stringify(data)) {
      this.lastBroadcast.set(key, { time: now, data });
      (io.to(room) as any).emit(event, data);
      return true;
    }

    return false;
  }

  /**
   * Envoie un message avec déduplication complète
   * Ne l'envoie que si les données ont changé
   */
  dedupedBroadcast(
    io: Server,
    room: string,
    event: string,
    data: any,
  ): boolean {
    const key = `${room}:${event}`;
    const last = this.lastBroadcast.get(key);

    // Comparer avec le dernier envoi
    if (last && JSON.stringify(last.data) === JSON.stringify(data)) {
      return false;
    }

    this.lastBroadcast.set(key, { time: Date.now(), data });
    (io.to(room) as any).emit(event, data);
    return true;
  }

  /**
   * Envoie directement au socket sans throttling
   */
  directEmit(socket: Socket, event: string, data: any): void {
    (socket as any).emit(event, data);
  }

  /**
   * Invalide tous les throttles (utiliser après changement critique)
   */
  reset(): void {
    this.lastBroadcast.clear();
  }

  /**
   * Invalide un throttle spécifique
   */
  resetKey(room: string, event: string): void {
    const key = `${room}:${event}`;
    this.lastBroadcast.delete(key);
  }
}

export default BroadcastOptimizer;
