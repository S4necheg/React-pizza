import React from 'react';

import styles from './NotFoundBlock.module.scss';

console.log(styles);

function NotFoundBlock() {
  return (
    <div className={styles.root}>
      <h1>
        <span>😔</span>
        <br />
        Ничего не найдено
      </h1>
      <p>К сожалению данная страница отсутствует в нашей пиццерии</p>
    </div>
  );
}

export default NotFoundBlock;
