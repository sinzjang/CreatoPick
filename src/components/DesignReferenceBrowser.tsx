import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  ActivityIndicator,
  StatusBar,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
import { WebView } from 'react-native-webview';
import { Ionicons } from '@expo/vector-icons';

interface DesignReferenceBrowserProps {
  searchQuery: string;
  onClose: () => void;
  onSaveMemo?: (memo: string) => void;
}

export default function DesignReferenceBrowser({ 
  searchQuery, 
  onClose,
  onSaveMemo 
}: DesignReferenceBrowserProps) {
  const [loading, setLoading] = useState(true);
  const [canGoBack, setCanGoBack] = useState(false);
  const [canGoForward, setCanGoForward] = useState(false);
  const [memo, setMemo] = useState('');
  const [hasError, setHasError] = useState(false);
  const webViewRef = React.useRef<WebView>(null);

  // Google Images 사용 (Pinterest는 WebView 차단)
  const imageSearchUrl = `https://www.google.com/search?q=${encodeURIComponent(searchQuery + ' design inspiration')}&tbm=isch`;
  
  // Mobile User-Agent for better compatibility
  const userAgent = 'Mozilla/5.0 (iPhone; CPU iPhone OS 16_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/16.0 Mobile/15E148 Safari/604.1';

  const handleBack = () => {
    if (canGoBack && webViewRef.current) {
      webViewRef.current.goBack();
    }
  };

  const handleForward = () => {
    if (canGoForward && webViewRef.current) {
      webViewRef.current.goForward();
    }
  };

  const handleRefresh = () => {
    if (webViewRef.current) {
      webViewRef.current.reload();
    }
  };

  const handleSaveMemo = () => {
    if (onSaveMemo && memo.trim()) {
      onSaveMemo(memo);
      console.log('Memo saved:', memo);
    }
  };

  return (
    <KeyboardAvoidingView 
      style={{ flex: 1 }} 
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 0}
    >
      <SafeAreaView style={styles.container}>
        <StatusBar barStyle="dark-content" />
        
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={onClose} style={styles.closeButton}>
            <Ionicons name="close" size={28} color="#333" />
          </TouchableOpacity>
          <View style={styles.titleContainer}>
            <Text style={styles.title} numberOfLines={1}>
              {searchQuery}
            </Text>
            <Text style={styles.subtitle}>디자인 레퍼런스</Text>
          </View>
          <View style={styles.placeholder} />
        </View>

        {/* Navigation Bar */}
        <View style={styles.navigationBar}>
          <TouchableOpacity
            onPress={handleBack}
            disabled={!canGoBack}
            style={[styles.navButton, !canGoBack && styles.navButtonDisabled]}
          >
            <Ionicons
              name="arrow-back"
              size={24}
              color={canGoBack ? '#333' : '#ccc'}
            />
          </TouchableOpacity>

          <TouchableOpacity
            onPress={handleForward}
            disabled={!canGoForward}
            style={[styles.navButton, !canGoForward && styles.navButtonDisabled]}
          >
            <Ionicons
              name="arrow-forward"
              size={24}
              color={canGoForward ? '#333' : '#ccc'}
            />
          </TouchableOpacity>

          <TouchableOpacity onPress={handleRefresh} style={styles.navButton}>
            <Ionicons name="refresh" size={24} color="#333" />
          </TouchableOpacity>

          <View style={styles.urlContainer}>
            <Ionicons name="search" size={16} color="#4285F4" />
            <Text style={styles.urlText} numberOfLines={1}>
              Google Images
            </Text>
          </View>
        </View>

        {/* WebView */}
        <View style={styles.webViewContainer}>
          {hasError && !loading && (
            <View style={styles.errorBanner}>
              <Ionicons name="warning-outline" size={16} color="#FF9800" />
              <Text style={styles.errorBannerText}>
                일부 사이트가 로드되지 않을 수 있습니다
              </Text>
            </View>
          )}
          
          {loading && (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color="#4285F4" />
              <Text style={styles.loadingText}>이미지 검색 중...</Text>
            </View>
          )}
          
          <WebView
            ref={webViewRef}
            source={{ 
              uri: imageSearchUrl,
              headers: {
                'User-Agent': userAgent
              }
            }}
            userAgent={userAgent}
            style={styles.webView}
            onLoadStart={() => {
              console.log('WebView loading started:', imageSearchUrl);
              setLoading(true);
            }}
            onLoadEnd={() => {
              console.log('WebView loading ended');
              setLoading(false);
            }}
            onError={(syntheticEvent) => {
              const { nativeEvent } = syntheticEvent;
              console.error('WebView error:', nativeEvent);
              setLoading(false);
              
              // SSL 에러 (code: -11)는 특정 사이트 접근 시 발생
              if (nativeEvent.code === -11) {
                console.log('SSL protocol error - trying to go back');
                setHasError(true);
                
                // 에러 발생 시 자동으로 뒤로 가기 (Google Images로 복귀)
                setTimeout(() => {
                  if (canGoBack && webViewRef.current) {
                    webViewRef.current.goBack();
                    setHasError(false);
                  }
                }, 1000);
              }
            }}
            onHttpError={(syntheticEvent) => {
              const { nativeEvent } = syntheticEvent;
              console.warn('WebView HTTP error:', nativeEvent.statusCode);
              setLoading(false);
            }}
            onNavigationStateChange={(navState) => {
              console.log('Navigation:', navState.url);
              setCanGoBack(navState.canGoBack);
              setCanGoForward(navState.canGoForward);
            }}
            startInLoadingState={true}
            javaScriptEnabled={true}
            domStorageEnabled={true}
            thirdPartyCookiesEnabled={true}
            sharedCookiesEnabled={true}
            allowsBackForwardNavigationGestures={true}
            mixedContentMode="always"
            onShouldStartLoadWithRequest={(request) => {
              // 모든 요청 허용
              return true;
            }}
          />
        </View>

        {/* Memo Section */}
        <View style={styles.memoSection}>
          <View style={styles.memoHeader}>
            <Ionicons name="create-outline" size={20} color="#666" />
            <Text style={styles.memoHeaderText}>디자인 메모</Text>
            {memo.trim() && (
              <TouchableOpacity onPress={handleSaveMemo} style={styles.saveButton}>
                <Text style={styles.saveButtonText}>저장</Text>
              </TouchableOpacity>
            )}
          </View>
          <ScrollView style={styles.memoScrollView}>
            <TextInput
              style={styles.memoInput}
              placeholder="레퍼런스에 대한 메모를 작성하세요..."
              placeholderTextColor="#999"
              value={memo}
              onChangeText={setMemo}
              multiline
              textAlignVertical="top"
            />
          </ScrollView>
        </View>
      </SafeAreaView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },

  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#e9ecef',
    backgroundColor: '#fff',
  },

  closeButton: {
    padding: 4,
  },

  titleContainer: {
    flex: 1,
    marginHorizontal: 12,
  },

  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 2,
  },

  subtitle: {
    fontSize: 12,
    color: '#666',
  },

  placeholder: {
    width: 36,
  },

  navigationBar: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#f8f9fa',
    borderBottomWidth: 1,
    borderBottomColor: '#e9ecef',
  },

  navButton: {
    padding: 8,
    marginRight: 12,
  },

  navButtonDisabled: {
    opacity: 0.3,
  },

  urlContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#e9ecef',
  },

  urlText: {
    fontSize: 14,
    color: '#666',
    marginLeft: 8,
    flex: 1,
  },

  webViewContainer: {
    flex: 1,
    position: 'relative',
  },

  webView: {
    flex: 1,
  },

  loadingContainer: {
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

  errorBanner: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFF3E0',
    paddingVertical: 8,
    paddingHorizontal: 12,
    zIndex: 2,
    borderBottomWidth: 1,
    borderBottomColor: '#FFE0B2',
  },

  errorBannerText: {
    fontSize: 12,
    color: '#E65100',
    marginLeft: 6,
  },

  memoSection: {
    height: 200,
    borderTopWidth: 1,
    borderTopColor: '#e9ecef',
    backgroundColor: '#f8f9fa',
  },

  memoHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#e9ecef',
    backgroundColor: '#fff',
  },

  memoHeaderText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginLeft: 8,
    flex: 1,
  },

  saveButton: {
    backgroundColor: '#4285F4',
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 16,
  },

  saveButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },

  memoScrollView: {
    flex: 1,
  },

  memoInput: {
    flex: 1,
    padding: 16,
    fontSize: 14,
    color: '#333',
    minHeight: 150,
  },
});
