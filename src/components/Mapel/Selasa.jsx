const Selasa = () => {
  const schedule = [
    { time: "8:00 - 10:00", subject: "Pendidikan Kewarganegaraan (PKN)" },
    { time: "10:00 - 10:15", subject: "ISTIRAHAT" },
    { time: "10:15 - 12:15", subject: "Bahasa Indonesia" },
    { time: "12:15 - 13:00", subject: "ISTIRAHAT" },
    { time: "13:00 - 15:00", subject: "Seni Budaya (SB)" },
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

export default Selasa
