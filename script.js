'use strict';
const navList = document.querySelector('.nav-menu');
const navLinks = Array.from(navList.querySelectorAll('.nav-item'));
const sections = Array.from(document.querySelectorAll('.section-contents')).concat(Array.from(document.querySelectorAll('section')));

/* HANDLING MENU CLICK */

navList.addEventListener('click', event => {
  event.preventDefault();
  if (event.target.classList.contains('nav-menu')) {
    return;
  }
  scrollToTarget(event.target);
});

/* HANDLING SCROLL EVENT */

let last_known_scroll_position = 0;
let ticking = false;
let sectionInView = sections[0];

window.addEventListener('scroll', () => {
  last_known_scroll_position = window.scrollY;

  if (!ticking) {
    window.requestAnimationFrame(() => {
      handleScroll(last_known_scroll_position);
      ticking = false;
    });

    ticking = true;
  }
});


function handleScroll(scrollPos) {
  const newSectionInView = getSectionInView(scrollPos);

  //if the section in view hasn't changed, terminate
  if (newSectionInView !== undefined && sectionInView.id === newSectionInView.id) {
    return;
  }
  //othervise, update the value
  sectionInView = newSectionInView;

  //find the corresponding link in navigation menu
  let current = navLinks.find(el => getURL(el.firstElementChild.href) === newSectionInView.id);

  if (!current) {
    return;
  } else if (!current.classList.contains('nav-item-sec')) {
    current = current.querySelector('.nav-item-sec');
  } else {
    updateClasses(current);
  }
}

function scrollToTarget(target) {
  const targetLink = target.classList.contains('nav-item') ? event.target.firstElementChild : target; 
  const targetURL = getURL(targetLink.href);
  const targetSection = document.getElementById(targetURL);
  
  window.scrollTo({
    top: targetSection.offsetTop - 170,
    behavior: 'smooth'
  });
}

function getURL(href) {
  const idx = href.indexOf('#');
  return href.substring(idx + 1);
}

function updateClasses(current) {
  navLinks.forEach(el => {
    el.classList.remove('active');
    el.parentElement.classList.remove('active');
  });

  current.classList.add('active');
  current.parentElement.parentElement.classList.add('active');
}

function getSectionInView(scrollPos) {
  const section = sections.find(el => {
    const top = el.offsetTop;
    const bottom = el.offsetTop + el.offsetHeight;

    if (top >= scrollPos && top < window.innerHeight + scrollPos) {
      return el;
    } else if (top <= scrollPos + 200 && bottom >= scrollPos + 250) {
      return el;
    }
  });

  return section;
}
