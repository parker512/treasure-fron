import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import useBookStore from "../../store/auth-books";
import {
  ArrowDown,
  ArrowUp,
  Search,
  X,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { CategoryBage } from "./components/CategoryBadge";
import { instance } from "../../services/api-client";
import { SortButton } from "./components/SortButton";
import ProductCard from "../../components/ProductCard";
import { ukraineLocations } from "../../constants/data";
import { CustomSelectLocation } from "../../components/customSelectLocation";
import CustomSelect from "../../components/customSelect";

interface Category {
  id: number;
  name: string;
}

interface Genre {
  id: number;
  name: string;
}

export const BrowseBooks = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [count, setCount] = useState(0);
  const [showAll, setShowAll] = useState(false);
  const [activeCategories, setActiveCategories] = useState<number[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortOption, setSortOption] = useState("first_name:ASC");
  const [currentPage, setCurrentPage] = useState(1);
  const [categories, setCategories] = useState<Category[]>([]);
  const [genres, setGenres] = useState<Genre[]>([]);
  const [stateList, setStateList] = useState<any>([]);
  const [currentState, setCurrentState] = useState<{
    stateId: string | null;
    stateName: string | undefined;
  }>({
    stateId: null,
    stateName: undefined,
  });
  const [condition, setCondition] = useState("");
  const [category, setCategory] = useState("");
  const itemsPerPage = 12;
  const [pagesCount, setPagesCount] = useState(0);

  const getBooks = useBookStore((state) => state.getBooks);
  const books = useBookStore((state) => state.books);

  useEffect(() => {
    const states = ukraineLocations.map((region, index) => ({
      id: index.toString(),
      name: region.name,
    }));
    setStateList(states);
  }, []);

  useEffect(() => {
    fetchCategories();
    fetchGenres();
  }, []);

  useEffect(() => {
    const pages = Math.ceil(books.count / itemsPerPage);
    setCount(books.count);
    setPagesCount(pages);
  }, [books.count]);

  useEffect(() => {
    const params = {
      search: searchQuery,
      city: currentState.stateName,
      category: category,
      condition: condition,
      genre_id: activeCategories.join(","),
      sort: sortOption,
      page: currentPage.toString(),
    };
    getBooks(params);
  }, [
    getBooks,
    searchQuery,
    currentState,
    condition,
    category,
    activeCategories,
    sortOption,
    currentPage,
  ]);

  const fetchCategories = async () => {
    const { data } = await instance.get<Category[]>("/books/categories/");
    setCategories(data);
  };

  const fetchGenres = async () => {
    const { data } = await instance.get<Genre[]>("/books/genres/");
    setGenres(data);
  };

  const sortOptions = [
    { label: "Назвою (А-Я)", value: "first_name:ASC" },
    { label: "Назвою (Я-A)", value: "first_name:DESC" },
    { label: "Ціна (зростає)", value: "price_asc" },
    { label: "Ціна (спадає)", value: "price_desc" },
    { label: "Спочатку нові", value: "newest" },
    { label: "Спочатку старі", value: "oldest" },
  ];

  const categoriesFilter = [
    { label: "Мʼяка обкладинка", value: "М'яка обкладинка" },
    { label: "Тверда обкладинка", value: "Тверда обкладинка" },
  ];

  const conditionFilter = [
    { label: "Нова", value: "new" },
    { label: "Б/у", value: "used" },
  ];

  const toggleCategory = (value: number) => {
    setActiveCategories((prev) =>
      prev.includes(value) ? prev.filter((v) => v !== value) : [...prev, value]
    );
    setCurrentPage(1); // Reset to first page on filter change
  };

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= pagesCount) {
      setCurrentPage(page);
      setSearchParams((prev) => {
        const newParams = new URLSearchParams(prev);
        newParams.set("page", page.toString());
        return newParams;
      });
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const renderPagination = () => {
    const pages = [];
    const maxPagesToShow = 5;
    const startPage = Math.max(1, currentPage - Math.floor(maxPagesToShow / 2));
    const endPage = Math.min(pagesCount, startPage + maxPagesToShow - 1);

    if (startPage > 1) {
      pages.push(
        <button
          key={1}
          onClick={() => handlePageChange(1)}
          className={`px-4 py-2 rounded-full text-gray-700 ${
            currentPage === 1 ? "bg-blue-500 text-white" : "hover:bg-gray-100"
          }`}
        >
          1
        </button>
      );
      if (startPage > 2) {
        pages.push(
          <span key="start-ellipsis" className="px-2">
            ...
          </span>
        );
      }
    }

    for (let i = startPage; i <= endPage; i++) {
      pages.push(
        <button
          key={i}
          onClick={() => handlePageChange(i)}
          className={`px-4 py-2 rounded-full text-gray-700 ${
            currentPage === i ? "bg-blue-500 text-white" : "hover:bg-gray-100"
          }`}
        >
          {i}
        </button>
      );
    }

    if (endPage < pagesCount) {
      if (endPage < pagesCount - 1) {
        pages.push(
          <span key="end-ellipsis" className="px-2">
            ...
          </span>
        );
      }
      pages.push(
        <button
          key={pagesCount}
          onClick={() => handlePageChange(pagesCount)}
          className={`px-4 py-2 rounded-full text-gray-700 ${
            currentPage === pagesCount
              ? "bg-blue-500 text-white"
              : "hover:bg-gray-100"
          }`}
        >
          {pagesCount}
        </button>
      );
    }

    return (
      <div className="flex items-center justify-center gap-2 mt-8">
        <button
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="p-2 rounded-full disabled:opacity-50 hover:bg-gray-100"
          aria-label="Предыдущая страница"
        >
          <ChevronLeft size={24} />
        </button>
        {pages}
        <button
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === pagesCount}
          className="p-2 rounded-full disabled:opacity-50 hover:bg-gray-100"
          aria-label="Следующая страница"
        >
          <ChevronRight size={24} />
        </button>
      </div>
    );
  };

  return (
    <div className="flex min-h-screen flex-col w-screen gap-20">
      <div className="bg-[#EAF3EF] rounded-b-4xl min-h-[260px] pb-10 w-full flex flex-col items-center justify-center">
        <div className="bg-white mt-[70px] rounded-full items-center justify-between hidden lg:flex lg:w-[1200px] min-h-16 py-2 px-4 gap-5">
          <div className="flex items-center gap-2">
            <CustomSelectLocation
              locations={stateList}
              placeholder="Выберите регион"
              selectedLocation={currentState.stateName}
              onSelect={setCurrentState}
            />
            {currentState.stateName && (
              <button
                onClick={() =>
                  setCurrentState({ stateId: null, stateName: undefined })
                }
                className="text-gray-500 hover:text-gray-800 transition"
                aria-label="Очистить фильтр региона"
              >
                <X size={18} />
              </button>
            )}
          </div>
          <div className="w-[1px] h-[40px] bg-[#415E52]" />
          <div className="flex items-center gap-2">
            <CustomSelect
              options={conditionFilter}
              value={condition}
              onChange={setCondition}
            />
            {condition !== "" && (
              <button
                onClick={() => setCondition("")}
                className="text-gray-500 hover:text-gray-800 transition"
                aria-label="Очистить фильтр состояния"
              >
                <X size={18} />
              </button>
            )}
          </div>
          <div className="w-[1px] h-[40px] bg-[#415E52]" />
          <div className="flex items-center gap-2">
            <CustomSelect
              options={categoriesFilter}
              value={category}
              onChange={setCategory}
            />
            {category !== "" && (
              <button
                onClick={() => setCategory("")}
                className="text-gray-500 hover:text-gray-800 transition"
                aria-label="Очистить фильтр категории"
              >
                <X size={18} />
              </button>
            )}
          </div>
          <div className="w-[1px] h-[40px] bg-[#415E52]" />
          <div className="relative w-[230px] max-w-md">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Найти книгу"
              className="w-full h-20 pl-6 pr-16 text-lg border-2 border-gray-700 rounded-full focus:outline-none focus:ring-2 focus:ring-gray-500"
            />
            <button className="absolute inset-y-0 top-[50%] translate-y-[-50%] right-4 flex items-center justify-center w-12 h-12 bg-blue-900 text-white rounded-full">
              <Search size={24} />
            </button>
          </div>
        </div>
        <div className="px-[300px] w-full hidden lg:flex mt-5 gap-5 justify-center items-center flex-wrap relative">
          {genres.length > 0 ? (
            (showAll ? genres : genres.slice(0, 5)).map((genre) => (
              <CategoryBage
                key={genre.name}
                genre={genre}
                isActive={activeCategories.includes(genre.id)}
                onClick={() => toggleCategory(genre.id)}
              />
            ))
          ) : (
            <p>Немає жанрів</p>
          )}
          {genres.length > 5 && (
            <button
              className="flex items-center justify-center w-10 h-10 rounded-full border border-gray-400 text-gray-600 hover:bg-gray-100 transition"
              onClick={() => setShowAll((prev) => !prev)}
            >
              {showAll ? <ArrowUp /> : <ArrowDown />}
            </button>
          )}
        </div>
        <div className="w-full flex lg:hidden mt-5 gap-5 justify-start items-center overflow-auto relative pl-4 hide-scrollbar">
          {genres.length > 0 ? (
            genres.map((genre) => (
              <CategoryBage
                key={genre.name}
                genre={genre}
                isActive={activeCategories.includes(genre.id)}
                onClick={() => toggleCategory(genre.id)}
              />
            ))
          ) : (
            <p>Немає жанрів</p>
          )}
        </div>
      </div>
      <div className="flex flex-col justify-center items-center w-full lg:w-[80vw] mx-auto">
        <div className="w-auto lg:w-full flex lg:flex-row flex-col lg:justify-around">
          <p className="font-manrope font-medium text-[28px] leading-[38.25px] tracking-normal">
            {books.count > 1
              ? `${books.count} книжки знайдено`
              : `${books.count} книжка знайдено`}
          </p>
          <SortButton
            options={sortOptions}
            onChange={(value) => setSortOption(value)}
            defaultValue="first_name:ASC"
          />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mt-10">
          {books.results.length > 0 ? (
            books.results.map((book) => (
              <ProductCard
                key={book.id}
                id={book.id}
                title={book.title}
                author={book.author}
                price={Number(book.price)}
                condition={book.condition}
                image={book?.photo_detail?.image}
                is_favorited={book.is_favorited}
              />
            ))
          ) : (
            <p>Немає книг</p>
          )}
        </div>
        {pagesCount > 1 && renderPagination()}
      </div>
    </div>
  );
};
