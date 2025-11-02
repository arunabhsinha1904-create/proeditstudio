import { pgTable, text, varchar, integer, timestamp, json, boolean } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Projects - video editing projects
export const projects = pgTable("projects", {
  id: varchar("id").primaryKey(),
  name: text("name").notNull(),
  aspectRatio: text("aspect_ratio").notNull().default("16:9"),
  resolution: text("resolution").notNull().default("1920x1080"),
  fps: integer("fps").notNull().default(30),
  duration: integer("duration").notNull().default(0), // in milliseconds
  thumbnailUrl: text("thumbnail_url"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

// Assets - uploaded media files
export const assets = pgTable("assets", {
  id: varchar("id").primaryKey(),
  projectId: varchar("project_id").notNull(),
  name: text("name").notNull(),
  type: text("type").notNull(), // 'video', 'audio', 'image'
  url: text("url").notNull(),
  duration: integer("duration"), // in milliseconds, null for images
  thumbnailUrl: text("thumbnail_url"),
  waveformData: text("waveform_data"), // JSON string for audio visualization
  fileSize: integer("file_size"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

// Tracks - timeline tracks (video, audio, text)
export const tracks = pgTable("tracks", {
  id: varchar("id").primaryKey(),
  projectId: varchar("project_id").notNull(),
  type: text("type").notNull(), // 'video', 'audio', 'text'
  order: integer("order").notNull(),
  locked: boolean("locked").notNull().default(false),
  muted: boolean("muted").notNull().default(false),
});

// Clips - individual clips on tracks
export const clips = pgTable("clips", {
  id: varchar("id").primaryKey(),
  trackId: varchar("track_id").notNull(),
  assetId: varchar("asset_id"), // null for text clips
  startTime: integer("start_time").notNull(), // position on timeline in ms
  duration: integer("duration").notNull(), // clip duration in ms
  trimStart: integer("trim_start").notNull().default(0), // trim from asset start in ms
  volume: integer("volume").notNull().default(100), // 0-100
  opacity: integer("opacity").notNull().default(100), // 0-100
  filters: text("filters"), // JSON string of applied filters
  textContent: text("text_content"), // for text clips
  textStyle: text("text_style"), // JSON string for text styling
});

// Export Jobs - track export history
export const exportJobs = pgTable("export_jobs", {
  id: varchar("id").primaryKey(),
  projectId: varchar("project_id").notNull(),
  status: text("status").notNull().default("pending"), // 'pending', 'processing', 'completed', 'failed'
  resolution: text("resolution").notNull(),
  format: text("format").notNull().default("mp4"),
  quality: text("quality").notNull().default("high"),
  outputUrl: text("output_url"),
  progress: integer("progress").notNull().default(0), // 0-100
  error: text("error"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  completedAt: timestamp("completed_at"),
});

// Insert schemas
export const insertProjectSchema = createInsertSchema(projects).omit({ id: true, createdAt: true, updatedAt: true });
export const insertAssetSchema = createInsertSchema(assets).omit({ id: true, createdAt: true });
export const insertTrackSchema = createInsertSchema(tracks).omit({ id: true });
export const insertClipSchema = createInsertSchema(clips).omit({ id: true });
export const insertExportJobSchema = createInsertSchema(exportJobs).omit({ id: true, createdAt: true, completedAt: true });

// Types
export type InsertProject = z.infer<typeof insertProjectSchema>;
export type Project = typeof projects.$inferSelect;

export type InsertAsset = z.infer<typeof insertAssetSchema>;
export type Asset = typeof assets.$inferSelect;

export type InsertTrack = z.infer<typeof insertTrackSchema>;
export type Track = typeof tracks.$inferSelect;

export type InsertClip = z.infer<typeof insertClipSchema>;
export type Clip = typeof clips.$inferSelect;

export type InsertExportJob = z.infer<typeof insertExportJobSchema>;
export type ExportJob = typeof exportJobs.$inferSelect;
