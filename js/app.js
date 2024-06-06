// Fetch ingredient categories and populate the ingredient select
fetch('https://www.themealdb.com/api/json/v1/1/list.php?i=list')
  .then(response => response.json())
  .then(data => {
    const ingredientSelect = document.getElementById('ingredient-select');
    data.meals.forEach(ingredient => {
      const option = document.createElement('option');
      option.value = ingredient.strIngredient;
      option.textContent = ingredient.strIngredient;
      ingredientSelect.appendChild(option);
    });
  });

// Fetch areas and populate the area select
fetch('https://www.themealdb.com/api/json/v1/1/list.php?a=list')
  .then(response => response.json())
  .then(data => {
    const areaSelect = document.getElementById('area-select');
    data.meals.forEach(area => {
      const option = document.createElement('option');
      option.value = area.strArea;
      option.textContent = area.strArea;
      areaSelect.appendChild(option);
    });
  });

// Fetch categories and populate the category select
fetch('https://www.themealdb.com/api/json/v1/1/categories.php')
  .then(response => response.json())
  .then(data => {
    const categorySelect = document.getElementById('category-select');
    data.categories.forEach(category => {
      const option = document.createElement('option');
      option.value = category.strCategory;
      option.textContent = category.strCategory;
      categorySelect.appendChild(option);
    });
  });

// Search meal by name
document.getElementById('search-button').addEventListener('click', () => {
  const query = document.getElementById('search-input').value;
  // Fetch meals by name
  fetch(`https://www.themealdb.com/api/json/v1/1/search.php?s=${query}`)
    .then(response => response.json())
    .then(data => displayResults(data.meals));
});

// Filter by category
document.getElementById('category-select').addEventListener('change', () => {
  const category = document.getElementById('category-select').value;
  if (category) {
    // Fetch meals by category
    fetch(`https://www.themealdb.com/api/json/v1/1/filter.php?c=${category}`)
      .then(response => response.json())
      .then(data => displayResults(data.meals));
  }
});

// Filter by ingredient
document.getElementById('ingredient-select').addEventListener('change', () => {
  const ingredient = document.getElementById('ingredient-select').value;
  if (ingredient) {
    // Fetch meals by ingredient
    fetch(`https://www.themealdb.com/api/json/v1/1/filter.php?i=${ingredient}`)
      .then(response => response.json())
      .then(data => displayResults(data.meals));
  }
});

// Filter by area
document.getElementById('area-select').addEventListener('change', () => {
  const area = document.getElementById('area-select').value;
  if (area) {
    // Fetch meals by area
    fetch(`https://www.themealdb.com/api/json/v1/1/filter.php?a=${area}`)
      .then(response => response.json())
      .then(data => displayResults(data.meals));
  }
});

// Clear filters and search input
document.getElementById('clear-button').addEventListener('click', () => {
  document.getElementById('search-input').value = '';
  document.getElementById('category-select').value = '';
  document.getElementById('ingredient-select').value = '';
  document.getElementById('area-select').value = '';
  document.getElementById('results').innerHTML = '';
});

// Display search results
function displayResults(meals) {
  const resultsContainer = document.getElementById('results');
  resultsContainer.innerHTML = '';
  
  if (meals) {
    meals.forEach(meal => {
      const mealDiv = document.createElement('div');
      mealDiv.classList.add('meal-box');
      mealDiv.innerHTML = `
        <h3>${meal.strMeal}</h3>
        <img src="${meal.strMealThumb}/preview" alt="${meal.strMeal}">
        <button class="favorite-button">♡</button>
      `;
      mealDiv.querySelector('.favorite-button').addEventListener('click', (event) => {
        event.stopPropagation(); // Prevent the click event from triggering the meal page display
        toggleFavorite(meal);
      });
      mealDiv.addEventListener('click', () => displayMealPage(meal.idMeal));
      resultsContainer.appendChild(mealDiv);
    });
  } else {
    resultsContainer.textContent = 'No results found';
  }
  applyHoverEffects();
}

