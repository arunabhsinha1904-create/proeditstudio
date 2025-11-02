import { 
  type Project, 
  type InsertProject,
  type Asset,
  type InsertAsset,
  type Track,
  type InsertTrack,
  type Clip,
  type InsertClip,
  type ExportJob,
  type InsertExportJob
} from "@shared/schema";
import { randomUUID } from "crypto";

export interface IStorage {
  // Projects
  getAllProjects(): Promise<Project[]>;
  getProject(id: string): Promise<Project | undefined>;
  createProject(project: InsertProject): Promise<Project>;
  updateProject(id: string, updates: Partial<InsertProject>): Promise<Project | undefined>;
  deleteProject(id: string): Promise<boolean>;

  // Assets
  getProjectAssets(projectId: string): Promise<Asset[]>;
  getAsset(id: string): Promise<Asset | undefined>;
  createAsset(asset: InsertAsset): Promise<Asset>;
  deleteAsset(id: string): Promise<boolean>;

  // Tracks
  getProjectTracks(projectId: string): Promise<Track[]>;
  getTrack(id: string): Promise<Track | undefined>;
  createTrack(track: InsertTrack): Promise<Track>;
  updateTrack(id: string, updates: Partial<InsertTrack>): Promise<Track | undefined>;
  deleteTrack(id: string): Promise<boolean>;

  // Clips
  getTrackClips(trackId: string): Promise<Clip[]>;
  getClip(id: string): Promise<Clip | undefined>;
  createClip(clip: InsertClip): Promise<Clip>;
  updateClip(id: string, updates: Partial<InsertClip>): Promise<Clip | undefined>;
  deleteClip(id: string): Promise<boolean>;

  // Export Jobs
  getProjectExportJobs(projectId: string): Promise<ExportJob[]>;
  getExportJob(id: string): Promise<ExportJob | undefined>;
  createExportJob(job: InsertExportJob): Promise<ExportJob>;
  updateExportJob(id: string, updates: Partial<InsertExportJob>): Promise<ExportJob | undefined>;
}

export class MemStorage implements IStorage {
  private projects: Map<string, Project>;
  private assets: Map<string, Asset>;
  private tracks: Map<string, Track>;
  private clips: Map<string, Clip>;
  private exportJobs: Map<string, ExportJob>;

  constructor() {
    this.projects = new Map();
    this.assets = new Map();
    this.tracks = new Map();
    this.clips = new Map();
    this.exportJobs = new Map();
  }

  // Projects
  async getAllProjects(): Promise<Project[]> {
    return Array.from(this.projects.values()).sort(
      (a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
    );
  }

  async getProject(id: string): Promise<Project | undefined> {
    return this.projects.get(id);
  }

  async createProject(insertProject: InsertProject): Promise<Project> {
    const id = randomUUID();
    const now = new Date();
    const project: Project = { 
      ...insertProject, 
      id,
      createdAt: now,
      updatedAt: now
    };
    this.projects.set(id, project);
    return project;
  }

  async updateProject(id: string, updates: Partial<InsertProject>): Promise<Project | undefined> {
    const project = this.projects.get(id);
    if (!project) return undefined;
    
    const updated: Project = { 
      ...project, 
      ...updates,
      updatedAt: new Date()
    };
    this.projects.set(id, updated);
    return updated;
  }

  async deleteProject(id: string): Promise<boolean> {
    // Delete associated assets, tracks, clips, and export jobs
    const assets = await this.getProjectAssets(id);
    for (const asset of assets) {
      await this.deleteAsset(asset.id);
    }

    const tracks = await this.getProjectTracks(id);
    for (const track of tracks) {
      await this.deleteTrack(track.id);
    }

    const jobs = await this.getProjectExportJobs(id);
    for (const job of jobs) {
      this.exportJobs.delete(job.id);
    }

    return this.projects.delete(id);
  }

  // Assets
  async getProjectAssets(projectId: string): Promise<Asset[]> {
    return Array.from(this.assets.values())
      .filter(asset => asset.projectId === projectId)
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }

  async getAsset(id: string): Promise<Asset | undefined> {
    return this.assets.get(id);
  }

  async createAsset(insertAsset: InsertAsset): Promise<Asset> {
    const id = randomUUID();
    const asset: Asset = { 
      ...insertAsset, 
      id,
      createdAt: new Date()
    };
    this.assets.set(id, asset);
    return asset;
  }

  async deleteAsset(id: string): Promise<boolean> {
    return this.assets.delete(id);
  }

  // Tracks
  async getProjectTracks(projectId: string): Promise<Track[]> {
    return Array.from(this.tracks.values())
      .filter(track => track.projectId === projectId)
      .sort((a, b) => a.order - b.order);
  }

  async getTrack(id: string): Promise<Track | undefined> {
    return this.tracks.get(id);
  }

  async createTrack(insertTrack: InsertTrack): Promise<Track> {
    const id = randomUUID();
    const track: Track = { ...insertTrack, id };
    this.tracks.set(id, track);
    return track;
  }

  async updateTrack(id: string, updates: Partial<InsertTrack>): Promise<Track | undefined> {
    const track = this.tracks.get(id);
    if (!track) return undefined;
    
    const updated: Track = { ...track, ...updates };
    this.tracks.set(id, updated);
    return updated;
  }

  async deleteTrack(id: string): Promise<boolean> {
    // Delete associated clips
    const clips = await this.getTrackClips(id);
    for (const clip of clips) {
      await this.deleteClip(clip.id);
    }
    return this.tracks.delete(id);
  }

  // Clips
  async getTrackClips(trackId: string): Promise<Clip[]> {
    return Array.from(this.clips.values())
      .filter(clip => clip.trackId === trackId)
      .sort((a, b) => a.startTime - b.startTime);
  }

  async getClip(id: string): Promise<Clip | undefined> {
    return this.clips.get(id);
  }

  async createClip(insertClip: InsertClip): Promise<Clip> {
    const id = randomUUID();
    const clip: Clip = { ...insertClip, id };
    this.clips.set(id, clip);
    return clip;
  }

  async updateClip(id: string, updates: Partial<InsertClip>): Promise<Clip | undefined> {
    const clip = this.clips.get(id);
    if (!clip) return undefined;
    
    const updated: Clip = { ...clip, ...updates };
    this.clips.set(id, updated);
    return updated;
  }

  async deleteClip(id: string): Promise<boolean> {
    return this.clips.delete(id);
  }

  // Export Jobs
  async getProjectExportJobs(projectId: string): Promise<ExportJob[]> {
    return Array.from(this.exportJobs.values())
      .filter(job => job.projectId === projectId)
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }

  async getExportJob(id: string): Promise<ExportJob | undefined> {
    return this.exportJobs.get(id);
  }

  async createExportJob(insertJob: InsertExportJob): Promise<ExportJob> {
    const id = randomUUID();
    const job: ExportJob = { 
      ...insertJob, 
      id,
      createdAt: new Date(),
      completedAt: null
    };
    this.exportJobs.set(id, job);
    return job;
  }

  async updateExportJob(id: string, updates: Partial<InsertExportJob>): Promise<ExportJob | undefined> {
    const job = this.exportJobs.get(id);
    if (!job) return undefined;
    
    const updated: ExportJob = { 
      ...job, 
      ...updates,
      completedAt: updates.status === 'completed' || updates.status === 'failed' 
        ? new Date() 
        : job.completedAt
    };
    this.exportJobs.set(id, updated);
    return updated;
  }
}

export const storage = new MemStorage();
