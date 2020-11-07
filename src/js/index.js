// Global app controller
import Search from './models/Search';
import Recipe from './models/Recipe';
import { elements, renderLoader, clearLoader } from './views/base';
import * as searchView from './views/searchView'
import * as recipeView from './views/recipeView'
import * as listView from './views/listView'
import List from './models/List'
import Like from './models/Likes'
import * as likeView from './views/likesView';


const state = {
    //Search object
    //Current recipe object
    //Shopping list object
    //Liked recipes

};



const controlSearch = async () => {
    //1) Get query from view
    const query = searchView.getInput();

    //console.log(query)

    //2) New search object and add to state
    if (query) {
        state.search = new Search(query)

        //3) Preparing the userInterface for what's going to happen next 
        //Clearing previous results or show a loading spinner
        searchView.clearInput();
        searchView.clearResult();

        //attach loader to parent element
        renderLoader(elements.searchRes)
        try {

            //4) Searching for recipes
            await state.search.getResults()

            //5) Rendering results on UI
            clearLoader()
            searchView.renderResult(state.search.result)
        } catch (err) {
            console.log(err)
            clearLoader()
        }
    }
}



elements.searchForm.addEventListener('submit', e => {

    //preventing reloading the page
    e.preventDefault();
    controlSearch();
})



elements.searchResPages.addEventListener('click', e => {
    const btn = e.target.closest('.btn-inline')
    //console.log(btn)
    if (btn) {
        const goToPage = parseInt(btn.dataset.goto, 10);
        //console.log(goToPage);
        searchView.clearResult();
        searchView.renderResult(state.search.result, goToPage)
    }
})

// const recipe = new Recipe('47746');
// recipe.getRecipe()
// console.log(recipe)



/* 
*   Recipe Controller
*/
const controlRecipe = async () => {
    // Get Id from URL
    const id = window.location.hash.replace('#', '');
    //console.log(id)

    if (id) {


        //Prepare UI FOR CHANGES
        recipeView.clearRecipe();
        renderLoader(elements.recipe)

        //Highlight Selected
        if (state.search) searchView.highlightSelcted(id)

        //Create a new recipe object
        state.recipe = new Recipe(id)

        try {

            //get recipe data and parse ingredients
            await state.recipe.getRecipe()
            state.recipe.parseIngredients()

            //Calculate servings and time
            state.recipe.calcTime();
            state.recipe.calcServings();

            // Render recipe
            clearLoader();
            recipeView.renderRecipe(
                state.recipe,
                state.Like.isLiked(id)
            );
            //console.log(state.recipe)
            //console.log(state.recipe)

        } catch (error) {
            console.log(error, 'Error processing Recipe !')
        }
    }
}

// window.addEventListener('hashchange', controlRecipe);
// window.addEventListener('load', controlRecipe)

['hashchange', 'load'].forEach(event => window.addEventListener(event, controlRecipe))



//List controller
const controlList = () => {
    // Create a new list if there is none yet

    if (!state.list) state.list = new List();

    //Add each ingredients to the list and UI
    state.recipe.ingredients.forEach(curr => {
        const item = state.list.addItem(curr.count, curr.unit, curr.ingredient);
        //console.log(curr.ingredient,'controllist')
        listView.renderItem(item);
    })
}



//Like controller
const controlLike = () => {

    //Check if state.like exist or not
    if (!state.Like) state.Like = new Like();

    const currentID = state.recipe.id;

    //User has not yet liked the current recipe
    if (!state.Like.isLiked(currentID)) {

        //Add like to the state
        const newLike = state.Like.addLike(
            currentID,
            state.recipe.title,
            state.recipe.author,
            state.recipe.img
        );

        //Toggle the like button
        likeView.toggleLikeBtn(true);

        //Add Like to the UI list 
        //console.log(newLike)
        likeView.renderLike(newLike);
        //console.log(state.Like)

    } else { // User has  liked the current recipe

        //Remove like to the state
        state.Like.deleteLike(currentID)

        //Toggle the like button
        likeView.toggleLikeBtn(false);

        //Remove Like to the UI list 
        likeView.deleteLike(currentID)
        //console.log(state.Like.getNumLikes())

    }

    likeView.toggleLikeMenu(state.Like.getNumLikes())
}



//Restore liked recipes when the page loads
window.addEventListener('load', () => {
    state.Like = new Like();

    //Restore Likes
    state.Like.readStorage();

    //Toggle the like button if there are some likes
    likeView.toggleLikeMenu(state.Like.getNumLikes())

    //Render the existing likes
    state.Like.likes.forEach(curr => likeView.renderLike(curr))
})



// Handle delete and update list item events 
elements.shopping.addEventListener('click', e => {
    //using closest because we specifically need to find an element with shopping item class on it close to where the click happened
    const id = e.target.closest('.shopping__item').dataset.itemid;

    //Handle the delete button

    //using matches here as it is going to return a true or false value
    if (e.target.matches('.shopping__delete, .shopping__delete *')) {

        //deleting it from state 
        state.list.deleteItem(id);

        //delete from user interface
        listView.deleteItem(id);

    } else if (e.target.matches('.shopping__count-value, .shopping__count-value *')) {

        //reading the current value of the element
        const val = parseFloat(e.target.value, 10)

        //update count in state

        state.list.updateCount(id, val)

    }
});



// Handling recipe button clicks
elements.recipe.addEventListener('click', e => {
    // .btn-decrease '*' here is a universal selector which will select all child elements of the parent
    if (e.target.matches('.btn-decrease, .btn-decrease *')) {
        //Decrease button is clicked
        if (state.recipe.servings > 1) {
            state.recipe.updateServings('dec');
            recipeView.updateServingIngredients(state.recipe)
        }

    } else if (e.target.matches('.btn-increase, .btn-increase *')) {
        // Increase button clicked
        state.recipe.updateServings('inc');
        recipeView.updateServingIngredients(state.recipe)
    } else if (e.target.matches('.recipe__btn--add, .recipe__btn--add *')) {
        //console.log('click')
        controlList();
    } else if (e.target.matches('.recipe__love, .recipe__love *')) {
        //Like controller
        controlLike();
    }
    //console.log(state.recipe)
})