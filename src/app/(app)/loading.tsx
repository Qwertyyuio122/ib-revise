const SUBJECT_CARD_SKELETONS = [
  'w-28',
  'w-32',
  'w-24',
  'w-40',
  'w-28',
  'w-28',
];

export default function AppLoading() {
  return (
    <div aria-busy="true" aria-label="Loading workspace">
      <header className="aurora-header">
        {/* Top Essay Studio Announcement Pill Skeleton */}
        <div className="max-w-[820px] mx-auto mb-[22px] flex items-center justify-center">
          <div className="inline-flex items-center justify-center gap-2.5 px-[14px] py-[6px] rounded-full bg-white/80 border border-[#E4E4E7] max-w-full">
            <div className="h-3.5 w-52 sm:w-72 rounded sr-shimmer" />
            <div className="h-6 w-12 rounded-full sr-shimmer shrink-0" />
          </div>
        </div>

        <div className="col-center">
          <div className="flex items-center justify-between gap-4 sm:gap-6 flex-wrap">
            {/* Greeting Header Skeleton */}
            <div>
              <div className="h-7 w-40 rounded-md sr-shimmer mb-2" />
              <div className="h-6 w-28 rounded-md sr-shimmer" />
            </div>
          </div>
        </div>
      </header>

      <div className="main-pad">
        <div className="col-center">
          {/* My Subjects Header Row */}
          <div className="flex justify-between items-center gap-2">
            <div className="h-4 w-24 rounded sr-shimmer" />
            <div className="h-3.5 w-64 rounded sr-shimmer hidden sm:block" />
          </div>

          {/* 3x2 Subject Card Grid Skeleton (118px height, 14px radius) */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-[14px] mt-[12px]">
            {SUBJECT_CARD_SKELETONS.map((titleWidth, index) => (
              <div
                key={index}
                className="min-h-[118px] rounded-[14px] border border-[#E4E4E7] bg-[#FFFFFF] px-[16px] py-[15px] flex flex-col justify-between relative overflow-hidden"
              >
                <div className={`h-4 ${titleWidth} rounded sr-shimmer relative z-10`} />
                <div className="h-6 w-16 rounded-full sr-shimmer relative z-10" />
                <div
                  aria-hidden="true"
                  className="w-16 h-16 rounded-full bg-[#F4F4F5] absolute right-[-6px] bottom-[-6px]"
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
