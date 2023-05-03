"use strict";

// ============== global variables ============== //
const endpoint = "https://post-rest-api-default-rtdb.firebaseio.com/";
let posts;

// ============== load and init app ============== //

window.addEventListener("load", initApp);



async function initApp() {
    await updatePostsGrid(); // update the grid of posts: get and show all posts

    // event listener
    document
        .querySelector("#btn-create-post")
        .addEventListener("click", showCreatePostDialog);
    document.querySelector("#btn-cancel").addEventListener("click",closeCreateDialog);
    document.querySelector("#btn-no").addEventListener("click",closeDeleteDialog);
    document.querySelector("#update-btn-cancel").addEventListener("click",closeUpdateDialog);
    document.querySelector("#form-create-post").addEventListener("submit", createPostClicked);
    document.querySelector("#form-delete-post").addEventListener("submit", deletePostClicked);
    document.querySelector("#form-update-post").addEventListener("submit", updatePostClicked);
    //submit can refer to a submit event like below in createPostClicked
}

    async function createPostClicked(event) {
    //event.target is everything in the event. 'Target' refers to the DOM element that targets the element.
    const form = event.target;
    // form.title.value is the specific data that we put in the title input field. Input fields almost always give you text as the value.
    //form(formular) uses the input name instead of the label ID.. Just because
    const title = form.title.value;
    const body = form.body.value;
    const image = form.image.value;
    await createPost(title, body, image)

    form.reset();

    // const newPost ={title: title, body: body, image: image}
    // console.log(newPost)
}

function updatePostClicked(event) {
    const form = event.target;

    const title = form.title.value;
    const body = form.body.value;
    const image = form.image.value;

    const id = form.getAttribute("data-id");

    updatePost(title, body, image)

    //createPost(title, body, image) no need to wait that updatePost is resolved/rejected, because I don't care.
    //I don't need to wait for updatePost is resolved/rejected, because I don't care.
    //async and await should only be used on get
    // no need for  form.reset(); as it use the existing data

}

function closeCreateDialog() {
    document.querySelector("#dialog-create-new-post").close();
}

function closeDeleteDialog() {
    document.querySelector("#dialog-delete-post").close();
}

function closeUpdateDialog() {
    document.querySelector("#dialog-update-post").close();
}

// ============== events ============== //

function showCreatePostDialog() {
    console.log("Create New Post clicked!");
    document.querySelector("#dialog-create-new-post").showModal();
}
// todo

async function deletePostClicked(event) {
    const form = event.target;
    const id= form.getAttribute("data-id");
    console.log(id);
    await deletePost(id);
}

// ============== posts ============== //

    async function updatePostsGrid() {
        posts = await getPosts(); // get posts from rest endpoint and save in global variable
        showPosts(posts); // show all posts (append to the DOM) with posts as argument
    }

// Get all posts - HTTP Method: GET
    async function getPosts() {
        const response = await fetch(`${endpoint}/posts.json`); // fetch request, (GET)
        const data = await response.json(); // parse JSON to JavaScript
        const posts = prepareData(data); // convert object of object to array of objects
        return posts; // return posts
    }

    function showPosts(listOfPosts) {
        document.querySelector("#posts").innerHTML = ""; // reset the content of section#posts

        for (const post of listOfPosts) {
            showPost(post); // for every post object in listOfPosts, call showPost
        }
    }

    function showPost(postObject) {
        const html = /*html*/ `
        <article class="grid-item">
            <img src="${postObject.image}" />
            <h3>${postObject.title}</h3>
            <p>${postObject.body}</p>
            <div class="btns">
                <button class="btn-delete">Delete</button>
                <button class="btn-update">Update</button>
            </div>
        </article>
    `; // html variable to hold generated html in backtick
        document.querySelector("#posts").insertAdjacentHTML("beforeend", html); // append html to the DOM - section#posts
        //use isertAdjacentTHML instead of innerHTML because else it will reset the eventlisteners after.
        // add event listeners to .btn-delete and .btn-update
        document
            .querySelector("#posts article:last-child .btn-delete")
            .addEventListener("click", deleteClicked);
        document
            .querySelector("#posts article:last-child .btn-update")
            .addEventListener("click", updateClicked);

        // called when delete button is clicked
        function deleteClicked() {
            console.log("Delete button clicked");
            // to do
            console.log(postObject.id);
            document.querySelector("#dialog-delete-post-title").textContent = postObject.title;
            //data-id attribute holds the id of the object we click on/select
            document.querySelector("#form-delete-post").setAttribute("data-id", postObject.id);
            document.querySelector("#dialog-delete-post").showModal();
            // deletePost(postObject.id);

        }

        // called when update button is clicked
        function updateClicked() {

            console.log("Update button clicked");
            // to do
            console.log(postObject);
            const form = document.querySelector("#form-update-post")
            form.title.value = postObject.title;
            form.body.value = postObject.body;
            form.image.value = postObject.image;
            form.setAttribute("data-id", postObject.id);
            document.querySelector("#dialog-update-post").showModal();
        }
    }

// Create a new post - HTTP Method: POST
//(title, body and image) is the data we get from the input fields
    async function createPost(title, body, image) {
        // create new post object
        const newPost ={title: title, body: body, image: image}
        console.log(newPost)
        // convert the JS object to JSON string
        const json = JSON.stringify(newPost);
        console.log(json);
        // POST fetch request with JSON in the body
        const response = await fetch(`${endpoint}/posts.json`, {method: "post", body: json});
        // check if response is ok - if the response is successful
        if(response.ok) {
          await updatePostsGrid();
        }
        // update the post grid to display all posts and the new post

    }

// Update an existing post - HTTP Method: DELETE
    async function deletePost(id) {
        // DELETE fetch request
        const response = await fetch(`${endpoint}/posts/${id}.json`, {method: "DELETE"});
        // check if response is ok - if the response is successful
        if(response.ok) {
            // update the post grid to display posts
            await updatePostsGrid();
        }
        else {
                console.log(response.statusText);
                console.log(response.status);
            }
    }

// Delete an existing post - HTTP Method: PUT
    async function updatePost(id, title, body, image) {
        // post update to update
        const post = {title, body, image};
        // convert the JS object to JSON string
        const json = JSON.stringify(post);
        // PUT fetch request with JSON in the body. Calls the specific element in resource
        const response = await fetch(`${endpoint}/posts/${id}.json`, {method: "PUT", body: json});
        // check if response is ok - if the response is successful
        if (response.ok) {
            // update the post grid to display all posts and the new post
            await updatePostGrid();
        }
            else {
            console.log(response.statusText);
            console.log(response.status);
//
        }

    }

// ============== helper function ============== //

// convert object of objects til an array of objects
    function prepareData(dataObject) {
        const array = []; // define empty array
        // loop through every key in dataObject
        // the value of every key is an object
        for (const key in dataObject) {
            const object = dataObject[key]; // define object
            object.id = key; // add the key in the prop id
            array.push(object); // add the object to array
        }
        return array; // return array back to "the caller"
    }


