import { useEffect, useState } from "react";

// Cuenta regresiva fija al 23‑jul‑2025 23:59
const TARGET_DATE = new Date("2025-08-05T19:00:00-05:00");

const Countdown = () => {
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  const updateCountdown = () => {
    const now = new Date();
    const diff = TARGET_DATE - now;

    if (diff <= 0) {
      setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
      return;
    }

    setTimeLeft({
      days: Math.floor(diff / (1000 * 60 * 60 * 24)),
      hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
      minutes: Math.floor((diff / (1000 * 60)) % 60),
      seconds: Math.floor((diff / 1000) % 60),
    });
  };

  useEffect(() => {
    updateCountdown(); // inicia al montar
    const interval = setInterval(updateCountdown, 1000); // actualiza cada segundo
    return () => clearInterval(interval); // limpia al desmontar
  }, []);

  return (
    <div className="mt-6 flex gap-4 justify-center text-white font-mono text-lg md:text-2xl">
      {[
        { label: "d", value: timeLeft.days },
        { label: "h", value: timeLeft.hours },
        { label: "m", value: timeLeft.minutes },
        { label: "s", value: timeLeft.seconds },
      ].map((item) => (
        <div
          key={item.label}
          className="bg-[#111] px-4 py-2 rounded-xl shadow text-center"
        >
          <div className="text-[#ec930d] text-2xl md:text-3xl">
            {String(item.value).padStart(2, "0")}
          </div>
          <div className="text-sm text-gray-400 uppercase">{item.label}</div>
        </div>
      ))}
    </div>
  );
};

export default Countdown;
