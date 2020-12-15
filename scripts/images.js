let storageArray = [], imageObjects = [], img;

function createSidebarEntry(src, id) {
    let sidebarEntry = document.createElement('div');
    sidebarEntry.className = "sidebar-entry";
    sidebarEntry.id = "sidebar-entry-" + id.replace("slika", "");

    sidebarEntry.insertAdjacentHTML('beforeend', `
        <div class="image-thumbnail-wrapper">
            <img class="image-thumbnail" src="" /> 
        </div>
        <div class="image-preview-info">
            <br />
            <span id="num-comments" style="font-size: 12px;"> Comments: </span> <br />
            <span id="num-likes" style="font-size: 12px;"> Likes: </span> <br />
            <span id="num-dislikes" style="font-size: 12px;"> Dislikes: </span>
        </div
    `);

    let numComments = storageArray[parseInt(id.replace("slika", ""))] ?
        storageArray[parseInt(id.replace("slika", ""))].comments.length : 0;

    let numLikes, numDislikes;

    storageArray[parseInt(id.replace("slika", ""))] ?
        ({ likes: numLikes, dislikes: numDislikes } = storageArray[parseInt(id.replace("slika", ""))])
        : numLikes = numDislikes = 0;

    sidebarEntry.querySelector('span[id="num-comments"]').textContent = "Comments: " + numComments;
    sidebarEntry.querySelector('span[id="num-likes"]').textContent = "Likes: " + numLikes;
    sidebarEntry.querySelector('span[id="num-dislikes"]').textContent = "Dislikes: " + numDislikes;

    sidebarEntry.onclick = () => window.location = "#" + id;
    sidebarEntry.onmouseover = function () {
        this.style.cursor = "pointer";
    }
    sidebarEntry.children[0].children[0].src = src;
    sidebarEntry.children[1].prepend("Slika " + id.replace("slika", ""));

    return sidebarEntry;
}

function createThumbs(id) {
    let thumbs = document.createElement('div');
    thumbs.id = "thumbs";

    thumbs.insertAdjacentHTML('beforeend', `
        <img src="images/like.png" />
        <span id="like-counter"> </span>
        <img src="images/dislike.png" />
        <span id="dislike-counter"> </span>
    `);

    const [like, likeCounter, dislike, dislikeCounter] = thumbs.children;

    let postObj = storageArray[parseInt(id.replace("slika", ""))];
    likeCounter.textContent = postObj ? postObj.likes : 0;
    dislikeCounter.textContent = postObj ? postObj.dislikes : 0;

    like.onclick = () => {
        storageArray[parseInt(id.replace("slika", ""))].likes += 1;
        localStorage.setItem('images', JSON.stringify(storageArray));
        likeCounter.textContent = parseInt(likeCounter.textContent) + 1;

        document
            .querySelector(`div[id="sidebar-entry-${id.replace("slika", "")}"]`)
            .querySelector('span[id="num-likes"]').textContent = "Likes: " +
            storageArray[id.replace("slika", "")].likes;
    }

    dislike.onclick = () => {
        storageArray[parseInt(id.replace("slika", ""))].dislikes += 1;
        localStorage.setItem('images', JSON.stringify(storageArray));
        dislikeCounter.textContent = parseInt(dislikeCounter.textContent) + 1;

        document
            .querySelector(`div[id="sidebar-entry-${id.replace("slika", "")}"]`)
            .querySelector('span[id="num-dislikes"]').textContent = "Dislikes: " +
            storageArray[id.replace("slika", "")].dislikes;
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

function createCommentSection(id) {
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

    let [commentInput, commentBtn, , , , comments] = commentSection.children;

    commentBtn.onclick = () => {
        if (commentInput.value.trim() != "") {
            let cmnt = createComment(commentInput.value,
                (new Date()).toLocaleDateString(), (new Date()).toLocaleTimeString());
            comments.prepend(cmnt, document.createElement('br'));
            storageArray[parseInt(id.replace("slika", ""))].comments
                .push({
                    text: cmnt.children[0].textContent,
                    date: cmnt.children[1].textContent,
                    time: cmnt.children[3].textContent
                });

            localStorage.setItem('images', JSON.stringify(storageArray));

            let numComments = document
                .querySelector(`div[id="sidebar-entry-${id.replace("slika", "")}"]`)
                .querySelector('span');

            numComments.textContent = "Comments: " +
                storageArray[id.replace("slika", "")].comments.length;
        }
    }

    for (let comment of imageObjects[parseInt(id.replace("slika", ""))].comments)
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
    let galerija = document.querySelector('div[id="galerija"]'),
        sidebar = document.querySelector('div[class="sidebar"]'),
        storageString = localStorage.getItem('images');

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

            div.append(createThumbs(div.id), createCommentSection(div.id));
            galerija.prepend(div);
            sidebar.prepend(createSidebarEntry(storageArray[i].dataURL, storageArray[i].id));
        }
    }

    document.querySelector('input[type="file"]').addEventListener('change', function () {
        img = new Image();
        img.src = URL.createObjectURL(this.files[0]);
        let div = createPost(img);

        div.id = "slika" + imageObjects.length;
        galerija.prepend(div);

        sidebar.prepend(createSidebarEntry(img.src, div.id));

        imageObjects.push({ url: img.src, id: div.id, comments: [] });
    });

    document.querySelector('button[id="savebtn"]').addEventListener('click', function () {
        for (let i = storageArray.length; i < imageObjects.length; i++) {
            document.querySelector(`div[id=${imageObjects[i].id}]`)
                .append(createThumbs(imageObjects[i].id),
                    createCommentSection(imageObjects[i].id));

            img = new Image();
            img.src = imageObjects[i].url;

            let imgCanvas = document.createElement("canvas");
            let imgContext = imgCanvas.getContext("2d");
            imgCanvas.width = img.width;
            imgCanvas.height = img.height;
            imgContext.drawImage(img, 0, 0, img.width, img.height);
            let url = imgCanvas.toDataURL("image/jpeg", 0.5);

            storageArray.push({
                dataURL: url, id: imageObjects[i].id, comments: [],
                likes: 0, dislikes: 0
            });
            localStorage.setItem('images', JSON.stringify(storageArray));
        }
    })
});
