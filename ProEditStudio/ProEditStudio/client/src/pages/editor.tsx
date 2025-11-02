import { useParams } from "wouter";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ThemeToggle } from "@/components/theme-toggle";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import {
  Play,
  Pause,
  SkipBack,
  SkipForward,
  Upload,
  Video,
  Music,
  Type,
  Sparkles,
  Download,
  ArrowLeft,
  Scissors,
  Layers,
  Volume2,
  Image as ImageIcon,
  Plus,
  Trash2,
} from "lucide-react";
import { Link } from "wouter";
import { useState, useEffect } from "react";
import type { Project, Asset, Track, Clip } from "@shared/schema";

export default function Editor() {
  const { id } = useParams<{ id: string }>();
  const { toast } = useToast();
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [newTrackType, setNewTrackType] = useState<"video" | "audio" | "text">("video");

  const { data: project, isLoading } = useQuery<Project>({
    queryKey: ["/api/projects", id],
  });

  const { data: assets = [] } = useQuery<Asset[]>({
    queryKey: ["/api/projects", id, "assets"],
    enabled: !!id,
  });

  const { data: tracks = [] } = useQuery<Track[]>({
    queryKey: ["/api/projects", id, "tracks"],
    enabled: !!id,
  });

  // Autosave project updates
  useEffect(() => {
    if (!project) return;
    const autosaveInterval = setInterval(async () => {
      try {
        // Trigger autosave by sending empty object - backend will update updatedAt
        await apiRequest("PATCH", `/api/projects/${id}`, {
          name: project.name, // Re-send existing data to trigger update
        });
        console.log("Project autosaved");
      } catch (error) {
        console.error("Autosave failed:", error);
      }
    }, 30000); // Autosave every 30 seconds

    return () => clearInterval(autosaveInterval);
  }, [project, id]);

  const createTrackMutation = useMutation({
    mutationFn: async (type: "video" | "audio" | "text") => {
      const response = await apiRequest("POST", "/api/tracks", {
        projectId: id,
        type,
        order: tracks.length,
        locked: false,
        muted: false,
      });
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/projects", id, "tracks"] });
      toast({
        title: "Track added",
        description: "New track created successfully.",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to create track.",
        variant: "destructive",
      });
    },
  });

  const deleteTrackMutation = useMutation({
    mutationFn: async (trackId: string) => {
      await apiRequest("DELETE", `/api/tracks/${trackId}`, {});
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/projects", id, "tracks"] });
      toast({
        title: "Track deleted",
        description: "Track removed from timeline.",
      });
    },
  });

  const createAssetMutation = useMutation({
    mutationFn: async (assetData: { name: string; type: string; url: string }) => {
      const response = await apiRequest("POST", "/api/assets", {
        projectId: id,
        ...assetData,
        duration: 5000, // Demo duration
        thumbnailUrl: null,
        waveformData: null,
        fileSize: 1024,
      });
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/projects", id, "assets"] });
      toast({
        title: "Asset added",
        description: "Media file uploaded successfully.",
      });
    },
  });

  if (isLoading) {
    return (
      <div className="h-screen flex items-center justify-center bg-background">
        <div className="space-y-4 text-center">
          <div className="animate-spin h-12 w-12 border-4 border-primary border-t-transparent rounded-full mx-auto" />
          <p className="text-muted-foreground" data-testid="text-loading">Loading project...</p>
        </div>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="h-screen flex items-center justify-center bg-background">
        <div className="text-center space-y-4">
          <Video className="h-16 w-16 text-muted-foreground mx-auto" data-testid="icon-not-found" />
          <h2 className="text-2xl font-semibold" data-testid="text-not-found">Project not found</h2>
          <Link href="/dashboard">
            <Button data-testid="button-back-to-dashboard">Back to Dashboard</Button>
          </Link>
        </div>
      </div>
    );
  }

  const formatTime = (ms: number) => {
    const totalSeconds = Math.floor(ms / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${minutes}:${seconds.toString().padStart(2, "0")}`;
  };

  const handleAddDemoAsset = () => {
    createAssetMutation.mutate({
      name: `Demo Video ${assets.length + 1}`,
      type: "video",
      url: "/demo-video.mp4",
    });
  };

  return (
    <div className="h-screen flex flex-col bg-background">
      {/* Header */}
      <header className="flex-none h-14 border-b bg-card/50 backdrop-blur flex items-center justify-between px-4 gap-4" data-testid="header-editor">
        <div className="flex items-center gap-3">
          <Link href="/dashboard">
            <Button variant="ghost" size="icon" data-testid="button-back-dashboard">
              <ArrowLeft className="h-5 w-5" />
            </Button>
          </Link>
          <div className="h-6 w-px bg-border" />
          <div>
            <h1 className="font-semibold text-base line-clamp-1" data-testid="text-project-name">{project.name}</h1>
            <p className="text-xs text-muted-foreground" data-testid="text-project-settings">{project.resolution} • {project.fps} fps</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" data-testid="button-export-video">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
          <ThemeToggle />
        </div>
      </header>

      <div className="flex-1 flex overflow-hidden min-h-0">
        {/* Left Sidebar - Assets & Effects */}
        <aside className="w-80 border-r bg-card/30 flex flex-col overflow-hidden" data-testid="sidebar-assets">
          <Tabs defaultValue="assets" className="flex-1 flex flex-col">
            <div className="flex-none border-b px-4 pt-3">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="assets" data-testid="tab-media">
                  <Upload className="h-4 w-4 mr-1.5" />
                  Media
                </TabsTrigger>
                <TabsTrigger value="effects" data-testid="tab-effects-panel">
                  <Sparkles className="h-4 w-4 mr-1.5" />
                  Effects
                </TabsTrigger>
                <TabsTrigger value="text" data-testid="tab-text-panel">
                  <Type className="h-4 w-4 mr-1.5" />
                  Text
                </TabsTrigger>
              </TabsList>
            </div>

            <div className="flex-1 overflow-y-auto">
              <TabsContent value="assets" className="p-4 space-y-4 mt-0">
                <Button className="w-full" onClick={handleAddDemoAsset} data-testid="button-upload-demo-media">
                  <Upload className="h-4 w-4 mr-2" />
                  Add Demo Media
                </Button>
                
                {assets.length === 0 ? (
                  <div className="text-center py-12 space-y-3" data-testid="empty-state-assets">
                    <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto">
                      <ImageIcon className="h-8 w-8 text-primary" />
                    </div>
                    <p className="text-sm text-muted-foreground">
                      No media files yet.
                      <br />
                      Upload videos, images, or audio.
                    </p>
                  </div>
                ) : (
                  <div className="grid grid-cols-2 gap-3">
                    {assets.map((asset) => (
                      <Card 
                        key={asset.id} 
                        className="hover-elevate cursor-pointer active-elevate-2 overflow-hidden"
                        data-testid={`asset-card-${asset.id}`}
                      >
                        <div className="aspect-video bg-muted flex items-center justify-center" data-testid={`asset-thumbnail-${asset.id}`}>
                          {asset.type === "video" ? (
                            <Video className="h-6 w-6 text-muted-foreground" />
                          ) : asset.type === "audio" ? (
                            <Music className="h-6 w-6 text-muted-foreground" />
                          ) : (
                            <ImageIcon className="h-6 w-6 text-muted-foreground" />
                          )}
                        </div>
                        <div className="p-2">
                          <p className="text-xs font-medium truncate" data-testid={`asset-name-${asset.id}`}>{asset.name}</p>
                          {asset.duration && (
                            <p className="text-xs text-muted-foreground" data-testid={`asset-duration-${asset.id}`}>{formatTime(asset.duration)}</p>
                          )}
                        </div>
                      </Card>
                    ))}
                  </div>
                )}
              </TabsContent>

              <TabsContent value="effects" className="p-4 space-y-4 mt-0">
                <div className="space-y-2">
                  <h3 className="text-sm font-semibold" data-testid="heading-filters">Filters</h3>
                  <div className="grid grid-cols-2 gap-3">
                    {["Cinematic", "Vintage", "Vibrant", "B&W"].map((filter) => (
                      <Card 
                        key={filter} 
                        className="hover-elevate cursor-pointer active-elevate-2 p-3 text-center"
                        data-testid={`filter-${filter.toLowerCase().replace("&", "")}`}
                      >
                        <div className="h-12 w-12 rounded bg-primary/10 mx-auto mb-2 flex items-center justify-center">
                          <Sparkles className="h-6 w-6 text-primary" />
                        </div>
                        <p className="text-xs font-medium">{filter}</p>
                      </Card>
                    ))}
                  </div>
                </div>

                <div className="space-y-2 pt-2">
                  <h3 className="text-sm font-semibold" data-testid="heading-transitions">Transitions</h3>
                  <div className="grid grid-cols-2 gap-3">
                    {["Fade", "Slide", "Zoom", "Dissolve"].map((transition) => (
                      <Card 
                        key={transition} 
                        className="hover-elevate cursor-pointer active-elevate-2 p-3 text-center"
                        data-testid={`transition-${transition.toLowerCase()}`}
                      >
                        <div className="h-12 w-12 rounded bg-chart-2/10 mx-auto mb-2 flex items-center justify-center">
                          <Layers className="h-6 w-6 text-chart-2" />
                        </div>
                        <p className="text-xs font-medium">{transition}</p>
                      </Card>
                    ))}
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="text" className="p-4 space-y-4 mt-0">
                <Button className="w-full" data-testid="button-add-text-layer">
                  <Type className="h-4 w-4 mr-2" />
                  Add Text Layer
                </Button>

                <div className="space-y-2">
                  <h3 className="text-sm font-semibold" data-testid="heading-text-templates">Templates</h3>
                  <div className="space-y-2">
                    {["Title", "Lower Third", "Subtitle", "End Card"].map((template) => (
                      <Card 
                        key={template} 
                        className="hover-elevate cursor-pointer active-elevate-2 p-3"
                        data-testid={`text-template-${template.toLowerCase().replace(" ", "-")}`}
                      >
                        <div className="flex items-center gap-3">
                          <div className="h-10 w-10 rounded bg-accent/50 flex items-center justify-center flex-none">
                            <Type className="h-5 w-5" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium">{template}</p>
                            <p className="text-xs text-muted-foreground">Animated text</p>
                          </div>
                        </div>
                      </Card>
                    ))}
                  </div>
                </div>
              </TabsContent>
            </div>
          </Tabs>
        </aside>

        {/* Main Editing Area */}
        <div className="flex-1 flex flex-col overflow-hidden min-h-0">
          {/* Video Preview */}
          <div className="flex-1 flex items-center justify-center p-6 bg-muted/20 overflow-hidden" data-testid="video-preview-area">
            <div className="relative w-full max-w-4xl" style={{ aspectRatio: project.aspectRatio.replace(":", "/") }}>
              <div className="absolute inset-0 bg-black rounded-lg flex items-center justify-center border" data-testid="video-preview-canvas">
                <div className="text-center space-y-3">
                  <Video className="h-16 w-16 text-muted-foreground mx-auto" />
                  <p className="text-muted-foreground" data-testid="text-preview-placeholder">Video Preview</p>
                  <p className="text-sm text-muted-foreground/60" data-testid="text-preview-info">
                    {project.aspectRatio} • {project.resolution}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Playback Controls */}
          <div className="flex-none border-t bg-card/50 px-6 py-3" data-testid="playback-controls">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-1">
                <Button variant="ghost" size="icon" data-testid="button-skip-backward">
                  <SkipBack className="h-5 w-5" />
                </Button>
                <Button 
                  variant="outline" 
                  size="icon"
                  onClick={() => setIsPlaying(!isPlaying)}
                  data-testid="button-play-pause-toggle"
                >
                  {isPlaying ? (
                    <Pause className="h-5 w-5" />
                  ) : (
                    <Play className="h-5 w-5 ml-0.5" />
                  )}
                </Button>
                <Button variant="ghost" size="icon" data-testid="button-skip-forward">
                  <SkipForward className="h-5 w-5" />
                </Button>
              </div>

              <div className="flex-1 flex items-center gap-3">
                <span className="text-sm font-mono tabular-nums min-w-[4rem]" data-testid="text-current-time">
                  {formatTime(currentTime)}
                </span>
                <div className="flex-1 h-2 bg-muted rounded-full relative overflow-hidden group cursor-pointer" data-testid="playback-progress-bar">
                  <div 
                    className="absolute inset-y-0 left-0 bg-primary rounded-full"
                    style={{ width: `${(currentTime / (project.duration || 1)) * 100}%` }}
                  />
                </div>
                <span className="text-sm font-mono tabular-nums text-muted-foreground min-w-[4rem] text-right" data-testid="text-total-duration">
                  {formatTime(project.duration)}
                </span>
              </div>

              <Button variant="ghost" size="icon" data-testid="button-volume-control">
                <Volume2 className="h-5 w-5" />
              </Button>
            </div>
          </div>

          {/* Timeline */}
          <div className="flex-none h-64 border-t bg-card/30 overflow-auto" data-testid="timeline-area">
            <div className="p-4 space-y-2">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-semibold flex items-center gap-2" data-testid="heading-timeline">
                  <Layers className="h-4 w-4" />
                  Timeline
                </h3>
                <div className="flex gap-1">
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={() => createTrackMutation.mutate("video")}
                    disabled={createTrackMutation.isPending}
                    data-testid="button-add-video-track"
                  >
                    <Video className="h-3.5 w-3.5 mr-1.5" />
                    Video
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={() => createTrackMutation.mutate("audio")}
                    disabled={createTrackMutation.isPending}
                    data-testid="button-add-audio-track"
                  >
                    <Music className="h-3.5 w-3.5 mr-1.5" />
                    Audio
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={() => createTrackMutation.mutate("text")}
                    disabled={createTrackMutation.isPending}
                    data-testid="button-add-text-track"
                  >
                    <Type className="h-3.5 w-3.5 mr-1.5" />
                    Text
                  </Button>
                </div>
              </div>

              {tracks.length === 0 ? (
                <div className="text-center py-12 space-y-3" data-testid="empty-state-timeline">
                  <div className="h-14 w-14 rounded-full bg-primary/10 flex items-center justify-center mx-auto">
                    <Scissors className="h-7 w-7 text-primary" />
                  </div>
                  <p className="text-sm text-muted-foreground">
                    No tracks yet. Add a track to start editing.
                  </p>
                </div>
              ) : (
                <div className="space-y-2">
                  {tracks.map((track, index) => (
                    <div key={track.id} className="flex gap-2" data-testid={`track-row-${track.id}`}>
                      <div className="w-24 flex-none">
                        <Card className="h-12 flex items-center justify-between px-3">
                          <span className="text-xs font-medium truncate flex items-center gap-1.5" data-testid={`track-label-${track.id}`}>
                            {track.type === "video" && <Video className="h-3.5 w-3.5" />}
                            {track.type === "audio" && <Music className="h-3.5 w-3.5" />}
                            {track.type === "text" && <Type className="h-3.5 w-3.5" />}
                            {track.type}
                          </span>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-6 w-6"
                            onClick={() => deleteTrackMutation.mutate(track.id)}
                            data-testid={`button-delete-track-${track.id}`}
                          >
                            <Trash2 className="h-3 w-3" />
                          </Button>
                        </Card>
                      </div>
                      <div className="flex-1">
                        <Card className="h-12 bg-muted/30 relative overflow-hidden" data-testid={`track-canvas-${track.id}`}>
                          <div className="absolute inset-0 flex items-center px-2">
                            <div className="text-xs text-muted-foreground">Empty track</div>
                          </div>
                        </Card>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
