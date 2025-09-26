const currentUser = { id: 1, username: "pouros" };

document.addEventListener("DOMContentLoaded", () => {
  const listPanel = document.getElementById("list");
  const showPanel = document.getElementById("show-panel");

  fetch("http://localhost:3000/books")
    .then((res) => res.json())
    .then((books) => {
      books.forEach((book) => renderBookTitle(book));
    });

  function renderBookTitle(book) {
    const li = document.createElement("li");
    li.textContent = book.title;
    li.addEventListener("click", () => showBookDetails(book));
    listPanel.appendChild(li);
  }

  function showBookDetails(book) {
    showPanel.innerHTML = `
      <h2>${book.title}</h2>
      <img src="${book.img_url}" alt="${book.title}" style="max-width:200px"/>
      <p>${book.description}</p>
      <h3>Liked by:</h3>
      <ul id="user-list"></ul>
      <button id="like-btn"></button>
    `;

    const userList = document.getElementById("user-list");
    book.users.forEach((user) => {
      const li = document.createElement("li");
      li.textContent = user.username;
      userList.appendChild(li);
    });

    const likeBtn = document.getElementById("like-btn");
    const userLiked = book.users.some((u) => u.id === currentUser.id);
    likeBtn.textContent = userLiked ? "UNLIKE" : "LIKE";

    likeBtn.addEventListener("click", () => toggleLike(book));
  }

  function toggleLike(book) {
    const userLiked = book.users.some((u) => u.id === currentUser.id);
    let updatedUsers;

    if (userLiked) {
      updatedUsers = book.users.filter((u) => u.id !== currentUser.id);
    } else {
      updatedUsers = [...book.users, currentUser];
    }

    fetch(`http://localhost:3000/books/${book.id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ users: updatedUsers }),
    })
      .then((res) => res.json())
      .then((updatedBook) => {
        showBookDetails(updatedBook);
      });
  }
});
