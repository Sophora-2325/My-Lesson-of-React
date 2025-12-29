// AnimatedCountdown.js
import React, { useState, useEffect, useRef } from "react";
import "../App.css"; // 我们将把 style.css 的内容放在这里

function AnimatedCountdown() {
  // 1. 定义状态
  const [isAnimating, setIsAnimating] = useState(false);
  const [resetKey, setResetKey] = useState(0);

  // 2. 使用 ref 引用 DOM 元素
  const numsRef = useRef([]);
  const counterRef = useRef(null);
  const finalRef = useRef(null);

  // 3. 初始化动画 - 相当于原版中的 runAnimation()
  useEffect(() => {
    const nums = numsRef.current;
    const counter = counterRef.current;
    const final = finalRef.current;

    // 重置函数
    const resetDOM = () => {
      counter.classList.remove("hide");
      final.classList.remove("show");
      nums.forEach((num) => {
        num.classList.value = "";
      });
      nums[0].classList.add("in");
    };

    // 运行动画函数
    const runAnimation = () => {
      nums.forEach((num, idx) => {
        const nextToLast = nums.length - 1;

        // 监听动画结束事件
        const handleAnimationEnd = (e) => {
          if (e.animationName === "goIn" && idx !== nextToLast) {
            num.classList.remove("in");
            num.classList.add("out");
          } else if (e.animationName === "goOut" && num.nextElementSibling) {
            num.nextElementSibling.classList.add("in");
          } else {
            counter.classList.add("hide");
            final.classList.add("show");
            setIsAnimating(false);
          }
        };

        num.addEventListener("animationend", handleAnimationEnd);

        // 保存事件监听器以便清理
        return () => {
          num.removeEventListener("animationend", handleAnimationEnd);
        };
      });
    };

    resetDOM();
    runAnimation();
    setIsAnimating(true);
  }, [resetKey]); // 当 resetKey 改变时重新运行动画

  // 4. 处理重播按钮点击
  const handleReplay = () => {
    setResetKey((prev) => prev + 1); // 改变 key 触发 useEffect 重新执行
  };

  return (
    <div className="App">
      {/* 计数器部分 */}
      <div ref={counterRef} className="counter" key={`counter-${resetKey}`}>
        <div className="nums">
          {/* 使用 ref 数组存储每个数字 */}
          {[3, 2, 1, 0].map((num, index) => (
            <span
              key={num}
              ref={(el) => (numsRef.current[index] = el)}
              className={index === 0 ? "in" : ""}
            >
              {num}
            </span>
          ))}
        </div>
        <h4>Get Ready</h4>
      </div>

      {/* 最终消息部分 */}
      <div ref={finalRef} className="final" key={`final-${resetKey}`}>
        <h1>GO</h1>
        <button id="replay" onClick={handleReplay}>
          <span>Replay</span>
        </button>
      </div>
    </div>
  );
}

export default AnimatedCountdown;
