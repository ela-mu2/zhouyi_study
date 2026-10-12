import { useState, useEffect } from "react";
import api from "../utils/api";
import { useNavigate } from "react-router-dom";

function Quiz() {
  const [questions, setQuestions] = useState([]);
  const [current, setCurrent] = useState(0);
  const [selected, setSelected] = useState(null);      // 当前题目选中的选项
  const [answers, setAnswers] = useState([]);           // 每题的作答记录
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [submitted, setSubmitted] = useState(false);    // 是否已提交整份试卷
  const [score, setScore] = useState(null);

  const navigate = useNavigate();

  // 页面加载时拉取题目列表
  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        setLoading(true);
        const response = await api.get("/quiz/questions");
        setQuestions(response.data);
      } catch (err) {
        setError("题目加载失败，请稍后重试。");
      } finally {
        setLoading(false);
      }
    };

    fetchQuestions();
  }, []);

  // 选择某个选项
  const handleSelect = (optionIndex) => {
    if (submitted) return; // 已提交则不允许再修改
    setSelected(optionIndex);
  };

  // 下一题 / 提交
  const handleNext = async () => {
    if (selected === null) return;

    const updatedAnswers = [
      ...answers,
      { questionId: questions[current].id, selected },
    ];
    setAnswers(updatedAnswers);

    // 还有下一题
    if (current < questions.length - 1) {
      setCurrent(current + 1);
      setSelected(null);
      return;
    }

    // 最后一题，提交答案
    try {
      const response = await api.post("/quiz/submit", { answers: updatedAnswers });
      setScore(response.data.score);
      setSubmitted(true);
    } catch (err) {
      setError("提交失败，请稍后重试。");
    }
  };

  // ── 渲染：加载中 ──
  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[300px]">
        <div className="text-gray-500 animate-pulse">题目加载中...</div>
      </div>
    );
  }

  // ── 渲染：出错 ──
  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[300px]">
        <p className="text-red-500 mb-4">{error}</p>
        <button
          onClick={() => navigate("/home")}
          className="px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded text-sm text-gray-700 transition"
        >
          返回首页
        </button>
      </div>
    );
  }

  // ── 渲染：结果页 ──
  if (submitted) {
    const total = questions.length;
    const passed = score >= Math.ceil(total * 0.6); // 60% 及格

    return (
      <div className="max-w-xl mx-auto px-4 py-12 text-center">
        <div className={`text-6xl mb-4 ${passed ? "text-amber-500" : "text-gray-400"}`}>
          {passed ? "🎉" : "📖"}
        </div>
        <h2 className="text-2xl font-bold text-gray-800 mb-2">
          {passed ? "恭喜完成测验！" : "继续加油！"}
        </h2>
        <p className="text-gray-500 mb-6">
          共 {total} 题，答对 <span className="text-amber-600 font-semibold">{score}</span> 题
        </p>

        <div className="flex justify-center gap-4">
          <button
            onClick={() => navigate("/home")}
            className="px-5 py-2 bg-gray-200 hover:bg-gray-300 rounded text-sm text-gray-700 transition"
          >
            返回首页
          </button>
          <button
            onClick={() => navigate("/quiz-history")}
            className="px-5 py-2 bg-amber-500 hover:bg-amber-600 rounded text-sm text-white transition"
          >
            查看答题记录
          </button>
        </div>
      </div>
    );
  }

  // ── 渲染：答题中 ──
  const q = questions[current];
  const progress = ((current + 1) / questions.length) * 100;

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      {/* 顶部进度 */}
      <div className="mb-6">
        <div className="flex justify-between text-sm text-gray-400 mb-1">
          <span>题目 {current + 1} / {questions.length}</span>
          <button
            onClick={() => navigate("/home")}
            className="text-gray-400 hover:text-gray-600 transition"
          >
            退出测验
          </button>
        </div>
        <div className="w-full h-1.5 bg-gray-100 rounded-full">
          <div
            className="h-1.5 bg-amber-400 rounded-full transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* 题目卡片 */}
      <div className="bg-white border border-gray-100 rounded-xl p-6 shadow-sm">
        <p className="text-lg font-medium text-gray-800 mb-6 leading-relaxed">
          {q.question}
        </p>

        {/* 选项列表 */}
        <ul className="space-y-3">
          {q.options.map((option, index) => (
            <li key={index}>
              <button
                onClick={() => handleSelect(index)}
                className={`w-full text-left px-4 py-3 rounded-lg border text-sm transition
                  ${selected === index
                    ? "border-amber-400 bg-amber-50 text-amber-800 font-medium"
                    : "border-gray-200 hover:border-amber-200 hover:bg-amber-50 text-gray-700"
                  }`}
              >
                <span className="font-semibold mr-2">
                  {String.fromCharCode(65 + index)}.
                </span>
                {option}
              </button>
            </li>
          ))}
        </ul>
      </div>

      {/* 下一题 / 提交按钮 */}
      <div className="mt-6 flex justify-end">
        <button
          onClick={handleNext}
          disabled={selected === null}
          className={`px-6 py-2.5 rounded-lg text-sm font-medium transition
            ${selected !== null
              ? "bg-amber-500 hover:bg-amber-600 text-white"
              : "bg-gray-100 text-gray-400 cursor-not-allowed"
            }`}
        >
          {current < questions.length - 1 ? "下一题 →" : "提交答卷"}
        </button>
      </div>
    </div>
  );
}

export default Quiz;