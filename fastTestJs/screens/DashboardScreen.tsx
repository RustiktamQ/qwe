import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { useEffect, useState } from 'react';
import { Alert, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import ApiController from '../services/api';
import decodeJwt from '../utils/decodeJwt';
import showToast from '../utils/toast';

export default function DashboardScreen({ navigation }: any) {
  const [tests, setTests] = useState<any[]>([]);
  const [teacher, setTeacher] = useState<any>(null);

  const api = new ApiController();

  useEffect(() => {
    init();
  }, []);

  const init = async () => {
    const token = await AsyncStorage.getItem('token');
    if (!token) {
      navigation.replace('Index');
      return;
    }
    const auth = await api.isAuthed(token);
    if (auth?.error) {
      navigation.replace('Index');
      return;
    }
    const decoded = decodeJwt(token);
    setTeacher(decoded);
    loadTests(decoded.id, token);
  };

  const loadTests = async (teacherId: number, token: string) => {
    const res = await api.getTestsByTeacher(teacherId);
    if (res?.error) {
      showToast(res.message || 'Ошибка загрузки');
      setTests([]);
      return;
    }
    setTests(Array.isArray(res) ? res : []);
  };

  const handleCreateTest = async () => {
    const token = await AsyncStorage.getItem('token');
    if (!token) return;
    const dto = { teacher_id: teacher.id, name: 'Новый тест' };
    const created = await api.createTest(dto, token);
    if (created?.error) {
      showToast(created.message || 'Не удалось создать тест');
      return;
    }
    showToast('Черновик создан');
    loadTests(teacher.id, token);
  };

  const handleDeleteTest = async (testId: number) => {
    Alert.alert('Удалить тест?', 'Это действие необратимо', [
      { text: 'Отмена', style: 'cancel' },
      {
        text: 'Удалить',
        style: 'destructive',
        onPress: async () => {
          const token = await AsyncStorage.getItem('token');
          if (!token) return;
          const res = await api.deleteTest(testId, token);
          if (res?.error) {
            showToast(res.message || 'Не удалось удалить');
            return;
          }
          showToast('Тест удалён');
          loadTests(teacher.id, token);
        },
      },
    ]);
  };

  const handleLogout = async () => {
    await AsyncStorage.removeItem('token');
    navigation.replace('Index');
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <View style={styles.logo}>
            <Text style={styles.logoText}>F</Text>
          </View>
          <Text style={styles.brandText}>FastTest</Text>
        </View>
        <TouchableOpacity style={styles.btnLogout} onPress={handleLogout}>
          <Text style={styles.btnText}>Выйти</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.titlebar}>
        <Text style={styles.title}>Мои тесты</Text>
        <Text style={styles.count}>{tests.length} тест(ов)</Text>
      </View>

      <ScrollView style={styles.list}>
        {tests.map((test: any) => (
          <View key={test.test_id} style={styles.card}>
            <View style={styles.meta}>
              <Text style={styles.testName}>{test.name || 'Без названия'}</Text>
              <Text style={styles.muted}>Вопросов: {test.questions?.length || 0}</Text>
            </View>
            <View style={styles.actions}>
              <TouchableOpacity
                style={styles.btnEdit}
                onPress={() => navigation.navigate('Edit', { testId: test.test_id })}
              >
                <Text style={styles.btnText}>Редактировать</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.btnDelete} onPress={() => handleDeleteTest(test.test_id)}>
                <Text style={styles.btnDeleteText}>Удалить</Text>
              </TouchableOpacity>
            </View>
          </View>
        ))}
      </ScrollView>

      <TouchableOpacity style={styles.fab} onPress={handleCreateTest}>
        <Text style={styles.fabText}>+ Создать тест</Text>
      </TouchableOpacity>
    </View>
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
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#e6e8ee',
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
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
  btnLogout: {
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#e6e8ee',
  },
  btnText: {
    fontWeight: '700',
  },
  titlebar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
  },
  title: {
    fontSize: 26,
    fontWeight: '800',
  },
  count: {
    fontSize: 14,
    color: '#5f6b7a',
  },
  list: {
    flex: 1,
    paddingHorizontal: 20,
  },
  card: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#e6e8ee',
    borderRadius: 16,
    padding: 14,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 3,
  },
  meta: {
    marginBottom: 12,
  },
  testName: {
    fontSize: 18,
    fontWeight: '800',
    marginBottom: 4,
  },
  muted: {
    fontSize: 14,
    color: '#5f6b7a',
  },
  actions: {
    flexDirection: 'row',
  },
  btnEdit: {
    flex: 1,
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#e6e8ee',
    alignItems: 'center',
  },
  btnDelete: {
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 10,
    backgroundColor: '#d93025',
    alignItems: 'center',
  },
  btnDeleteText: {
    color: '#fff',
    fontWeight: '700',
  },
  fab: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    backgroundColor: '#1a73e8',
    borderRadius: 10,
    paddingVertical: 14,
    paddingHorizontal: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 5,
  },
  fabText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
  },
});
