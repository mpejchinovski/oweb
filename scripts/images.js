let storageArray = [], imageObjects = [];
let img;

function createCommentSection(post) {
    let commentSection = document.createElement('div');
    commentSection.id = "comment-section";

    commentSection.insertAdjacentHTML('beforeend', `
        <input type="text" placeholder="Add a comment..." />
        <button type="submit" id="commentbtn"> Submit </button>
        <span id="com"> Comments: <br /> </span>
        <div id="comments"> </div>
    `);

    let [commentInput, commentBtn, com, comments] = commentSection.children;

    commentBtn.onclick = () => {
        comments.append(commentInput.value, document.createElement('br'));
        storageArray[parseInt(post.id.replace("slika", ""))].comments.push(commentInput.value);
        localStorage.setItem('images', JSON.stringify(storageArray));
    }

    for (let comment of imageObjects[parseInt(post.id.replace("slika", ""))].comments)
        comments.append(comment, document.createElement('br'));

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
                comments: storageArray[i].comments
            }
            img = new Image();
            img.src = storageArray[i].dataURL;
            let div = createPost(img);
            div.id = storageArray[i].id;
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
                .append(createCommentSection(document.querySelector(`div[id=${imageObjects[i].id}]`)));

            img = new Image();
            img.src = imageObjects[i].url;

            let imgCanvas = document.createElement("canvas");
            let imgContext = imgCanvas.getContext("2d");
            imgCanvas.width = img.width;
            imgCanvas.height = img.height;
            imgContext.drawImage(img, 0, 0, img.width, img.height);
            let url = imgCanvas.toDataURL("image/jpeg", 0.5);

            storageArray.push({ dataURL: url, id: imageObjects[i].id, comments: [] });
            localStorage.setItem('images', JSON.stringify(storageArray));
        }
    })
});

function draw(img) {

}