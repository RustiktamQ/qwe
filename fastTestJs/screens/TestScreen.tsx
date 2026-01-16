import React, { useEffect, useState } from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import ApiController from '../services/api';
import showToast from '../utils/toast';

export default function TestScreen({ route, navigation }: any) {
  const { testId } = route.params;
  const [quiz, setQuiz] = useState<any[]>([]);
  const [quizName, setQuizName] = useState('');
  const [idx, setIdx] = useState(0);
  const [answers, setAnswers] = useState<number[]>([]);
  const [started, setStarted] = useState(false);
  const [finished, setFinished] = useState(false);

  const api = new ApiController();

  useEffect(() => {
    loadQuiz();
  }, []);

  const loadQuiz = async () => {
    try {
      const all = await api.getAllTests();
      if (!Array.isArray(all)) throw new Error('Не удалось получить список тестов');
      const test = all.find((t: any) => Number(t.test_id) === Number(testId));
      if (!test) throw new Error('Тест не найден');

      const questions = Array.isArray(test.questions) ? test.questions : [];
      const withOpts = [];

      for (const q of questions) {
        const qid = q.question_id ?? q.id;
        const optsRow = await api.getOptionsByQuestion(qid);
        const opts = [
          { text: String(optsRow?.correct ?? ''), correct: true },
          { text: String(optsRow?.incorrect1 ?? ''), correct: false },
          { text: String(optsRow?.incorrect2 ?? ''), correct: false },
          { text: String(optsRow?.incorrect3 ?? ''), correct: false },
        ].filter((o) => o.text.trim() !== '');

        withOpts.push({
          text: String(q.text || ''),
          options: shuffle(opts),
        });
      }

      setQuiz(withOpts);
      setQuizName(String(test.name || 'Квиз'));
    } catch (e: any) {
      showToast(e.message || 'Ошибка загрузки');
    }
  };

  const shuffle = (arr: any[]) => {
    const a = arr.slice();
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
  };

  const handleStart = () => {
    setStarted(true);
    setIdx(0);
    setAnswers([]);
    setFinished(false);
  };

  const handleAnswer = (optIdx: number) => {
    const newAnswers = [...answers];
    newAnswers[idx] = optIdx;
    setAnswers(newAnswers);
  };

  const handleNext = () => {
    if (answers[idx] === undefined) return;
    if (idx < quiz.length - 1) {
      setIdx(idx + 1);
    } else {
      setFinished(true);
      setStarted(false);
    }
  };

  const handlePrev = () => {
    if (idx > 0) {
      setIdx(idx - 1);
    }
  };

  const calculateScore = () => {
    let correct = 0;
    quiz.forEach((q, i) => {
      if (q.options[answers[i]]?.correct) correct++;
    });
    return correct;
  };

  const getProgressPercent = () => {
    return quiz.length ? (idx / quiz.length) * 100 : 0;
  };

  if (!started && !finished) {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <View style={styles.logo}>
            <Text style={styles.logoText}>F</Text>
          </View>
          <Text style={styles.brandText}>FastTest</Text>
          <TouchableOpacity style={styles.btnBack} onPress={() => navigation.goBack()}>
            <Text style={styles.btnText}>Назад</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.startCard}>
          <Text style={styles.startTitle}>{quizName}</Text>
          <Text style={styles.muted}>Вопросов: {quiz.length}</Text>
          <Text style={styles.muted}>Отвечайте последовательно — по одному вопросу.</Text>
          <TouchableOpacity style={styles.btnPrimary} onPress={handleStart}>
            <Text style={styles.btnPrimaryText}>Начать</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  if (finished) {
    const correct = calculateScore();
    const pct = Math.round((correct / quiz.length) * 100);
    const remark =
      pct >= 80 ? 'Отличный результат!' : pct >= 50 ? 'Неплохо! Есть, куда расти.' : 'Нужно подтянуть тему.';

    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <View style={styles.logo}>
            <Text style={styles.logoText}>F</Text>
          </View>
          <Text style={styles.brandText}>FastTest</Text>
        </View>

        <View style={styles.resultCard}>
          <Text style={styles.score}>
            {correct} / {quiz.length}
          </Text>
          <Text style={styles.remark}>{remark}</Text>
          <TouchableOpacity style={styles.btnPrimary} onPress={handleStart}>
            <Text style={styles.btnPrimaryText}>Пройти ещё раз</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.btnSecondary} onPress={() => navigation.goBack()}>
            <Text style={styles.btnText}>Вернуться</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  const currentQ = quiz[idx];
  const selectedAnswer = answers[idx];

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.logo}>
          <Text style={styles.logoText}>F</Text>
        </View>
        <Text style={styles.brandText}>FastTest</Text>
      </View>

      <View style={styles.progress}>
        <Text style={styles.badge}>
          Вопрос {idx + 1} / {quiz.length}
        </Text>
        <View style={styles.bar}>
          <View style={[styles.barFill, { width: `${getProgressPercent()}%` }]} />
        </View>
      </View>

      <ScrollView style={styles.content}>
        <View style={styles.card}>
          <Text style={styles.qtext}>{currentQ?.text}</Text>
          <View style={styles.options}>
            {currentQ?.options.map((opt: any, i: number) => (
              <TouchableOpacity
                key={i}
                style={[styles.option, selectedAnswer === i && styles.optionSelected]}
                onPress={() => handleAnswer(i)}
              >
                <View style={styles.radio}>{selectedAnswer === i && <View style={styles.radioInner} />}</View>
                <Text style={styles.optionText}>{opt.text}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </ScrollView>

      <View style={styles.toolbar}>
        <TouchableOpacity
          style={[styles.btnSecondary, idx === 0 && styles.btnDisabled]}
          onPress={handlePrev}
          disabled={idx === 0}
        >
          <Text style={styles.btnText}>Назад</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.btnPrimary, selectedAnswer === undefined && styles.btnDisabled]}
          onPress={handleNext}
          disabled={selectedAnswer === undefined}
        >
          <Text style={styles.btnPrimaryText}>Далее</Text>
        </TouchableOpacity>
      </View>
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
    flex: 1,
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
  startCard: {
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
  startTitle: {
    fontSize: 24,
    fontWeight: '800',
    marginBottom: 6,
  },
  muted: {
    fontSize: 14,
    color: '#5f6b7a',
    marginBottom: 8,
  },
  btnPrimary: {
    backgroundColor: '#1a73e8',
    borderRadius: 10,
    padding: 14,
    alignItems: 'center',
    marginTop: 10,
  },
  btnPrimaryText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
  },
  btnSecondary: {
    borderRadius: 10,
    padding: 14,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#e6e8ee',
    marginTop: 10,
  },
  btnDisabled: {
    opacity: 0.5,
  },
  progress: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
  },
  badge: {
    backgroundColor: '#f2f7ff',
    borderWidth: 1,
    borderColor: '#e6e8ee',
    borderRadius: 999,
    paddingVertical: 6,
    paddingHorizontal: 10,
    fontSize: 12,
    color: '#1357b7',
  },
  bar: {
    flex: 1,
    height: 10,
    borderRadius: 999,
    backgroundColor: '#eef2ff',
    borderWidth: 1,
    borderColor: '#e6e8ee',
    overflow: 'hidden',
  },
  barFill: {
    height: '100%',
    backgroundColor: '#1a73e8',
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  card: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#e6e8ee',
    borderRadius: 16,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 3,
  },
  qtext: {
    fontSize: 18,
    fontWeight: '800',
    marginBottom: 16,
  },
  options: {},
  option: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#e6e8ee',
    borderRadius: 12,
    padding: 12,
    backgroundColor: '#fff',
  },
  optionSelected: {
    borderColor: '#1a73e8',
    backgroundColor: '#f2f7ff',
  },
  radio: {
    width: 18,
    height: 18,
    borderRadius: 9,
    borderWidth: 2,
    borderColor: '#e6e8ee',
    alignItems: 'center',
    justifyContent: 'center',
  },
  radioInner: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#1a73e8',
  },
  optionText: {
    flex: 1,
    fontSize: 16,
  },
  toolbar: {
    flexDirection: 'row',
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: '#e6e8ee',
  },
  resultCard: {
    margin: 20,
    padding: 18,
    backgroundColor: '#fff',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#e6e8ee',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 3,
  },
  score: {
    fontSize: 36,
    fontWeight: '900',
    marginBottom: 10,
  },
  remark: {
    fontSize: 14,
    color: '#5f6b7a',
    marginBottom: 20,
  },
});
