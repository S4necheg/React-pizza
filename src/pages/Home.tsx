import React from 'react';
import qs from 'qs';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch } from '../redux/store';
import { selectPizzaData } from '../redux/pizza/selectors';
import { fetchPizzas } from '../redux/pizza/asyncActions';
import { selectFilter } from '../redux/filter/selectors';
import {
  initialState,
  setCategoryId,
  setCurrentPageCount,
  setFilters,
} from '../redux/filter/slice';
import Categories from '../components/Categories';
import PizzaBlock from '../components/PizzaBlock/PizzaBlock';
import Skeleton from '../components/PizzaBlock/Skeleton';
import Pagination from '../components/Pagination';
import SortPopup, { list } from '../components/Sort';

// import pizzas from './assets/pizzas.json';

// {pizzas.map((obj) => (
//      <PizzaBlock {...obj} />
//    ))}

type TParsedQuery = {
  currentPage: string;
  categoryId: string;
  sortProperty: string;
  searchValue: string;
};

function Home(): React.ReactElement {
  const { categoryId, sort, currentPage, searchValue } = useSelector(selectFilter);
  const { items, status } = useSelector(selectPizzaData);
  const sortType = sort.sortProperty;
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const isSearch = React.useRef(false);
  const isMounted = React.useRef(false);

  const onChangeCategory = (idx: number) => {
    dispatch(setCategoryId(idx));
  };

  const onChangePage = (page: number) => {
    dispatch(setCurrentPageCount(page));
  };

  const getPizzas = async () => {
    const category = categoryId > 0 ? `category=${categoryId}` : '';
    const sortBy = sortType.replace('-', '');
    const order = sortType.includes('-') ? 'asc' : 'desc';
    const search = searchValue ? `&search=${searchValue}` : '';

    dispatch(
      fetchPizzas({
        category,
        sortBy,
        order,
        search,
        currentPage: String(currentPage),
      }),
    );

    window.scrollTo(0, 0);
  };

  //Если был первый рендер и изменили параметры, то только тогда вшивать в адресную строчку параметры
  React.useEffect(() => {
    if (isMounted.current) {
      const querySrting = qs.stringify({
        sortProperty: sortType,
        categoryId,
        currentPage,
      });

      navigate(`?${querySrting}`);
    }

    isMounted.current = true;
  }, [categoryId, sortType, currentPage, navigate]);

  //Если был первый рендер, то проверяем URL-параметры и сохраняем в redux
  React.useEffect(() => {
    if (window.location.search) {
      const params = qs.parse(window.location.search.substring(1)) as TParsedQuery;

      //Если в адресной строке будет стоять url, который соответствует изначальному состоянию хранилища, то
      //страница будет пустой, потому что мы достаем из url такие же данные как в initialState и в итоге запрос не уходит на бэк
      //Поэтому нужна проверка
      if (
        initialState.categoryId === Number(params.categoryId) &&
        initialState.sort.sortProperty === params.sortProperty &&
        initialState.currentPage === Number(params.currentPage)
      ) {
        dispatch(
          fetchPizzas({
            category: params.categoryId,
            sortBy: params.sortProperty,
            order: 'desc',
            search: params.searchValue,
            currentPage: params.currentPage,
          }),
        );
      }

      const sort = list.find((obj) => {
        return obj.sortProperty === params.sortProperty;
      });

      dispatch(
        setFilters({
          ...params,
          currentPage: Number(params.currentPage),
          categoryId: Number(params.categoryId),
          sort: sort || list[0],
        }),
      );

      isSearch.current = true;
    }
  }, [dispatch]);

  //Если был первый рендер, то запрашиваем пиццы
  React.useEffect(() => {
    window.scrollTo(0, 0);

    if (!isSearch.current) {
      getPizzas();
    }

    isSearch.current = false;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [categoryId, sort.sortProperty, searchValue, currentPage]);

  const skeletons = [...new Array(4)].map((_, index) => <Skeleton key={index} />);
  const pizzas = items
    .filter((obj: any) => {
      if (obj.title.toLowerCase().includes(searchValue.toLowerCase())) {
        return true;
      }
      return false;
    })
    .map((obj: any) => <PizzaBlock key={obj.id} {...obj} />);

  return (
    <div className="container">
      <div className="content__top">
        <Categories value={categoryId} onChangeCategory={onChangeCategory} />
        <SortPopup />
      </div>
      <h2 className="content__title">Все пиццы</h2>
      {status === 'error' ? (
        <div className="content__error-info">
          <h2>
            Произошла ошибка <span>😕</span>
          </h2>
          <p>К сожалению, не удалось получить пиццы. Попробуйте повторить попытку позже.</p>
        </div>
      ) : (
        <div className="content__items">
          {/* {items.map((obj) =>
      isLoading ? <Skeleton> </Skeleton> : <PizzaBlock key={obj.id} {...obj} />,
    )} */}
          {status === 'loading' ? skeletons : pizzas}
        </div>
      )}
      <Pagination currentPage={currentPage} onChangePage={onChangePage} />
    </div>
  );
}

export default Home;
