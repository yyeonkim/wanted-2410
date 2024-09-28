import { useEffect, useRef, useState } from "react";

import { getMockData, MockData, MockDataResponse } from "./data";

let page = 0;

function App() {
  const ref = useRef<HTMLDivElement>(null);

  const [data, setData] = useState<MockData[]>([]);
  const [isEnd, setIsEnd] = useState(false);

  const observer = new IntersectionObserver((entries, observer) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        console.log(page);
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
  }, []);

  return (
    <div className="container-center">
      <h1>〰️ General Store 〰️</h1>
      <div className="list">
        {data.map((item) => (
          <div className="card" key={item.productId}>
            <h2>{item.productName}</h2>
            <p>
              <span>
                {"Bought date: " + new Date(item.boughtDate).toDateString()}
              </span>
              <span>Price: ${item.price}</span>
            </p>
          </div>
        ))}
        {!isEnd && <div className="spinner" ref={ref} />}
      </div>
    </div>
  );
}

export default App;
