/**
 * URL Crawler Service
 * URL에서 메타데이터와 이미지를 추출
 */

export interface CrawledData {
  url: string;
  title: string;
  description?: string;
  images: string[];
  favicon?: string;
  siteName?: string;
}

export interface ImageAnalysis {
  description: string;
  designElements: string[];
  colorPalette: string[];
  suggestions: string[];
  style: string;
}

/**
 * 일반 URL 크롤링
 */
export async function crawlUrl(url: string): Promise<CrawledData> {
  try {
    console.log('Crawling URL:', url);
    
    const response = await fetch(url);
    const html = await response.text();
    
    // 제목 추출
    const title = html.match(/<title>([^<]*)<\/title>/i)?.[1] || 'Untitled';
    
    // 설명 추출
    const description = html.match(/<meta name="description" content="([^"]*)"/i)?.[1];
    
    // 이미지 추출 (간단한 버전)
    const imageRegex = /<img[^>]+src="([^">]+)"/gi;
    const images: string[] = [];
    let match;
    while ((match = imageRegex.exec(html)) !== null) {
      images.push(match[1]);
    }
    
    return {
      url,
      title,
      description,
      images: [...new Set(images)],
    };
  } catch (error) {
    console.error('Crawl error:', error);
    throw new Error('URL 크롤링에 실패했습니다.');
  }
}

/**
 * Pinterest URL에서 이미지 추출 (특화)
 */
export async function crawlPinterestUrl(url: string): Promise<CrawledData> {
  try {
    console.log('Crawling Pinterest URL:', url);
    
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (iPhone; CPU iPhone OS 16_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/16.0 Mobile/15E148 Safari/604.1',
      },
    });
    
    const html = await response.text();
    
    // Pinterest 특화 이미지 추출 (우선순위 순서)
    const extractPinterestImage = (): string[] => {
      const images: string[] = [];
      
      // 1순위: elementtiming="closeupImage" (가장 정확한 메인 이미지)
      const closeupImageMatch = html.match(
        /elementtiming="closeupImage"[^>]*src="([^"]*)"/
      );
      if (closeupImageMatch) {
        images.push(closeupImageMatch[1]);
        console.log('Found closeup image:', closeupImageMatch[1]);
      }
      
      // 2순위: StoryPinImageBlock-MainPinImage (스토리 핀)
      const storyImageMatch = html.match(
        /elementtiming="StoryPinImageBlock-MainPinImage"[^>]*src="([^"]*)"/
      );
      if (storyImageMatch) {
        images.push(storyImageMatch[1]);
        console.log('Found story pin image:', storyImageMatch[1]);
      }
      
      // 3순위: og:image
      const ogImageMatch = html.match(/<meta property="og:image" content="([^"]*)"/i);
      if (ogImageMatch) {
        images.push(ogImageMatch[1]);
      }
      
      // 4순위: originals (최고 품질)
      const originalsRegex = /https:\/\/i\.pinimg\.com\/originals\/[^"'\s]*/gi;
      let match;
      while ((match = originalsRegex.exec(html)) !== null) {
        images.push(match[0]);
      }
      
      // 5순위: 736x (고품질)
      const largeRegex = /https:\/\/i\.pinimg\.com\/736x\/[^"'\s]*/gi;
      while ((match = largeRegex.exec(html)) !== null) {
        images.push(match[0]);
      }
      
      // 6순위: 564x (중간 품질)
      const mediumRegex = /https:\/\/i\.pinimg\.com\/564x\/[^"'\s]*/gi;
      while ((match = mediumRegex.exec(html)) !== null) {
        images.push(match[0]);
      }
      
      // 중복 제거
      return [...new Set(images)];
    };
    
    const title = html.match(/<meta property="og:title" content="([^"]*)"/i)?.[1] || 
                  html.match(/<title>([^<]*)<\/title>/i)?.[1] || 
                  'Pinterest Image';
    
    const description = html.match(/<meta property="og:description" content="([^"]*)"/i)?.[1] ||
                       html.match(/<meta name="description" content="([^"]*)"/i)?.[1];
    
    const images = extractPinterestImage();
    
    console.log('Pinterest crawled:', { title, images: images.length });
    
    return {
      url,
      title,
      description,
      images,
      siteName: 'Pinterest',
    };
  } catch (error) {
    console.error('Pinterest crawl error:', error);
    throw new Error('Pinterest URL 크롤링에 실패했습니다.');
  }
}

/**
 * URL 타입 감지
 */
export function detectUrlType(url: string): 'pinterest' | 'dribbble' | 'behance' | 'generic' {
  if (url.includes('pinterest.com')) return 'pinterest';
  if (url.includes('dribbble.com')) return 'dribbble';
  if (url.includes('behance.net')) return 'behance';
  return 'generic';
}

/**
 * 스마트 크롤링 (URL 타입에 따라 적절한 크롤러 선택)
 */
export async function smartCrawl(url: string): Promise<CrawledData> {
  const urlType = detectUrlType(url);
  
  switch (urlType) {
    case 'pinterest':
      return crawlPinterestUrl(url);
    case 'dribbble':
    case 'behance':
    case 'generic':
    default:
      return crawlUrl(url);
  }
}
