# BYD Content Marketing AI - User Guide

## Quick Reference

| I want to... | Use this endpoint |
|--------------|-------------------|
| Create image from text description | `/api/image/generate` |
| Edit an existing image | `/api/image/edit` |
| Add or remove objects from image | `/api/image/elements` |
| Edit specific area of image | `/api/image/mask-edit` |
| Merge multiple images into one | `/api/image/combine` |
| Create multiple angle views | `/api/image/360-view` |
| Increase image resolution | `/api/image/upscale` |
| Chat-based image editing | `/api/image/chat` |
| Create social media content | `/api/image/marketing` |

---

## Detailed Guide

### 1. Text to Image (`/api/image/generate`)

**Use when:** You want to create a new image from scratch using text description.

**What you need:**
- `prompt` - Describe the image you want (required)
- `style` - Art style like "realistic", "cartoon", "minimalist" (optional)
- `aspectRatio` - Like "16:9", "1:1", "9:16" (optional)
- `brand` - Brand name to include (optional)
- `numberOfResults` - How many images to generate, 1-4 (optional)

**Example:**
```
prompt: "BYD Seal electric car in a futuristic city at sunset"
style: "cinematic"
numberOfResults: 3
```

---

### 2. Edit Image (`/api/image/edit`)

**Use when:** You have an image and want to modify it based on instructions.

**What you need:**
- `image` - Upload your image (required)
- `prompt` - What changes you want (required)
- `preserveStyle` - Keep original style? "true" or "false" (optional)

**Example:**
```
image: [upload car.jpg]
prompt: "Change the background to a beach scene"
preserveStyle: true
```

---

### 3. Add/Remove Elements (`/api/image/elements`)

**Use when:** You want to add something new or remove something from an image.

**What you need:**
- `image` - Upload your image (required)
- `action` - "add" or "remove" (required)
- `element` - What to add/remove (required)
- `position` - Where to add it, like "top right", "center" (optional, for add only)

**Example - Add:**
```
image: [upload car.jpg]
action: "add"
element: "BYD logo"
position: "bottom right corner"
```

**Example - Remove:**
```
image: [upload photo.jpg]
action: "remove"
element: "person in background"
```

---

### 4. Mask Edit (`/api/image/mask-edit`)

**Use when:** You want to edit only a specific part of an image.

**What you need:**
- `image` - Upload your image (required)
- `prompt` - What to change (required)
- `mask` - Black/white mask image where white = area to edit (optional)
- `maskDescription` - Describe area to edit if no mask, like "the sky", "the car" (optional)

**Example with description:**
```
image: [upload photo.jpg]
prompt: "Make it look like sunset"
maskDescription: "the sky"
```

---

### 5. Combine Images (`/api/image/combine`)

**Use when:** You want to merge 2-5 images into one cohesive image.

**What you need:**
- `images` - Upload 2-5 images (required)
- `prompt` - How to combine them (required)
- `layout` - Like "side by side", "collage", "blend" (optional)
- `style` - Output style (optional)

**Example:**
```
images: [upload car1.jpg, car2.jpg, car3.jpg]
prompt: "Create a comparison showcase of these 3 BYD models"
layout: "side by side"
```

---

### 6. 360 View (`/api/image/360-view`)

**Use when:** You want multiple angle views of a product or character.

**What you need:**
- `image` - Reference image (optional)
- `characterDescription` - Describe what to create if no image (optional)
- `prompt` - Additional instructions (optional)
- `angles` - Which angles, default: front, side, back, 3/4 view (optional)

**Example:**
```
image: [upload car.jpg]
prompt: "Show the car from all angles for product showcase"
angles: "front, rear, side, interior"
```

---

### 7. Upscale Image (`/api/image/upscale`)

**Use when:** You want to increase image resolution/quality.

**What you need:**
- `image` - Upload your image (required)
- `preset` - Choose: "hd", "fullhd", "2k", or "4k" (optional)
- `width` & `height` - Custom dimensions if no preset (optional)
- `quality` - Output quality 1-100, default 90 (optional)

**Preset resolutions:**
- HD: 1280x720
- FullHD: 1920x1080
- 2K: 2560x1440
- 4K: 3840x2160

**Example:**
```
image: [upload photo.jpg]
preset: "4k"
quality: 95
```

---

### 8. Image Chat (`/api/image/chat`)

**Use when:** You want to have a conversation about editing an image, step by step.

**What you need:**
- `message` - Your message/question (required)
- `image` - Current image you're working on (optional)
- `conversationHistory` - Previous chat history as JSON (optional)

**Example:**
```
message: "Can you make this image more vibrant and add some lens flare?"
image: [upload photo.jpg]
```

---

### 9. Marketing Content (`/api/image/marketing`)

**Use when:** You want to create social media ready content with proper dimensions.

**What you need:**
- `platform` - Choose: "tiktok-reels", "youtube-shorts", "instagram-post", "linkedin" (required)
- `contentType` - Choose: "edu-ent" (educational) or "soft-campaign" (promotional) (required)
- `targetAudience` - Choose: "genz-balanced", "genz-emotional", "genalpha-balanced", "genalpha-emotional" (required)
- `product` - Product name or topic (optional)
- `brand` - Brand name (optional)
- `message` - Key message to convey (optional)
- `image` - Reference image (optional)

**Platform specs:**
| Platform | Aspect Ratio | Resolution |
|----------|--------------|------------|
| TikTok/Reels | 9:16 | 1080x1920 |
| YouTube Shorts | 9:16 | 1080x1920 |
| Instagram Post | 1:1 | 1080x1080 |
| LinkedIn | 1.91:1 | 1200x628 |

**Example:**
```
platform: "instagram-post"
contentType: "soft-campaign"
targetAudience: "genz-emotional"
product: "BYD Seal"
brand: "BYD"
message: "The future of electric mobility"
```

---

## Get Available Options

**Endpoint:** `GET /api/image/marketing/options`

Returns all available platforms, content types, and target audiences for the marketing endpoint.

---

## Health Check

- `GET /health` - Check if server is running
- `GET /health/gemini` - Check if AI service is connected

---

## API Documentation

For technical details and testing, visit: `http://localhost:4000/docs`
