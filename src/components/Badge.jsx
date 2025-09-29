import CountUp from "react-countup";
import { useInView } from "react-intersection-observer";

function Badge() {
  const stats = [
    { number: 5000, label: "Users" },
    { number: 100, label: "Turfs" },
    { number: 200, label: "Turf Owners" },
    { number: 50, label: "Cities Covered" },
  ];

  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.3,
  });

  return (
    <section
      ref={ref}
      className="py-16 bg-gradient-to-b from-gray-300 to-gray-300 text-center"
    >
      <div className="max-w-6xl mx-auto px-6">
        <h2 className="text-3xl font-bold text-gray-800 mb-12">
          Fun Facts About PlayConnect
        </h2>

        <div className="grid md:grid-cols-4 gap-8">
          {stats.map((stat, index) => (
            <div
              key={index}
              className="bg-white rounded-xl shadow-lg p-6 flex flex-col items-center justify-center hover:shadow-xl transition duration-300"
            >
              <h3 className="text-4xl font-bold text-blue-600 mb-2">
                {inView ? (
                  <CountUp end={stat.number} duration={2} separator="," />
                ) : (
                  0
                )}
                +
              </h3>
              <p className="text-gray-700 text-lg">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default Badge;
