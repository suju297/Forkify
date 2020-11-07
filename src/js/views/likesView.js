import {elements} from './base';
import {limitRecipeTitle} from './searchView'

export const toggleLikeBtn = isLiked => {

    //img/icons.svg#icon-heart-outlined

    const iconString = isLiked ? 'icon-heart' : 'icon-heart-outlined';

    document.querySelector('.recipe__love use').setAttribute('href', `img/icons.svg#${iconString}`);
};

export const toggleLikeMenu = numLikes => {
    //if we had many styles we wanted to apply then we would just define a class in css and then toggle that class here using javascript but In this case its the simple visibility property
    elements.likeMenu.style.visibility = numLikes > 0 ? 'visible' : 'hidden';
}

export const renderLike = like =>{
    console.log(like,'like')
    const markup = `
            <li>
                <a class="likes__link" href="#${like.id}">
                    <figure class="likes__fig">
                        <img src="${like.img}" alt="${like.title}">
                    </figure>
                    <div class="likes__data">
                        <h4 class="likes__name">${limitRecipeTitle(like.title)}</h4>
                        <p class="likes__author">${like.author}</p>
                    </div>
                </a>
            </li>
    `

    elements.likeList.insertAdjacentHTML('beforeend',markup);
}

export const deleteLike = id => {

    //Selects element from the like__link class and which has id
    //We want to delete the entire list so we select the parent element
    const el = document.querySelector(`.likes__link[href*="#${id}`).parentElement;

    if(el){
        //if there is a parent element we move up and remove the child
        el.parentElement.removeChild(el);
    }
}