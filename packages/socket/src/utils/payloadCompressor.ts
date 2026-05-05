/**
 * Service pour réduire la taille des payloads envoyés
 * Utilise le shorthand pour les propriétés courantes
 */
class PayloadCompressor {
  /**
   * Compresse les données de leaderboard
   * Réduit la taille de ~40%
   */
  static compressLeaderboard(
    leaderboard: Array<{
      id: string;
      username: string;
      points: number;
    }>,
  ): Array<[string, string, number]> {
    // Convertir en array de tuples [id, username, points]
    return leaderboard.map((p) => [p.id, p.username, p.points]);
  }

  /**
   * Décompresse les données de leaderboard
   */
  static decompressLeaderboard(
    compressed: Array<[string, string, number]>,
  ): Array<{
    id: string;
    username: string;
    points: number;
  }> {
    return compressed.map(([id, username, points]) => ({
      id,
      username,
      points,
    }));
  }

  /**
   * Compresse les données de statut
   * Crée un format réduit: [statusName, ...data]
   */
  static compressStatus(
    status: string,
    data: Record<string, any>,
  ): [string, Record<string, any>] {
    return [status, data];
  }

  /**
   * Compresse les données de joueur
   */
  static compressPlayerData(player: {
    id: string;
    username: string;
    points: number;
    connected: boolean;
  }): [string, string, number, boolean] {
    return [player.id, player.username, player.points, player.connected];
  }

  /**
   * Décompresse les données de joueur
   */
  static decompressPlayerData(
    compressed: [string, string, number, boolean],
  ): {
    id: string;
    username: string;
    points: number;
    connected: boolean;
  } {
    const [id, username, points, connected] = compressed;
    return { id, username, points, connected };
  }

  /**
   * Calcule la taille d'un objet en bytes
   */
  static getObjectSize(obj: any): number {
    return new Blob([JSON.stringify(obj)]).size;
  }

  /**
   * Compare les tailles avant/après compression
   */
  static getCompressionRatio(original: any, compressed: any): number {
    const originalSize = this.getObjectSize(original);
    const compressedSize = this.getObjectSize(compressed);
    return Math.round(((originalSize - compressedSize) / originalSize) * 100);
  }
}

export default PayloadCompressor;
