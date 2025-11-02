import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ThemeToggle } from "@/components/theme-toggle";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { 
  Plus, 
  Video, 
  Clock, 
  Trash2,
  FolderOpen,
  Sparkles
} from "lucide-react";
import { Link, useLocation } from "wouter";
import type { Project } from "@shared/schema";

export default function Dashboard() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [newProjectName, setNewProjectName] = useState("");
  const [aspectRatio, setAspectRatio] = useState("16:9");
  const [resolution, setResolution] = useState("1920x1080");

  const { data: projects, isLoading } = useQuery<Project[]>({
    queryKey: ["/api/projects"],
  });

  const createMutation = useMutation({
    mutationFn: async (data: { name: string; aspectRatio: string; resolution: string }) => {
      const response = await apiRequest("POST", "/api/projects", data);
      return response.json();
    },
    onSuccess: (project) => {
      queryClient.invalidateQueries({ queryKey: ["/api/projects"] });
      setIsCreateOpen(false);
      setNewProjectName("");
      toast({
        title: "Project created",
        description: "Your new project is ready to edit!",
      });
      setLocation(`/editor/${project.id}`);
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to create project. Please try again.",
        variant: "destructive",
      });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      await apiRequest("DELETE", `/api/projects/${id}`, {});
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/projects"] });
      toast({
        title: "Project deleted",
        description: "The project has been removed.",
      });
    },
  });

  const handleCreate = () => {
    if (!newProjectName.trim()) {
      toast({
        title: "Name required",
        description: "Please enter a project name.",
        variant: "destructive",
      });
      return;
    }
    createMutation.mutate({ name: newProjectName, aspectRatio, resolution });
  };

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const formatDuration = (ms: number) => {
    const seconds = Math.floor(ms / 1000);
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`;
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60" data-testid="header-dashboard">
        <div className="container flex h-16 items-center justify-between px-4 md:px-8">
          <Link href="/">
            <a className="flex items-center gap-2 hover:opacity-80 transition-opacity" data-testid="link-home">
              <Video className="h-6 w-6 text-primary" />
              <span className="text-xl font-bold tracking-tight">CreatorStudio</span>
            </a>
          </Link>
          <div className="flex items-center gap-2">
            <ThemeToggle />
            <Button onClick={() => setIsCreateOpen(true)} data-testid="button-new-project">
              <Plus className="h-4 w-4 mr-2" />
              New Project
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container px-4 md:px-8 py-12">
        <div className="space-y-8">
          <div>
            <h1 className="text-4xl font-bold tracking-tight mb-2" data-testid="heading-projects">Your Projects</h1>
            <p className="text-muted-foreground text-lg" data-testid="text-projects-description">
              Create and manage your video editing projects
            </p>
          </div>

          {/* Projects Grid */}
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <Card key={i} className="border">
                  <CardContent className="p-0">
                    <div className="aspect-video bg-muted animate-pulse rounded-t-lg" />
                    <div className="p-6 space-y-4">
                      <div className="h-6 bg-muted rounded animate-pulse" />
                      <div className="h-4 bg-muted rounded w-2/3 animate-pulse" />
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : !projects || projects.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 space-y-6" data-testid="empty-state-projects">
              <div className="h-24 w-24 rounded-full bg-primary/10 flex items-center justify-center">
                <FolderOpen className="h-12 w-12 text-primary" />
              </div>
              <div className="text-center space-y-2">
                <h3 className="text-2xl font-semibold" data-testid="heading-empty-state">No projects yet</h3>
                <p className="text-muted-foreground max-w-md" data-testid="text-empty-state">
                  Create your first video project and start editing with professional tools.
                </p>
              </div>
              <Button size="lg" onClick={() => setIsCreateOpen(true)} data-testid="button-create-first">
                <Sparkles className="h-4 w-4 mr-2" />
                Create Your First Project
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {projects.map((project) => (
                <Card key={project.id} className="border hover-elevate transition-all group">
                  <CardContent className="p-0">
                    <Link href={`/editor/${project.id}`}>
                      <a className="block">
                        <div className="aspect-video bg-gradient-to-br from-primary/20 to-chart-2/20 flex items-center justify-center rounded-t-lg border-b">
                          {project.thumbnailUrl ? (
                            <img 
                              src={project.thumbnailUrl} 
                              alt={project.name}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <Video className="h-12 w-12 text-primary/50" />
                          )}
                        </div>
                      </a>
                    </Link>
                    <div className="p-6 space-y-4">
                      <div>
                        <Link href={`/editor/${project.id}`}>
                          <a className="text-xl font-semibold hover:text-primary transition-colors line-clamp-1" data-testid={`link-project-${project.id}`}>
                            {project.name}
                          </a>
                        </Link>
                        <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
                          <span className="flex items-center gap-1">
                            <Clock className="h-3.5 w-3.5" />
                            {formatDuration(project.duration)}
                          </span>
                          <span>{project.resolution}</span>
                        </div>
                      </div>
                      <div className="flex items-center justify-between pt-2 border-t">
                        <span className="text-xs text-muted-foreground">
                          {formatDate(project.updatedAt)}
                        </span>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-muted-foreground hover:text-destructive"
                          onClick={(e) => {
                            e.preventDefault();
                            deleteMutation.mutate(project.id);
                          }}
                          data-testid={`button-delete-${project.id}`}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </main>

      {/* Create Project Dialog */}
      <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
        <DialogContent data-testid="dialog-create-project">
          <DialogHeader>
            <DialogTitle>Create New Project</DialogTitle>
            <DialogDescription>
              Set up your video project settings. You can change these later.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <label htmlFor="project-name" className="text-sm font-medium">
                Project Name
              </label>
              <Input
                id="project-name"
                placeholder="My Awesome Video"
                value={newProjectName}
                onChange={(e) => setNewProjectName(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleCreate()}
                data-testid="input-project-name"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label htmlFor="aspect-ratio" className="text-sm font-medium">
                  Aspect Ratio
                </label>
                <Select value={aspectRatio} onValueChange={setAspectRatio}>
                  <SelectTrigger id="aspect-ratio" data-testid="select-aspect-ratio">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="16:9">16:9 (Landscape)</SelectItem>
                    <SelectItem value="9:16">9:16 (Portrait)</SelectItem>
                    <SelectItem value="1:1">1:1 (Square)</SelectItem>
                    <SelectItem value="4:3">4:3 (Standard)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <label htmlFor="resolution" className="text-sm font-medium">
                  Resolution
                </label>
                <Select value={resolution} onValueChange={setResolution}>
                  <SelectTrigger id="resolution" data-testid="select-resolution">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1920x1080">1080p (Full HD)</SelectItem>
                    <SelectItem value="1280x720">720p (HD)</SelectItem>
                    <SelectItem value="3840x2160">4K (Ultra HD)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsCreateOpen(false)} data-testid="button-cancel">
              Cancel
            </Button>
            <Button 
              onClick={handleCreate} 
              disabled={createMutation.isPending}
              data-testid="button-create-project"
            >
              {createMutation.isPending ? "Creating..." : "Create Project"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
