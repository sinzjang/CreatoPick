import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  ActivityIndicator,
  ScrollView,
  Alert,
} from 'react-native';
import { WebView } from 'react-native-webview';
import { Ionicons } from '@expo/vector-icons';

// 테스트할 디자인 레퍼런스 사이트들
const TEST_SITES = [
  {
    name: 'Google Images',
    url: 'https://www.google.com/search?q=design+inspiration&tbm=isch',
    category: '검색엔진',
    expectedResult: '✅ 작동',
  },
  {
    name: 'Unsplash',
    url: 'https://unsplash.com/s/photos/design',
    category: '이미지',
    expectedResult: '✅ 작동 예상',
  },
  {
    name: 'Pexels',
    url: 'https://www.pexels.com/search/design/',
    category: '이미지',
    expectedResult: '✅ 작동 예상',
  },
  {
    name: 'Pixabay',
    url: 'https://pixabay.com/images/search/design/',
    category: '이미지',
    expectedResult: '✅ 작동 예상',
  },
  {
    name: 'Dribbble',
    url: 'https://dribbble.com/search/design',
    category: '디자인',
    expectedResult: '⚠️ 테스트 필요',
  },
  {
    name: 'Behance',
    url: 'https://www.behance.net/search/projects?search=design',
    category: '디자인',
    expectedResult: '⚠️ 테스트 필요',
  },
  {
    name: 'Awwwards',
    url: 'https://www.awwwards.com/websites/',
    category: '웹 디자인',
    expectedResult: '⚠️ 테스트 필요',
  },
  {
    name: 'Mobbin',
    url: 'https://mobbin.com/browse/ios/apps',
    category: 'UI/UX',
    expectedResult: '⚠️ 테스트 필요',
  },
  {
    name: 'Pinterest',
    url: 'https://www.pinterest.com/search/pins/?q=design',
    category: '디자인',
    expectedResult: '❌ 차단됨',
  },
  {
    name: 'Pinterest Mobile',
    url: 'https://m.pinterest.com/search/pins/?q=design',
    category: '디자인',
    expectedResult: '❌ 차단됨',
  },
];

interface TestResult {
  siteName: string;
  success: boolean;
  loadTime: number;
  error?: string;
}

