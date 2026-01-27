# BYD Content Marketing AI - User Guide

## Quick Reference

| I want to... | Use this endpoint |
|--------------|-------------------|
| Improve my short prompt | `/api/image/enhance-prompt` |
| Get editing suggestions for my image | `/api/image/analyze` |
| **Discover viral trends** | `/api/trends/search` |
| **Generate content from trend** | `/api/trends/generate-content` |
| **Generate improved video prompt** | `/api/trends/generate-video` |
---

### Generate Video Prompt (`/api/trends/generate-video`)

**Use when:** Anda ingin mengubah prompt video dari AI menjadi lebih sinematik, kreatif, atau menambah dialog/efek suara, serta mengatur orientasi landscape/portrait.

**Request (JSON):**
```json
{
  "basePrompt": "Dynamic tracking shot of BYD Atto 3 driving through city at night, neon reflections, cinematic lighting",
  "style": ["dialog", "cinematic", "creative"],
  "aspectRatio": "16:9",
  "duration": "20 seconds",
  "orientation": "landscape"
}
```

**Style options:**
- `dialog`: Tambahkan dialog natural & efek suara
- `cinematic`: Realisme sinematik (lighting, grading, camera movement)
- `creative`: Animasi kreatif, transisi, efek visual

**Orientation:**
- `landscape` (horizontal) atau `portrait` (vertical)

**Response:**
```json
{
  "success": true,
  "improvedPrompt": "Dynamic tracking shot of BYD Atto 3 driving through a neon-lit city at night. Include natural dialog between driver and passenger about the car's features, subtle city sound effects, cinematic lighting, smooth camera pans, creative animated transitions between scenes. Format for landscape orientation. Duration: 20 seconds. Aspect Ratio: 16:9.",
  "basePrompt": "Dynamic tracking shot of BYD Atto 3 driving through city at night, neon reflections, cinematic lighting",
  "style": ["dialog", "cinematic", "creative"],
  "aspectRatio": "16:9",
  "duration": "20 seconds",
  "orientation": "landscape"
}
```

