import sleep from "@rahoot/socket/utils/sleep";

/**
 * Service optimisé pour gérer les cooldowns
 * Réduit le nombre de broadcasts en throttlant les mises à jour
 */
class CooldownManager {
  /**
   * Démarre un cooldown avec broadcasts throttled
   * Envoie un message seulement chaque seconde au lieu de chaque 100ms
   */
  static async startOptimizedCooldown(
    seconds: number,
    onTick: (count: number) => void,
  ): Promise<void> {
    let count = seconds - 1;

    while (count > 0 && count >= 0) {
      onTick(count);
      count -= 1;
      await sleep(1); // Attend 1 seconde complète
    }

    onTick(0); // Envoyer la dernière mise à jour
  }

  /**
   * Démarre un cooldown avec increment rapide mais broadcasts throttled
   * Utile pour les animations côté client
   */
  static async startSmartCooldown(
    seconds: number,
    onTick: (count: number) => void,
    ticksPerSecond: number = 4, // Envoyer 4 mises à jour par seconde max
  ): Promise<void> {
    const tickInterval = 1000 / ticksPerSecond;
    let elapsed = 0;
    const totalMs = seconds * 1000;

    while (elapsed < totalMs) {
      const remaining = Math.ceil((totalMs - elapsed) / 1000);
      onTick(remaining);
      await sleep(tickInterval / 1000); // Convertir ms en secondes
      elapsed += tickInterval;
    }

    onTick(0);
  }
}

export default CooldownManager;
