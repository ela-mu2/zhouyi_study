import React, { useState, useEffect } from 'react';

// 模拟数据结构，实际开发中可替换为 API 请求或通过 React Router 获取
const ArticleDetail = ({ articleId, onBack }) => {
  const [article, setArticle] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // 模拟从后端获取文章详情数据
    const fetchArticle = async () => {
      try {
        setLoading(true);
        // 模拟延迟
        await new Promise((resolve) => setTimeout(resolve, 600));

        // 模拟文章数据
        const data = {
          id: articleId || 1,
          title: '周易六十四卦浅析：从乾坤两卦看阴阳变易',
          subtitle: '探讨易经核心哲学思想及其在日常思考中的应用',
          author: 'Elias',
          publishDate: '2026-10-06',
          category: '周易研究',
          readTime: '5 分钟',
          content: `
            <p>《周易》作为中国古代思想的源头活水，其核心在于“变”。“易”有三义：简易、变易、不易。</p>
            <h3>一、乾坤两卦的象征意义</h3>
            <p>乾卦代表纯阳，刚健有力；坤卦代表纯阴，柔顺包容。两者互为表里，共同构成了变化的基础。</p>
            <p>在日常生活中，懂得刚柔相济，便能更好地应对各种复杂的情境。</p>
            <h3>二、变爻与时位的把握</h3>
            <p>六爻的演变代表了事物发展的不同阶段。从初爻的潜藏到上爻的盈满，每一爻都给出了特定的处事智慧。</p>
          `,
        };

        setArticle(data);
      } catch (err) {
        setError('加载文章失败，请稍后重试。');
      } finally {
        setLoading(false);
      }
    };

    fetchArticle();
  }, [articleId]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[300px]">
        <div className="text-gray-500 animate-pulse">文章加载中...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[300px]">
        <p className="text-red-500 mb-4">{error}</p>
        {onBack && (
          <button
            onClick={onBack}
            className="px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded text-sm text-gray-700 transition"
          >
            返回列表
          </button>
        )}
      </div>
    );
  }

  if (!article) return null;

  return (
    <article className="max-w-3xl mx-auto px-4 py-8 bg-white text-gray-800">
      {/* 返回按钮 */}
      {onBack && (
        <button
          onClick={onBack}
          className="mb-6 flex items-center text-sm text-gray-500 hover:text-gray-800 transition"
        >
          ← 返回
        </button>
      )}

      {/* 文章头部信息 */}
      <header className="border-b border-gray-100 pb-6 mb-6">
        <div className="flex items-center gap-2 mb-3 text-xs font-medium text-amber-700">
          <span className="bg-amber-50 px-2 py-0.5 rounded">{article.category}</span>
          <span>•</span>
          <span>预计阅读 {article.readTime}</span>
        </div>

        <h1 className="text-3xl font-bold text-gray-900 leading-tight mb-3">
          {article.title}
        </h1>

        {article.subtitle && (
          <p className="text-lg text-gray-500 mb-4 leading-relaxed">
            {article.subtitle}
          </p>
        )}

        <div className="flex items-center text-sm text-gray-400 gap-4">
          <span>作者：<strong className="text-gray-600">{article.author}</strong></span>
          <span>发布于 {article.publishDate}</span>
        </div>
      </header>

      {/* 文章正文 */}
      <section 
        className="prose prose-slate max-w-none leading-relaxed text-gray-700 space-y-4"
        dangerouslySetInnerHTML={{ __html: article.content }}
      />

      {/* 文章页脚 */}
      <footer className="mt-12 pt-6 border-t border-gray-100 flex justify-between items-center text-sm text-gray-400">
        <div>编辑于 {article.publishDate}</div>
        <button 
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          className="hover:text-gray-600 transition"
        >
          回到顶部 ↑
        </button>
      </footer>
    </article>
  );
};

export default ArticleDetail;