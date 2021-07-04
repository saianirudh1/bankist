'use strict';

// Data
const account1 = {
  owner: 'Sai Anirudh',
  movements: [200, 450, -400, 3000, -650, -130, 70, 1300],
  interestRate: 0.02, // %
  pin: 1111,
};

const account2 = {
  owner: 'Keerthi Reddy',
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 0.05,
  pin: 2222,
};

const account3 = {
  owner: 'Sai Santosh Anuraag',
  movements: [200, -200, 340, -300, -20, 50, 400, -460],
  interestRate: 0.075,
  pin: 3333,
};

const account4 = {
  owner: 'Yamini Chinta',
  movements: [430, 1000, 700, 50, 90],
  interestRate: 0.1,
  pin: 4444,
};

const accounts = [account1, account2, account3, account4];

// Elements
const labelWelcome = document.querySelector('.welcome');
const labelDate = document.querySelector('.date');
const labelBalance = document.querySelector('.balance__value');
const labelSumIn = document.querySelector('.summary__value--in');
const labelSumOut = document.querySelector('.summary__value--out');
const labelSumInterest = document.querySelector('.summary__value--interest');
const labelTimer = document.querySelector('.timer');

const containerApp = document.querySelector('.app');
const containerMovements = document.querySelector('.movements');

const btnLogin = document.querySelector('.login__btn');
const btnTransfer = document.querySelector('.form__btn--transfer');
const btnLoan = document.querySelector('.form__btn--loan');
const btnClose = document.querySelector('.form__btn--close');
const btnSort = document.querySelector('.btn--sort');

const inputLoginUsername = document.querySelector('.login__input--user');
const inputLoginPin = document.querySelector('.login__input--pin');
const inputTransferTo = document.querySelector('.form__input--to');
const inputTransferAmount = document.querySelector('.form__input--amount');
const inputLoanAmount = document.querySelector('.form__input--loan-amount');
const inputCloseUsername = document.querySelector('.form__input--user');
const inputClosePin = document.querySelector('.form__input--pin');

const currency = '\u20B9';
let currAccount;
const geneateUsernames = function (accounts) {
  accounts.forEach(function (acc) {
    acc.username = acc.owner
      .split(' ')
      .map(word => word[0].toLowerCase())
      .join('');
  });
};

geneateUsernames(accounts);

const displayMovements = function (movements, sorted = false) {
  const movs = sorted ? movements.slice().sort((a, b) => a - b) : movements;
  containerMovements.innerHTML = '';

  movs.forEach(function (movement, index) {
    const movementType = movement < 0 ? 'withdrawal' : 'deposit';
    const transaction = `<div class="movements__row">
    <div class="movements__num">${index + 1}.</div>
    <div class="movements__type movements__type--${movementType}">${movementType}</div>
    <div class="movements__date">3 days ago</div>
    <div class="movements__value">${movement} ${currency}</div>
  </div>`;

    containerMovements.insertAdjacentHTML('afterbegin', transaction);
  });
};

const displayBalance = function (acc) {
  const balance = acc.movements.reduce((bal, mov) => bal + mov);
  labelBalance.textContent = `${balance + currency}`;
};

const displaySummaries = function (acc) {
  const depositSummary = acc.movements
    .filter(mov => mov > 0)
    .reduce((sum, mov) => sum + mov, 0);

  const withdrawalSummary = Math.abs(
    acc.movements.filter(mov => mov < 0).reduce((sum, mov) => sum + mov, 0)
  );

  const interestSummary = acc.movements
    .filter(mov => mov > 0)
    .map(deposit => (deposit * acc.interestRate) / 100)
    .reduce((int, val) => int + val, 0);

  labelSumIn.textContent = depositSummary + currency;
  labelSumOut.textContent = withdrawalSummary + currency;
  labelSumInterest.textContent = interestSummary + currency;
};

const validCredentials = function (username, pin) {
  currAccount = accounts.find(acc => acc.username === username);
  if (!currAccount) {
    inputLoginUsername.classList.add('invalid');
    inputLoginUsername.value = '';
    inputLoginUsername.blur();
    return false;
  }

  if (currAccount?.pin !== Number(pin)) {
    inputLoginPin.classList.add('invalid');
    inputLoginPin.value = '';
    inputLoginPin.blur();
    return false;
  }

  return true;
};

inputLoginUsername.addEventListener('click', function () {
  inputLoginUsername.value = '';
  inputLoginUsername.classList.remove('invalid');
});

inputLoginPin.addEventListener('click', function () {
  inputLoginPin.value = '';
  inputLoginPin.classList.remove('invalid');
});

const refreshUI = function (acc) {
  displayMovements(acc.movements);
  displayBalance(acc);
  displaySummaries(acc);
};

btnLogin.addEventListener('click', function (e) {
  e.preventDefault();
  const username = inputLoginUsername.value;
  const pin = inputLoginPin.value;

  if (validCredentials(username, pin)) {
    inputLoginPin.value = '';
    inputLoginPin.blur();

    inputLoginUsername.value = '';
    inputLoginUsername.blur();

    containerApp.style.opacity = '100%';
    labelWelcome.textContent = `Welcome Back, ${currAccount.owner}`;

    refreshUI(currAccount);
  }
});

btnTransfer.addEventListener('click', function (e) {
  e.preventDefault();
  const recieverAccount = accounts.find(
    acc => acc.username === inputTransferTo.value
  );
  const amount = Number(inputTransferAmount.value);

  if (
    amount > 0 &&
    recieverAccount &&
    recieverAccount.username !== currAccount.username
  ) {
    currAccount.movements.push(amount * -1);
    recieverAccount.movements.push(amount);
    inputTransferAmount.value = inputTransferTo.value = '';
    inputTransferAmount.blur();
    refreshUI(currAccount);
  }
});

btnClose.addEventListener('click', function (e) {
  e.preventDefault();
  const closeUser = inputCloseUsername.value;
  const closePin = inputClosePin.value;

  if (
    !closeUser ||
    !closePin ||
    closeUser != currAccount.username ||
    closePin != currAccount.pin
  ) {
    inputClosePin.value = inputCloseUsername.value = '';
    inputClosePin.blur();
    inputCloseUsername.blur();
  } else {
    const index = accounts.findIndex(acc => acc.username === closeUser);
    accounts.splice(index, 1);
    containerApp.style.opacity = '0';
  }
});

btnLoan.addEventListener('click', function (e) {
  e.preventDefault();
  const amount = Number(inputLoanAmount.value);

  const approval = currAccount.movements
    .filter(num => num > 0)
    .some(deposit => amount * 0.1 <= deposit);

  if (amount > 0 && approval) {
    currAccount.movements.push(amount);
    refreshUI(currAccount);
  } else {
    inputLoanAmount.value = '';
    inputLoanAmount.blur();
  }
});

let sorted = false;
btnSort.addEventListener('click', function () {
  displayMovements(currAccount.movements, sorted);
  sorted = !sorted;
});
