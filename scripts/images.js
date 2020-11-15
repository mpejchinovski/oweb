let storageArray = [], imageObjects = [];
let img;

function createThumbs(post) {
    let thumbs = document.createElement('div');
    thumbs.id = "thumbs";
    
    thumbs.insertAdjacentHTML('beforeend', `
        <img src="images/like.png" />
        <span id="like-counter"> </span>
        <img src="images/dislike.png" />
        <span id="dislike-counter"> </span>
    `);
    
    const [ like, likeCounter, dislike, dislikeCounter ] = thumbs.children;

    let postObj = storageArray[parseInt(post.id.replace("slika", ""))];
    likeCounter.textContent = postObj ? postObj.likes : 0;
    dislikeCounter.textContent = postObj ? postObj.dislikes : 0;

    like.onclick = () => {
        storageArray[parseInt(post.id.replace("slika", ""))].likes += 1;
        localStorage.setItem('images', JSON.stringify(storageArray));
        likeCounter.textContent = parseInt(likeCounter.textContent) + 1;
    }

    dislike.onclick = () => {
        storageArray[parseInt(post.id.replace("slika", ""))].dislikes += 1;
        localStorage.setItem('images', JSON.stringify(storageArray));
        dislikeCounter.textContent = parseInt(dislikeCounter.textContent) + 1;
    }

    return thumbs;
}

function createComment(text, date, time) {
    let comment = document.createElement('div');
    comment.id = "comment";
    comment.insertAdjacentHTML('beforeend', `
        <div id="comment-text"></div>
        <span id="comment-date"></span> <br />
        <span id="comment-time"></span>
    `);

    comment.children[0].append(text);
    comment.children[1].append(date);
    comment.children[3].append(time);
    
    return comment;
}

function createCommentSection(post) {
    let commentSection = document.createElement('div');
    commentSection.id = "comment-section";

    commentSection.insertAdjacentHTML('beforeend', `
        <input type="text" placeholder="Add a comment..." />
        <button type="submit" id="commentbtn"> Submit </button>
        <br />
        <span id="com"> Comments: <br /> </span>
        <br />
        <div id="comments"> </div>
    `);

    let [commentInput, commentBtn,,,, comments] = commentSection.children;

    commentBtn.onclick = () => {
        let cmnt = createComment(commentInput.value,
            (new Date()).toLocaleDateString(), (new Date()).toLocaleTimeString());
        comments.prepend(cmnt, document.createElement('br'));
        storageArray[parseInt(post.id.replace("slika", ""))].comments
            .push({
                text: cmnt.children[0].textContent,
                date: cmnt.children[1].textContent,
                time: cmnt.children[3].textContent
            });
        localStorage.setItem('images', JSON.stringify(storageArray));
    }

    for (let comment of imageObjects[parseInt(post.id.replace("slika", ""))].comments)
        comments.prepend(createComment(comment.text, comment.date, comment.time), 
            document.createElement('br'));

    return commentSection;
}

function createPost(image) {
    let post = document.createElement('div');
    post.className = 'post';
    post.append(image);
    return post;
}

window.addEventListener('load', function () {
    let galerija = document.querySelector('div[id="galerija"]');
    let storageString = localStorage.getItem('images');

    if (storageString) {
        storageArray = JSON.parse(storageString);
        for (let i = 0; i < storageArray.length; i++) {
            imageObjects[i] = {
                url: storageArray[i].dataURL,
                id: storageArray[i].id,
                comments: storageArray[i].comments,
                likes: storageArray[i].likes,
                dislikes: storageArray[i].dislikes
            }
            img = new Image();
            img.src = storageArray[i].dataURL;
            let div = createPost(img);
            div.id = storageArray[i].id;
            div.append(createThumbs(div));
            div.append(createCommentSection(div));
            galerija.prepend(div);
        }
    }
    
    document.querySelector('input[type="file"]').addEventListener('change', function () {
        img = new Image();
        img.src = URL.createObjectURL(this.files[0]);
        let div = createPost(img);

        div.id = "slika" + imageObjects.length;
        galerija.prepend(div);

        imageObjects.push({ url: img.src, id: div.id, comments: [] });
    });

    document.querySelector('button[id="savebtn"]').addEventListener('click', function () {
        for (let i = storageArray.length; i < imageObjects.length; i++) {
            document.querySelector(`div[id=${imageObjects[i].id}]`)
                .append(createThumbs(document.querySelector(`div[id=${imageObjects[i].id}]`)),
                    createCommentSection(document.querySelector(`div[id=${imageObjects[i].id}]`)));

            img = new Image();
            img.src = imageObjects[i].url;

            let imgCanvas = document.createElement("canvas");
            let imgContext = imgCanvas.getContext("2d");
            imgCanvas.width = img.width;
            imgCanvas.height = img.height;
            imgContext.drawImage(img, 0, 0, img.width, img.height);
            let url = imgCanvas.toDataURL("image/jpeg", 0.5);

            storageArray.push({ dataURL: url, id: imageObjects[i].id, comments: [],
                likes: 0, dislikes: 0 });
            localStorage.setItem('images', JSON.stringify(storageArray));
        }
    })
});
