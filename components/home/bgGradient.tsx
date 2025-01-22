type props = {
  children: React.ReactElement | any;
};
const BgGradient = ({ children }: props) => {
  return (
    <div className="relative isolate">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute 
inset-x-0 -top-40 -z-10  transform-gpu overflow-hidden blur-3xl "
      >
        <div
          style={{
            clipPath:
              "polygon(50% 0%,61% 35%,98% 35%,68% 57%,79% 91%, 50% 70%, 21% 91%, 32% 57%,2% 35%, 39% 35%)",
          }}
          className="relative let-cal[(50%-11rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 roate-[30deg] bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 opacity-30 sm:left-[calc(50%-30%rem)] sm:w-[72rem]"
        />
      </div>
      <div className="relative z-10">{children}</div>
    </div>
  );
};

export default BgGradient;
