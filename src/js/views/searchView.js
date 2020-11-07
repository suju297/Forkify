import { elements } from './base'

export const getInput = () => elements.searchInput.value;

export const clearInput = () => {
    elements.searchInput.value = '';
};

export const clearResult = () => {
    elements.searchReslist.innerHTML = '';
    elements.searchResPages.innerHTML = '';
};

export const highlightSelcted = id =>{

    const resultsArr = Array.from(document.querySelectorAll('.results__link'));
    resultsArr.forEach(curr => {
        curr.classList.remove('results__link--active');
    })
    //CSS selector Selecting all links based on attributes, the attribute we are looking for is href which has the id with the # symbol then adding a class 
    // in the classlist we just need to send the name and not the selector (no need of dot)
   const el =  document.querySelector(`.results__link[href*="#${id}"]`);

  if(el) el.classList.add('results__link--active');

}
export const limitRecipeTitle = (title, limit = 17) => {

    const newTitle = []

    if (title.length > limit) {

        title.split(/ |-/).reduce((acc, curr) => {

            if (acc + curr.length <= limit) {
                newTitle.push(curr)
                // console.log(newTitle)
            }
            return acc + curr.length
        }, 0)

        return `${newTitle.join(' ')} ...`
    }
    return title
}

const renderRecipe = recipe => {

    const markup = `
                 <li>
                    <a class="results__link" href=#${recipe.recipe_id}>
                        <figure class="results__fig">
                            <img src=${recipe.image_url} alt=${recipe.title}>
                        </figure>
                        <div class="results__data">
                            <h4 class="results__name">${limitRecipeTitle(recipe.title)}</h4>
                            <p class="results__author">${recipe.publisher}</p>
                        </div>
                    </a>
                </li>
    `
    elements.searchReslist.insertAdjacentHTML('beforeend', markup);

};

const createButton = (page, type) => `
                <button class="btn-inline results__btn--${type}" data-goto=${type === 'prev' ? page - 1 : page + 1}>
                <span>Page ${type === 'prev' ? page - 1 : page + 1}</span>
                    <svg class="search__icon">
                        <use href="img/icons.svg#icon-triangle-${type === 'prev' ? 'left' : 'right'}"></use>
                    </svg>
                </button>
`

const renderButtons = (page, numResults, resPerPage) => {

    //Rounding up to upper limit
    const pages = Math.ceil(numResults / resPerPage);
    let button;

    if (page === 1 && pages > 1) {
        //Only button Go to next page
        button = createButton(page, 'next');
    } else if (page < pages) {
        //Need both previous and next page
        button = `
                ${createButton(page, 'prev')}
                ${createButton(page, 'next')}
                `
    } else if (page === pages && pages > 1) {
        //Only button need previous page
        button = createButton(page, 'prev');
    }

    elements.searchResPages.insertAdjacentHTML('afterbegin', button);
}

export const renderResult = (recipes, page = 2, resPerPage = 10) => {

    // render results of current page
    const start = (page - 1) * resPerPage;
    const end = page * resPerPage;

    recipes.slice(start, end).forEach(renderRecipe);

    //render pagination button
    renderButtons(page, recipes.length, resPerPage)
};