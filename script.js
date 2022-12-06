document.addEventListener('DOMContentLoaded', () => {
  const app = document.getElementById('game-app');
  const start = document.getElementById('option__button');
  const option = document.getElementById('option');

  start.addEventListener('click', () => {
    startGame();
  });

  function startGame() {
    setTimeout(stopGame, 60000);

    const amount = Number(document.getElementById('option__number').value);

    if(amount % 2 || amount > 10) return false;

    option.style.display = 'none';

    const { cards, cardsArray } = createPlane(amount);
    
    game(cards, cardsArray);
  }

  function createPlane(amount) {
    const colors = colorGeneration(amount);
    const ul = document.createElement('ul');

    ul.classList.add('game-app__plane');
    ul.style.gridTemplateColumns = `repeat(${ amount }, 60px)`;

    const { cards, cardsArray } = createCards(colors);
    
    cards.forEach((item) => {
      ul.append(item);
    });
    
    app.append(ul);

    return {
      cards, 
      cardsArray
    };
  }

  function game(cards, cardsArray) {
    openCard(cards, cardsArray);

    checkGame(cards);
  }

  function checkGame(cards) {
    cards.forEach((card) => {
      card.addEventListener('click', (event) => {
        const status = event.currentTarget.closest('.game-app__plane').querySelectorAll('.game-app__card_active[data-done="true"]');

        if(cards.length === status.length) {
          setTimeout(stopGame, 1000);
        }
      });
    });
  }

  function openCard(cards, cardsArray) {
    const click = [];
    let active = [];

    cards.forEach((card) => {
      card.addEventListener('click', (event) => {
        click.push(event.currentTarget.dataset.number);
        active.push(event.currentTarget);

        cardsArray.forEach((item) => {
          if(item.first == event.currentTarget.dataset.number || item.second == event.currentTarget.dataset.number) {
            event.currentTarget.querySelector('.back').style.backgroundColor = `rgb(${ item.color })`;
            
            return;
          }
        });

        event.currentTarget.classList.add('game-app__card_active');

        if(click.length === 2) {
          if(checkCard(click, cardsArray)){
            doneCard(active);
            active.length = 0;
          } else {
            active = clearCard(active);
          }

          click.length = 0;
        }
      });
    });
  }

  function clearCard(active) {
    setTimeout(() => {
      active.forEach((card) => {
        card.classList.remove('game-app__card_active');
      });
    }, 1500);

    return [];
  }

  function doneCard(active) {
    active.forEach((card) => {
      card.dataset.done = true;
    });
  }

  function checkCard(click, cardsArray) {
    return cardsArray.some((card) => {
      if((card.first == click[0] || card.first == click[1]) && (card.second == click[0] || card.second == click[1])) {
        return true;
      } else {
        return false;
      }
    });
  }

  function createCards(colors) {
    let cardsNumber = amountCards(colors);
    const cardsArray = [];

    cardsNumber = shakeArray(cardsNumber);

    colors.forEach((item) => {
      cardsArray.push({color: item, first: cardsNumber.shift(), second: cardsNumber.shift()});
    });

    cardsNumber = amountCards(colors);

    const cards = amountCards(colors).map((item) => {
      const li = document.createElement('li');

      li.classList.add('game-app__card');
      li.innerHTML = `<div class="front"></div><div class="back"></div>`;
      li.dataset.number = cardsNumber.shift();

      return li;
    });

    return {
      cards,
      cardsArray
    };
  }

  function amountCards(colors) {
    let cardsNumber = [];

    for(let i = 1; i <= colors.length * 2; i++) {
      cardsNumber.push(i);
    }

    return cardsNumber;
  }

  function stopGame() {
    const button = document.createElement('button');
    button.textContent = 'Сыграть ещё раз';
    button.classList.add('option__button');

    app.innerHTML = '';
    app.append(button);

    button.addEventListener('click', () => {
      button.remove();

      option.style.display = 'block';
    });
  }

  function shakeArray(cardsNumber) {
    return cardsNumber.sort(()=>Math.random() - 0.5);
  }

  function randomNumber(min, max) {
    return Math.floor(Math.random() * (max - min) + min);
  }

  function colorGeneration(amount) {
    const colors = [];

    for(let i = 0; i < amount * amount / 2; i++) {
      colors.push(`${randomNumber(0, 255)},${randomNumber(0, 255)},${randomNumber(0, 255)}`);
    }
  
    return colors;
  }
});