const Selasa = () => {
  const schedule = [
    { time: "8:00 - 8:40", subject: "Pendidikan Kewarganegaraan (PKN)" },
    { time: "8:40 - 9:20", subject: "Pendidikan Kewarganegaraan (PKN)" },
    { time: "9:20 - 10:00", subject: "Pendidikan Kewarganegaraan (PKN)" },
    { time: "10:00 - 10:15", subject: "ISTIRAHAT" },
    { time: "10:15 - 10:55", subject: "Bahasa Indonesia" },
    { time: "10:55 - 11:35", subject: "Bahasa Indonesia" },
    { time: "11:35 - 12:15", subject: "Bahasa Indonesia" },
    { time: "12:15 - 13:00", subject: "ISTIRAHAT" },
    { time: "13:00 - 13:40", subject: "Seni Budaya (SB)" },
    { time: "13:40 - 14:20", subject: "Seni Budaya (SB)" },
    { time: "14:20 - 15:00", subject: "Seni Budaya (SB)" },
  ]

  return (
    <div className="w-72 border border-gray-700 rounded-lg p-4">
      {schedule.map((item, index) => (
        <div
          key={index}
          className={`flex justify-between items-center py-2 ${index < schedule.length - 1 ? "border-b border-gray-700" : ""}`}
        >
          <div className="text-sm text-gray-400">{item.time}</div>
          <div className="text-base font-medium">{item.subject}</div>
        </div>
      ))}
    </div>
  )
}

export default Selasa
