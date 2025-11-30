/**
 * Preset Creation Modal Component
 * Role Preset 생성을 위한 스택업 형태의 모달
 */

import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  Modal, 
  TouchableOpacity, 
  TextInput, 
  ScrollView,
  Animated,
  Dimensions,
  ActivityIndicator
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Theme } from '@/theme/tokens';
import openaiService from '@/services/openai';
import DesignReferenceBrowser from './DesignReferenceBrowser';

const { height: SCREEN_HEIGHT } = Dimensions.get('window');
const MODAL_HEIGHT = SCREEN_HEIGHT * 0.8; // 4/5 높이

interface PresetCreationModalProps {
  visible: boolean;
  onClose: () => void;
  onComplete: (preset: {
    name: string;
    field: string;
    role: string;
    topic?: string;
  }) => void;
}

type Step = 'field' | 'role' | 'topic' | 'custom';

const FIELDS = [
  'UX/UI',
  'Graphic',
  'Branding',
  'Motion',
  'Web/App',
  'Art',
];

const ROLES: Record<string, string[]> = {
  'UX/UI': ['UX/UI Designer', 'Product Designer', 'Graphic Designer', 'Visual/Brand Designer', 'Motion Designer', 'Creative/Art Director'],
  'Graphic': ['UX/UI Designer', 'Product Designer', 'Graphic Designer', 'Visual/Brand Designer', 'Motion Designer', 'Creative/Art Director'],
  'Branding': ['UX/UI Designer', 'Product Designer', 'Graphic Designer', 'Visual/Brand Designer', 'Motion Designer', 'Creative/Art Director'],
  'Motion': ['UX/UI Designer', 'Product Designer', 'Graphic Designer', 'Visual/Brand Designer', 'Motion Designer', 'Creative/Art Director'],
  'Web/App': ['UX/UI Designer', 'Product Designer', 'Graphic Designer', 'Visual/Brand Designer', 'Motion Designer', 'Creative/Art Director'],
  'Art': ['UX/UI Designer', 'Product Designer', 'Graphic Designer', 'Visual/Brand Designer', 'Motion Designer', 'Creative/Art Director'],
};

const AI_TOPICS = [
  '최신 트렌드 분석',
  '경쟁사 리서치',
  '타겟 고객 분석',
  '성공 사례 연구',
  '문제 해결 방안',
  '혁신적인 아이디어',
  '비용 효율화',
  '프로세스 개선',
];

