const swaggerDocument = {
  openapi: "3.0.0",
  info: {
    title: "BYD Content Marketing AI API",
    version: "1.0.0",
    description: "API untuk generate konten marketing ",
  },
  servers: [
    {
      url: "http://localhost:4000/api",
      description: "Local Server",
    },
  ],
  tags: [
    { name: "Marketing", description: "Marketing content generation" },
    { name: "Image Generation", description: "Text to image generation" },
    { name: "Image Editing", description: "Edit dan modify gambar" },
    { name: "Utility", description: "Resize, combine, dan utility lainnya" },
  ],
  paths: {
    "/image/marketing/options": {
      get: {
        tags: ["Marketing"],
        summary: "Get Marketing Options",
        description: "Ambil semua opsi platform, content type, dan target audience",
        responses: {
          200: {
            description: "Berhasil mengambil data",
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
        description: "Generate konten marketing berdasarkan platform, tipe konten, dan target audience",
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
                    description: "Platform target",
                  },
                  contentType: {
                    type: "string",
                    enum: ["edu-ent", "soft-campaign"],
                    description: "Tipe konten",
                  },
                  targetAudience: {
                    type: "string",
                    enum: ["genz-balanced", "genz-emotional", "genalpha-balanced", "genalpha-emotional"],
                    description: "Target audience",
                  },
                  product: { type: "string", description: "Nama produk/topik" },
                  brand: { type: "string", description: "Nama brand" },
                  message: { type: "string", description: "Key message" },
                  customAspectRatio: { type: "string", description: "Custom aspect ratio (contoh: 4:5)" },
                  customWidth: { type: "integer", description: "Custom width" },
                  customHeight: { type: "integer", description: "Custom height" },
                  image: { type: "string", format: "binary", description: "Reference image (optional)" },
                },
              },
            },
          },
        },
        responses: {
          200: { description: "Berhasil generate konten" },
          400: { description: "Parameter tidak valid" },
          500: { description: "Server error" },
        },
      },
    },
    "/image/generate": {
      post: {
        tags: ["Image Generation"],
        summary: "Text to Image",
        description: "Generate gambar dari text prompt dengan opsi jumlah hasil",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                required: ["prompt"],
                properties: {
                  prompt: { type: "string", description: "Deskripsi gambar yang ingin dibuat" },
                  style: { type: "string", description: "Style gambar" },
                  aspectRatio: { type: "string", description: "Aspect ratio" },
                  brand: { type: "string", description: "Brand name" },
                  numberOfResults: { type: "integer", minimum: 1, maximum: 4, default: 1, description: "Jumlah gambar yang akan digenerate (1-4)" },
                },
              },
            },
          },
        },
        responses: {
          200: { description: "Berhasil generate gambar" },
          400: { description: "Prompt required" },
          500: { description: "Server error" },
        },
      },
    },
    "/image/edit": {
      post: {
        tags: ["Image Editing"],
        summary: "Edit Image",
        description: "Edit gambar berdasarkan instruksi text",
        requestBody: {
          required: true,
          content: {
            "multipart/form-data": {
              schema: {
                type: "object",
                required: ["image", "prompt"],
                properties: {
                  image: { type: "string", format: "binary", description: "Gambar yang akan diedit" },
                  prompt: { type: "string", description: "Instruksi edit" },
                  preserveStyle: { type: "string", enum: ["true", "false"], description: "Pertahankan style" },
                },
              },
            },
          },
        },
        responses: {
          200: { description: "Berhasil edit gambar" },
          400: { description: "Image dan prompt required" },
          500: { description: "Server error" },
        },
      },
    },
    "/image/elements": {
      post: {
        tags: ["Image Editing"],
        summary: "Add/Remove Elements",
        description: "Tambah atau hapus elemen dari gambar",
        requestBody: {
          required: true,
          content: {
            "multipart/form-data": {
              schema: {
                type: "object",
                required: ["image", "action", "element"],
                properties: {
                  image: { type: "string", format: "binary" },
                  action: { type: "string", enum: ["add", "remove"], description: "Aksi" },
                  element: { type: "string", description: "Elemen yang akan ditambah/dihapus" },
                  position: { type: "string", description: "Posisi (untuk add)" },
                  description: { type: "string", description: "Deskripsi tambahan" },
                },
              },
            },
          },
        },
        responses: {
          200: { description: "Berhasil modify elemen" },
          400: { description: "Parameter tidak valid" },
          500: { description: "Server error" },
        },
      },
    },
    "/image/mask-edit": {
      post: {
        tags: ["Image Editing"],
        summary: "Mask Edit (Inpainting)",
        description: "Edit bagian tertentu gambar menggunakan mask atau deskripsi area",
        requestBody: {
          required: true,
          content: {
            "multipart/form-data": {
              schema: {
                type: "object",
                required: ["image", "prompt"],
                properties: {
                  image: { type: "string", format: "binary", description: "Gambar utama" },
                  mask: { type: "string", format: "binary", description: "Mask image (optional)" },
                  prompt: { type: "string", description: "Instruksi edit" },
                  maskDescription: { type: "string", description: "Deskripsi area yang akan diedit (jika tanpa mask)" },
                },
              },
            },
          },
        },
        responses: {
          200: { description: "Berhasil edit" },
          400: { description: "Parameter tidak valid" },
          500: { description: "Server error" },
        },
      },
    },
    "/image/combine": {
      post: {
        tags: ["Utility"],
        summary: "Combine Images",
        description: "Gabungkan beberapa gambar menjadi satu",
        requestBody: {
          required: true,
          content: {
            "multipart/form-data": {
              schema: {
                type: "object",
                required: ["images", "prompt"],
                properties: {
                  images: { type: "array", items: { type: "string", format: "binary" }, description: "2-5 gambar" },
                  prompt: { type: "string", description: "Instruksi combine" },
                  layout: { type: "string", description: "Layout" },
                  style: { type: "string", description: "Style" },
                },
              },
            },
          },
        },
        responses: {
          200: { description: "Berhasil combine" },
          400: { description: "Minimal 2 gambar required" },
          500: { description: "Server error" },
        },
      },
    },
    "/image/360-view": {
      post: {
        tags: ["Utility"],
        summary: "Generate 360 View",
        description: "Generate multiple angle views dengan konsistensi karakter",
        requestBody: {
          required: true,
          content: {
            "multipart/form-data": {
              schema: {
                type: "object",
                properties: {
                  image: { type: "string", format: "binary", description: "Reference image (optional)" },
                  characterDescription: { type: "string", description: "Deskripsi karakter (jika tanpa image)" },
                  prompt: { type: "string", description: "Instruksi tambahan" },
                  angles: { type: "array", items: { type: "string" }, description: "Angle yang diinginkan" },
                },
              },
            },
          },
        },
        responses: {
          200: { description: "Berhasil generate views" },
          400: { description: "Image atau characterDescription required" },
          500: { description: "Server error" },
        },
      },
    },
    "/image/upscale": {
      post: {
        tags: ["Utility"],
        summary: "Upscale Image",
        description: "Upscale gambar ke resolusi lebih tinggi (HD, FullHD, 2K, 4K)",
        requestBody: {
          required: true,
          content: {
            "multipart/form-data": {
              schema: {
                type: "object",
                required: ["image"],
                properties: {
                  image: { type: "string", format: "binary" },
                  preset: { type: "string", enum: ["hd", "fullhd", "2k", "4k"], description: "Preset resolusi" },
                  width: { type: "integer", description: "Custom width (jika tanpa preset)" },
                  height: { type: "integer", description: "Custom height (jika tanpa preset)" },
                  quality: { type: "integer", minimum: 1, maximum: 100, default: 90, description: "Output quality" },
                },
              },
            },
          },
        },
        responses: {
          200: { description: "Berhasil upscale" },
          400: { description: "Image required" },
          500: { description: "Server error" },
        },
      },
    },
    "/image/chat": {
      post: {
        tags: ["Utility"],
        summary: "Conversational Image Chat",
        description: "Multi-turn conversation untuk editing gambar",
        requestBody: {
          required: true,
          content: {
            "multipart/form-data": {
              schema: {
                type: "object",
                required: ["message"],
                properties: {
                  image: { type: "string", format: "binary", description: "Current image (optional)" },
                  message: { type: "string", description: "Pesan user" },
                  conversationHistory: { type: "string", description: "JSON array conversation history" },
                },
              },
            },
          },
        },
        responses: {
          200: { description: "Berhasil" },
          400: { description: "Message required" },
          500: { description: "Server error" },
        },
      },
    },
  },
};

export default swaggerDocument;
