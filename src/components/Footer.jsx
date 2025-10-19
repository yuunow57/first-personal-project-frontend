function Footer() {
  return (
    <footer className="mt-16 bg-[#17171C] text-gray-500 py-8 px-6 text-center">
      {/* 🔹 경계선 길이 줄이기 */}
      <div className="border-t border-gray-800 w-2/3 mx-auto mb-6" />

      <p className="text-sm mb-2">
         이 사이트는 <span className="text-gray-400 font-semibold">React, Node.js, Express, MySQL</span> 기반으로 제작되었습니다.
      </p>
      <p className="text-sm mb-2">
         실시간 시세 데이터는 <span className="text-blue-400 font-semibold">Upbit Open API</span>를 통해 제공됩니다.
      </p>
      <p className="text-sm">
         Developed by <span className="text-gray-400 font-semibold">Jang Yunho</span> | 2025 © CoinView
      </p>
    </footer>
  );
}

export default Footer;