Prompt sudah otomatis di-improve sesuai [Gemini Video API Prompt Guide](https://ai.google.dev/gemini-api/docs/video?hl=id&example=style#prompt-guide).
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

<details>
<summary><strong>Supported Languages</strong></summary>

| Language | Code |
|----------|------|
| English | en |
| Arabic – Egypt | ar-EG |
| German – Germany | de-DE |
| Spanish – Mexico | es-MX |
| French – France | fr-FR |
| Hindi – India | hi-IN |
| Indonesian – Indonesia | id-ID |
| Italian – Italy | it-IT |
| Japanese – Japan | ja-JP |
| Korean – Korea | ko-KR |
| Portuguese – Brazil | pt-BR |
| Russian – Russia | ru-RU |
| Ukrainian – Ukraine | ua-UA |
| Vietnamese – Vietnam | vi-VN |
| Chinese – China | zh-CN |

</details>

---

## Detailed Guide

### 1. Enhance Prompt (`/api/image/enhance-prompt`)

**Use when:** You have a short/simple prompt and want AI to make it more detailed and effective.

**What you need:**
- `prompt` - Your short prompt (required)
- `style` - Desired style like "cinematic", "minimalist", "professional" (optional)
- `purpose` - Purpose like "instagram post", "billboard", "product catalog" (optional)
- `language` - Response language code (optional, default: en)

**Example:**
```json
{
  "prompt": "BYD car",
  "style": "cinematic",
  "purpose": "instagram post"
}
```

**Response:**
```json
{
  "success": true,
  "original": "BYD car",
  "enhanced": "Professional marketing shot of a sleek BYD electric vehicle, cinematic lighting with golden hour sun rays, dynamic low angle composition, reflective metallic surface, modern urban backdrop with subtle bokeh, high-end automotive photography style",
  "variations": [
    "BYD electric car in minimalist white studio, soft diffused lighting, clean reflections",
    "Dynamic BYD vehicle in motion on coastal highway, dramatic sunset sky",
    "Elegant BYD sedan parked at luxury venue, night scene with ambient city lights"
  ],
  "tips": [
    "Specify car model for more accurate results",
    "Add color preference for the vehicle"
  ]
}
```

Copy the `enhanced` prompt or pick from `variations` and use it in `/generate`!

---

### 2. Analyze Image & Get Suggestions (`/api/image/analyze`)

**Use when:** You uploaded an image but don't know what to do with it. Get AI-powered suggestions!

**What you need:**
- `image` - Upload your image (required)
- `language` - Response language code from supported languages above (optional, default: en)

**Example:**
```
image: [upload car.jpg]
language: id
```

**Response:**
```json
{
  "success": true,
  "analysis": {
    "description": "A black sedan car on a city street",
    "detected": {
      "objects": ["car", "building", "road"],
      "people": "1 person in driver seat",
      "background": "City street with tall buildings",
      "colors": ["black", "gray", "blue sky"],
      "mood": "Urban, modern"
    },
    "suggestions": [
      {
        "action": "remove",
        "prompt": "Remove the person inside the car",
        "description": "For cleaner product photo"
      },
      {
        "action": "change",
        "prompt": "Change background to beach sunset",
        "description": "More attractive for marketing"
      }
    ]
  }
}
```

You can copy the `prompt` from suggestions and use it directly in `/edit` or `/elements` endpoint!

---

### 3. Text to Image (`/api/image/generate`)

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

### 4. Edit Image (`/api/image/edit`)

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

### 5. Add/Remove Elements (`/api/image/elements`)

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

### 6. Mask Edit (`/api/image/mask-edit`)

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

### 7. Combine Images (`/api/image/combine`)

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

### 8. 360 View (`/api/image/360-view`)

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

### 9. Upscale Image (`/api/image/upscale`)

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

### 10. Image Chat (`/api/image/chat`)

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

### 11. Marketing Content (`/api/image/marketing`)

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

## Viral Trends Discovery

### Search Trends (`/api/trends/search`)

**Use when:** You want to discover real-time viral trends and topics for your marketing content.

**Request (JSON):**
```json
{
  "query": "BYD electric cars Indonesia",
  "platform": "instagram",
  "topic": "automotive",
  "language": "en"
}
```

**Parameters:**
| Parameter | Required | Description |
|-----------|----------|-------------|
| query | Yes | Search query for trends |
| platform | No | Filter by: instagram, tiktok, youtube, linkedin, twitter |
| topic | No | Filter by: general, automotive, ev, technology, lifestyle |
| language | No | en (default) or id |

**Response:**
```json
{
  "success": true,
  "query": "BYD electric cars Indonesia",
  "trends": [
    {
      "topic": "BYD Atto 3 Dominates Indonesia EV Market",
      "keyTopic": "BYDAtto3",
      "scale": 0.85,
      "sentiment": {
        "positive": 72,
        "negative": 28,
        "label": "positive"
      },
      "sources": [
        {
          "title": "Article title",
          "url": "https://example.com",
          "platform": "news"
        }
      ],
      "description": "BYD Atto 3 becomes best-selling EV in Indonesia...",
      "category": "automotive",
      "engagement": {
        "estimated": "high",
        "reason": "Strong social media discussions"
      }
    }
  ],
  "summary": "Overall trend summary",
  "grounding": {
    "searchQueries": ["queries used"],
    "sources": [{"title": "...", "uri": "..."}]
  }
}
```

---

### Generate Content from Trend (`/api/trends/generate-content`)

**Use when:** You've selected a trending topic and want to generate headlines, storyline, and visual prompts.

**Request (JSON):**
```json
{
  "topic": "BYD Atto 3 Dominates Indonesia EV Market",
  "keyTopic": "BYDAtto3",
  "targetAudience": "Gen Z, Car Enthusiasts",
  "toneOfVoice": "Professional & Authoritative",
  "targetKeywords": "BYD, EV, electric car",
  "slideCount": 5,
  "language": "en"
}
```

**Response:**
```json
{
  "success": true,
  "headlines": [
    {
      "text": "Why Gen Z is Choosing BYD Atto 3 Over Tesla",
      "type": "high-clickrate",
      "hook": "Creates curiosity with comparison"
    }
  ],
  "storyline": {
    "slides": [
      {
        "slideNumber": 1,
        "title": "HOOK",
        "content": "Open with a striking question...",
        "duration": "3-5 seconds",
        "visualCue": "Close-up of BYD Atto 3 front grille"
      }
    ]
  },
  "visualDescription": {
    "photo": {
      "prompt": "Professional automotive photography, BYD Atto 3 in urban Jakarta setting...",
      "style": "cinematic",
      "aspectRatio": "4:5"
    },
    "video": {
      "prompt": "Dynamic tracking shot of BYD Atto 3 driving through city...",
      "style": "dynamic",
      "duration": "15-30 seconds",
      "aspectRatio": "9:16"
    }
  },
  "hashtags": ["#BYD", "#BYDAtto3", "#ElectricVehicle"],
  "callToAction": "Book your test drive today!",
  "bestPostingTime": "6-8 PM local time"
}
```

---

### Regenerate Headlines (`/api/trends/regenerate-headlines`)

**Use when:** You want different headline options for the same topic.

**Request (JSON):**
```json
{
  "topic": "BYD Atto 3 Indonesia",
  "currentHeadlines": ["Previous headline 1", "Previous headline 2"],
  "style": "question",
  "language": "en"
}
```

---

### Polish Content (`/api/trends/polish`)

**Use when:** You have content that needs improvement.

**Request (JSON):**
```json
{
  "content": "BYD car is good for environment",
  "instruction": "Make it more engaging and professional",
  "language": "en"
}
```

**Response:**
```json
{
  "success": true,
  "original": "BYD car is good for environment",
  "polished": "Drive the change you want to see. BYD vehicles deliver zero-emission performance without compromising on style or power.",
  "changes": ["Added emotional hook", "More specific benefits", "Professional tone"]
}
```

---

### Get Trend Options (`GET /api/trends/options`)

Returns all available options for trend searches and content generation.

---

## Health Check

- `GET /health` - Check if server is running
- `GET /health/gemini` - Check if AI service is connected

---

## API Documentation

For technical details and testing, visit: `http://localhost:4000/docs`
