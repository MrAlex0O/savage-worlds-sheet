import { Edge, Language } from '../../types/character';
import { fetchFromPostgrest } from './basePostgrestRepository';
import { mapEdgeFromDb, EdgeDb } from './edgeMappers';

export class EdgesPostgrestRepository {
  private static instance: EdgesPostgrestRepository;

  private constructor() {}

  public static getInstance(): EdgesPostgrestRepository {
    if (!EdgesPostgrestRepository.instance) {
      EdgesPostgrestRepository.instance = new EdgesPostgrestRepository();
    }
    return EdgesPostgrestRepository.instance;
  }

  public async getEdges(language: Language): Promise<Edge[]> {
    const dbEdges = await fetchFromPostgrest<EdgeDb>('edges', { language });
    return dbEdges.map(mapEdgeFromDb);
  }

  public async getEdgeByName(name: string, language: Language): Promise<Edge | undefined> {
    const dbEdges = await fetchFromPostgrest<EdgeDb>('edges', { name, language });
    return dbEdges.length > 0 ? mapEdgeFromDb(dbEdges[0]) : undefined;
  }
} 