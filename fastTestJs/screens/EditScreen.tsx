import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { useEffect, useState } from 'react';
import { Alert, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import ApiController from '../services/api';
import decodeJwt from '../utils/decodeJwt';
import showToast from '../utils/toast';

export default function EditScreen({ route, navigation }: any) {
  const { testId } = route.params;
  const [state, setState] = useState<any>({
    test_id: testId,
    name: '',
    _originalName: '',
    teacher_id: null,
    questions: [],
  });
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
    const decoded = decodeJwt(token);
    setTeacher(decoded);
    loadTest(decoded.id, token);
  };

  const loadTest = async (teacherId: number, token: string) => {
    let test = null;
    const byTeacher = await api.getTestsByTeacher(teacherId);
    if (Array.isArray(byTeacher)) {
      test = byTeacher.find((t: any) => Number(t.test_id) === Number(testId)) || null;
    }
    if (!test) {
      const all = await api.getAllTests();
      if (Array.isArray(all)) {
        test = all.find((t: any) => Number(t.test_id) === Number(testId)) || null;
      }
    }
    if (!test) {
      showToast('Тест не найден');
      return;
    }

    const rawQuestions = Array.isArray(test.questions) ? test.questions : [];
    const enriched = [];
    for (const q of rawQuestions) {
      const qid = q.question_id ?? q.id ?? q.qid;
      let optRow = null;
      try {
        optRow = await api.getOptionsByQuestion(qid);
      } catch {}
      const mapped = {
        correct: optRow?.correct ?? '',
        incorrect1: optRow?.incorrect1 ?? '',
        incorrect2: optRow?.incorrect2 ?? '',
        incorrect3: optRow?.incorrect3 ?? '',
        option_id: optRow?.option_id ?? optRow?.id ?? null,
      };
      enriched.push({
        id: String(qid ?? uid()),
        question_id: qid || null,
        option_row_id: mapped.option_id,
        text: String(q.text || ''),
        _originalText: String(q.text || ''),
        options: [
          { key: 'A', text: mapped.correct },
          { key: 'B', text: mapped.incorrect1 },
          { key: 'C', text: mapped.incorrect2 },
          { key: 'D', text: mapped.incorrect3 },
        ],
        correct: 'A',
        _status: 'existing',
      });
    }

    setState({
      test_id: testId,
      name: String(test.name || ''),
      _originalName: String(test.name || ''),
      teacher_id: teacherId,
      questions: enriched,
    });
  };

  const uid = () => Math.random().toString(36).slice(2, 9);

  const addQuestion = () => {
    const id = uid();
    setState((prev: any) => ({
      ...prev,
      questions: [
        ...prev.questions,
        {
          id,
          question_id: null,
          option_row_id: null,
          text: '',
          _originalText: '',
          options: [
            { key: 'A', text: '' },
            { key: 'B', text: '' },
            { key: 'C', text: '' },
            { key: 'D', text: '' },
          ],
          correct: 'A',
          _status: 'new',
        },
      ],
    }));
  };

  const removeQuestion = async (id: string, immediateDelete = false) => {
    const i = state.questions.findIndex((x: any) => x.id === id);
    if (i === -1) return;
    const q = state.questions[i];
    if (immediateDelete && q.question_id) {
      const token = await AsyncStorage.getItem('token');
      if (!token) return;
      const res = await api.deleteQuestion(q.question_id, token);
      if (res?.error) {
        showToast(res.message || 'Не удалось удалить вопрос');
        return;
      }
    }
    setState((prev: any) => ({
      ...prev,
      questions: prev.questions.filter((_: any, idx: number) => idx !== i),
    }));
    showToast('Вопрос удалён');
  };

  const duplicateQuestion = (id: string) => {
    const q = state.questions.find((x: any) => x.id === id);
    if (!q) return;
    const clone = JSON.parse(JSON.stringify(q));
    clone.id = uid();
    clone.question_id = null;
    clone.option_row_id = null;
    clone._originalText = '';
    clone._status = 'new';
    setState((prev: any) => ({
      ...prev,
      questions: [...prev.questions, clone],
    }));
  };

  const updateQuestionText = (id: string, text: string) => {
    setState((prev: any) => ({
      ...prev,
      questions: prev.questions.map((q: any) => (q.id === id ? { ...q, text } : q)),
    }));
  };

  const updateOptionText = (qid: string, optIdx: number, text: string) => {
    setState((prev: any) => ({
      ...prev,
      questions: prev.questions.map((q: any) =>
        q.id === qid
          ? {
              ...q,
              options: q.options.map((o: any, i: number) => (i === optIdx ? { ...o, text } : o)),
            }
          : q,
      ),
    }));
  };

  const setCorrectAnswer = (qid: string, key: string) => {
    setState((prev: any) => ({
      ...prev,
      questions: prev.questions.map((q: any) => (q.id === qid ? { ...q, correct: key } : q)),
    }));
  };

  const validate = () => {
    if (!state.name.trim()) return { ok: false, msg: 'Введите название теста' };
    if (state.questions.length === 0) return { ok: false, msg: 'Добавьте минимум один вопрос' };
    for (const [i, q] of state.questions.entries()) {
      if (!q.text.trim()) return { ok: false, msg: `Вопрос ${i + 1}: введите текст` };
      for (const o of q.options) {
        if (!o.text.trim()) return { ok: false, msg: `Вопрос ${i + 1}: заполните вариант ${o.key}` };
      }
      if (!['A', 'B', 'C', 'D'].includes(q.correct)) {
        return { ok: false, msg: `Вопрос ${i + 1}: выберите правильный вариант` };
      }
    }
    return { ok: true };
  };

  const toOptionDto = (q: any) => {
    const lookup = Object.fromEntries(q.options.map((o: any) => [o.key, o.text]));
    const correct = lookup[q.correct];
    const incorrect = ['A', 'B', 'C', 'D'].filter((k) => k !== q.correct).map((k) => lookup[k]);
    return {
      question_id: q.question_id,
      correct,
      incorrect1: incorrect[0],
      incorrect2: incorrect[1],
      incorrect3: incorrect[2],
    };
  };

  const saveAll = async () => {
    const v = validate();
    if (!v.ok) {
      showToast(v.msg || '');
      return;
    }

    const token = await AsyncStorage.getItem('token');
    if (!token) return;

    if (state.name !== state._originalName) {
      const r = await api.updateTest(state.test_id, { name: state.name }, token);
      if (r?.error) {
        showToast(r.message || 'Не удалось сохранить название');
        return;
      }
      setState((prev: any) => ({ ...prev, _originalName: state.name }));
    }

    for (const q of state.questions) {
      if (q.question_id && q.text !== q._originalText) {
        const del = await api.deleteQuestion(q.question_id, token);
        if (del?.error) {
          showToast(del.message || 'Не удалось обновить вопрос');
          return;
        }
        q.question_id = null;
        q.option_row_id = null;
        q._status = 'new';
      }
      if (!q.question_id) {
        const createdQ = await api.createQuestion({ test_id: state.test_id, text: q.text }, token);

        console.log('createQuestion response:', createdQ);

        if (createdQ?.error || !createdQ?.question_id) {
          showToast(createdQ?.message || 'Не удалось создать вопрос');
          return;
        }
        q.question_id = createdQ.question_id;
        const dto = toOptionDto(q);
        dto.question_id = q.question_id;
        const createdOpt = await api.createOption(dto, token);
        if (createdOpt?.error) {
          showToast(createdOpt.message || 'Не удалось сохранить варианты');
          return;
        }
        q.option_row_id = createdOpt.option_id ?? createdOpt.id ?? null;
        q._originalText = q.text;
        q._status = 'existing';
      } else {
        const dto = toOptionDto(q);
        if (q.option_row_id) {
          const upd = await api.editOption(q.option_row_id, dto, token);
          if (upd?.error) {
            showToast(upd.message || 'Не удалось обновить варианты');
            return;
          }
        } else {
          const createdOpt = await api.createOption(dto, token);
          if (createdOpt?.error) {
            showToast(createdOpt.message || 'Не удалось сохранить варианты');
            return;
          }
          q.option_row_id = createdOpt.option_id ?? createdOpt.id ?? null;
        }
      }
    }
    showToast('Изменения сохранены');
  };

  const handleDeleteTest = async () => {
    Alert.alert('Удалить этот тест безвозвратно?', '', [
      { text: 'Отмена', style: 'cancel' },
      {
        text: 'Удалить',
        style: 'destructive',
        onPress: async () => {
          const token = await AsyncStorage.getItem('token');
          if (!token) return;
          const res = await api.deleteTest(state.test_id, token);
          if (res?.error) {
            showToast(res.message || 'Не удалось удалить тест');
            return;
          }
          showToast('Тест удалён');
          navigation.goBack();
        },
      },
    ]);
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
        <View style={styles.headerRight}>
          <TouchableOpacity style={styles.btnBack} onPress={() => navigation.goBack()}>
            <Text style={styles.btnText}>← Назад</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.btnSave} onPress={saveAll}>
            <Text style={styles.btnSaveText}>Сохранить</Text>
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView style={styles.content}>
        <View style={styles.titlebar}>
          <Text style={styles.title}>Редактирование теста</Text>
          <Text style={styles.muted}>Вопросов: {state.questions.length}</Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.label}>Название теста</Text>
          <TextInput
            style={styles.input}
            value={state.name}
            onChangeText={(text) => setState((prev: any) => ({ ...prev, name: text }))}
            placeholder="Например: Контрольная по JavaScript"
          />
        </View>

        {state.questions.map((q: any, i: number) => (
          <View key={q.id} style={styles.card}>
            <View style={styles.qHead}>
              <Text style={styles.qTitle}>Вопрос {i + 1}</Text>
              <View style={styles.qActions}>
                <TouchableOpacity style={styles.btnSmall} onPress={() => duplicateQuestion(q.id)}>
                  <Text style={styles.btnText}>Дублировать</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.btnDanger} onPress={() => removeQuestion(q.id, true)}>
                  <Text style={styles.btnDangerText}>Удалить</Text>
                </TouchableOpacity>
              </View>
            </View>

            <Text style={styles.label}>Формулировка</Text>
            <TextInput
              style={styles.input}
              value={q.text}
              onChangeText={(text) => updateQuestionText(q.id, text)}
              placeholder="Например: Что такое замыкание?"
              multiline
            />

            <Text style={styles.label}>Варианты (выберите правильный)</Text>
            {q.options.map((opt: any, idx: number) => (
              <View key={idx} style={styles.optRow}>
                <TouchableOpacity style={styles.radio} onPress={() => setCorrectAnswer(q.id, opt.key)}>
                  {q.correct === opt.key && <View style={styles.radioInner} />}
                </TouchableOpacity>
                <TextInput
                  style={[styles.input, styles.optInput]}
                  value={opt.text}
                  onChangeText={(text) => updateOptionText(q.id, idx, text)}
                  placeholder={`Вариант ${opt.key}`}
                />
              </View>
            ))}
          </View>
        ))}

        <TouchableOpacity style={styles.btnAdd} onPress={addQuestion}>
          <Text style={styles.btnText}>+ Добавить вопрос</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.btnDeleteTest} onPress={handleDeleteTest}>
          <Text style={styles.btnDangerText}>Удалить тест</Text>
        </TouchableOpacity>

        <View style={{ height: 40 }} />
      </ScrollView>
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
  headerRight: {
    flexDirection: 'row',
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
  btnBack: {
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#e6e8ee',
  },
  btnText: {
    fontWeight: '700',
  },
  btnSave: {
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 10,
    backgroundColor: '#16a34a',
  },
  btnSaveText: {
    color: '#fff',
    fontWeight: '700',
  },
  content: {
    flex: 1,
    padding: 20,
  },
  titlebar: {
    marginBottom: 16,
  },
  title: {
    fontSize: 26,
    fontWeight: '800',
    marginBottom: 4,
  },
  muted: {
    fontSize: 14,
    color: '#5f6b7a',
  },
  card: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#e6e8ee',
    borderRadius: 16,
    padding: 16,
    marginBottom: 14,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 3,
  },
  label: {
    fontSize: 14,
    fontWeight: '700',
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
  qHead: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  qTitle: {
    fontSize: 16,
    fontWeight: '800',
  },
  qActions: {
    flexDirection: 'row',
  },
  btnSmall: {
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e6e8ee',
  },
  btnDanger: {
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 8,
    backgroundColor: '#d93025',
  },
  btnDangerText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 12,
  },
  optRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  radio: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#e6e8ee',
    alignItems: 'center',
    justifyContent: 'center',
  },
  radioInner: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#1a73e8',
  },
  optInput: {
    flex: 1,
  },
  btnAdd: {
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#e6e8ee',
    alignItems: 'center',
    marginBottom: 14,
  },
  btnDeleteTest: {
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: 10,
    backgroundColor: '#d93025',
    alignItems: 'center',
  },
});
