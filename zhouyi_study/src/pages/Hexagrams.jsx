import { useEffect, useState } from 'react';
import { getGuaList } from '../utils/api'; // 调用之前写好的接口

export default function GuaList() {
  const [guaList, setGuaList] = useState([]);

  useEffect(() => {
    // 页面加载时请求后端
    getGuaList().then(data => {
      setGuaList(data);
    });
  }, []);

  return (
    <div style={{ padding: '20px' }}>
      <h2>经卦大全</h2>
      <ul>
        {guaList.map(item => (
          <li key={item.id}>
            <h3>{item.title}</h3>
            <p>{item.description}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}