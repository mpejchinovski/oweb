function createBlogPost({text, user, time, date}) {
    let blogPost = document.createElement('div');
    blogPost.id = "blog-post";

    blogPost.insertAdjacentHTML('beforeend', `
        <span id="post-text"> </span>
        <span id="post-user"><span style="color: black;">by </span></span>
        <span id="post-time"> </span>
        <span id="post-date"> </span>
    `);

    let [postText, postUsername, postTime, postDate] = blogPost.children;
    postText.textContent = text;
    postTime.textContent = time;
    postDate.textContent = date;

    if (user == '')
        user = "random" + Math.floor(Math.random() * 1500);
    
    postUsername.append(user);
    return { blogPost, user };
}

window.addEventListener('load', () => {
    let postStorage = [],
        blogPosts = document.querySelector('div[id="blog-posts"]'),
        textInput = document.querySelector('textarea[id="post-text-input"]'),
        usernameInput = document.querySelector('input[id="post-user-input"]');

    textInput.oninput = function() {
        this.style.height = this.scrollHeight + "px";
    }

    let postStorageString = localStorage.getItem('posts');
    if (postStorageString) {
        postStorage = JSON.parse(postStorageString);
        for (let post of postStorage) {
            blogPosts.prepend(createBlogPost(post).blogPost);
        }
    }

    document.querySelector('button[id="post-submit"]')
            .addEventListener('click', () => {
                if (textInput.value.trim() != "") {
                    let postObj = { 
                        text: textInput.value,
                        user: usernameInput.value,
                        time: (new Date()).toLocaleTimeString(), 
                        date: (new Date()).toLocaleDateString()
                    };
                    let { blogPost: newPost, user } = createBlogPost(postObj);
                    blogPosts.prepend(newPost);
                    postObj.user = user;
                    postStorage.push(postObj);
                    localStorage.setItem('posts', JSON.stringify(postStorage));
                }
            });
});
