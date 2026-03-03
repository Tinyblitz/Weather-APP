 const DEFAULT_ANIMATION_TIME = 500 // in milliseconds

 // Set fade animation for content change
export function fadeOut(el, time = DEFAULT_ANIMATION_TIME) {
    el.classList.replace('show','fade');
    setTimeout(() => {
        el.classList.replace('fade','show');
    },time);
}