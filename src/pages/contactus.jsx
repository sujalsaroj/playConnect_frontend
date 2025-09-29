import { useRef, useState } from "react";

const Contact = () => {
  const nameRef = useRef();
  const emailRef = useRef();
  const msgRef = useRef();

  const [status, setStatus] = useState(""); // for success/error messages

  const handleSubmit = async (e) => {
    e.preventDefault();

    const data = {
      name: nameRef.current.value,
      email: emailRef.current.value,
      message: msgRef.current.value,
    };

    try {
      const res = await fetch("http://localhost:5000/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      const result = await res.json();

      if (res.ok) {
        setStatus("✅ Message sent successfully!");
        // Clear inputs
        nameRef.current.value = "";
        emailRef.current.value = "";
        msgRef.current.value = "";

        setTimeout(() => {
          window.location.reload();
        }, 1000);
      } else {
        setStatus("❌ " + result.message);
      }
    } catch (error) {
      console.error("Error:", error);
      setStatus("❌ Something went wrong. Try again!");
    }
  };

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <h2 className="text-3xl font-bold mb-4 text-center">Contact Us</h2>
      <p className="mb-6 text-center text-gray-600">
        Have any questions or suggestions? We'd love to hear from you!
      </p>

      <form className="space-y-4" onSubmit={handleSubmit}>
        <div>
          <label className="block mb-1 font-medium">Name</label>
          <input
            ref={nameRef}
            type="text"
            placeholder="Your Name"
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:border-blue-400"
            required
          />
        </div>
        <div>
          <label className="block mb-1 font-medium">Email</label>
          <input
            ref={emailRef}
            type="email"
            placeholder="Your Email"
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:border-blue-400"
            required
          />
        </div>
        <div>
          <label className="block mb-1 font-medium">Message</label>
          <textarea
            ref={msgRef}
            rows="4"
            placeholder="Your Message"
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:border-blue-400"
            required
          ></textarea>
        </div>
        <button
          type="submit"
          className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition duration-200"
        >
          Send Message
        </button>
      </form>

      {status && (
        <p className="mt-4 text-center text-sm font-medium">{status}</p>
      )}
    </div>
  );
};

export default Contact;
