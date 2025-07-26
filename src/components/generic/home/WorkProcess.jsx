export function WorkProcess() {
  const steps = [
    {
      number: "01",
      title: "Đánh giá",
      description:
        "Chúng tôi bắt đầu bằng cách đánh giá thói quen hút thuốc, các yếu tố kích hoạt và mức độ sẵn sàng bỏ thuốc để xây dựng một kế hoạch cá nhân hóa.",
    },
    {
      number: "02",
      title: "Đặt mục tiêu",
      description:
        "Cùng nhau xác định các mục tiêu rõ ràng, thực tế và chọn ngày bắt đầu phù hợp với lối sống của bạn.",
    },
    {
      number: "03",
      title: "Chuẩn bị",
      description:
        "Hướng dẫn bạn chuẩn bị về mặt tinh thần, cảm xúc và môi trường để tăng khả năng thành công.",
    },
    {
      number: "04",
      title: "Hành động",
      description:
        "Vào ngày bỏ thuốc, bạn sẽ thực hiện kế hoạch với sự hỗ trợ, công cụ và động lực cần thiết.",
    },
    {
      number: "05",
      title: "Hỗ trợ",
      description:
        "Sự đồng hành liên tục từ chuyên gia và cộng đồng giúp bạn vượt qua cơn thèm thuốc và ngăn ngừa tái nghiện.",
    },
    {
      number: "06",
      title: "Duy trì",
      description:
        "Chúng tôi giúp bạn xây dựng chiến lược dài hạn để duy trì lối sống không thuốc lá và ăn mừng những cột mốc quan trọng.",
    },
  ];

  return (
    <section id="process" className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Quy trình{" "}
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-purple-500 to-cyan-500">
              hỗ trợ
            </span>
          </h2>
          <p className="text-xl text-gray-700 max-w-2xl mx-auto">
            Các chiến lược cá nhân hóa, đã được chứng minh để đồng hành cùng bạn
            trong hành trình bỏ thuốc lá.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {steps.map((step, index) => (
            <div
              key={index}
              className="bg-gray-50 border border-gray-200 rounded-xl p-6 hover:border-cyan-400 transition-all shadow-sm"
            >
              <div className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-500 to-cyan-500 mb-4">
                {step.number}
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-3">
                {step.title}
              </h3>
              <p className="text-gray-600">{step.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
