const Senin = () => {
  const schedule = [
    { time: "8:00 - 10:00", subject: "Bahasa Indonesia" },
    { time: "10:00 - 10:15", subject: "ISTIRAHAT" },
    { time: "10:15 - 10:55", subject: "Matematika" },
    { time: "10:55 - 12:15", subject: "Ilmu Pengetahuan Alam (IPA)" },
    { time: "12:15 - 13:00", subject: "ISTIRAHAT" },
    { time: "13:00 - 13:40", subject: "Ilmu Pengetahuan Alam (IPA)" },
    { time: "13:40 - 15:00", subject: "Bahasa Inggris" },
  ]

  return (
    <div className="w-72 border border-gray-700 rounded-lg p-4 text-white">
      {schedule.map((item, index) => (
        <div
          key={index}
          className={`flex justify-between items-center py-2 ${index < schedule.length - 1 ? "border-b border-gray-700" : ""}`}
        >
          <div className="text-base font-medium">{item.subject}</div>
          <div className="text-sm text-gray-400">{item.time}</div>
        </div>
      ))}
    </div>
  )
}

export default Senin
