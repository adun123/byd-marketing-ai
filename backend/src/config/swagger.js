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
  },
};

export default swaggerDocument;