export const PresetCreationModal: React.FC<PresetCreationModalProps> = ({
  visible,
  onClose,
  onComplete,
}) => {
  const [step, setStep] = useState<Step>('field');
  const [selectedField, setSelectedField] = useState('');
  const [selectedRole, setSelectedRole] = useState('');
  const [selectedTopic, setSelectedTopic] = useState('');
  const [customTopic, setCustomTopic] = useState('');
  const [slideAnim] = useState(new Animated.Value(SCREEN_HEIGHT));
  
  // AI Topics state
  const [aiTopics, setAiTopics] = useState<string[]>([]);
  const [isLoadingTopics, setIsLoadingTopics] = useState(false);
  const [topicError, setTopicError] = useState<string | null>(null);
  
  // Pinterest Browser state
  const [showPinterestBrowser, setShowPinterestBrowser] = useState(false);
  const [pinterestSearchQuery, setPinterestSearchQuery] = useState('');

  // Load AI topics when role is selected
  useEffect(() => {
    if (selectedField && selectedRole && step === 'topic') {
      loadAITopics();
    }
  }, [selectedField, selectedRole, step]);

  const loadAITopics = async () => {
    if (!selectedField || !selectedRole) return;
    
    setIsLoadingTopics(true);
    setTopicError(null);
    
    try {
      const topics = await openaiService.generateTopics(selectedField, selectedRole);
      setAiTopics(topics);
    } catch (error) {
      setTopicError('Failed to load AI topics. Please try again.');
      console.error('AI Topics loading error:', error);
    } finally {
      setIsLoadingTopics(false);
    }
  };

  const refreshTopics = () => {
    // Clear cache and reload topics
    openaiService.clearCache();
    loadAITopics();
  };

  React.useEffect(() => {
    console.log('Modal visibility changed:', visible, 'Current step:', step);
    if (visible) {
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: false,
      }).start();
    } else {
      Animated.timing(slideAnim, {
        toValue: SCREEN_HEIGHT,
        duration: 300,
        useNativeDriver: false,
      }).start();
    }
  }, [visible, slideAnim, step]);

  const handleFieldSelect = (field: string) => {
    setSelectedField(field);
    setStep('role');
  };

  const handleRoleSelect = (role: string) => {
    setSelectedRole(role);
    setStep('topic');
  };

  const handleTopicSelect = (topic: string) => {
    console.log('Topic selected:', topic);
    setSelectedTopic(topic);
    // Don't move to custom step, stay on topic step to show complete button
  };

  const handleComplete = () => {
    const finalTopic = step === 'custom' ? customTopic : selectedTopic;
    
    console.log('handleComplete called:', {
      step,
      customTopic,
      selectedTopic,
      finalTopic,
      showPinterestBrowser
    });
    
    // Save preset data first
    onComplete({
      name: `${selectedField} - ${selectedRole}`,
      field: selectedField,
      role: selectedRole,
      topic: finalTopic,
    });
    
    // Open design reference browser with the selected topic
    if (finalTopic && finalTopic.trim()) {
      console.log('Opening design reference browser with query:', finalTopic);
      setPinterestSearchQuery(finalTopic);
      setShowPinterestBrowser(true);
    } else {
      console.warn('No topic selected, skipping reference browser');
    }
  };

  const handleClose = () => {
    Animated.timing(slideAnim, {
      toValue: SCREEN_HEIGHT,
      duration: 300,
      useNativeDriver: true,
    }).start(() => {
      // Reset states
      setStep('field');
      setSelectedField('');
      setSelectedRole('');
      setSelectedTopic('');
      setCustomTopic('');
      setAiTopics([]);
      setTopicError(null);
      onClose();
    });
  };
  
  const handlePinterestClose = () => {
    setShowPinterestBrowser(false);
    setPinterestSearchQuery('');
    handleClose();
  };

  const renderFieldStep = () => {
    console.log('Rendering field step, FIELDS:', FIELDS.length);
    return (
      <View style={styles.stepContainer}>
        <Text style={styles.stepTitle}>분야를 선택하세요</Text>
        {selectedField && (
          <View style={styles.selectedInfo}>
            <Text style={styles.selectedLabel}>선택된 분야:</Text>
            <Text style={styles.selectedValue}>{selectedField}</Text>
          </View>
        )}
        <ScrollView style={styles.optionsContainer} showsVerticalScrollIndicator={false}>
          <View style={styles.optionsGrid}>
            {FIELDS.map((field) => (
              <TouchableOpacity
                key={field}
                style={[
                  styles.optionButton,
                  selectedField === field && styles.selectedOption,
                ]}
                onPress={() => handleFieldSelect(field)}
              >
                <Text style={[
                  styles.optionText,
                  selectedField === field && styles.selectedOptionText,
                ]}>
                  {field}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </ScrollView>
      </View>
    );
  };

  const renderRoleStep = () => (
    <View style={styles.stepContainer}>
      <Text style={styles.stepTitle}>롤을 선택하세요</Text>
      {selectedRole && (
        <View style={styles.selectedInfo}>
          <Text style={styles.selectedLabel}>선택된 롤:</Text>
          <Text style={styles.selectedValue}>{selectedRole}</Text>
        </View>
      )}
      <ScrollView style={styles.optionsContainer} showsVerticalScrollIndicator={false}>
        <View style={styles.optionsGrid}>
          {ROLES[selectedField]?.map((role) => (
            <TouchableOpacity
              key={role}
              style={[
                styles.optionButton,
                selectedRole === role && styles.selectedOption,
              ]}
              onPress={() => handleRoleSelect(role)}
            >
              <Text style={[
                styles.optionText,
                selectedRole === role && styles.selectedOptionText,
              ]}>
                {role}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    </View>
  );

  const renderTopicStep = () => (
    <View style={styles.stepContainer}>
      <View style={styles.topicHeader}>
        <Text style={styles.stepTitle}>AI가 추천하는 작업 주제</Text>
        <TouchableOpacity 
          style={styles.refreshButton} 
          onPress={refreshTopics}
          disabled={isLoadingTopics}
        >
          <Ionicons 
            name="refresh" 
            size={20} 
            color={isLoadingTopics ? Theme.Colors.border.primary : Theme.Colors.primary[500]} 
          />
        </TouchableOpacity>
      </View>
      <Text style={styles.stepSubtitle}>
        {selectedField} • {selectedRole} 분야에 맞는 주제들
      </Text>
      
      {topicError && (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>{topicError}</Text>
          <TouchableOpacity style={styles.retryButton} onPress={loadAITopics}>
            <Text style={styles.retryButtonText}>다시 시도</Text>
          </TouchableOpacity>
        </View>
      )}
      
      <ScrollView style={styles.optionsContainer}>
        {isLoadingTopics ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color={Theme.Colors.primary[500]} />
            <Text style={styles.loadingText}>AI가 주제를 생성중입니다...</Text>
          </View>
        ) : (
          <>
            {aiTopics.map((topic, index) => (
              <TouchableOpacity
                key={`${topic}-${index}`}
                style={[
                  styles.optionButton,
                  selectedTopic === topic && styles.selectedOption,
                ]}
                onPress={() => handleTopicSelect(topic)}
              >
                <Text style={[
                  styles.optionText,
                  selectedTopic === topic && styles.selectedOptionText,
                ]}>
                  {topic}
                </Text>
              </TouchableOpacity>
            ))}
            
            {/* 주제 선택 후 완료 버튼 */}
            {selectedTopic && (
              <TouchableOpacity
                style={styles.completeButton}
                onPress={handleComplete}
              >
                <Text style={styles.completeButtonText}>
                  "{selectedTopic}" 레퍼런스 검색
                </Text>
              </TouchableOpacity>
            )}
          </>
        )}
      </ScrollView>
    </View>
  );

  const renderCustomStep = () => (
    <View style={styles.stepContainer}>
      <Text style={styles.stepTitle}>커스텀 주제 (선택사항)</Text>
      <Text style={styles.stepSubtitle}>원하는 주제를 자유롭게 입력하세요</Text>
      
      {selectedTopic && (
        <View style={styles.selectedTopicContainer}>
          <Text style={styles.selectedTopicLabel}>선택된 주제:</Text>
          <Text style={styles.selectedTopicText}>{selectedTopic}</Text>
        </View>
      )}

      <TextInput
        style={styles.textInput}
        placeholder="원하는 주제를 입력하세요..."
        placeholderTextColor={Theme.Colors.text.muted}
        value={customTopic}
        onChangeText={setCustomTopic}
        multiline
        numberOfLines={3}
        textAlignVertical="top"
      />

      <TouchableOpacity
        style={[styles.completeButton, !customTopic && !selectedTopic && styles.disabledButton]}
        onPress={handleComplete}
        disabled={!customTopic && !selectedTopic}
      >
        <Text style={styles.completeButtonText}>완료</Text>
      </TouchableOpacity>
    </View>
  );

  const renderStep = () => {
    return (
      <View style={styles.stepsContainer}>
        {/* 항상 보이는 단계들 */}
        {renderFieldStep()}
        {step === 'role' && renderRoleStep()}
        {step === 'topic' && renderTopicStep()}
        {step === 'custom' && renderCustomStep()}
      </View>
    );
  };

  return (
    <>
      <Modal
        visible={visible}
        transparent
        animationType="none"
        onRequestClose={handleClose}
      >
        <View style={styles.overlay}>
          <Animated.View
            style={[
              styles.modalContainer,
              {
                transform: [{ translateY: slideAnim }],
              },
            ]}
          >
            {/* Header */}
            <View style={styles.header}>
              <TouchableOpacity onPress={handleClose} style={styles.closeButton}>
                <Ionicons name="close" size={Theme.Icon.lg} color={Theme.Colors.text.primary} />
              </TouchableOpacity>
              <Text style={styles.headerTitle}>Preset 생성</Text>
              <View style={styles.placeholder} />
            </View>

            {/* Progress Indicator */}
            <View style={styles.progressContainer}>
              <View style={[styles.progressDot, step === 'field' && styles.activeDot]} />
              <View style={[styles.progressDot, step === 'role' && styles.activeDot]} />
              <View style={[styles.progressDot, step === 'topic' && styles.activeDot]} />
              <View style={[styles.progressDot, step === 'custom' && styles.activeDot]} />
            </View>

            {/* Step Content */}
            <View style={styles.content}>
              {renderStep()}
            </View>
          </Animated.View>
        </View>
      </Modal>
      
      {/* Design Reference Browser Modal */}
      {showPinterestBrowser && (
        <Modal
          visible={showPinterestBrowser}
          animationType="slide"
          onRequestClose={handlePinterestClose}
        >
          <DesignReferenceBrowser
            searchQuery={pinterestSearchQuery}
            onClose={handlePinterestClose}
            onSaveMemo={(memo) => console.log('Design memo saved:', memo)}
          />
        </Modal>
      )}
    </>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  
  modalContainer: {
    backgroundColor: Theme.Colors.surface.primary,
    borderTopLeftRadius: Theme.Radius['3xl'],
    borderTopRightRadius: Theme.Radius['3xl'],
    height: MODAL_HEIGHT, // 4/5 높이 고정
    ...Theme.Shadow.xl,
  },
  
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Theme.Spacing.lg,
    paddingVertical: Theme.Spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: Theme.Colors.border.primary,
  },
  
  closeButton: {
    padding: Theme.Spacing.xs,
  },
  
  headerTitle: {
    fontSize: Theme.Typography.fontSize.lg,
    fontWeight: Theme.Typography.fontWeight.semibold,
    color: Theme.Colors.text.primary,
  },
  
  placeholder: {
    width: Theme.Icon.lg + Theme.Spacing.xs * 2,
  },
  
  progressContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    paddingVertical: Theme.Spacing.md,
    gap: Theme.Spacing.sm,
  },
  
  progressDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: Theme.Colors.border.primary,
  },
  
  activeDot: {
    backgroundColor: Theme.Colors.primary[500],
  },
  
  content: {
    flex: 1,
    paddingHorizontal: Theme.Spacing.lg,
    paddingBottom: Theme.Spacing.xl,
  },
  
  stepsContainer: {
    flex: 1,
  },
  
  stepContainer: {
    backgroundColor: Theme.Colors.surface.secondary,
    borderRadius: Theme.Radius.lg,
    padding: Theme.Spacing.lg,
    marginBottom: Theme.Spacing.md,
    borderWidth: 1,
    borderColor: Theme.Colors.border.primary,
    minHeight: 200,
  },
  
  stepTitle: {
    fontSize: Theme.Typography.fontSize.xl,
    fontWeight: Theme.Typography.fontWeight.bold,
    color: Theme.Colors.text.primary,
    textAlign: 'center',
    marginBottom: Theme.Spacing.sm,
  },
  
  stepSubtitle: {
    fontSize: Theme.Typography.fontSize.sm,
    color: Theme.Colors.text.secondary,
    textAlign: 'center',
    marginBottom: Theme.Spacing.lg,
  },
  
  optionsContainer: {
    flex: 1,
    minHeight: 120,
  },
  
  optionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'flex-start',
    gap: Theme.Spacing.sm,
  },
  
  optionButton: {
    backgroundColor: Theme.Colors.surface.secondary,
    paddingVertical: Theme.Spacing.sm,
    paddingHorizontal: Theme.Spacing.md,
    borderRadius: Theme.Radius.md,
    marginBottom: 0,
    borderWidth: 1,
    borderColor: Theme.Colors.border.primary,
    minWidth: 80,
    alignItems: 'center',
  },
  
  selectedOption: {
    backgroundColor: Theme.Colors.primary[500],
    borderColor: Theme.Colors.primary[500],
  },
  
  optionText: {
    fontSize: Theme.Typography.fontSize.sm,
    color: Theme.Colors.text.primary,
    textAlign: 'center',
  },
  
  selectedOptionText: {
    color: Theme.Colors.text.inverse,
    fontWeight: Theme.Typography.fontWeight.semibold,
  },
  
  selectedInfo: {
    backgroundColor: Theme.Colors.primary[50],
    padding: Theme.Spacing.sm,
    paddingHorizontal: Theme.Spacing.md,
    borderRadius: Theme.Radius.md,
    marginBottom: Theme.Spacing.md,
    flexDirection: 'row',
    alignItems: 'center',
  },
  
  selectedLabel: {
    fontSize: Theme.Typography.fontSize.sm,
    color: Theme.Colors.text.secondary,
    marginRight: Theme.Spacing.sm,
  },
  
  selectedValue: {
    fontSize: Theme.Typography.fontSize.sm,
    fontWeight: Theme.Typography.fontWeight.semibold,
    color: Theme.Colors.primary[600],
  },
  
  selectedTopicContainer: {
    backgroundColor: Theme.Colors.surface.secondary,
    padding: Theme.Spacing.md,
    borderRadius: Theme.Radius.lg,
    marginBottom: Theme.Spacing.md,
  },
  
  selectedTopicLabel: {
    fontSize: Theme.Typography.fontSize.sm,
    color: Theme.Colors.text.secondary,
    marginBottom: Theme.Spacing.xs,
  },
  
  selectedTopicText: {
    fontSize: Theme.Typography.fontSize.base,
    color: Theme.Colors.text.primary,
    fontWeight: Theme.Typography.fontWeight.semibold,
  },
  
  textInput: {
    backgroundColor: Theme.Colors.surface.secondary,
    borderWidth: 1,
    borderColor: Theme.Colors.border.primary,
    borderRadius: Theme.Radius.lg,
    padding: Theme.Spacing.md,
    fontSize: Theme.Typography.fontSize.base,
    color: Theme.Colors.text.primary,
    minHeight: 80,
    marginBottom: Theme.Spacing.lg,
  },
  
  completeButton: {
    backgroundColor: Theme.Colors.primary[500],
    paddingVertical: Theme.Spacing.md,
    paddingHorizontal: Theme.Spacing.xl,
    borderRadius: Theme.Radius.lg,
    alignItems: 'center',
  },
  
  disabledButton: {
    backgroundColor: Theme.Colors.border.primary,
  },
  
  completeButtonText: {
    fontSize: Theme.Typography.fontSize.base,
    fontWeight: Theme.Typography.fontWeight.semibold,
    color: Theme.Colors.text.inverse,
  },

  // AI Topics specific styles
  topicHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Theme.Spacing.sm,
  },

  refreshButton: {
    padding: Theme.Spacing.xs,
    borderRadius: Theme.Radius.sm,
    backgroundColor: Theme.Colors.surface.secondary,
  },

  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: Theme.Spacing.xl,
  },

  loadingText: {
    marginTop: Theme.Spacing.md,
    fontSize: Theme.Typography.fontSize.sm,
    color: Theme.Colors.text.secondary,
    textAlign: 'center',
  },

  errorContainer: {
    backgroundColor: Theme.Colors.error.light,
    padding: Theme.Spacing.md,
    borderRadius: Theme.Radius.md,
    marginBottom: Theme.Spacing.md,
    borderWidth: 1,
    borderColor: Theme.Colors.error.main,
  },

  errorText: {
    fontSize: Theme.Typography.fontSize.sm,
    color: Theme.Colors.error.dark,
    textAlign: 'center',
    marginBottom: Theme.Spacing.sm,
  },

  retryButton: {
    backgroundColor: Theme.Colors.error.main,
    paddingVertical: Theme.Spacing.xs,
    paddingHorizontal: Theme.Spacing.md,
    borderRadius: Theme.Radius.sm,
    alignSelf: 'center',
  },

  retryButtonText: {
    color: Theme.Colors.text.inverse,
    fontSize: Theme.Typography.fontSize.sm,
    fontWeight: Theme.Typography.fontWeight.semibold,
  },
});
