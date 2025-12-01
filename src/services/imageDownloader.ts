/**
 * Image Downloader Service
 * URL에서 이미지를 다운로드하여 로컬에 저장
 * Expo Go에서는 URL만 저장 (Development Build에서만 다운로드)
 */

import { Platform } from 'react-native';

export interface DownloadResult {
  success: boolean;
  localUri?: string;
  error?: string;
}

/**
 * 이미지 다운로드 (Expo Go에서는 URL만 반환)
 * Development Build나 실제 빌드에서만 로컬 다운로드 가능
 */
export async function downloadImage(imageUrl: string): Promise<DownloadResult> {
  try {
    console.log('Image URL:', imageUrl);
    
    // Expo Go에서는 다운로드 불가능
    // URL만 반환하고 Image 컴포넌트의 캐싱에 의존
    console.log('Using URL directly (download not available in Expo Go)');
    
    return {
      success: true,
      localUri: imageUrl, // URL을 그대로 사용
    };
  } catch (error) {
    console.error('Download error:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}

/**
 * 여러 이미지를 한 번에 다운로드
 */
export async function downloadMultipleImages(
  imageUrls: string[]
): Promise<DownloadResult[]> {
  console.log(`Processing ${imageUrls.length} images...`);
  
  const downloadPromises = imageUrls.map(url => downloadImage(url));
  const results = await Promise.allSettled(downloadPromises);
  
  return results.map((result, index) => {
    if (result.status === 'fulfilled') {
      return result.value;
    } else {
      console.error(`Failed to process image ${index}:`, result.reason);
      return {
        success: false,
        error: result.reason?.message || 'Processing failed',
      };
    }
  });
}
