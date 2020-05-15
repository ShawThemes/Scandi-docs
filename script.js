'use strict';
const navList = document.querySelector('.nav-menu');
const navLinks = Array.from(navList.querySelectorAll('.nav-item'));
const sections = Array.from(document.querySelectorAll('.section-contents')).concat(Array.from(document.querySelectorAll('section')));

navList.addEventListener('click', event => {
  event.preventDefault();
  if (event.target.classList.contains('nav-menu')) {
    return;
  }

  const targetLink = event.target.classList.contains('nav-item') ? event.target.firstElementChild : event.target; 
  
  const targetURL = getURL(targetLink.href);
  console.log(targetURL);
  let targetSection = document.getElementById(targetURL);
  
  window.scrollTo({
    top: targetSection.offsetTop - 170,
    behavior: 'smooth'
  });



});

function getURL(href) {
  const idx = href.indexOf('#');
  return href.substring(idx + 1);
}




let last_known_scroll_position = 0;
let ticking = false;
let sectionInView = sections[0];

function doSomething(scrollPos) {
  const newSectionInView = sections.find(el => (el.offsetTop >= scrollPos && el.offsetTop <= window.innerHeight + scrollPos) || (el.offsetTop <= scrollPos && el.offsetTop + el.offsetHeight >= scrollPos + window.innerHeight) );

  if (newSectionInView !== undefined && sectionInView.id === newSectionInView.id) {
    return;
  }
  sectionInView = newSectionInView;
  console.log('sectionInview - ', newSectionInView.id);
  let current = navLinks.find(el => getURL(el.firstElementChild.href) === newSectionInView.id);
  console.log('menu item - ', current);

  

  if (!current) {
    return;
  } else if (!current.classList.contains('nav-item-sec')) {
    current = current.querySelector('.nav-item-sec');
  } else {
    navLinks.forEach(el => {
      el.classList.remove('active');
      el.parentElement.classList.remove('active');
    });

    current.classList.add('active');
    current.parentElement.parentElement.classList.add('active');
  }




}

window.addEventListener('scroll', function(e) {
  last_known_scroll_position = window.scrollY;

  if (!ticking) {
    window.requestAnimationFrame(function() {
      doSomething(last_known_scroll_position);
      ticking = false;
    });

    ticking = true;
  }
});