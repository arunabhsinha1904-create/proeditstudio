# Design Guidelines: Professional Video Editing App for Content Creators

## Design Approach
**Reference-Based Strategy** - Drawing inspiration from modern creator tools (CapCut, Canva, Figma) combined with professional productivity apps (Linear, Notion). The design balances "pro vibes" with "lively nature" through confident typography, vibrant accents, and polished interfaces.

**Core Principle:** Professional capability meets creator energy - sophisticated enough for serious work, energetic enough to inspire creativity.

---

## Typography System

**Primary Font:** Inter or Outfit (Google Fonts)
- Headings: 600-700 weight, tight leading (-0.02em tracking)
- Body: 400-500 weight, relaxed leading (1.6)
- UI Elements: 500-600 weight, -0.01em tracking

**Hierarchy:**
- Hero headline: 4xl-6xl, bold (700)
- Section headers: 3xl-4xl, semibold (600)
- Feature titles: xl-2xl, semibold (600)
- Body text: base-lg, regular (400)
- UI labels: sm-base, medium (500)
- Buttons: base, semibold (600)

---

## Layout System

**Spacing Scale:** Tailwind units of 2, 4, 6, 8, 12, 16, 20, 24
- Component padding: p-4 to p-8
- Section spacing: py-16 to py-24 (desktop), py-12 (mobile)
- Card gaps: gap-6 to gap-8
- Element margins: m-2, m-4, m-6

**Grid System:**
- Container: max-w-7xl with px-4 to px-8
- Feature grids: 3 columns (desktop), 2 columns (tablet), 1 column (mobile)
- Timeline workspace: Full-width with constrained controls

---

## Component Library

### Navigation
**Header:** Sticky top navigation with backdrop blur
- Logo left, navigation center, CTA right
- Height: h-16 to h-20
- Items: "Features," "Pricing," "Templates," "Learn"
- Primary CTA: "Start Creating Free" prominent button
- Secondary: "Sign In" text link

### Hero Section
**Layout:** Full-width with gradient background treatment
- Centered content: max-w-4xl
- Headline + subheading + dual CTAs
- Video demo embed or animated preview showcase below text
- Height: min-h-screen with py-20 to py-32

**Image:** Large hero image showing the video editor interface in action - split screen with creator on left editing their content on timeline, polished video preview on right. Image should convey professional workspace energy with vibrant project thumbnails visible.

### Feature Showcase Sections

**Timeline Editor Preview:**
- Full-width screenshot/demo of the editing interface
- Annotated callouts highlighting key features
- Dark interface preview on light background with subtle shadow

**Effects & Tools Grid:**
- 3-column grid of feature cards (lg:grid-cols-3 md:grid-cols-2)
- Each card: icon, title, description, visual preview
- Hover: subtle lift (translate-y-1) with shadow increase
- Cards: rounded-2xl with border and p-6

**Template Gallery:**
- Horizontal scroll carousel of video templates
- Each template: thumbnail + title + category badge
- Templates show actual video frames with play button overlay

### Subscription Pricing
**Layout:** 2-3 column comparison (Free, Pro, Team)
- Centered cards with featured plan elevated
- Each plan: title, price, feature list, CTA button
- Visual differentiation through border treatment and scale
- Toggle for monthly/annual billing

### Social Proof Section
**Creator Showcase:**
- 4-column grid of creator testimonials with profile photos
- Each: circular photo, name, follower count, quote
- Alternating card heights for visual interest

**Stats Banner:**
- Horizontal bar with 4 key metrics in flex layout
- Large numbers (3xl-4xl) with descriptive labels below
- Examples: "500K+ Videos Created," "150+ Countries"

### Footer
**Multi-Column Layout:**
- 4-column grid: Product, Resources, Company, Newsletter
- Each column: heading + 4-6 links
- Newsletter signup: email input + submit button
- Social media icons row
- Bottom bar: copyright, privacy, terms links

---

## Editing Interface Components

### Video Preview Player
- 16:9 aspect ratio container with controls overlay
- Playback controls: play/pause, timeline scrubber, time display
- Quality selector and fullscreen toggle
- Rounded corners (rounded-xl)

### Timeline Component
- Horizontal scrollable tracks with zoom controls
- Video tracks, audio tracks, text overlay tracks
- Playhead with timestamp
- Clip thumbnails on timeline
- Background: subtle grid pattern

### Effects Panel
- Sidebar with tabbed navigation (Transitions, Filters, Text, Audio)
- Grid of effect thumbnails with hover previews
- Drag-and-drop visual indicators
- Search/filter bar at top

### Export Settings Modal
- Overlay modal with settings form
- Resolution dropdown, format selector, quality slider
- File size estimation display
- Progress bar during export
- "Export" primary button, "Cancel" secondary

---

## Images Specification

**Hero Image:** Yes - Large, prominent hero image
- Description: Professional video editing interface screenshot showing timeline with colorful video clips, effects panel open, and preview window displaying polished content. Should convey both capability and creativity.
- Placement: Center of hero section, below headline and CTAs
- Treatment: Subtle shadow, slight perspective tilt for depth

**Feature Images:**
- Timeline closeup showing multi-track editing
- Effects library with vibrant filter previews
- Text animation showcase with kinetic typography
- Export settings panel with quality options
- All images: rounded-xl borders, modern UI screenshots

**Creator Photos:**
- Authentic creator headshots in testimonial section
- Diverse representation of YouTubers/influencers
- Circular crops (rounded-full)

**Template Thumbnails:**
- Video frame previews showing different content styles
- YouTube intro, Instagram reel, TikTok templates
- Play button overlay on hover

---

## Interaction Patterns

### Buttons
Primary buttons on hero image and throughout: Add backdrop blur (backdrop-blur-sm) with semi-transparent background. No custom hover states - rely on Button component's built-in interactions.

### Cards
- Base state: border with subtle shadow
- Hover: translate-y-1 with shadow-lg
- Transition: 200ms ease

### Tabs
- Active: border-b-2 with accent color
- Inactive: opacity-60
- Smooth slide indicator

### Form Inputs
- Consistent height: h-12
- Rounded: rounded-lg
- Focus: ring-2 with offset
- Icons positioned inside inputs (left padding)

---

## Animations
**Strategic Use Only:**
- Hero headline: Fade up on load (duration-500)
- Feature cards: Stagger fade-in on scroll intersection
- Video preview: Subtle pulse on hover
- NO scroll-triggered parallax or complex sequences

---

## Accessibility Standards
- All interactive elements: min height 44px
- Form inputs: visible labels and ARIA attributes
- Color contrast: WCAG AA minimum
- Keyboard navigation: visible focus states
- Alt text: all images and icons
- Screen reader: semantic HTML structure

---

**Final Notes:** This design prioritizes visual impact through clean layouts, professional typography, and strategic use of creator-focused imagery. The "pro vibes" come from restraint and polish, while "lively nature" emerges through vibrant accents within the color system (applied later) and dynamic content showcases. Every section serves a purpose: demonstrating capability, building trust, or driving conversion.