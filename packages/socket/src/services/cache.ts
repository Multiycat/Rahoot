import { QuizzWithId, QuestionBankItem } from "@rahoot/common/types/game";

/**
 * Cache service pour optimiser les lectures filesystem
 * Réduit la charge I/O et améliore les performances
 */
class Cache {
  private static instance: Cache;
  private quizzCache: QuizzWithId[] | null = null;
  private questionBankCache: QuestionBankItem[] | null = null;
  private lastQuizzUpdate: number = 0;
  private lastQuestionBankUpdate: number = 0;

  // Cache TTL en millisecondes (5 minutes par défaut)
  private readonly CACHE_TTL = 5 * 60 * 1000;

  static getInstance(): Cache {
    if (!Cache.instance) {
      Cache.instance = new Cache();
    }
    return Cache.instance;
  }

  /**
   * Récupère les quizzes du cache ou recharge si expiré
   */
  getQuizzCache(): QuizzWithId[] | null {
    return this.quizzCache;
  }

  /**
   * Définit le cache des quizzes
   */
  setQuizzCache(quizz: QuizzWithId[]): void {
    this.quizzCache = quizz;
    this.lastQuizzUpdate = Date.now();
  }

  /**
   * Invalide le cache des quizzes
   */
  invalidateQuizzCache(): void {
    this.quizzCache = null;
    this.lastQuizzUpdate = 0;
  }

  /**
   * Vérifie si le cache des quizzes est valide
   */
  isQuizzCacheValid(): boolean {
    if (!this.quizzCache) return false;
    return Date.now() - this.lastQuizzUpdate < this.CACHE_TTL;
  }

  /**
   * Récupère la question bank du cache
   */
  getQuestionBankCache(): QuestionBankItem[] | null {
    return this.questionBankCache;
  }

  /**
   * Définit le cache de la question bank
   */
  setQuestionBankCache(items: QuestionBankItem[]): void {
    this.questionBankCache = items;
    this.lastQuestionBankUpdate = Date.now();
  }

  /**
   * Invalide le cache de la question bank
   */
  invalidateQuestionBankCache(): void {
    this.questionBankCache = null;
    this.lastQuestionBankUpdate = 0;
  }

  /**
   * Vérifie si le cache de la question bank est valide
   */
  isQuestionBankCacheValid(): boolean {
    if (!this.questionBankCache) return false;
    return Date.now() - this.lastQuestionBankUpdate < this.CACHE_TTL;
  }

  /**
   * Invalide tous les caches
   */
  invalidateAll(): void {
    this.invalidateQuizzCache();
    this.invalidateQuestionBankCache();
  }
}

export default Cache;
