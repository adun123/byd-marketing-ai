const swaggerDocument = {
  openapi: "3.0.0",
  info: {
    title: "BYD Content Marketing AI API",
    version: "1.0.2",
    description: "API for generating marketing content using Gemini AI",
  },
  servers: [
    {
      url: "http://localhost:4000/api",
      description: "Local Server",
    },
  ],
  tags: [
    { name: "Prompt", description: "Prompt enhancement tools" },
    { name: "Trends", description: "Viral trends discovery and content generation" },
    { name: "Video", description: "AI Video Generator (Veo)" },
    { name: "Marketing", description: "Marketing content generation" },
    { name: "Image Analysis", description: "Analyze images and get suggestions" },
    { name: "Image Generation", description: "Text to image generation" },
    { name: "Image Editing", description: "Edit and modify images" },
    { name: "Utility", description: "Upscale, combine, and other utilities" },
  ],
  paths: {
    "/image/enhance-prompt": {
      post: {
        tags: ["Prompt"],
        summary: "Enhance Prompt",
        description: "Transform a short prompt into a detailed, effective prompt for image generation",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                required: ["prompt"],
                properties: {
                  prompt: { type: "string", description: "Your short prompt to enhance" },
                  style: { type: "string", description: "Desired style (e.g. cinematic, minimalist, professional)" },
                  purpose: { type: "string", description: "Purpose (e.g. instagram post, billboard, product catalog)" },
                  language: { 
                    type: "string", 
                    enum: ["en", "id"],
                    default: "en",
                    description: "Response language" 
                  },
                },
              },
            },
          },
        },
        responses: {
          200: {
            description: "Successfully enhanced prompt",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    success: { type: "boolean" },
                    original: { type: "string" },
                    enhanced: { type: "string" },
                    variations: { type: "array", items: { type: "string" } },
                    tips: { type: "array", items: { type: "string" } },
                  },
                },
              },
            },
          },
          400: { description: "Prompt required" },
          500: { description: "Server error" },
        },
      },
    },
    "/image/analyze": {
      post: {
        tags: ["Image Analysis"],
        summary: "Analyze Image & Get Suggestions",
        description: "Upload an image to get AI-powered analysis and editing suggestions",
        requestBody: {
          required: true,
          content: {
            "multipart/form-data": {
              schema: {
                type: "object",
                required: ["image"],
                properties: {
                  image: { type: "string", format: "binary", description: "Image to analyze" },
                  language: { 
                    type: "string", 
                    enum: ["en", "id", "ar-EG", "de-DE", "es-MX", "fr-FR", "hi-IN", "it-IT", "ja-JP", "ko-KR", "pt-BR", "ru-RU", "ua-UA", "vi-VN", "zh-CN"],
                    default: "en",
                    description: "Response language" 
                  },
                },
              },
            },
          },
        },
        responses: {
          200: {
            description: "Successfully analyzed image",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    success: { type: "boolean" },
                    analysis: {
                      type: "object",
                      properties: {
                        description: { type: "string" },
                        detected: { type: "object" },
                        suggestions: { type: "array" },
                      },
                    },
                  },
                },
              },
            },
          },
          400: { description: "Image required" },
          500: { description: "Server error" },
        },
      },
    },
    "/image/marketing/options": {
      get: {
        tags: ["Marketing"],
        summary: "Get Marketing Options",
        description: "Get all platform, content type, and target audience options",
        responses: {
          200: {
            description: "Successfully retrieved data",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    platforms: { type: "array" },
                    contentTypes: { type: "array" },
                    targetAudiences: { type: "array" },
                  },
                },
              },
            },
          },
        },
      },
    },
    "/image/marketing": {
      post: {
        tags: ["Marketing"],
        summary: "Generate Marketing Content",
        description: "Generate marketing content based on platform, content type, and target audience",
        requestBody: {
          required: true,
          content: {
            "multipart/form-data": {
              schema: {
                type: "object",
                required: ["platform", "contentType", "targetAudience"],
                properties: {
                  platform: {
                    type: "string",
                    enum: ["tiktok-reels", "youtube-shorts", "instagram-post", "linkedin"],
                    description: "Target platform",
                  },
                  contentType: {
                    type: "string",
                    enum: ["edu-ent", "soft-campaign"],
                    description: "Content type",
                  },
                  targetAudience: {
                    type: "string",
                    enum: ["genz-balanced", "genz-emotional", "genalpha-balanced", "genalpha-emotional"],
                    description: "Target audience",
                  },
                  product: { type: "string", description: "Product name/topic" },
                  brand: { type: "string", description: "Brand name" },
                  message: { type: "string", description: "Key message" },
                  customAspectRatio: { type: "string", description: "Custom aspect ratio (e.g. 4:5)" },
                  customWidth: { type: "integer", description: "Custom width" },
                  customHeight: { type: "integer", description: "Custom height" },
                  image: { type: "string", format: "binary", description: "Reference image (optional)" },
                },
              },
            },
          },
        },
        responses: {
          200: { description: "Successfully generated content" },
          400: { description: "Invalid parameters" },
          500: { description: "Server error" },
        },
      },
    },
    "/image/generate": {
      post: {
        tags: ["Image Generation"],
        summary: "Text to Image",
        description: "Generate images from text prompt with number of results option",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                required: ["prompt"],
                properties: {
                  prompt: { type: "string", description: "Description of the image to create" },
                  style: { type: "string", description: "Image style" },
                  aspectRatio: { type: "string", description: "Aspect ratio" },
                  brand: { type: "string", description: "Brand name" },
                  numberOfResults: { type: "integer", minimum: 1, maximum: 4, default: 1, description: "Number of images to generate (1-4)" },
                },
              },
            },
          },
        },
        responses: {
          200: { description: "Successfully generated image" },
          400: { description: "Prompt required" },
          500: { description: "Server error" },
        },
      },
    },
    "/image/edit": {
      post: {
        tags: ["Image Editing"],
        summary: "Edit Image",
        description: "Edit image based on text instructions",
        requestBody: {
          required: true,
          content: {
            "multipart/form-data": {
              schema: {
                type: "object",
                required: ["image", "prompt"],
                properties: {
                  image: { type: "string", format: "binary", description: "Image to edit" },
                  prompt: { type: "string", description: "Edit instructions" },
                  preserveStyle: { type: "string", enum: ["true", "false"], description: "Preserve original style" },
                },
              },
            },
          },
        },
        responses: {
          200: { description: "Successfully edited image" },
          400: { description: "Image and prompt required" },
          500: { description: "Server error" },
        },
      },
    },
    "/image/elements": {
      post: {
        tags: ["Image Editing"],
        summary: "Add/Remove Elements",
        description: "Add or remove elements from an image",
        requestBody: {
          required: true,
          content: {
            "multipart/form-data": {
              schema: {
                type: "object",
                required: ["image", "action", "element"],
                properties: {
                  image: { type: "string", format: "binary" },
                  action: { type: "string", enum: ["add", "remove"], description: "Action" },
                  element: { type: "string", description: "Element to add/remove" },
                  position: { type: "string", description: "Position (for add)" },
                  description: { type: "string", description: "Additional description" },
                },
              },
            },
          },
        },
        responses: {
          200: { description: "Successfully modified element" },
          400: { description: "Invalid parameters" },
          500: { description: "Server error" },
        },
      },
    },
    "/image/mask-edit": {
      post: {
        tags: ["Image Editing"],
        summary: "Mask Edit (Inpainting)",
        description: "Edit specific parts of an image using mask or area description",
        requestBody: {
          required: true,
          content: {
            "multipart/form-data": {
              schema: {
                type: "object",
                required: ["image", "prompt"],
                properties: {
                  image: { type: "string", format: "binary", description: "Main image" },
                  mask: { type: "string", format: "binary", description: "Mask image (optional)" },
                  prompt: { type: "string", description: "Edit instructions" },
                  maskDescription: { type: "string", description: "Description of area to edit (if no mask)" },
                },
              },
            },
          },
        },
        responses: {
          200: { description: "Successfully edited" },
          400: { description: "Invalid parameters" },
          500: { description: "Server error" },
        },
      },
    },
    "/image/combine": {
      post: {
        tags: ["Utility"],
        summary: "Combine Images",
        description: "Combine multiple images into one",
        requestBody: {
          required: true,
          content: {
            "multipart/form-data": {
              schema: {
                type: "object",
                required: ["images", "prompt"],
                properties: {
                  images: { type: "array", items: { type: "string", format: "binary" }, description: "2-5 images" },
                  prompt: { type: "string", description: "Combine instructions" },
                  layout: { type: "string", description: "Layout" },
                  style: { type: "string", description: "Style" },
                },
              },
            },
          },
        },
        responses: {
          200: { description: "Successfully combined" },
          400: { description: "At least 2 images required" },
          500: { description: "Server error" },
        },
      },
    },
    "/image/360-view": {
      post: {
        tags: ["Utility"],
        summary: "Generate 360 View",
        description: "Generate multiple angle views with character consistency",
        requestBody: {
          required: true,
          content: {
            "multipart/form-data": {
              schema: {
                type: "object",
                properties: {
                  image: { type: "string", format: "binary", description: "Reference image (optional)" },
                  characterDescription: { type: "string", description: "Character description (if no image)" },
                  prompt: { type: "string", description: "Additional instructions" },
                  angles: { type: "array", items: { type: "string" }, description: "Desired angles" },
                },
              },
            },
          },
        },
        responses: {
          200: { description: "Successfully generated views" },
          400: { description: "Image or characterDescription required" },
          500: { description: "Server error" },
        },
      },
    },
    "/image/upscale": {
      post: {
        tags: ["Utility"],
        summary: "Upscale Image",
        description: "Upscale image to higher resolution (HD, FullHD, 2K, 4K)",
        requestBody: {
          required: true,
          content: {
            "multipart/form-data": {
              schema: {
                type: "object",
                required: ["image"],
                properties: {
                  image: { type: "string", format: "binary" },
                  preset: { type: "string", enum: ["hd", "fullhd", "2k", "4k"], description: "Resolution preset" },
                  width: { type: "integer", description: "Custom width (if no preset)" },
                  height: { type: "integer", description: "Custom height (if no preset)" },
                  quality: { type: "integer", minimum: 1, maximum: 100, default: 90, description: "Output quality" },
                },
              },
            },
          },
        },
        responses: {
          200: { description: "Successfully upscaled" },
          400: { description: "Image required" },
          500: { description: "Server error" },
        },
      },
    },
    "/image/chat": {
      post: {
        tags: ["Utility"],
        summary: "Conversational Image Chat",
        description: "Multi-turn conversation for image editing",
        requestBody: {
          required: true,
          content: {
            "multipart/form-data": {
              schema: {
                type: "object",
                required: ["message"],
                properties: {
                  image: { type: "string", format: "binary", description: "Current image (optional)" },
                  message: { type: "string", description: "User message" },
                  conversationHistory: { type: "string", description: "JSON array conversation history" },
                },
              },
            },
          },
        },
        responses: {
          200: { description: "Success" },
          400: { description: "Message required" },
          500: { description: "Server error" },
        },
      },
    },
    "/trends/search": {
      post: {
        tags: ["Trends"],
        summary: "Search Real-Time Trends",
        description: "Search for viral trends using Google Search Grounding",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                required: ["query"],
                properties: {
                  query: { type: "string", description: "Search query (e.g. BYD electric cars, EV trends)" },
                  platform: { 
                    type: "string", 
                    enum: ["instagram", "tiktok", "youtube", "linkedin", "twitter"],
                    description: "Filter by platform" 
                  },
                  topic: { 
                    type: "string", 
                    enum: ["general", "automotive", "ev", "technology", "lifestyle"],
                    description: "Filter by topic category" 
                  },
                  language: { 
                    type: "string", 
                    enum: ["en", "id"],
                    default: "en",
                    description: "Response language" 
                  },
                },
              },
            },
          },
        },
        responses: {
          200: {
            description: "Successfully retrieved trends",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    success: { type: "boolean" },
                    query: { type: "string" },
                    trends: {
                      type: "array",
                      items: {
                        type: "object",
                        properties: {
                          topic: { type: "string" },
                          keyTopic: { type: "string" },
                          scale: { type: "number" },
                          sentiment: {
                            type: "object",
                            properties: {
                              positive: { type: "number" },
                              negative: { type: "number" },
                              label: { type: "string" },
                            },
                          },
                          sources: { type: "array" },
                          description: { type: "string" },
                        },
                      },
                    },
                    grounding: { type: "object" },
                  },
                },
              },
            },
          },
          400: { description: "Query required" },
          500: { description: "Server error" },
        },
      },
    },
    "/trends/generate-content": {
      post: {
        tags: ["Trends"],
        summary: "Generate Content from Trend",
        description: "Generate headlines, storyline/script, and visual prompts from a selected trend",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  topic: { type: "string", description: "Full topic name" },
                  keyTopic: { type: "string", description: "Key topic keyword" },
                  targetAudience: { type: "string", description: "Target audience (default: Gen Z, Car Enthusiasts)" },
                  toneOfVoice: { type: "string", description: "Tone of voice (default: Professional & Authoritative)" },
                  targetKeywords: { type: "string", description: "SEO keywords to include" },
                  slideCount: { type: "integer", default: 5, description: "Number of slides/sections" },
                  language: { type: "string", enum: ["en", "id"], default: "en" },
                },
              },
            },
          },
        },
        responses: {
          200: {
            description: "Successfully generated content",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    success: { type: "boolean" },
                    headlines: { type: "array" },
                    storyline: { type: "object" },
                    visualDescription: {
                      type: "object",
                      properties: {
                        photo: { type: "object" },
                        video: { type: "object" },
                      },
                    },
                    hashtags: { type: "array" },
                    callToAction: { type: "string" },
                  },
                },
              },
            },
          },
          400: { description: "Topic or keyTopic required" },
          500: { description: "Server error" },
        },
      },
    },
    "/trends/regenerate-headlines": {
      post: {
        tags: ["Trends"],
        summary: "Regenerate Headlines",
        description: "Generate new headlines for a topic",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                required: ["topic"],
                properties: {
                  topic: { type: "string", description: "Topic for headlines" },
                  currentHeadlines: { type: "array", description: "Current headlines to avoid" },
                  style: { type: "string", description: "Headline style preference" },
                  language: { type: "string", enum: ["en", "id"], default: "en" },
                },
              },
            },
          },
        },
        responses: {
          200: { description: "Successfully regenerated headlines" },
          400: { description: "Topic required" },
          500: { description: "Server error" },
        },
      },
    },
    "/trends/polish": {
      post: {
        tags: ["Trends"],
        summary: "Polish Content",
        description: "Polish and improve marketing content",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                required: ["content"],
                properties: {
                  content: { type: "string", description: "Content to polish" },
                  instruction: { type: "string", description: "Specific improvement instruction" },
                  language: { type: "string", enum: ["en", "id"], default: "en" },
                },
              },
            },
          },
        },
        responses: {
          200: { description: "Successfully polished content" },
          400: { description: "Content required" },
          500: { description: "Server error" },
        },
      },
    },
    "/trends/options": {
      get: {
        tags: ["Trends"],
        summary: "Get Trend Options",
        description: "Get available platforms, topics, tone of voice, and audience presets",
        responses: {
          200: {
            description: "Successfully retrieved options",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    platforms: { type: "array" },
                    topics: { type: "array" },
                    toneOfVoice: { type: "array" },
                    audiencePresets: { type: "array" },
                  },
                },
              },
            },
          },
        },
      },
    },
  //       "/video/enhance-prompt": {
  //   "post": {
  //     "tags": ["Video"],
  //     "summary": "Enhance Video Prompt",
  //     "description": "Transforms a rough idea into a detailed prompt optimized for Gemini Veo.",
  //     "requestBody": {
  //       "required": true,
  //       "content": {
  //         "application/json": {
  //           "schema": {
  //             "type": "object",
  //             "required": ["basePrompt"],
  //             "properties": {
  //               "basePrompt": {
  //                 "type": "string",
  //                 "example": "A cat sitting on a neon rooftop overlooking a cyberpunk city",
  //                 "description": "User's initial idea that has not yet been detailed"
  //               },
  //               "language": {
  //                 "type": "string",
  //                 "enum": ["en", "id"],
  //                 "default": "en",
  //                 "description": "Prompt instruction language"
  //               }
  //             }
  //           }
  //         }
  //       }
  //     },
  //     "responses": {
  //       "200": {
  //         "description": "Prompt successfully enhanced",
  //         "content": {
  //           "application/json": {
  //             "schema": {
  //               "type": "object",
  //               "properties": {
  //                 "success": { "type": "boolean" },
  //                 "improvedPrompt": {
  //                   "type": "string",
  //                   "description": "AI-generated prompt ready for use"
  //                 },
  //                 "basePrompt": { "type": "string" }
  //               }
  //             }
  //           }
  //         }
  //       }
  //     }
  //   }
  // },
    // "/video/generate": {
    //   "post": {
    //     "tags": ["Video"],
    //     "summary": "Generate Video (Veo)",
    //     "description": "Generate video using Google Veo (Vertex AI). Supports Text-to-Video and Image-to-Video via Base64. Note: 4K resolution increases latency.",
    //     "requestBody": {
    //       "required": true,
    //       "content": {
    //         "application/json": {
    //           "schema": {
    //             "type": "object",
    //             "properties": {
    //               "prompt": {
    //                 "type": "string",
    //                 "description": "Text description. Required for Text-to-Video. For Image-to-Video, acts as motion instruction.",
    //                 "example": "A cinematic drone shot of a futuristic city at sunset, neon lights"
    //               },
    //               "image": {
    //                 "type": "string",
    //                 "description": "Base64 encoded image string (for Image-to-Video mode).",
    //                 "example": "data:image/jpeg;base64,/9j/4AAQSkZJRg..."
    //               },
    //               "style": {
    //                 "type": "string",
    //                 "enum": ["cinematic", "anime", "cyberpunk", "drone", "vintage", "advertising"],
    //                 "description": "Visual style preset.",
    //                 "default": "cinematic"
    //               },
    //               "resolution": {
    //                 "type": "string",
    //                 "enum": ["720p", "1080p", "4k"],
    //                 "description": "Target video resolution. (Note: '4k' is slower/more expensive).",
    //                 "default": "1080p"
    //               },
    //               "aspectRatio": {
    //                 "type": "string",
    //                 "enum": ["16:9", "9:16", "1:1", "4:3", "3:4"],
    //                 "description": "Video dimensions ratio.",
    //                 "default": "16:9"
    //               },
    //               "duration": {
    //                 "type": "integer",
    //                 "enum": [4, 8],
    //                 "description": "Video duration in seconds.",
    //                 "default": 4
    //               },
    //               "seed": {
    //                 "type": "integer",
    //                 "description": "Random seed for reproducibility."
    //               }
    //             }
    //           }
    //         }
    //       }
    //     },
    //     "responses": {
    //       "200": {
    //         "description": "Video generated successfully",
    //         "content": {
    //           "application/json": {
    //             "schema": {
    //               "type": "object",
    //               "properties": {
    //                 "success": { "type": "boolean", "example": true },
    //                 "videoUrl": {
    //                   "type": "string",
    //                   "description": "Local public URL to play the video",
    //                   "example": "http://localhost:3000/videos/veo_1080p_1741234.mp4"
    //                 },
    //                 "metadata": {
    //                   "type": "object",
    //                   "properties": {
    //                     "prompt": { "type": "string" },
    //                     "duration": { "type": "integer" },
    //                     "resolution": { "type": "string", "example": "1080p" },
    //                     "mode": { "type": "string", "enum": ["TXT2VID", "IMG2VID"] }
    //                   }
    //                 }
    //               }
    //             }
    //           }
    //         }
    //       },
    //       "400": { "description": "Bad Request (Missing prompt/image)" },
    //       "500": { "description": "Server Error (Vertex AI / Storage Error)" }
    //     }
    //   }
    // }
  },
};

export default swaggerDocument;
