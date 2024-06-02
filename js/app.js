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

// Display search results
function displayResults(meals) {
  const resultsContainer = document.getElementById('results');
  resultsContainer.innerHTML = '';
  if (meals) {
    meals.forEach(meal => {
      const mealDiv = document.createElement('div');
      mealDiv.innerHTML = `<h3>${meal.strMeal}</h3><img src="${meal.strMealThumb}/preview" alt="${meal.strMeal}">`;
      mealDiv.addEventListener('click', () => displayMealDetails(meal.idMeal)); // Add event listener
      resultsContainer.appendChild(mealDiv);
    });
  } else {
    resultsContainer.textContent = 'No results found';
  }
}

// Function to display meal details
function displayMealDetails(mealId) {
  // Fetch meal details by id
  fetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${mealId}`)
    .then(response => response.json())
    .then(data => {
      const meal = data.meals[0];
      // Display meal details (you can implement this according to your UI)
      console.log(meal);
      alert(`Meal Name: ${meal.strMeal}\nCategory: ${meal.strCategory}\nArea: ${meal.strArea}\nInstructions: ${meal.strInstructions}`);
    });
}