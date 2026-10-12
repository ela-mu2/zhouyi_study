import { useEffect, useMemo, useState } from "react";
import api from "../utils/api";
import { useNavigate } from "react-router-dom";

const HISTORY_KEY = "zhouyi-quiz-history";

export default function Quiz() {
  const [quizzes, setQuizzes] = useState([]);
  const [quizIndex, setQuizIndex] = useState(0);
  const [questionIndex, setQuestionIndex] = useState(0);
  const [selected, setSelected] = useState(null);
  const [answers, setAnswers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [saveWarning, setSaveWarning] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [finalScore, setFinalScore] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    let active = true;
    api.get("/quizzes")
      .then(({ data }) => { if (active) setQuizzes(Array.isArray(data) ? data : []); })
      .catch(() => { if (active) setError("测验加载失败，请检查后端服务和 API 地址。"); })
      .finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, []);

  const quiz = quizzes[quizIndex];
  const questions = quiz?.questions || [];
  const question = questions[questionIndex];
  const score = useMemo(() => answers.filter((answer) => answer.isCorrect).length, [answers]);

  const submitAnswer = async () => {
    if (!question || selected === null || submitting) return;
    const option = question.options?.[selected];
    const nextAnswers = [...answers, {
      questionId: question._id,
      selectedOptionId: option?._id,
      selectedOption: option?.option_text || "",
      isCorrect: Boolean(option?.is_correct),
    }];
    setAnswers(nextAnswers);

    if (questionIndex < questions.length - 1) {
      setQuestionIndex(questionIndex + 1);
      setSelected(null);
      return;
    }

    const attempt = {
      id: globalThis.crypto?.randomUUID?.() || String(Date.now()),
      quizTitle: quiz.category_title || "周易测验",
      total: questions.length,
      score: nextAnswers.filter((answer) => answer.isCorrect).length,
      completedAt: new Date().toISOString(),
    };

    try {
      const previous = JSON.parse(localStorage.getItem(HISTORY_KEY) || "[]");
      localStorage.setItem(HISTORY_KEY, JSON.stringify([attempt, ...previous]));
    } catch {
      setSaveWarning("浏览器未能保存本地成绩记录。");
    }

    const token = localStorage.getItem("token");
    if (token && quiz._id && nextAnswers.every((answer) => answer.questionId && answer.selectedOptionId)) {
      setSubmitting(true);
      try {
        const { data } = await api.post("/quizzes/attempt", {
          quiz_id: quiz._id,
          attempt_group_id: attempt.id,
          answers: nextAnswers.map(({ questionId, selectedOptionId }) => ({
            question_id: questionId,
            selected_option_id: selectedOptionId,
          })),
        }, { headers: { Authorization: `Bearer ${token}` } });
        attempt.score = data.score;
        setFinalScore(data.score);
      } catch {
        setSaveWarning("成绩已保存在当前浏览器，但暂未同步到账号。");
        setFinalScore(attempt.score);
      } finally {
        setSubmitting(false);
      }
    } else {
      setFinalScore(attempt.score);
    }
    setSubmitted(true);
  };

  if (loading) return <main className="page-shell"><p role="status">正在加载测验…</p></main>;
  if (error) return <main className="page-shell"><p className="notice notice-error" role="alert">{error}</p><button className="action-button" onClick={() => navigate("/home")}>返回首页</button></main>;
  if (quizzes.length === 0) return <main className="page-shell"><h1>在线测验</h1><p className="notice">目前没有可用测验。</p><button className="action-button" onClick={() => navigate("/home")}>返回首页</button></main>;

  if (submitted) return (
    <main className="page-shell result-panel">
      <p className="eyebrow">测验完成</p><h1>{quiz.category_title}</h1>
      <p className="result-score">{finalScore ?? score}<span> / {questions.length}</span></p>
      <p>答对 {finalScore ?? score} 题，共 {questions.length} 题。</p>
      {saveWarning && <p className="notice notice-error" role="status">{saveWarning}</p>}
      {!localStorage.getItem("token") && <p className="muted">记录保存在当前浏览器；登录后可以同步到账号。</p>}
      <div className="button-row"><button className="action-button" onClick={() => navigate("/quiz-history")}>查看答题记录</button><button className="secondary-button" onClick={() => navigate("/home")}>返回首页</button></div>
    </main>
  );

  if (!question) return <main className="page-shell"><p className="notice">这个测验还没有题目。</p><button className="action-button" onClick={() => navigate("/home")}>返回首页</button></main>;

  return (
    <main className="page-shell quiz-page">
      <button className="text-button" onClick={() => navigate("/home")}>← 退出测验</button>
      {quizzes.length > 1 && <label className="quiz-picker">选择测验
        <select value={quizIndex} onChange={(event) => { setQuizIndex(Number(event.target.value)); setQuestionIndex(0); setSelected(null); setAnswers([]); }}>
          {quizzes.map((item, index) => <option key={item._id || index} value={index}>{item.category_title || `测验 ${index + 1}`}</option>)}
        </select>
      </label>}
      <p className="eyebrow">{quiz.category_title}</p>
      <h1>第 {questionIndex + 1} / {questions.length} 题</h1>
      <div className="progress-track"><span style={{ width: `${((questionIndex + 1) / questions.length) * 100}%` }} /></div>
      <section className="quiz-card">
        <h2>{question.question_text}</h2>
        <div className="option-list">
          {(question.options || []).map((option, index) => (
            <button key={option._id || index} className={selected === index ? "option selected" : "option"} aria-pressed={selected === index} onClick={() => setSelected(index)}>
              <span>{String.fromCharCode(65 + index)}</span>{option.option_text}
            </button>
          ))}
        </div>
      </section>
      <button className="action-button" disabled={selected === null || submitting} onClick={submitAnswer}>{submitting ? "正在保存…" : questionIndex === questions.length - 1 ? "完成测验" : "下一题 →"}</button>
    </main>
  );
}
