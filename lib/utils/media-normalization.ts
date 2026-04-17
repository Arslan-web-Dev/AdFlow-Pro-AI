import AdMedia, { IAdMedia } from '../models/AdMedia';

export interface MediaNormalizationResult {
  sourceType: 'youtube' | 'image' | 'cloudinary' | 'other';
  originalUrl: string;
  thumbnailUrl: string;
  validationStatus: 'valid' | 'invalid' | 'pending';
  errorMessage?: string;
}

export function normalizeYouTubeUrl(url: string): MediaNormalizationResult {
  try {
    // Extract video ID from various YouTube URL formats
    const videoIdMatch = url.match(
      /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/
    );

    if (!videoIdMatch) {
      return {
        sourceType: 'youtube',
        originalUrl: url,
        thumbnailUrl: '',
        validationStatus: 'invalid',
        errorMessage: 'Invalid YouTube URL',
      };
    }

    const videoId = videoIdMatch[1];
    const thumbnailUrl = `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`;

    return {
      sourceType: 'youtube',
      originalUrl: url,
      thumbnailUrl,
      validationStatus: 'valid',
    };
  } catch (error) {
    return {
      sourceType: 'youtube',
      originalUrl: url,
      thumbnailUrl: '',
      validationStatus: 'invalid',
      errorMessage: 'Failed to process YouTube URL',
    };
  }
}

export function normalizeImageUrl(url: string): MediaNormalizationResult {
  try {
    const urlObj = new URL(url);

    // Validate protocol
    if (!['http:', 'https:'].includes(urlObj.protocol)) {
      return {
        sourceType: 'image',
        originalUrl: url,
        thumbnailUrl: '',
        validationStatus: 'invalid',
        errorMessage: 'Invalid protocol. Only HTTP/HTTPS allowed',
      };
    }

    // Validate extension
    const validExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.svg'];
    const hasValidExtension = validExtensions.some(ext =>
      urlObj.pathname.toLowerCase().endsWith(ext)
    );

    // Allow GitHub raw URLs without extension check
    const isGitHubRaw = urlObj.hostname === 'raw.githubusercontent.com';

    if (!hasValidExtension && !isGitHubRaw) {
      return {
        sourceType: 'image',
        originalUrl: url,
        thumbnailUrl: '',
        validationStatus: 'invalid',
        errorMessage: 'Invalid image extension',
      };
    }

    // Allowed domains policy (can be configured)
    const allowedDomains = ['github.com', 'raw.githubusercontent.com', 'imgur.com', 'cdn'];
    const domainAllowed = allowedDomains.some(domain => urlObj.hostname.includes(domain));

    if (!domainAllowed) {
      return {
        sourceType: 'image',
        originalUrl: url,
        thumbnailUrl: url,
        validationStatus: 'valid', // Still valid but may need admin review
        errorMessage: 'Domain not in allowed list - requires review',
      };
    }

    return {
      sourceType: 'image',
      originalUrl: url,
      thumbnailUrl: url,
      validationStatus: 'valid',
    };
  } catch (error) {
    return {
      sourceType: 'image',
      originalUrl: url,
      thumbnailUrl: '',
      validationStatus: 'invalid',
      errorMessage: 'Failed to process image URL',
    };
  }
}

export function normalizeCloudinaryUrl(url: string): MediaNormalizationResult {
  try {
    const urlObj = new URL(url);

    if (!urlObj.hostname.includes('cloudinary.com')) {
      return {
        sourceType: 'cloudinary',
        originalUrl: url,
        thumbnailUrl: '',
        validationStatus: 'invalid',
        errorMessage: 'Not a Cloudinary URL',
      };
    }

    // Extract transformation parameters for thumbnail
    const thumbnailUrl = `${urlObj.origin}${urlObj.pathname}?w=400&h=300&fit=crop`;

    return {
      sourceType: 'cloudinary',
      originalUrl: url,
      thumbnailUrl,
      validationStatus: 'valid',
    };
  } catch (error) {
    return {
      sourceType: 'cloudinary',
      originalUrl: url,
      thumbnailUrl: '',
      validationStatus: 'invalid',
      errorMessage: 'Failed to process Cloudinary URL',
    };
  }
}

export async function normalizeMediaUrl(url: string): Promise<MediaNormalizationResult> {
  if (url.includes('youtube.com') || url.includes('youtu.be')) {
    return normalizeYouTubeUrl(url);
  }

  if (url.includes('cloudinary.com')) {
    return normalizeCloudinaryUrl(url);
  }

  // Default to image normalization
  return normalizeImageUrl(url);
}

export function getPlaceholderThumbnail(): string {
  return 'https://via.placeholder.com/400x300?text=No+Preview+Available';
}

export async function saveMediaToDatabase(
  adId: string,
  mediaUrl: string
): Promise<IAdMedia | null> {
  try {
    const normalized = await normalizeMediaUrl(mediaUrl);

    const media = await AdMedia.create({
      adId,
      sourceType: normalized.sourceType,
      originalUrl: normalized.originalUrl,
      thumbnailUrl: normalized.validationStatus === 'valid'
        ? normalized.thumbnailUrl
        : getPlaceholderThumbnail(),
      validationStatus: normalized.validationStatus,
      errorMessage: normalized.errorMessage,
    });

    return media;
  } catch (error) {
    console.error('Error saving media to database:', error);
    return null;
  }
}
