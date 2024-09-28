import { useEffect, useRef, useState } from "react";

import { getMockData, MockData, MockDataResponse } from "./data";

let page = 0;
let totalAmount = 0;

function App() {
  const ref = useRef<HTMLDivElement>(null);

  const [data, setData] = useState<MockData[]>([]);
  const [isEnd, setIsEnd] = useState(false);

  const observer = new IntersectionObserver((entries, observer) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        getMockData(page++).then((res) => {
          const { datas, isEnd } = res as unknown as MockDataResponse;

          totalAmount += datas.reduce(
            (acc, cur) => acc + cur.price,
            totalAmount
          );
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
    <div className="container">
      <h1>〰️ General Store 〰️</h1>
      <div className="list">
        <div className="list-header">
          <span>Products ({data.length})</span>
          <span>Total amount ${totalAmount.toLocaleString()}</span>
        </div>
        <div className="list-main">
          {data.map((item) => (
            <div className="card" key={item.productId}>
              <h2>{item.productName}</h2>
              <p>
                <span>
                  Bought date: {new Date(item.boughtDate).toDateString()}
                </span>
                <span>Price: ${item.price}</span>
              </p>
            </div>
          ))}
        </div>
      </div>
      {!isEnd && <div className="spinner" ref={ref} />}
    </div>
  );
}

export default App;
