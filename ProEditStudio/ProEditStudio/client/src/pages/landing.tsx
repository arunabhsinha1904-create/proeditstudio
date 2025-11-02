import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ThemeToggle } from "@/components/theme-toggle";
import { 
  Video, 
  Scissors, 
  Sparkles, 
  Type, 
  Music, 
  Layers, 
  Download,
  Zap,
  Heart,
  TrendingUp
} from "lucide-react";
import { Link } from "wouter";
import heroImage from "@assets/generated_images/Video_editor_interface_hero_60abe925.png";
import timelineImage from "@assets/generated_images/Timeline_editing_feature_closeup_e459370f.png";
import filtersImage from "@assets/generated_images/Video_filters_showcase_grid_eb12a996.png";
import creator1 from "@assets/generated_images/Creator_testimonial_portrait_1_4068821a.png";
import creator2 from "@assets/generated_images/Creator_testimonial_portrait_2_4295dd99.png";

export default function Landing() {
  const features = [
    {
      icon: Scissors,
      title: "Precision Editing",
      description: "Trim, split, and arrange clips with frame-perfect accuracy on our intuitive timeline."
    },
    {
      icon: Sparkles,
      title: "Stunning Effects",
      description: "Apply professional filters, color grading, and transitions to make your videos stand out."
    },
    {
      icon: Type,
      title: "Animated Text",
      description: "Add dynamic titles, lower thirds, and captions with customizable animations."
    },
    {
      icon: Music,
      title: "Audio Mastery",
      description: "Fine-tune volume, add fades, and visualize audio with waveform displays."
    },
    {
      icon: Layers,
      title: "Multi-Track Timeline",
      description: "Layer multiple video, audio, and text tracks for complex compositions."
    },
    {
      icon: Download,
      title: "High-Quality Export",
      description: "Export in 1080p or 720p with optimized settings for any platform."
    }
  ];

  const testimonials = [
    {
      name: "Sarah Mitchell",
      role: "Content Creator",
      followers: "250K YouTube",
      image: creator1,
      quote: "This editor has completely changed my workflow. I can edit anywhere, anytime, without heavy software."
    },
    {
      name: "Marcus Chen",
      role: "Digital Marketer",
      followers: "180K Instagram",
      image: creator2,
      quote: "The effects library is incredible. My clients love the professional quality I can deliver quickly."
    }
  ];

  const stats = [
    { value: "100%", label: "Free Forever" },
    { value: "Fast", label: "Browser-Based" },
    { value: "HD", label: "Export Quality" },
    { value: "∞", label: "Projects" }
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center justify-between px-4 md:px-8">
          <div className="flex items-center gap-2">
            <Video className="h-6 w-6 text-primary" />
            <span className="text-xl font-bold tracking-tight">CreatorStudio</span>
          </div>
          <nav className="hidden md:flex items-center gap-6">
            <a href="#features" className="text-sm font-medium hover:text-primary transition-colors" data-testid="link-features">
              Features
            </a>
            <a href="#testimonials" className="text-sm font-medium hover:text-primary transition-colors" data-testid="link-testimonials">
              Testimonials
            </a>
          </nav>
          <div className="flex items-center gap-2">
            <ThemeToggle />
            <Link href="/dashboard">
              <Button size="default" data-testid="button-get-started">
                Start Creating Free
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative py-20 md:py-32 overflow-hidden">
        {/* Gradient Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-background to-chart-2/20 -z-10" />
        
        <div className="container px-4 md:px-8">
          <div className="mx-auto max-w-4xl text-center space-y-8">
            <Badge variant="secondary" className="px-4 py-1.5">
              <Zap className="h-3 w-3 mr-1.5 inline" />
              100% Free • No Signup Required
            </Badge>
            
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight" data-testid="heading-hero">
              Professional Video Editing
              <span className="block text-primary mt-2">For Content Creators</span>
            </h1>
            
            <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed" data-testid="text-hero-description">
              Edit stunning videos right in your browser. Powerful tools, beautiful effects, and seamless export—all completely free.
            </p>
            
            <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
              <Link href="/dashboard">
                <Button size="lg" className="text-base h-12 px-8" data-testid="button-hero-start">
                  Start Editing Now
                </Button>
              </Link>
              <Button size="lg" variant="outline" className="text-base h-12 px-8 backdrop-blur-sm" data-testid="button-learn-more">
                <Heart className="h-4 w-4 mr-2" />
                See Features
              </Button>
            </div>
          </div>

          {/* Hero Image */}
          <div className="mt-16 mx-auto max-w-6xl">
            <div className="relative rounded-xl overflow-hidden shadow-2xl border">
              <img 
                src={heroImage} 
                alt="CreatorStudio video editor interface showing professional timeline, effects panel, and preview window" 
                className="w-full h-auto"
                data-testid="img-hero"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Stats Banner */}
      <section className="border-y bg-card/50">
        <div className="container px-4 md:px-8 py-12">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, i) => (
              <div key={i} className="text-center space-y-1" data-testid={`stat-${i}`}>
                <div className="text-3xl md:text-4xl font-bold text-primary" data-testid={`stat-value-${i}`}>{stat.value}</div>
                <div className="text-sm text-muted-foreground font-medium" data-testid={`stat-label-${i}`}>{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 md:py-32">
        <div className="container px-4 md:px-8">
          <div className="text-center space-y-4 mb-16">
            <h2 className="text-3xl md:text-5xl font-bold tracking-tight">
              Everything You Need to Create
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Professional-grade tools designed for content creators who demand quality and speed.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-20">
            {features.map((feature, i) => (
              <Card key={i} className="border hover-elevate transition-all duration-200" data-testid={`feature-card-${i}`}>
                <CardContent className="p-6 space-y-4">
                  <div className="h-12 w-12 rounded-md bg-primary/10 flex items-center justify-center">
                    <feature.icon className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="text-xl font-semibold" data-testid={`feature-title-${i}`}>{feature.title}</h3>
                  <p className="text-muted-foreground leading-relaxed" data-testid={`feature-description-${i}`}>
                    {feature.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Feature Showcase Images */}
          <div className="space-y-20">
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div className="space-y-6">
                <Badge variant="secondary">Multi-Track Timeline</Badge>
                <h3 className="text-3xl md:text-4xl font-bold">
                  Edit Like a Pro
                </h3>
                <p className="text-lg text-muted-foreground leading-relaxed">
                  Arrange clips with precision on our multi-track timeline. Drag, drop, trim, and split with intuitive controls. See your entire project at a glance with thumbnail previews and waveform visualization.
                </p>
                <div className="flex gap-2">
                  <Badge variant="outline">Drag & Drop</Badge>
                  <Badge variant="outline">Waveforms</Badge>
                  <Badge variant="outline">Thumbnails</Badge>
                </div>
              </div>
              <div className="rounded-xl overflow-hidden shadow-lg border">
                <img src={timelineImage} alt="Multi-track timeline with video clips and waveforms" className="w-full" />
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div className="rounded-xl overflow-hidden shadow-lg border order-2 md:order-1">
                <img src={filtersImage} alt="Grid of professional video filters and color grading presets" className="w-full" />
              </div>
              <div className="space-y-6 order-1 md:order-2">
                <Badge variant="secondary">Professional Effects</Badge>
                <h3 className="text-3xl md:text-4xl font-bold">
                  Stunning Visual Effects
                </h3>
                <p className="text-lg text-muted-foreground leading-relaxed">
                  Transform your footage with our library of professional filters and color grading presets. From cinematic looks to vibrant social media styles, find the perfect aesthetic for your content.
                </p>
                <div className="flex gap-2">
                  <Badge variant="outline">LUT Filters</Badge>
                  <Badge variant="outline">Color Grade</Badge>
                  <Badge variant="outline">Transitions</Badge>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section id="testimonials" className="py-20 md:py-32 bg-card/30">
        <div className="container px-4 md:px-8">
          <div className="text-center space-y-4 mb-16">
            <h2 className="text-3xl md:text-5xl font-bold tracking-tight">
              Loved by Creators
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Join thousands of content creators who trust CreatorStudio for their video editing needs.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            {testimonials.map((testimonial, i) => (
              <Card key={i} className="border" data-testid={`testimonial-card-${i}`}>
                <CardContent className="p-8 space-y-6">
                  <div className="flex items-center gap-4">
                    <img 
                      src={testimonial.image} 
                      alt={testimonial.name}
                      className="h-16 w-16 rounded-full object-cover border-2 border-primary/20"
                      data-testid={`testimonial-avatar-${i}`}
                    />
                    <div>
                      <div className="font-semibold text-lg" data-testid={`testimonial-name-${i}`}>{testimonial.name}</div>
                      <div className="text-sm text-muted-foreground" data-testid={`testimonial-role-${i}`}>{testimonial.role}</div>
                      <div className="flex items-center gap-1.5 mt-1">
                        <TrendingUp className="h-3.5 w-3.5 text-primary" />
                        <span className="text-xs font-medium text-primary" data-testid={`testimonial-followers-${i}`}>{testimonial.followers}</span>
                      </div>
                    </div>
                  </div>
                  <p className="text-muted-foreground leading-relaxed italic" data-testid={`testimonial-quote-${i}`}>
                    "{testimonial.quote}"
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 md:py-32">
        <div className="container px-4 md:px-8">
          <Card className="border-2 border-primary/20 bg-gradient-to-br from-primary/10 via-background to-chart-2/10">
            <CardContent className="p-12 md:p-16 text-center space-y-8">
              <h2 className="text-3xl md:text-5xl font-bold tracking-tight">
                Ready to Create Something Amazing?
              </h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Start editing professional videos in seconds. No credit card required. No limits.
              </p>
              <Link href="/dashboard">
                <Button size="lg" className="text-base h-12 px-8" data-testid="button-cta-start">
                  Launch CreatorStudio
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t py-12">
        <div className="container px-4 md:px-8">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <Video className="h-5 w-5 text-primary" />
                <span className="font-bold">CreatorStudio</span>
              </div>
              <p className="text-sm text-muted-foreground">
                Professional video editing, completely free.
              </p>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Product</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><a href="#features" className="hover:text-primary transition-colors">Features</a></li>
                <li><Link href="/dashboard" className="hover:text-primary transition-colors">Editor</Link></li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-4">Resources</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><a href="#" className="hover:text-primary transition-colors">Tutorials</a></li>
                <li><a href="#" className="hover:text-primary transition-colors">Community</a></li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-4">Company</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><a href="#" className="hover:text-primary transition-colors">About</a></li>
                <li><a href="#" className="hover:text-primary transition-colors">Contact</a></li>
              </ul>
            </div>
          </div>

          <div className="border-t pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-muted-foreground">
            <p>© 2025 CreatorStudio. All rights reserved.</p>
            <div className="flex gap-6">
              <a href="#" className="hover:text-primary transition-colors">Privacy</a>
              <a href="#" className="hover:text-primary transition-colors">Terms</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
