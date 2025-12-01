/**
 * Search Keyword Generator Service
 * AI를 사용하여 레퍼런스 검색어를 생성하는 서비스
 */

import Constants from 'expo-constants';

export interface SearchKeywordParams {
  field: string;
  role: string;
  topic?: string;
}

/**
 * AI를 사용하여 레퍼런스 검색어 생성
 */
export async function generateSearchKeywords(params: SearchKeywordParams): Promise<string[]> {
  const { field, role, topic } = params;
  
  const apiKey = Constants.expoConfig?.extra?.OPENAI_API_KEY;
  
  const prompt = topic
    ? `당신은 ${field} 분야의 ${role}입니다. "${topic}"에 대한 레퍼런스를 찾기 위한 효과적인 검색어 10개를 추천해주세요.

검색어는 다음 조건을 만족해야 합니다:
- Pinterest, Behance, Dribbble 등에서 좋은 결과를 얻을 수 있는 영문 검색어
- 구체적이고 실용적인 검색어
- 트렌디하고 현대적인 디자인/개발 키워드 포함
- 각 검색어는 2-5단어로 구성

검색어만 줄바꿈으로 구분하여 나열해주세요. 번호나 설명은 제외하고 검색어만 작성해주세요.`
    : `당신은 ${field} 분야의 ${role}입니다. 이 역할에 가장 유용한 레퍼런스 검색어 10개를 추천해주세요.

검색어는 다음 조건을 만족해야 합니다:
- Pinterest, Behance, Dribbble 등에서 좋은 결과를 얻을 수 있는 영문 검색어
- ${role}가 자주 참고할 만한 실용적인 검색어
- 트렌디하고 현대적인 디자인/개발 키워드 포함
- 각 검색어는 2-5단어로 구성

검색어만 줄바꿈으로 구분하여 나열해주세요. 번호나 설명은 제외하고 검색어만 작성해주세요.`;

  if (!apiKey) {
    throw new Error('OpenAI API key not configured');
  }

  try {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          {
            role: 'user',
            content: prompt,
          },
        ],
        temperature: 0.8,
        max_tokens: 500,
      }),
    });

    if (!response.ok) {
      throw new Error(`OpenAI API error: ${response.status}`);
    }

    const data = await response.json();
    const content = data.choices[0]?.message?.content || '';

    // 응답을 줄바꿈으로 분리하고 빈 줄 제거
    const keywords = content
      .split('\n')
      .map((line: string) => line.trim())
      .filter((line: string) => line.length > 0)
      .filter((line: string) => !line.match(/^\d+\./)) // 번호 제거
      .slice(0, 10); // 최대 10개

    return keywords;
  } catch (error) {
    console.error('Generate search keywords error:', error);
    throw error;
  }
}