// Function to display meal details in a new page-like div
function displayMealPage(mealId) {
  // Fetch meal details by id
  fetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${mealId}`)
    .then(response => response.json())
    .then(data => {
      const meal = data.meals[0];
      
      // Create a new div for the meal details page
      const mealPageDiv = document.createElement('div');
      mealPageDiv.classList.add('meal-page');
      mealPageDiv.innerHTML = `
        <div class="meal-page-content">
          <h2>${meal.strMeal}</h2>
          <img src="${meal.strMealThumb}" alt="${meal.strMeal}">
          <p><strong>Category:</strong> ${meal.strCategory}</p>
          <p><strong>Area:</strong> ${meal.strArea}</p>
          <p><strong>Instructions:</strong> ${meal.strInstructions}</p>
          <button class="back-button">Back</button>
        </div>
      `;
      
      // Append the mealPageDiv to the body
      document.body.appendChild(mealPageDiv);

      // Back button functionality
      mealPageDiv.querySelector('.back-button').addEventListener('click', () => {
        mealPageDiv.remove();
      });
    });
}

// Toggle favorite meals and store in local storage
function toggleFavorite(meal) {
  let favorites = JSON.parse(localStorage.getItem('favorites')) || [];
  const mealIndex = favorites.findIndex(fav => fav.idMeal === meal.idMeal);

  if (mealIndex >= 0) {
    // Remove from favorites
    favorites.splice(mealIndex, 1);
  } else {
    // Add to favorites
    favorites.push(meal);
  }

  localStorage.setItem('favorites', JSON.stringify(favorites));
  displayFavorites();
}

// Display favorite meals
function displayFavorites() {
  const favoritesList = document.getElementById('favorites-list');
  favoritesList.innerHTML = '';
  const favorites = JSON.parse(localStorage.getItem('favorites')) || [];

  if (favorites.length === 0) {
    const emptyMessage = document.createElement('p');
    emptyMessage.textContent = 'No favorite meals yet. Add some!';
    favoritesList.appendChild(emptyMessage);
  } else {
    favorites.forEach(meal => {
      const mealDiv = document.createElement('div');
      mealDiv.classList.add('favorite-meal');
      mealDiv.innerHTML = `
        <h3>${meal.strMeal}</h3>
        <img src="${meal.strMealThumb}/preview" alt="${meal.strMeal}">
        <button class="remove-favorite">Remove</button>
      `;
      mealDiv.querySelector('.remove-favorite').addEventListener('click', () => toggleFavorite(meal));
      favoritesList.appendChild(mealDiv);
    });
  }
}


// Apply hover effects to meal boxes
function applyHoverEffects() {
  const mealBoxes = document.querySelectorAll('.meal-box');
  mealBoxes.forEach(mealBox => {
    mealBox.addEventListener('mouseover', () => {
      mealBox.style.transform = 'scale(1.05)';
      mealBox.style.boxShadow = '0 4px 8px rgba(0,0,0,0.2)';
    });
    mealBox.addEventListener('mouseout', () => {
      mealBox.style.transform = 'scale(1)';
      mealBox.style.boxShadow = 'none';
    });
  });
}

// Initialize favorites on page load
window.addEventListener('load', () => {
  displayFavorites();
});

// Function to create meal elements and attach event listeners
function createMealElement(meal) {
  const mealDiv = document.createElement('div');
  mealDiv.classList.add('meal-box');
  mealDiv.innerHTML = `
    <h3>${meal.strMeal}</h3>
    <img src="${meal.strMealThumb}" alt="${meal.strMeal}">
  `;
  
  mealDiv.addEventListener('click', () => {
    displayMealPage(meal.idMeal);
  });

  return mealDiv;
}

// Fetch and display meals based on search criteria
function fetchAndDisplayMeals(url) {
  fetch(url)
    .then(response => response.json())
    .then(data => {
      const resultsDiv = document.getElementById('results');
      resultsDiv.innerHTML = '';
      data.meals.forEach(meal => {
        const mealElement = createMealElement(meal);
        resultsDiv.appendChild(mealElement);
      });
      applyHoverEffects();
    });
}
