import { FC } from "react";

interface Genre {
  id: number;
  name: string;
}

interface Props {
  genre: Genre;
  isActive: boolean;
  onClick: () => void;
}

export const CategoryBage: FC<Props> = ({ genre, isActive, onClick }) => {
  return (
    <>
      <div
        onClick={onClick}
        className={`px-10 hidden lg:block py-2 rounded-full cursor-pointer transition-colors duration-200 ${
          isActive ? "bg-[#244034] text-white" : "border-[1px] border-[#575555]"
        }`}
      >
        {genre.name}
      </div>
      <div
        onClick={onClick}
        className={`px-10 py-2 block lg:hidden rounded-full cursor-pointer transition-colors duration-200 text-[14px] whitespace-nowrap ${
          isActive ? "bg-[#244034] text-white" : "border-[1px] border-[#575555]"
        }`}
      >
        {genre.name}
      </div>
    </>
  );
};
