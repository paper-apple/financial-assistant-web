// ErrorBar.tsxs
type ErrorBarProps = {
  errorText: string;
};

export const ErrorBar: React.FC<ErrorBarProps> = ({
  errorText
}) => {

  return (
    <div className="absolute bottom-full rounded-md p-1 w-[360px] left-1/2 bg-red-300 transform border border-red-300 error-toast">
      <div className="absolute top-full left-1/2 transform -translate-x-1/2">
        {/* <div className="border-10 border-transparent border-t-red-300/70"></div> */}
      </div>
      <div className="whitespace-pre-line text-center text-gray-700">
        {errorText}
      </div>
    </div>
    //  <div className="absolute bottom-full rounded-md p-1  bg-red-300/70 transform border border-red-300/70 error-toast"
    //   // onAnimationEnd={onAnimationEnd}
    //   style={{ transform: 'translateX(-50%)' }}
    // >
    //   <div className="absolute top-full left-1/2 transform -translate-x-1/2">
    //     <div className="border-10 border-transparent border-t-red-300/70"></div>
    //   </div>
    //   <div>
    //     {errorText}
    //   </div>
    // </div>
  )
};