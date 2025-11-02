import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { 
  insertProjectSchema,
  insertAssetSchema,
  insertTrackSchema,
  insertClipSchema,
  insertExportJobSchema
} from "@shared/schema";
import { fromZodError } from "zod-validation-error";

export async function registerRoutes(app: Express): Promise<Server> {
  // Projects
  app.get("/api/projects", async (req, res) => {
    try {
      const projects = await storage.getAllProjects();
      res.json(projects);
    } catch (error: any) {
      res.status(500).json({ message: "Failed to fetch projects", error: error.message });
    }
  });

  app.get("/api/projects/:id", async (req, res) => {
    try {
      const project = await storage.getProject(req.params.id);
      if (!project) {
        return res.status(404).json({ message: "Project not found" });
      }
      res.json(project);
    } catch (error: any) {
      res.status(500).json({ message: "Failed to fetch project", error: error.message });
    }
  });

  app.post("/api/projects", async (req, res) => {
    try {
      const result = insertProjectSchema.safeParse(req.body);
      if (!result.success) {
        return res.status(400).json({ 
          message: "Validation error", 
          error: fromZodError(result.error).message 
        });
      }
      const project = await storage.createProject(result.data);
      res.status(201).json(project);
    } catch (error: any) {
      res.status(500).json({ message: "Failed to create project", error: error.message });
    }
  });

  app.patch("/api/projects/:id", async (req, res) => {
    try {
      const result = insertProjectSchema.partial().safeParse(req.body);
      if (!result.success) {
        return res.status(400).json({ 
          message: "Validation error", 
          error: fromZodError(result.error).message 
        });
      }
      const project = await storage.updateProject(req.params.id, result.data);
      if (!project) {
        return res.status(404).json({ message: "Project not found" });
      }
      res.json(project);
    } catch (error: any) {
      res.status(500).json({ message: "Failed to update project", error: error.message });
    }
  });

  app.delete("/api/projects/:id", async (req, res) => {
    try {
      const deleted = await storage.deleteProject(req.params.id);
      if (!deleted) {
        return res.status(404).json({ message: "Project not found" });
      }
      res.status(204).send();
    } catch (error: any) {
      res.status(500).json({ message: "Failed to delete project", error: error.message });
    }
  });

  // Assets
  app.get("/api/projects/:id/assets", async (req, res) => {
    try {
      const assets = await storage.getProjectAssets(req.params.id);
      res.json(assets);
    } catch (error: any) {
      res.status(500).json({ message: "Failed to fetch assets", error: error.message });
    }
  });

  app.get("/api/assets/:id", async (req, res) => {
    try {
      const asset = await storage.getAsset(req.params.id);
      if (!asset) {
        return res.status(404).json({ message: "Asset not found" });
      }
      res.json(asset);
    } catch (error: any) {
      res.status(500).json({ message: "Failed to fetch asset", error: error.message });
    }
  });

  app.post("/api/assets", async (req, res) => {
    try {
      const result = insertAssetSchema.safeParse(req.body);
      if (!result.success) {
        return res.status(400).json({ 
          message: "Validation error", 
          error: fromZodError(result.error).message 
        });
      }
      const asset = await storage.createAsset(result.data);
      res.status(201).json(asset);
    } catch (error: any) {
      res.status(500).json({ message: "Failed to create asset", error: error.message });
    }
  });

  app.delete("/api/assets/:id", async (req, res) => {
    try {
      const deleted = await storage.deleteAsset(req.params.id);
      if (!deleted) {
        return res.status(404).json({ message: "Asset not found" });
      }
      res.status(204).send();
    } catch (error: any) {
      res.status(500).json({ message: "Failed to delete asset", error: error.message });
    }
  });

  // Tracks
  app.get("/api/projects/:id/tracks", async (req, res) => {
    try {
      const tracks = await storage.getProjectTracks(req.params.id);
      res.json(tracks);
    } catch (error: any) {
      res.status(500).json({ message: "Failed to fetch tracks", error: error.message });
    }
  });

  app.get("/api/tracks/:id", async (req, res) => {
    try {
      const track = await storage.getTrack(req.params.id);
      if (!track) {
        return res.status(404).json({ message: "Track not found" });
      }
      res.json(track);
    } catch (error: any) {
      res.status(500).json({ message: "Failed to fetch track", error: error.message });
    }
  });

  app.post("/api/tracks", async (req, res) => {
    try {
      const result = insertTrackSchema.safeParse(req.body);
      if (!result.success) {
        return res.status(400).json({ 
          message: "Validation error", 
          error: fromZodError(result.error).message 
        });
      }
      const track = await storage.createTrack(result.data);
      res.status(201).json(track);
    } catch (error: any) {
      res.status(500).json({ message: "Failed to create track", error: error.message });
    }
  });

  app.patch("/api/tracks/:id", async (req, res) => {
    try {
      const result = insertTrackSchema.partial().safeParse(req.body);
      if (!result.success) {
        return res.status(400).json({ 
          message: "Validation error", 
          error: fromZodError(result.error).message 
        });
      }
      const track = await storage.updateTrack(req.params.id, result.data);
      if (!track) {
        return res.status(404).json({ message: "Track not found" });
      }
      res.json(track);
    } catch (error: any) {
      res.status(500).json({ message: "Failed to update track", error: error.message });
    }
  });

  app.delete("/api/tracks/:id", async (req, res) => {
    try {
      const deleted = await storage.deleteTrack(req.params.id);
      if (!deleted) {
        return res.status(404).json({ message: "Track not found" });
      }
      res.status(204).send();
    } catch (error: any) {
      res.status(500).json({ message: "Failed to delete track", error: error.message });
    }
  });

  // Clips
  app.get("/api/tracks/:id/clips", async (req, res) => {
    try {
      const clips = await storage.getTrackClips(req.params.id);
      res.json(clips);
    } catch (error: any) {
      res.status(500).json({ message: "Failed to fetch clips", error: error.message });
    }
  });

  app.get("/api/clips/:id", async (req, res) => {
    try {
      const clip = await storage.getClip(req.params.id);
      if (!clip) {
        return res.status(404).json({ message: "Clip not found" });
      }
      res.json(clip);
    } catch (error: any) {
      res.status(500).json({ message: "Failed to fetch clip", error: error.message });
    }
  });

  app.post("/api/clips", async (req, res) => {
    try {
      const result = insertClipSchema.safeParse(req.body);
      if (!result.success) {
        return res.status(400).json({ 
          message: "Validation error", 
          error: fromZodError(result.error).message 
        });
      }
      const clip = await storage.createClip(result.data);
      res.status(201).json(clip);
    } catch (error: any) {
      res.status(500).json({ message: "Failed to create clip", error: error.message });
    }
  });

  app.patch("/api/clips/:id", async (req, res) => {
    try {
      const result = insertClipSchema.partial().safeParse(req.body);
      if (!result.success) {
        return res.status(400).json({ 
          message: "Validation error", 
          error: fromZodError(result.error).message 
        });
      }
      const clip = await storage.updateClip(req.params.id, result.data);
      if (!clip) {
        return res.status(404).json({ message: "Clip not found" });
      }
      res.json(clip);
    } catch (error: any) {
      res.status(500).json({ message: "Failed to update clip", error: error.message });
    }
  });

  app.delete("/api/clips/:id", async (req, res) => {
    try {
      const deleted = await storage.deleteClip(req.params.id);
      if (!deleted) {
        return res.status(404).json({ message: "Clip not found" });
      }
      res.status(204).send();
    } catch (error: any) {
      res.status(500).json({ message: "Failed to delete clip", error: error.message });
    }
  });

  // Export Jobs
  app.get("/api/projects/:id/exports", async (req, res) => {
    try {
      const jobs = await storage.getProjectExportJobs(req.params.id);
      res.json(jobs);
    } catch (error: any) {
      res.status(500).json({ message: "Failed to fetch export jobs", error: error.message });
    }
  });

  app.get("/api/exports/:id", async (req, res) => {
    try {
      const job = await storage.getExportJob(req.params.id);
      if (!job) {
        return res.status(404).json({ message: "Export job not found" });
      }
      res.json(job);
    } catch (error: any) {
      res.status(500).json({ message: "Failed to fetch export job", error: error.message });
    }
  });

  app.post("/api/exports", async (req, res) => {
    try {
      const result = insertExportJobSchema.safeParse(req.body);
      if (!result.success) {
        return res.status(400).json({ 
          message: "Validation error", 
          error: fromZodError(result.error).message 
        });
      }
      const job = await storage.createExportJob(result.data);
      res.status(201).json(job);
    } catch (error: any) {
      res.status(500).json({ message: "Failed to create export job", error: error.message });
    }
  });

  app.patch("/api/exports/:id", async (req, res) => {
    try {
      const result = insertExportJobSchema.partial().safeParse(req.body);
      if (!result.success) {
        return res.status(400).json({ 
          message: "Validation error", 
          error: fromZodError(result.error).message 
        });
      }
      const job = await storage.updateExportJob(req.params.id, result.data);
      if (!job) {
        return res.status(404).json({ message: "Export job not found" });
      }
      res.json(job);
    } catch (error: any) {
      res.status(500).json({ message: "Failed to update export job", error: error.message });
    }
  });

  const httpServer = createServer(app);

  return httpServer;
}
