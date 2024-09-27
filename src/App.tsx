import { useEffect, useRef, useState } from "react";

import { getMockData, MockData, MockDataResponse } from "./data";

let page = 0;

function App() {
  const ref = useRef<HTMLSpanElement>(null);

  const [data, setData] = useState<MockData[]>([]);
  const [isEnd, setIsEnd] = useState(false);

  const observer = new IntersectionObserver((entries, observer) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        getMockData(page++).then((res) => {
          const { datas, isEnd } = res as unknown as MockDataResponse;
          setData((prev) => [...prev, ...datas]);
          setIsEnd(isEnd);

          if (isEnd) observer.unobserve(entry.target);
        });
      }
    });
  });

  useEffect(() => {
    // Set observer
    const target = ref.current;
    if (target) observer.observe(target);

    getMockData(page++).then((res) => {
      const { datas, isEnd } = res as unknown as MockDataResponse;
      setData(datas);
      setIsEnd(isEnd);
    });
  }, []);

  return (
    <>
      <h1>잡화점</h1>
      <div>
        {data.map((item) => (
          <div key={item.productId}>
            <h2>{item.productName}</h2>
            <p>
              <span>{item.price}원</span>
              <span>{item.boughtDate}</span>
            </p>
          </div>
        ))}
        {!isEnd && <span ref={ref}>Loading...</span>}
      </div>
    </>
  );
}

export default App;
