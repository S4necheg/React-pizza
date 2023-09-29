import React from 'react';
import axios from 'axios';
import { useSelector, useDispatch } from 'react-redux';

import { setCategoryId, setCurrentPageCount } from '../redux/slices/filterSlice';
import Categories from '../components/Categories';
import Sort from '../components/Sort';
import PizzaBlock from '../components/PizzaBlock/PizzaBlock';
import Skeleton from '../components/PizzaBlock/Skeleton';
import Pagination from '../components/Pagination';
import { SearchContext } from '../App';

// import pizzas from './assets/pizzas.json';

// {pizzas.map((obj) => (
//      <PizzaBlock {...obj} />
//    ))}

function Home() {
  const { categoryId, sort, currentPage } = useSelector((state) => state.filter);
  const sortType = sort.sortProperty;
  const dispatch = useDispatch();

  const { searchValue } = React.useContext(SearchContext);
  const [items, setItems] = React.useState([]);
  const [isLoading, setIsLoading] = React.useState(true);

  const onChangeCategory = (id) => {
    dispatch(setCategoryId(id));
  };

  const onChangePage = (number) => {
    dispatch(setCurrentPageCount(number));
  };

  React.useEffect(() => {
    setIsLoading(true);

    const category = categoryId > 0 ? `category=${categoryId}` : '';
    const sortBy = sortType.replace('-', '');
    const order = sortType.includes('-') ? 'asc' : 'desc';
    const search = searchValue ? `&search=${searchValue}` : '';

    axios
      .get(
        `https://650db563a8b42265ec2c9d6c.mockapi.io/items?page=${currentPage}&limit=4&${category}&${search}&sortBy=${sortBy}&order=${order}`,
      )
      .then((res) => {
        setItems(res.data);
        setIsLoading(false);
      });

    window.scrollTo(0, 0);
  }, [categoryId, sortType, searchValue, currentPage]);

  const skeletons = [...new Array(6)].map((_, index) => <Skeleton key={index} />);
  const pizzas = items
    .filter((obj) => {
      if (obj.title.toLowerCase().includes(searchValue.toLowerCase())) {
        return true;
      }
      return false;
    })
    .map((obj) => <PizzaBlock key={obj.id} {...obj} />);

  return (
    <div className="container">
      <div className="content__top">
        <Categories value={categoryId} onChangeCategory={onChangeCategory} />
        <Sort />
      </div>
      <h2 className="content__title">Все пиццы</h2>
      <div className="content__items">
        {/* {items.map((obj) =>
      isLoading ? <Skeleton> </Skeleton> : <PizzaBlock key={obj.id} {...obj} />,
    )} */}
        {isLoading ? skeletons : pizzas}
      </div>
      <Pagination currentPage={currentPage} onChangePage={onChangePage} />
    </div>
  );
}

export default Home;
