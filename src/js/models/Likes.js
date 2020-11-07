export default class Likes {
    constructor(){
        this.likes = [];
    }

    addLike(id, title, author, img) {
        const like = {
            id,
            title,
            author,
            img
        }

        this.likes.push(like);

        //Persist data in local storage
        this.persistData();

        return like
    }

    deleteLike(id){
       const index = this.likes.findIndex(curr => curr.id === id);
       console.log(index)

       this.likes.splice(index,1);
       
       //Persist data in local storage
       this.persistData();
    }

    isLiked(id){

        //findIndex will return -1 if the id is not matched and hence it will turn out to be a false or if the id is matched it will turn out to be true

        return this.likes.findIndex(curr => curr.id === id) !== -1;
    }

    getNumLikes(){
        return this.likes.length;
    }

    persistData () {
        //Converting array to string using JSON stringify method
        localStorage.setItem('likes', JSON.stringify(this.likes));
    }

    readStorage () {
        //To convert the data from string to it's actual data structure
        const storage = JSON.parse(localStorage.getItem('likes'));

        //Restoring the likes from localstorage
        if(storage) this.likes = storage;
    }
}