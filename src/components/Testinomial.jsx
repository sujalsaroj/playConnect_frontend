import avatar4 from "../images/avtar4.jpg";
import avatar1 from "../images/avtar1.png";
import avatar from "../images/avatar.jpg";

function Testinomial() {
  return (
    <>
      <section className="bg-gradient-to-b from-gray-300 to-gray-400  py-16 px-4 px-20 ">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 text-gray-800">
          What Our Users Say
        </h2>

        <div className="grid md:grid-cols-3 gap-8">
          {/* Testimonial Card 1 */}
          <div className="bg-white p-6 rounded-xl shadow-md">
            <div className="flex items-center gap-4 mb-4">
              <img
                src={avatar1}
                alt="User"
                className="w-14 h-14 rounded-full border"
              />
              <div>
                <h4 className="font-semibold text-lg">Ravi Sharma</h4>
                <p className="text-sm text-gray-500">Turf Owner</p>
              </div>
            </div>
            <p className="text-gray-700 mb-3">
              “PlayConnect made it super easy to manage bookings and reduce
              no-shows. Highly recommend!”
            </p>
            <div className="text-yellow-500 text-lg">★★★★★</div>
          </div>

          {/* Testimonial Card 2 */}
          <div className="bg-white p-6 rounded-xl shadow-md">
            <div className="flex items-center gap-4 mb-4">
              <img
                src={avatar4}
                alt="User"
                className="w-14 h-14 rounded-full border"
              />
              <div>
                <h4 className="font-semibold text-lg">Sneha Patel</h4>
                <p className="text-sm text-gray-500">Football Player</p>
              </div>
            </div>
            <p className="text-gray-700 mb-3">
              “I love how simple it is to find and book a turf nearby. No more
              calling and waiting.”
            </p>
            <div className="text-yellow-500 text-lg">★★★★★</div>
          </div>

          {/* Testimonial Card 3 */}
          <div className="bg-white p-6 rounded-xl shadow-md">
            <div className="flex items-center gap-4 mb-4">
              <img
                src={avatar}
                alt="User"
                className="w-14 h-14 rounded-full border"
              />
              <div>
                <h4 className="font-semibold text-lg">Aman Verma</h4>
                <p className="text-sm text-gray-500">Cricket Enthusiast</p>
              </div>
            </div>
            <p className="text-gray-700 mb-3">
              Booking turfs with friends is fun and easy! Great experience, will
              definitely play again.
            </p>
            <div className="text-yellow-500 text-lg">★★★★★</div>
          </div>
        </div>
      </section>
    </>
  );
}
export default Testinomial;
