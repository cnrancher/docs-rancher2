import React from 'react';
import styles from './styles.module.css';

function Accordion(props) {
  return (
    <details className={styles.accordion}><summary className={styles.accordion__title}>{props.title || 'CLICK TO EXPAND'}</summary>
      <div className={styles.accordion__content}>{props.children}</div>
    </details>
  );
}

export default Accordion;
