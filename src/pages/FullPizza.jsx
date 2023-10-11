import React from 'react';
import axios from 'axios';
import { useParams, Link } from 'react-router-dom';

import Skeleton from '../components/PizzaBlock/Skeleton';

function FullPizza() {
  const [pizza, setPizza] = React.useState();
  const { id } = useParams([]);

  React.useEffect(() => {
    async function fetchPizza() {
      try {
        const { data } = await axios.get('https://650db563a8b42265ec2c9d6c.mockapi.io/items/' + id);
        setPizza(data);
      } catch (error) {
        alert('Ошибка при получении пиццы');
        console.log(error);
      }
    }

    fetchPizza();
  }, [id]);

  if (!pizza) {
    return (
      <div className="pizza-info">
        <Skeleton />
      </div>
    );
  }

  return (
    <div className="pizza-info">
      <img src={pizza.imageUrl} className="pizza-info__image" alt="Pizza" />
      <h2 className="pizza-info__title">{pizza.title}</h2>
      <p className="pizza-info__info">Состав пиццы: {pizza.info}</p>
      <h4 className="pizza-info__price">от {pizza.price} ₽</h4>
      <Link to="/React-pizza" className="button button--outline button--add go-back-btn">
        <span>Вернуться назад</span>
      </Link>
    </div>
  );
}

export default FullPizza;
