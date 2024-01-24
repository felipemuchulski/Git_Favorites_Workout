import { GithubUser } from "./githubAPi.js";

// created class for the logic code:
export class Favorites {
  constructor(root) {
    this.root = document.querySelector(root);
    this.load();
  }

  load() {
    this.entries = JSON.parse(localStorage.getItem("@gitfav")) || [];
  }

  save() {
    localStorage.setItem("@gitfav", JSON.stringify(this.entries));
  }

  async add(username) {
    try {
      const userExist = this.entries.find((entry) => entry.login === username);

      if (userExist) {
        throw new Error(`User Exist`);
      }

      const user = await GithubUser.search(username);

      if (user === undefined) {
        throw new Error(`User not found`);
      }

      this.entries = [user, ... this.entries];
      this.update();
      this.save()

    } catch (error) {
        alert(error.message)
    }
  }

  delete(user) {
    const filteredEntries = this.entries.filter(
      (entry) => entry.login !== user.login
    );

    this.entries = filteredEntries;
    this.update();
    this.save();
  }
}

// class created to build visual content:

export class FavoritesView extends Favorites {
  constructor(root) {
    super(root);
    this.tbody = document.querySelector("table tbody");
    this.update();
    this.onadd();
  }

  update() {
    this.removeAllTr();

    this.entries.forEach((user) => {
      const row = this.createRow();

      row.querySelector(
        ".user img"
      ).src = `https://github.com/${user.login}.png`;
      row.querySelector(`.user a`).href = `https://github.com/${user.login}`;
      row.querySelector(`.user p`).textContent = user.name;
      row.querySelector(`.user span`).textContent = user.login;
      row.querySelector(`.repositories`).textContent = user.public_repos;
      row.querySelector(`.followers`).textContent = user.followers;

      //remove row onclick
      row.querySelector(`.remove button`).onclick = () => {
        const itsOk = confirm(`Delete user?`);
        if (itsOk) {
          this.delete(user);
        }
      };
        this.tbody.append(row)

    });
  }

  onadd() {
    const addButton = document.querySelector(".addFav");
    addButton.onclick = () => {
      const { value } = document.querySelector(`#inputUser`);
      this.add(value);
      this.root.querySelector('.inputField input').value = ''
    };
  }

  createRow() {
    const tr = document.createElement("tr");

    tr.innerHTML = `
    <td class="user">
    <img src="" alt="imagem do usuário" />
    <a href="" target="_blank">
      <p>Felipe Muchulski</p>
      <span>felipemuchulski</span>
    </a>
      
  </td>
  <td class="repositories">38</td>
  <td class="followers">10</td>
  <td class="remove"><button>Remove</button></td>
 </tr>`;

    return tr;
  }

  removeAllTr() {
    this.tbody.querySelectorAll("tr").forEach((tr) => {
      tr.remove();
    });
  }
}
