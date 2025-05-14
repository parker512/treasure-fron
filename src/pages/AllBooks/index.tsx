import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import useBookStore from "../../store/auth-books";
import { ArrowDown, ArrowUp, Search, X } from "lucide-react";
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

  useEffect(() => {
    const states = ukraineLocations.map((region, index) => ({
      id: index.toString(), // можешь использовать uuid, если хочешь
      name: region.name,
    }));
    setStateList(states);
  }, []);

  const isLoading = false;

  const itemsPerPage = 12;

  const [pagesCount, setPagesCount] = useState(0);

  const sortOptions = [
    { label: "Назвою (А-Я)", value: "first_name:ASC" },
    { label: "Назвою (Я-A)", value: "first_name:DESC" },
    { label: "Ціна (зростає)", value: "price_asc" },
    { label: "Ціна (спадає)", value: "price_desc" },
    { label: "Спочатку нові", value: "newest" },
    { label: "Спочатку старі", value: "oldest" },
  ];

  const categoriesFilter = [
    {
      label: "Мʼяка обкладинка",
      value: "Мʼяка",
    },
    {
      label: "Тверда обкладинка",
      value: "Твердий",
    },
  ];

  const conditionFilter = [
    {
      label: "Нова",
      value: "new",
    },
    {
      label: "Б/у",
      value: "used",
    },
  ];

  console.log("Genres: ", genres);

  const getBooks = useBookStore((state) => state.getBooks);
  const books = useBookStore((state) => state.books);

  const fetchCategories = async () => {
    const { data } = await instance.get<Category[]>("/books/categories/");
    setCategories(data);
  };

  const fetchGenres = async () => {
    const { data } = await instance.get<Genre[]>("/books/genres/");

    setGenres(data);
  };

  useEffect(() => {
    fetchCategories();
    fetchGenres();
  }, []);

  useEffect(() => {
    const params = {
      search: searchQuery,
      city: currentState.stateName,
      category: category,
      condition: condition,
      genre_id: activeCategories.join(","),
      sort: sortOption,
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
  ]);

  const toggleCategory = (value: number) => {
    setActiveCategories((prev) =>
      prev.includes(value) ? prev.filter((v) => v !== value) : [...prev, value]
    );
  };

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= pagesCount) {
      setCurrentPage(page);
      // Update search params
      setSearchParams((prev) => {
        const newParams = new URLSearchParams(prev);
        newParams.set("page", page.toString());
        return newParams;
      });
    }
  };

  return (
    <div className="flex min-h-screen flex-col w-screen gap-20">
      <div className="bg-[#EAF3EF] rounded-b-4xl min-h-[260px] pb-10 w-full flex flex-col items-center justify-center">
        <div className="bg-white mt-[70px] rounded-full  items-center justify-between hidden lg:flex lg:w-[1200px] min-h-16 py-2 px-4 gap-5">
          <div className="flex items-center gap-2">
            <CustomSelectLocation
              locations={stateList}
              placeholder="Select State"
              selectedLocation={currentState.stateName}
              onSelect={setCurrentState}
            />
            {currentState.stateName && (
              <button
                onClick={() =>
                  setCurrentState({ stateId: null, stateName: undefined })
                }
                className="text-gray-500 hover:text-gray-800 transition"
                aria-label="Clear location filter"
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
                aria-label="Clear location filter"
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
                aria-label="Clear location filter"
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
              placeholder="Знайти книгу"
              className="w-full h-20 pl-6 pr-16 text-lg border-2 border-gray-700 rounded-full focus:outline-none focus:ring-2 focus:ring-gray-500"
            />
            <button className="absolute inset-y-0 top-[50%] translate-y-[-50%] right-4 flex items-center justify-center w-12 h-12 bg-blue-900 text-white rounded-full">
              <Search size={24} />
            </button>
          </div>
        </div>

        <div className="px-[300px] w-full hidden  lg:flex mt-5 gap-5 justify-center items-center flex-wrap relative">
          {isLoading ? (
            <p>Loading tags...</p>
          ) : Array.isArray(genres) && genres.length > 0 ? (
            (showAll ? genres : genres.slice(0, 5)).map((genre) => (
              <CategoryBage
                key={genre.name}
                genre={genre}
                isActive={activeCategories.includes(genre.id)}
                onClick={() => toggleCategory(genre.id)}
              />
            ))
          ) : (
            <p>No tags available</p>
          )}
          {Array.isArray(genres) && genres.length > 5 && (
            <button
              className="flex items-center justify-center w-10 h-10 rounded-full border border-gray-400 text-gray-600 hover:bg-gray-100 transition"
              onClick={() => setShowAll((prev) => !prev)}
            >
              {showAll ? <ArrowUp /> : <ArrowDown />}
            </button>
          )}
        </div>
        <div className="w-full flex lg:hidden mt-5 gap-5 justify-start items-center overflow-auto relative pl-4 hide-scrollbar">
          {isLoading ? (
            <p>Loading tags...</p>
          ) : Array.isArray(genres) && genres.length > 0 ? (
            genres.map((genre) => (
              <CategoryBage
                key={genre.name}
                genre={genre}
                isActive={activeCategories.includes(genre.id)}
                onClick={() => toggleCategory(genre.id)}
              />
            ))
          ) : (
            <p>No tags available</p>
          )}
        </div>
      </div>
      {/*  */}
      <div className="flex flex-col justify-center items-center w-full  lg:w-[80vw] mx-auto">
        <div className="w-auto lg:w-full flex lg:flex-row flex-col lg:justify-around ">
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
              />
            ))
          ) : (
            <p>Немає книг</p>
          )}
        </div>
      </div>
    </div>
  );
};
