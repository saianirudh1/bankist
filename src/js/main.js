'use strict';

const modal = document.querySelector('.modal');
const overlay = document.querySelector('.overlay');
const btnCloseModal = document.querySelector('.btn--close-modal');
const btnsOpenModal = document.querySelectorAll('.btn--show-modal');

const btnScrollTo = document.querySelector('.btn--scroll-to');
const section1 = document.getElementById('section--1');

const header = document.querySelector('.header');
const nav = document.querySelector('.nav');
const navLinks = document.querySelector('.nav__links');

const operationsContainer = document.querySelector(
  '.operations__tab-container'
);
const sections = document.querySelectorAll('.section');

const images = document.querySelectorAll('img[data-src]');

const btnRight = document.querySelector('.slider__btn--right');
const btnLeft = document.querySelector('.slider__btn--left');

// Nav Links
navLinks.addEventListener('click', function (e) {
  e.preventDefault();
  if (e.target.classList.contains('nav__link')) {
    const target = document.querySelector(e.target.getAttribute('href'));

    target.scrollIntoView({ behavior: 'smooth' });
  }
});

const navAnimation = function (e) {
  if (e.target.classList.contains('nav__link')) {
    const hovered = e.target;
    const sibilings = hovered
      .closest('.nav__links')
      .querySelectorAll('.nav__link');

    sibilings.forEach(sib => {
      if (sib !== hovered) {
        sib.style.opacity = this;
      }
    });
  }
};

navLinks.addEventListener('mouseover', navAnimation.bind(0.5));
navLinks.addEventListener('mouseout', navAnimation.bind(1));

//Scroll to
btnScrollTo.addEventListener('click', function () {
  section1.scrollIntoView({ behavior: 'smooth' });
});

// Tabbed Content
operationsContainer.addEventListener('click', function (e) {
  const currentBtn = document.querySelector('.operations__tab--active');
  const currentTab = document.querySelector('.operations__content--active');

  if (e.target.classList.contains('operations__tab')) {
    currentBtn.classList.remove('operations__tab--active');
    currentTab.classList.remove('operations__content--active');

    const tabNum = e.target.dataset.tab;
    const clickedTab = document.querySelector(`.operations__tab--${tabNum}`);
    const tabContent = document.querySelector(
      `.operations__content--${tabNum}`
    );

    clickedTab.classList.add('operations__tab--active');
    tabContent.classList.add('operations__content--active');
  }
});

// Sticky Nav
const height = nav.getBoundingClientRect().height;
const stickyNav = function (entries) {
  const [entry] = entries;
  if (!entry.isIntersecting) {
    nav.classList.add('sticky');
  } else {
    nav.classList.remove('sticky');
  }
};

const headerObserver = new IntersectionObserver(stickyNav, {
  root: null,
  threshold: 0,
  rootMargin: `-${height}px`,
});

headerObserver.observe(header);

// Reveal on scroll

const revealSection = function (entries, options) {
  const [entry] = entries;

  if (!entry.isIntersecting) return;

  entry.target.classList.remove('section--hidden');
  sectionObserver.unobserve(entry.target);
};

const sectionObserver = new IntersectionObserver(revealSection, {
  root: null,
  threshold: 0.15,
});

sections.forEach(section => {
  sectionObserver.observe(section);
  //   section.classList.add('section--hidden');
});

// Lazy Load
const revealImage = function (entries, options) {
  const [entry] = entries;

  if (!entry.isIntersecting) return;

  entry.target.src = entry.target.dataset.src;
  entry.target.addEventListener('load', function () {
    entry.target.style.filter = 'none';
  });

  imageObserver.unobserve(entry.target);
};

const imageObserver = new IntersectionObserver(revealImage, {
  root: null,
  threshold: 0.15,
  rootMargin: '200px',
});

images.forEach(img => imageObserver.observe(img));

// Slider
const slider = function () {
  const slides = document.querySelectorAll('.slide');
  let currentSlide = 0;
  const maxSlide = slides.length - 1;

  const dotContainer = document.querySelector('.dots');
  const createDots = function () {
    slides.forEach(function (_, index) {
      dotContainer.insertAdjacentHTML(
        'beforeend',
        `<button class="dots__dot dots__dot--active" data-slide='${index}'></button>`
      );
    });
  };

  createDots();

  const activateDot = function (index) {
    currentSlide = index;
    goToSlide(currentSlide);

    const dots = document.querySelectorAll('button[data-slide]');
    let currentDot;
    dots.forEach(dot => {
      if (Number(dot.dataset.slide) === currentSlide) {
        currentDot = dot;
      } else {
        dot.classList.remove('dots__dot--active');
      }
    });

    currentDot.classList.add('dots__dot--active');
  };

  const goToSlide = function (index) {
    slides.forEach((slide, i) => {
      slide.style.transform = `translateX(${100 * (i - index)}%)`;
    });
  };

  activateDot(currentSlide);

  const nextSlide = function () {
    if (currentSlide === maxSlide) {
      currentSlide = 0;
    } else {
      currentSlide++;
    }

    activateDot(currentSlide);
  };

  const prevSlide = function () {
    if (currentSlide === 0) {
      currentSlide = maxSlide;
    } else {
      currentSlide--;
    }

    activateDot(currentSlide);
  };

  btnRight.addEventListener('click', nextSlide);
  btnLeft.addEventListener('click', prevSlide);

  dotContainer.addEventListener('click', function (e) {
    if (e.target.classList.contains('dots__dot')) {
      activateDot(Number(e.target.getAttribute('data-slide')));
    }
  });

  document.addEventListener('keydown', function (e) {
    if (e.key === 'ArrowRight') {
      currentSlide++;
    }

    if (e.key === 'ArrowLeft') {
      currentSlide--;
    }

    activateDot(currentSlide);
  });
};

slider();

// Modal window
const openModal = function () {
  modal.classList.remove('hidden');
  overlay.classList.remove('hidden');
};

const closeModal = function () {
  modal.classList.add('hidden');
  overlay.classList.add('hidden');
};

btnsOpenModal.forEach(btn => btn.addEventListener('click', openModal));

btnCloseModal.addEventListener('click', closeModal);
overlay.addEventListener('click', closeModal);

document.addEventListener('keydown', function (e) {
  if (e.key === 'Escape' && !modal.classList.contains('hidden')) {
    closeModal();
  }
});
