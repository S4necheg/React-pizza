import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { addItem } from '../../redux/cart/slice';
import { CartItem } from '../../redux/cart/types';

import { Link } from 'react-router-dom';

const typeNames = ['тонкое', 'традиционное'];

type PizzaBlockProps = {
  id: string;
  title: string;
  price: number;
  imageUrl: string;
  sizes: number[];
  types: number[];
  rating: number;
};

function PizzaBlock({
  id,
  title,
  price,
  imageUrl,
  sizes,
  types,
}: PizzaBlockProps): React.ReactElement {
  const dispatch = useDispatch();
  const [activeType, setActiveType] = React.useState(0);
  const [activeSize, setActiveSize] = React.useState(0);
  const cartItem = useSelector((state) =>
    //@ts-ignore
    state.cart.items.find(
      //@ts-ignore
      (obj) =>
        obj.id === id && obj.type === typeNames[activeType] && obj.size === sizes[activeSize],
    ),
  );

  const addedCount = cartItem ? cartItem.count : 0;

  const onClickAdd = () => {
    const item: CartItem = {
      id,
      title,
      price: pricePizza,
      imageUrl,
      type: typeNames[activeType],
      size: sizes[activeSize],
      count: 0,
    };
    dispatch(addItem(item));
  };

  //изменение цены с выбором типа и размера
  let pricePizza = price;

  if (activeType === 0 && activeSize === 0) {
    pricePizza = Math.round(price * 1);
  } else if (activeType === 0 && activeSize === 1) {
    pricePizza = Math.round(price * 1.53);
  } else if (activeType === 0 && activeSize === 2) {
    pricePizza = Math.round(price * 1.81);
  } else if (activeType === 1 && activeSize === 0) {
    pricePizza = Math.round(price + 40);
  } else if (activeType === 1 && activeSize === 1) {
    pricePizza = Math.round(price * 1.53 + 40);
  } else if (activeType === 1 && activeSize === 2) {
    pricePizza = Math.round(price * 1.81 + 40);
  }

  return (
    <div className="pizza-block-wrapper">
      <div className="pizza-block">
        <Link to={`/React-pizza/pizza/${id}`}>
          <img className="pizza-block__image" src={imageUrl} alt="Pizza" />
        </Link>
        <h4 className="pizza-block__title">{title}</h4>
        <div className="pizza-block__selector">
          <ul>
            {types.map((typeId) => (
              <li
                key={typeId}
                onClick={() => setActiveType(typeId)}
                className={activeType === typeId ? 'active' : ''}>
                {typeNames[typeId]}
              </li>
            ))}
          </ul>
          <ul>
            {sizes.map((size, i) => (
              <li
                key={size}
                onClick={() => setActiveSize(i)}
                className={activeSize === i ? 'active' : ''}>
                {size} см.
              </li>
            ))}
          </ul>
        </div>
        <div className="pizza-block__bottom">
          <div className="pizza-block__price">от {pricePizza} ₽</div>
          <button onClick={onClickAdd} className="button button--outline button--add">
            <svg
              width="12"
              height="12"
              viewBox="0 0 12 12"
              fill="none"
              xmlns="http://www.w3.org/2000/svg">
              <path
                d="M10.8 4.8H7.2V1.2C7.2 0.5373 6.6627 0 6 0C5.3373 0 4.8 0.5373 4.8 1.2V4.8H1.2C0.5373 4.8 0 5.3373 0 6C0 6.6627 0.5373 7.2 1.2 7.2H4.8V10.8C4.8 11.4627 5.3373 12 6 12C6.6627 12 7.2 11.4627 7.2 10.8V7.2H10.8C11.4627 7.2 12 6.6627 12 6C12 5.3373 11.4627 4.8 10.8 4.8Z"
                fill="white"
              />
            </svg>
            <span>Добавить</span>
            {addedCount > 0 && <i>{addedCount}</i>}
          </button>
        </div>
      </div>
    </div>
  );
}

export default PizzaBlock;
