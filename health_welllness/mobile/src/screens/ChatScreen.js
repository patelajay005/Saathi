import React, { useState, useEffect, useRef } from 'react';
import { View, Text, TextInput, TouchableOpacity, FlatList, StyleSheet, KeyboardAvoidingView, Platform, Modal, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { chatAPI } from '../api/api';

const languages = [
  { code: 'en', name: 'English', flag: '🇬🇧' },
  { code: 'es', name: 'Español', flag: '🇪🇸' },
  { code: 'fr', name: 'Français', flag: '🇫🇷' },
  { code: 'de', name: 'Deutsch', flag: '🇩🇪' },
  { code: 'zh', name: '中文', flag: '🇨🇳' },
  { code: 'ja', name: '日本語', flag: '🇯🇵' },
  { code: 'hi', name: 'हिन्दी', flag: '🇮🇳' },
];

export default function ChatScreen() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [sessionId, setSessionId] = useState(null);
  const [sending, setSending] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState('en');
  const [showLanguagePicker, setShowLanguagePicker] = useState(false);
  const flatListRef = useRef(null);

  useEffect(() => {
    loadSession();
  }, []);

  const loadSession = async () => {
    try {
      const sessionsRes = await chatAPI.getSessions();
      if (sessionsRes.data.sessions.length > 0) {
        const session = sessionsRes.data.sessions[0];
        setSessionId(session.sessionId);
        const historyRes = await chatAPI.getSession(session.sessionId);
        setMessages(historyRes.data.messages);
      }
    } catch (error) {
      console.error('Error loading session:', error);
    }
  };

  const sendMessage = async () => {
    if (!input.trim() || sending) return;

    let currentSessionId = sessionId;
    
    if (!currentSessionId) {
      try {
        const res = await chatAPI.createSession();
        currentSessionId = res.data.session.sessionId;
        setSessionId(currentSessionId);
      } catch (error) {
        return;
      }
    }

    const userMessage = input.trim();
    setInput('');
    setSending(true);

    const tempMsg = { role: 'user', content: userMessage, timestamp: new Date() };
    setMessages(prev => [...prev, tempMsg]);

    try {
      const response = await chatAPI.sendMessage({
        sessionId: currentSessionId,
        message: userMessage,
        language: selectedLanguage
      });

      setMessages(prev => [
        ...prev.slice(0, -1),
        response.data.userMessage,
        response.data.assistantMessage
      ]);
    } catch (error) {
      setMessages(prev => prev.slice(0, -1));
    } finally {
      setSending(false);
    }
  };

  const renderMessage = ({ item }) => (
    <View style={[styles.messageContainer, item.role === 'user' ? styles.userMessage : styles.aiMessage]}>
      <Text style={[styles.messageText, item.role === 'user' && styles.userMessageText]}>
        {item.content}
      </Text>
    </View>
  );

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
      keyboardVerticalOffset={90}
    >
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Saathi 🤝</Text>
        <TouchableOpacity 
          onPress={() => setShowLanguagePicker(true)}
          style={styles.languageButton}
        >
          <Text style={styles.languageFlag}>
            {languages.find(l => l.code === selectedLanguage)?.flag}
          </Text>
        </TouchableOpacity>
      </View>

      {/* Language Picker Modal */}
      <Modal
        visible={showLanguagePicker}
        transparent={true}
        animationType="slide"
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Select Language</Text>
              <TouchableOpacity onPress={() => setShowLanguagePicker(false)}>
                <Ionicons name="close" size={24} color="#666" />
              </TouchableOpacity>
            </View>
            <ScrollView>
              {languages.map((lang) => (
                <TouchableOpacity
                  key={lang.code}
                  style={[
                    styles.languageOption,
                    selectedLanguage === lang.code && styles.languageOptionActive
                  ]}
                  onPress={() => {
                    setSelectedLanguage(lang.code);
                    setShowLanguagePicker(false);
                  }}
                >
                  <Text style={styles.languageOptionFlag}>{lang.flag}</Text>
                  <Text style={styles.languageOptionText}>{lang.name}</Text>
                  {selectedLanguage === lang.code && (
                    <Ionicons name="checkmark" size={20} color="#0ea5e9" />
                  )}
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        </View>
      </Modal>

      <FlatList
        ref={flatListRef}
        data={messages}
        renderItem={renderMessage}
        keyExtractor={(item, index) => index.toString()}
        contentContainerStyle={styles.messagesList}
        onContentSizeChange={() => flatListRef.current?.scrollToEnd()}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>Namaste! I'm Saathi 🙏</Text>
            <Text style={styles.emptySubtext}>Your wellness companion. How can I walk with you today?</Text>
          </View>
        }
      />

      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          value={input}
          onChangeText={setInput}
          placeholder="Type your message..."
          multiline
          maxLength={500}
        />
        <TouchableOpacity
          style={[styles.sendButton, (!input.trim() || sending) && styles.sendButtonDisabled]}
          onPress={sendMessage}
          disabled={!input.trim() || sending}
        >
          <Ionicons name="send" size={20} color="white" />
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9fafb',
  },
  header: {
    paddingTop: 60,
    paddingBottom: 16,
    paddingHorizontal: 20,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  languageButton: {
    padding: 8,
  },
  languageFlag: {
    fontSize: 24,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: 'white',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: '70%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  languageOption: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f3f4f6',
  },
  languageOptionActive: {
    backgroundColor: '#eff6ff',
  },
  languageOptionFlag: {
    fontSize: 24,
    marginRight: 12,
  },
  languageOptionText: {
    fontSize: 16,
    flex: 1,
  },
  messagesList: {
    padding: 16,
  },
  messageContainer: {
    maxWidth: '80%',
    marginBottom: 12,
    padding: 12,
    borderRadius: 12,
  },
  userMessage: {
    alignSelf: 'flex-end',
    backgroundColor: '#0ea5e9',
  },
  aiMessage: {
    alignSelf: 'flex-start',
    backgroundColor: 'white',
  },
  messageText: {
    fontSize: 15,
    lineHeight: 20,
    color: '#374151',
  },
  userMessageText: {
    color: 'white',
  },
  emptyContainer: {
    alignItems: 'center',
    marginTop: 100,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 8,
  },
  emptySubtext: {
    fontSize: 14,
    color: '#666',
  },
  inputContainer: {
    flexDirection: 'row',
    padding: 16,
    backgroundColor: 'white',
    borderTopWidth: 1,
    borderTopColor: '#e5e7eb',
  },
  input: {
    flex: 1,
    backgroundColor: '#f3f4f6',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 10,
    marginRight: 8,
    maxHeight: 100,
  },
  sendButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#0ea5e9',
    alignItems: 'center',
    justifyContent: 'center',
  },
  sendButtonDisabled: {
    opacity: 0.5,
  },
});