export default function WebViewSiteTest() {
  const [selectedSite, setSelectedSite] = useState<typeof TEST_SITES[0] | null>(null);
  const [loading, setLoading] = useState(false);
  const [testResults, setTestResults] = useState<TestResult[]>([]);
  const [loadStartTime, setLoadStartTime] = useState<number>(0);

  const handleTestSite = (site: typeof TEST_SITES[0]) => {
    setSelectedSite(site);
    setLoading(true);
    setLoadStartTime(Date.now());
  };

  const handleLoadEnd = () => {
    if (selectedSite && loadStartTime) {
      const loadTime = Date.now() - loadStartTime;
      const result: TestResult = {
        siteName: selectedSite.name,
        success: true,
        loadTime,
      };
      
      setTestResults(prev => [...prev, result]);
      setLoading(false);
      
      Alert.alert(
        '✅ 성공!',
        `${selectedSite.name}이(가) ${(loadTime / 1000).toFixed(2)}초 만에 로드되었습니다.`,
        [{ text: '확인' }]
      );
    }
  };

  const handleError = (error: any) => {
    if (selectedSite) {
      const result: TestResult = {
        siteName: selectedSite.name,
        success: false,
        loadTime: 0,
        error: error.nativeEvent?.description || 'Unknown error',
      };
      
      setTestResults(prev => [...prev, result]);
      setLoading(false);
      
      Alert.alert(
        '❌ 실패',
        `${selectedSite.name}을(를) 로드할 수 없습니다.\n\n에러: ${result.error}`,
        [{ text: '확인' }]
      );
    }
  };

  const handleClose = () => {
    setSelectedSite(null);
    setLoading(false);
  };

  const getResultIcon = (siteName: string) => {
    const result = testResults.find(r => r.siteName === siteName);
    if (!result) return '⚪';
    return result.success ? '✅' : '❌';
  };

  const getResultColor = (siteName: string) => {
    const result = testResults.find(r => r.siteName === siteName);
    if (!result) return '#999';
    return result.success ? '#4CAF50' : '#F44336';
  };

  if (selectedSite) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.testHeader}>
          <TouchableOpacity onPress={handleClose} style={styles.closeButton}>
            <Ionicons name="arrow-back" size={24} color="#333" />
          </TouchableOpacity>
          <View style={styles.testInfo}>
            <Text style={styles.testTitle}>{selectedSite.name}</Text>
            <Text style={styles.testCategory}>{selectedSite.category}</Text>
          </View>
        </View>

        <View style={styles.webViewContainer}>
          {loading && (
            <View style={styles.loadingOverlay}>
              <ActivityIndicator size="large" color="#4285F4" />
              <Text style={styles.loadingText}>로딩 중...</Text>
            </View>
          )}
          
          <WebView
            source={{ uri: selectedSite.url }}
            style={styles.webView}
            onLoadStart={() => {
              console.log('Loading:', selectedSite.name);
              setLoading(true);
            }}
            onLoadEnd={handleLoadEnd}
            onError={handleError}
            onHttpError={(syntheticEvent) => {
              const { nativeEvent } = syntheticEvent;
              console.warn('HTTP Error:', nativeEvent.statusCode);
            }}
            startInLoadingState={true}
            javaScriptEnabled={true}
            domStorageEnabled={true}
          />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>WebView 사이트 호환성 테스트</Text>
        <Text style={styles.headerSubtitle}>
          각 사이트를 클릭하여 WebView에서 작동하는지 테스트하세요
        </Text>
      </View>

      <ScrollView style={styles.siteList}>
        {TEST_SITES.map((site, index) => (
          <TouchableOpacity
            key={index}
            style={styles.siteCard}
            onPress={() => handleTestSite(site)}
          >
            <View style={styles.siteCardLeft}>
              <Text style={styles.resultIcon}>{getResultIcon(site.name)}</Text>
              <View style={styles.siteInfo}>
                <Text style={styles.siteName}>{site.name}</Text>
                <Text style={styles.siteCategory}>{site.category}</Text>
              </View>
            </View>
            <View style={styles.siteCardRight}>
              <Text style={styles.expectedResult}>{site.expectedResult}</Text>
              <Ionicons name="chevron-forward" size={20} color="#999" />
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {testResults.length > 0 && (
        <View style={styles.resultsSection}>
          <Text style={styles.resultsTitle}>테스트 결과</Text>
          <View style={styles.resultsSummary}>
            <View style={styles.summaryItem}>
              <Text style={styles.summaryLabel}>성공</Text>
              <Text style={[styles.summaryValue, { color: '#4CAF50' }]}>
                {testResults.filter(r => r.success).length}
              </Text>
            </View>
            <View style={styles.summaryItem}>
              <Text style={styles.summaryLabel}>실패</Text>
              <Text style={[styles.summaryValue, { color: '#F44336' }]}>
                {testResults.filter(r => !r.success).length}
              </Text>
            </View>
            <View style={styles.summaryItem}>
              <Text style={styles.summaryLabel}>전체</Text>
              <Text style={styles.summaryValue}>{testResults.length}</Text>
            </View>
          </View>
        </View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  header: {
    padding: 20,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e9ecef',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  headerSubtitle: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
  },
  siteList: {
    flex: 1,
  },
  siteCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#fff',
    padding: 16,
    marginHorizontal: 16,
    marginTop: 12,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  siteCardLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  resultIcon: {
    fontSize: 24,
    marginRight: 12,
  },
  siteInfo: {
    flex: 1,
  },
  siteName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  siteCategory: {
    fontSize: 12,
    color: '#666',
  },
  siteCardRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  expectedResult: {
    fontSize: 12,
    color: '#666',
    marginRight: 8,
  },
  testHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e9ecef',
  },
  closeButton: {
    padding: 4,
    marginRight: 12,
  },
  testInfo: {
    flex: 1,
  },
  testTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  testCategory: {
    fontSize: 14,
    color: '#666',
  },
  webViewContainer: {
    flex: 1,
    position: 'relative',
  },
  webView: {
    flex: 1,
  },
  loadingOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
    zIndex: 1,
  },
  loadingText: {
    marginTop: 12,
    fontSize: 14,
    color: '#666',
  },
  resultsSection: {
    padding: 16,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#e9ecef',
  },
  resultsTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 12,
  },
  resultsSummary: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  summaryItem: {
    alignItems: 'center',
  },
  summaryLabel: {
    fontSize: 12,
    color: '#666',
    marginBottom: 4,
  },
  summaryValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
});
