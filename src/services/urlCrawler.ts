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
      
      // 1순위: og:image (가장 신뢰할 수 있는 메인 이미지)
      const ogImageMatch = html.match(/<meta property="og:image" content="([^"]*)"/i);
      if (ogImageMatch && ogImageMatch[1]) {
        const ogImage = ogImageMatch[1];
        // 유효한 이미지 URL인지 확인
        if (ogImage.startsWith('http') && !ogImage.includes('placeholder')) {
          images.push(ogImage);
          console.log('Found og:image:', ogImage);
        }
      }
      
      // 2순위: originals (최고 품질 원본)
      const originalsRegex = /https:\/\/i\.pinimg\.com\/originals\/[a-f0-9]{2}\/[a-f0-9]{2}\/[a-f0-9]{2}\/[a-f0-9]+\.(jpg|jpeg|png|webp)/gi;
      let match;
      const originalsSet = new Set<string>();
      while ((match = originalsRegex.exec(html)) !== null) {
        originalsSet.add(match[0]);
      }
      console.log('Originals found:', originalsSet.size);
      
      // 3순위: 736x (고품질)
      const largeRegex = /https:\/\/i\.pinimg\.com\/736x\/[a-f0-9]{2}\/[a-f0-9]{2}\/[a-f0-9]{2}\/[a-f0-9]+\.(jpg|jpeg|png|webp)/gi;
      const largeSet = new Set<string>();
      while ((match = largeRegex.exec(html)) !== null) {
        largeSet.add(match[0]);
      }
      console.log('736x images found:', largeSet.size);
      
      // originals 우선, 없으면 736x 사용
      const highQualityImages = originalsSet.size > 0 
        ? Array.from(originalsSet) 
        : Array.from(largeSet);
      console.log('Using image source:', originalsSet.size > 0 ? 'originals' : '736x');
      
      // 필터링할 공통 이미지 (Pinterest UI 요소 등)
      const excludePatterns = [
        'd53b014d86a6b6761bf649a0ed813c2b', // Pinterest 공통 이미지
      ];
      
      // 최대 3개만 추가 (중복 방지 및 제외 패턴 필터링)
      highQualityImages.forEach((img, index) => {
        // 제외 패턴 체크
        const shouldExclude = excludePatterns.some(pattern => img.includes(pattern));
        
        if (!shouldExclude && !images.includes(img) && images.length < 3) {
          images.push(img);
          console.log(`High-quality image ${images.length}:`, img);
        } else if (shouldExclude) {
          console.log(`Excluded common image:`, img);
        }
      });
      
      console.log('Pinterest images found:', images.length);
      console.log('All images:', images);
      
      // 최소 1개 이상의 이미지가 있어야 함
      if (images.length === 0) {
        throw new Error('이미지를 찾을 수 없습니다.');
      }
      
      return images;
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
 * Dribbble URL에서 이미지 추출
 */
