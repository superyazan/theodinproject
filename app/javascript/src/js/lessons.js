/* eslint-disable */
import Stickyfill from 'stickyfilljs';
import Prism from 'prismjs';

const LESSON_HEADINGS = [
  'Introduction',
  'Lesson Overview',
  'Learning Outcomes',
  'Assignment',
  'Assignment 1',
  'Assignment 2',
  'Practice',
  'Exercises',
  'Knowledge Check',
  'Additional Resources',
];

function getElements(selector) {
  return document.querySelectorAll(selector);
}

function kebabCase(text) {
  return text
    .toLowerCase()
    .replace(/[^\w\d -]/, '')
    .split(' ')
    .join('-');
}

function navigationElement(headingText) {
  return `${
    '<div class="lesson-navigation__item">' +
    '<div class="lesson-navigation__circle"></div>' +
    '<div class="lesson-navigation__title">' +
    '<a class="lesson-navigation__link grey" href="#'
  }${kebabCase(headingText)}">${headingText}</a></div></div>`;
}

function lessonNavigation(headings) {
  return headings.map(navigationElement).join('');
}

function getInnerText(heading) {
  return heading.innerText;
}

function isCommonHeading(heading) {
  return LESSON_HEADINGS.includes(heading.trim());
}

function filterHeadings() {
  const lessonHeadings = getElements('.lesson-content h3');

  return Array.prototype.slice
    .call(lessonHeadings)
    .map(getInnerText)
    .filter(isCommonHeading);
}

function setTargetForExternalLinks() {
  getElements('.lesson-content a[href^=http]').forEach((externalLink) => {
    externalLink.setAttribute('target', '_blank');
    externalLink.setAttribute('rel', 'noreferrer');
  });
}

function addActiveClass() {
  const links = getElements('.lesson-navigation__link');

  window.onhashchange = function () {
    links.forEach((link) => {
      if (link.hash == window.location.hash) {
        link.classList.add('active');
        link.parentNode.previousSibling.classList.add('active');
      } else {
        link.classList.remove('active');
        link.parentNode.previousSibling.classList.remove('active');
      }
    });
  };
}

function constructLessonNavigation() {
  const commonHeadings = filterHeadings();

  if (commonHeadings.length < 2) {
    const navigationColumn = document.querySelector('.lesson .col-lg-3');
    const lessonColumn = document.querySelector('.lesson .row');
    navigationColumn.classList.add('d-none');
    lessonColumn.classList.add('justify-content-center');
  } else {
    const lessonNavigationHTML = lessonNavigation(commonHeadings);
    const lessonNavigationElement =
      document.querySelector('.lesson-navigation');
    lessonNavigationElement.innerHTML = lessonNavigationHTML;
    addActiveClass();
    Stickyfill.add(lessonNavigationElement);
  }
}

function isLessonPage() {
  return document.querySelector('.lesson') !== null;
}

function constructLessonSections() {
  const lessonHeadings = getElements('.lesson-content h3');

  lessonHeadings.forEach(buildScrollSpy);
  lessonHeadings.forEach(constructInternalLinks);
}

function buildScrollSpy(heading) {
  const id = heading.getAttribute('id');
  heading.removeAttribute('id');
  const section = document.createElement('div');
  section.setAttribute('id', id);

  if (isCommonHeading(heading.innerText)) {
    section.classList.add('scrollspy');
  }

  heading.parentNode.insertBefore(section, heading);

  while (
    heading.nextElementSibling !== null &&
    heading.nextElementSibling.tagName !== 'H3'
  ) {
    section.appendChild(heading.nextElementSibling);
  }

  section.insertBefore(heading, section.firstChild);
}

function constructInternalLinks(heading) {
  const uri = location.href.replace(location.hash, '');
  const { id } = heading.parentElement;
  const internalLink = document.createElement('a');
  internalLink.setAttribute('href', `${uri}#${id}`);
  internalLink.textContent = heading.textContent;
  internalLink.className = 'internal-link';
  heading.appendChild(internalLink);
  heading.firstChild.remove();
}

function spyLessonSections() {
  $('.scrollspy').scrollSpy({ scrollOffset: 50 });
}

document.addEventListener('DOMContentLoaded', () => {
  if (!isLessonPage()) return;

  Prism.highlightAll();
  setTargetForExternalLinks();
  constructLessonSections();

  if (!window.matchMedia('(min-width: 992px)').matches) {
    return;
  }
  constructLessonNavigation();
  spyLessonSections();
});
