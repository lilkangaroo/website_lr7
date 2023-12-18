// Ссылки на элементы DOM
const postsContainer = document.querySelector('.posts_list');
const showButton = document.querySelector('.show_all_btn');
const creatorInput = document.querySelector('.creator');

// Объект состояния приложения
const state = { posts: [] };

// Функция для создания элемента поста
function createPostElement(post) {
  // Создание DOM-элементов
  const postElement = document.createElement('div');
  postElement.classList.add('post');

  const postWrapper = document.createElement('div');
  postWrapper.classList.add('post__wrapper');

  const userHeader = document.createElement('h2');
  userHeader.classList.add('wrapper__user');
  userHeader.textContent = post.userId;

  const titleParagraph = document.createElement('p');
  titleParagraph.classList.add('wrapper__title');
  titleParagraph.textContent = post.title;

  const bodyDiv = document.createElement('div');
  bodyDiv.classList.add('wrapper__body');
  bodyDiv.textContent = post.body;

  // Собираем структуру элемента
  postWrapper.appendChild(userHeader);
  postWrapper.appendChild(titleParagraph);
  postWrapper.appendChild(bodyDiv);

  postElement.appendChild(postWrapper);

  return postElement;
}

// Функция для отображения постов в зависимости от введенного authorId
async function showPosts() {
  postsContainer.innerHTML = "";
  const authorId = creatorInput.value;
  if (authorId) {
    try {
      const filteredPosts = await getFilteredPosts(authorId);
      if (filteredPosts && filteredPosts.length > 0) {
        filteredPosts.forEach((post) => {
          const postElement = createPostElement(post);
          postsContainer.appendChild(postElement);
        });
      } else {
        postsContainer.innerHTML = '<div class="post">Такой записи не существует, попробуйте указать другой ID</div>';
      }
    } catch (error) {
      console.error('Ошибка при получении данных:', error);
    }
  } else {
    try {
      await getAllPosts();
      fillPostsList();
    } catch (error) {
      console.error('Ошибка при получении данных:', error);
    }
  }
}

// Функция для получения всех постов
function getAllPosts() {
  return fetch('https://jsonplaceholder.typicode.com/posts')
    .then((res) => res.json())
    .then((posts) => {
      state.posts = posts;
    });
}

// Функция для получения отфильтрованных постов по authorId
function getFilteredPosts(authorId) {
  return fetch(`https://jsonplaceholder.typicode.com/posts?userId=${authorId}`)
    .then((res) => {
      if (res.ok) {
        return res.json();
      } else {
        return null;
      }
    });
}

// Функция для заполнения списка постов
function fillPostsList() {
  postsContainer.innerHTML = "";
  if (state.posts.length) {
    state.posts.forEach((post) => {
      const postElement = createPostElement(post);
      postsContainer.appendChild(postElement);
    });
  }
}

// Устанавливаем обработчик события на кнопку
showButton.addEventListener('click', showPosts);