export async function crawlDribbbleUrl(url: string): Promise<CrawledData> {
  try {
    console.log('Crawling Dribbble URL:', url);
    
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (iPhone; CPU iPhone OS 16_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/16.0 Mobile/15E148 Safari/604.1',
      },
    });
    
    const html = await response.text();
    
    const extractDribbbleImage = (): string[] => {
      const images: string[] = [];
      
      // 1순위: og:image
      const ogImageMatch = html.match(/<meta property="og:image" content="([^"]*)"/i);
      if (ogImageMatch && ogImageMatch[1]) {
        images.push(ogImageMatch[1]);
        console.log('Found Dribbble og:image:', ogImageMatch[1]);
      }
      
      // 2순위: data-img-src (Dribbble 특화)
      const dataImgRegex = /data-img-src="([^"]*)"/gi;
      let match;
      const imgSet = new Set<string>();
      while ((match = dataImgRegex.exec(html)) !== null) {
        if (match[1].includes('cdn.dribbble.com/users')) {
          imgSet.add(match[1]);
        }
      }
      
      // 3순위: img src (고해상도)
      const imgSrcRegex = /<img[^>]+src="(https:\/\/cdn\.dribbble\.com\/[^"]+)"/gi;
      while ((match = imgSrcRegex.exec(html)) !== null) {
        if (!match[1].includes('avatar')) {
          imgSet.add(match[1]);
        }
      }
      
      console.log('Dribbble images found in HTML:', imgSet.size);
      
      // 최대 3개 추가
      Array.from(imgSet).slice(0, 3).forEach(img => {
        if (!images.includes(img)) {
          images.push(img);
        }
      });
      
      if (images.length === 0) {
        throw new Error('이미지를 찾을 수 없습니다.');
      }
      
      return images;
    };
    
    const title = html.match(/<meta property="og:title" content="([^"]*)"/i)?.[1] || 
                  html.match(/<title>([^<]*)<\/title>/i)?.[1] || 
                  'Dribbble Shot';
    
    const description = html.match(/<meta property="og:description" content="([^"]*)"/i)?.[1] ||
                       html.match(/<meta name="description" content="([^"]*)"/i)?.[1];
    
    const images = extractDribbbleImage();
    
    console.log('Dribbble crawled:', { title, images: images.length });
    
    return {
      url,
      title,
      description,
      images,
      siteName: 'Dribbble',
    };
  } catch (error) {
    console.error('Dribbble crawl error:', error);
    throw new Error('Dribbble URL 크롤링에 실패했습니다.');
  }
}

/**
 * Behance URL에서 이미지 추출
 */
export async function crawlBehanceUrl(url: string): Promise<CrawledData> {
  try {
    console.log('Crawling Behance URL:', url);
    
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (iPhone; CPU iPhone OS 16_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/16.0 Mobile/15E148 Safari/604.1',
      },
    });
    
    const html = await response.text();
    
    const extractBehanceImage = (): string[] => {
      const images: string[] = [];
      
      // 1순위: og:image
      const ogImageMatch = html.match(/<meta property="og:image" content="([^"]*)"/i);
      if (ogImageMatch && ogImageMatch[1]) {
        images.push(ogImageMatch[1]);
        console.log('Found Behance og:image:', ogImageMatch[1]);
      }
      
      // 2순위: mir-media (Behance CDN)
      const behanceRegex = /https:\/\/mir-s3-cdn-cf\.behance\.net\/project_modules\/[^"'\s]+\.(jpg|jpeg|png|webp)/gi;
      let match;
      const imgSet = new Set<string>();
      while ((match = behanceRegex.exec(html)) !== null) {
        imgSet.add(match[0]);
      }
      
      console.log('Behance images found in HTML:', imgSet.size);
      
      // 최대 3개 추가
      Array.from(imgSet).slice(0, 3).forEach(img => {
        if (!images.includes(img)) {
          images.push(img);
        }
      });
      
      if (images.length === 0) {
        throw new Error('이미지를 찾을 수 없습니다.');
      }
      
      return images;
    };
    
    const title = html.match(/<meta property="og:title" content="([^"]*)"/i)?.[1] || 
                  html.match(/<title>([^<]*)<\/title>/i)?.[1] || 
                  'Behance Project';
    
    const description = html.match(/<meta property="og:description" content="([^"]*)"/i)?.[1] ||
                       html.match(/<meta name="description" content="([^"]*)"/i)?.[1];
    
    const images = extractBehanceImage();
    
    console.log('Behance crawled:', { title, images: images.length });
    
    return {
      url,
      title,
      description,
      images,
      siteName: 'Behance',
    };
  } catch (error) {
    console.error('Behance crawl error:', error);
    throw new Error('Behance URL 크롤링에 실패했습니다.');
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
  
  console.log('Smart crawl detected URL type:', urlType);
  
  switch (urlType) {
    case 'pinterest':
      return crawlPinterestUrl(url);
    case 'dribbble':
      return crawlDribbbleUrl(url);
    case 'behance':
      return crawlBehanceUrl(url);
    case 'generic':
    default:
      return crawlUrl(url);
  }
}
