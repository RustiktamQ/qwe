import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { useEffect, useState } from 'react';
import { ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import ApiController from '../services/api';
import showToast from '../utils/toast';

export default function IndexScreen({ navigation }: any) {
  const [activeTab, setActiveTab] = useState('login');
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [regName, setRegName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPassword, setRegPassword] = useState('');

  const api = new ApiController();

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    const token = await AsyncStorage.getItem('token');
    if (token) {
      const auth = await api.isAuthed(token);
      if (auth && !auth.error) {
        navigation.replace('Dashboard');
      }
    }
  };

  const handleLogin = async () => {
    if (!loginEmail.trim() || !loginPassword) {
      showToast('Заполните все поля');
      return;
    }
    const res = await api.login(loginEmail.trim(), loginPassword);
    if (res?.error) {
      const msg = typeof res.message === 'string' ? res.message : JSON.stringify(res.message);
      showToast(msg);
      return;
    }
    if (res?.token) {
      await AsyncStorage.setItem('token', res.token);
      showToast('Успешный вход');
      navigation.replace('Dashboard');
    } else {
      showToast('Токен не получен');
    }
  };

  const handleRegister = async () => {
    if (!regName.trim() || !regEmail.trim() || !regPassword) {
      showToast('Заполните все поля');
      return;
    }
    const r = await api.register(regName.trim(), regEmail.trim(), regPassword);
    if (r?.error) {
      const msg = typeof r.message === 'string' ? r.message : JSON.stringify(r.message);
      showToast(msg);
      return;
    }
    const res = await api.login(regEmail.trim(), regPassword);
    if (res?.error) {
      const msg = typeof res.message === 'string' ? res.message : JSON.stringify(res.message);
      showToast(msg);
      return;
    }
    if (res?.token) {
      await AsyncStorage.setItem('token', res.token);
      showToast('Регистрация выполнена');
      navigation.replace('Dashboard');
    } else {
      showToast('Токен не получен');
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <View style={styles.logo}>
          <Text style={styles.logoText}>F</Text>
        </View>
        <Text style={styles.brandText}>FastTest</Text>
      </View>

      <View style={styles.hero}>
        <Text style={styles.title}>
          Создай тест и поделись ссылкой за <Text style={styles.accent}>30 секунд</Text>
        </Text>
        <Text style={styles.subtitle}>
          FastTest — минималистичный инструмент для преподавателей. Мгновенное создание, редактирование и публикация
          тестов.
        </Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>Кабинет преподавателя</Text>

        <View style={styles.tabs}>
          <TouchableOpacity
            style={[styles.tab, activeTab === 'login' && styles.tabActive]}
            onPress={() => setActiveTab('login')}
          >
            <Text style={[styles.tabText, activeTab === 'login' && styles.tabTextActive]}>Вход</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.tab, activeTab === 'register' && styles.tabActive]}
            onPress={() => setActiveTab('register')}
          >
            <Text style={[styles.tabText, activeTab === 'register' && styles.tabTextActive]}>Регистрация</Text>
          </TouchableOpacity>
        </View>

        {activeTab === 'login' ? (
          <View>
            <Text style={styles.label}>E-mail</Text>
            <TextInput
              style={styles.input}
              value={loginEmail}
              onChangeText={setLoginEmail}
              placeholder="teacher@example.com"
              keyboardType="email-address"
              autoCapitalize="none"
            />
            <Text style={styles.label}>Пароль</Text>
            <TextInput
              style={styles.input}
              value={loginPassword}
              onChangeText={setLoginPassword}
              placeholder="••••••••"
              secureTextEntry
            />
            <TouchableOpacity style={styles.btnPrimary} onPress={handleLogin}>
              <Text style={styles.btnPrimaryText}>Войти</Text>
            </TouchableOpacity>
            <Text style={styles.hint}>Нет аккаунта? Переключитесь на вкладку «Регистрация».</Text>
          </View>
        ) : (
          <View>
            <Text style={styles.label}>Имя</Text>
            <TextInput style={styles.input} value={regName} onChangeText={setRegName} placeholder="Иван Петров" />
            <Text style={styles.label}>E-mail</Text>
            <TextInput
              style={styles.input}
              value={regEmail}
              onChangeText={setRegEmail}
              placeholder="teacher@example.com"
              keyboardType="email-address"
              autoCapitalize="none"
            />
            <Text style={styles.label}>Пароль</Text>
            <TextInput
              style={styles.input}
              value={regPassword}
              onChangeText={setRegPassword}
              placeholder="Str0ngPass!123"
              secureTextEntry
            />
            <TouchableOpacity style={styles.btnPrimary} onPress={handleRegister}>
              <Text style={styles.btnPrimaryText}>Зарегистрироваться</Text>
            </TouchableOpacity>
            <Text style={styles.hint}>После успешной регистрации вы автоматически войдёте в систему.</Text>
          </View>
        )}
      </View>
    </ScrollView>
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
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#e6e8ee',
  },
  logo: {
    width: 32,
    height: 32,
    borderRadius: 10,
    backgroundColor: '#1a73e8',
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '900',
  },
  brandText: {
    fontSize: 18,
    fontWeight: '800',
  },
  hero: {
    padding: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: '800',
    marginBottom: 10,
  },
  accent: {
    color: '#1a73e8',
  },
  subtitle: {
    fontSize: 16,
    color: '#5f6b7a',
    lineHeight: 24,
  },
  card: {
    margin: 20,
    padding: 18,
    backgroundColor: '#fff',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#e6e8ee',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 3,
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 12,
  },
  tabs: {
    flexDirection: 'row',
    backgroundColor: '#f8faff',
    borderRadius: 999,
    padding: 4,
    marginBottom: 16,
  },
  tab: {
    flex: 1,
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 999,
    alignItems: 'center',
  },
  tabActive: {
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
  },
  tabText: {
    fontWeight: '700',
    color: '#5f6b7a',
  },
  tabTextActive: {
    color: '#0b1220',
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 6,
    marginTop: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: '#e6e8ee',
    borderRadius: 12,
    padding: 12,
    fontSize: 16,
  },
  btnPrimary: {
    backgroundColor: '#1a73e8',
    borderRadius: 10,
    padding: 14,
    alignItems: 'center',
    marginTop: 16,
  },
  btnPrimaryText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
  },
  hint: {
    fontSize: 12,
    color: '#5f6b7a',
    marginTop: 10,
  },
});
