export default function ExportOptions() {
  return (
    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-gradient-to-br from-[#111827] to-[#000000] p-6 rounded-xl shadow-lg border border-[#1F2937]">
      <div>
      </div>
      <div className="flex gap-3">
        <button className="px-6 py-3 bg-yellow-500/10 text-yellow-500 text-sm font-semibold rounded-lg border border-yellow-500/30 hover:bg-yellow-500/20 transition-all duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-yellow-500/50 focus:ring-offset-2 focus:ring-offset-black flex items-center gap-2 group">
          <svg className="w-4 h-4 group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          CSV Format
        </button>
        <button className="px-6 py-3 bg-green-500/10 text-green-500 text-sm font-semibold rounded-lg border border-green-500/30 hover:bg-green-500/20 transition-all duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-green-500/50 focus:ring-offset-2 focus:ring-offset-black flex items-center gap-2 group">
          <svg className="w-4 h-4 group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          PDF Format
        </button>
      </div>
    </div>
  );
}