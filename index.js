document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("github-form");
  const searchInput = document.getElementById("search");
  const userList = document.getElementById("user-list");
  const reposList = document.getElementById("repos-list");

  form.addEventListener("submit", event => {
    event.preventDefault();
    const query = searchInput.value.trim();
    if (query) {
      searchUsers(query);
    }
  });

  function searchUsers(query) {
    fetch(`https://api.github.com/search/users?q=${query}`)
      .then(res => res.json())
      .then(data => {
        userList.innerHTML = ""; // Clear previous results
        reposList.innerHTML = "";
        data.items.forEach(user => {
          const li = document.createElement("li");
          li.innerHTML = `
            <img src="${user.avatar_url}" width="50" />
            <strong>${user.login}</strong> - 
            <a href="${user.html_url}" target="_blank">Profile</a>
          `;
          li.addEventListener("click", () => {
            fetchUserRepos(user.login);
          });
          userList.appendChild(li);
        });
      })
      .catch(error => console.error("User search failed:", error));
  }

  function fetchUserRepos(username) {
    fetch(`https://api.github.com/users/${username}/repos`)
      .then(res => res.json())
      .then(repos => {
        reposList.innerHTML = `<h3>Repositories for ${username}</h3>`;
        repos.forEach(repo => {
          const li = document.createElement("li");
          li.innerHTML = `<a href="${repo.html_url}" target="_blank">${repo.name}</a>`;
          reposList.appendChild(li);
        });
      })
      .catch(error => console.error("Failed to load repos:", error));
  }
});
