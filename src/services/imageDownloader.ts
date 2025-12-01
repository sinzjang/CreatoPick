/**
 * Image Downloader Service
 * URL에서 이미지를 다운로드하여 로컬에 저장
 * Expo SDK v54 호환 버전
 */

import * as FileSystem from 'expo-file-system';
import { Platform } from 'react-native';

export interface DownloadResult {
  success: boolean;
  localUri?: string;
  error?: string;
}

/**
 * 이미지 URL에서 파일명 추출
 */
function getFilenameFromUrl(url: string): string {
  try {
    const urlObj = new URL(url);
    const pathname = urlObj.pathname;
    const filename = pathname.split('/').pop() || `image_${Date.now()}.jpg`;
    
    // 확장자가 없으면 .jpg 추가
    if (!filename.includes('.')) {
      return `${filename}.jpg`;
    }
    
    return filename;
  } catch (error) {
    return `image_${Date.now()}.jpg`;
  }
}

/**
 * 이미지를 다운로드하여 로컬에 저장
 * FileSystem.downloadAsync 사용 (간단하고 안정적)
 */
export async function downloadImage(imageUrl: string): Promise<DownloadResult> {
  try {
    console.log('Downloading image from:', imageUrl);
    
    // 파일명 생성
    const filename = getFilenameFromUrl(imageUrl);
    const localUri = `${FileSystem.documentDirectory}${filename}`;
    
    // FileSystem.downloadAsync 사용 (권장 방법)
    const downloadResult = await FileSystem.downloadAsync(imageUrl, localUri);
    
    if (downloadResult.status === 200) {
      console.log('Image downloaded successfully:', downloadResult.uri);
      return {
        success: true,
        localUri: downloadResult.uri,
      };
    } else {
      throw new Error(`Download failed with status: ${downloadResult.status}`);
    }
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
  console.log(`Downloading ${imageUrls.length} images...`);
  
  const downloadPromises = imageUrls.map(url => downloadImage(url));
  const results = await Promise.allSettled(downloadPromises);
  
  return results.map((result, index) => {
    if (result.status === 'fulfilled') {
      return result.value;
    } else {
      console.error(`Failed to download image ${index}:`, result.reason);
      return {
        success: false,
        error: result.reason?.message || 'Download failed',
      };
    }
  });
}

/**
 * 로컬 이미지 삭제
 */
export async function deleteLocalImage(localUri: string): Promise<boolean> {
  try {
    const fileInfo = await FileSystem.getInfoAsync(localUri);
    
    if (fileInfo.exists) {
      await FileSystem.deleteAsync(localUri);
      console.log('Image deleted:', localUri);
      return true;
    } else {
      console.warn('Image does not exist:', localUri);
      return false;
    }
  } catch (error) {
    console.error('Delete error:', error);
    return false;
  }
}

/**
 * 이미지가 로컬에 존재하는지 확인
 */
export async function checkImageExists(localUri: string): Promise<boolean> {
  try {
    const fileInfo = await FileSystem.getInfoAsync(localUri);
    return fileInfo.exists;
  } catch (error) {
    console.error('Check exists error:', error);
    return false;
  }
}

/**
 * 로컬 이미지 정보 가져오기
 */
export async function getImageInfo(localUri: string) {
  try {
    const fileInfo = await FileSystem.getInfoAsync(localUri);
    return fileInfo;
  } catch (error) {
    console.error('Get info error:', error);
    return null;
  }
}

/**
 * Base64로 이미지 읽기 (선택적)
 */
export async function readImageAsBase64(localUri: string): Promise<string | null> {
  try {
    const base64 = await FileSystem.readAsStringAsync(localUri, {
      encoding: FileSystem.EncodingType.Base64,
    });
    return base64;
  } catch (error) {
    console.error('Read as base64 error:', error);
    return null;
  }
}

/**
 * 이미지 캐시 디렉토리 정리
 */
export async function clearImageCache(): Promise<number> {
  try {
    const directory = FileSystem.documentDirectory;
    if (!directory) return 0;
    
    const files = await FileSystem.readDirectoryAsync(directory);
    const imageFiles = files.filter((file: string) => 
      file.endsWith('.jpg') || 
      file.endsWith('.jpeg') || 
      file.endsWith('.png') || 
      file.endsWith('.webp')
    );
    
    let deletedCount = 0;
    for (const file of imageFiles) {
      const uri = `${directory}${file}`;
      await FileSystem.deleteAsync(uri, { idempotent: true });
      deletedCount++;
    }
    
    console.log(`Cleared ${deletedCount} cached images`);
    return deletedCount;
  } catch (error) {
    console.error('Clear cache error:', error);
    return 0;
  }
}
