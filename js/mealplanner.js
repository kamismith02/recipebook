document.addEventListener('DOMContentLoaded', () => {
    const dropzones = document.querySelectorAll('.dropzone');
    const resultsContainer = document.getElementById('results');
    const searchButton = document.getElementById('search-button');
    const searchInput = document.getElementById('search-input');
    const categorySelect = document.getElementById('category-select');

    // Fetch categories and populate the category select
    fetch('https://www.themealdb.com/api/json/v1/1/categories.php')
        .then(response => response.json())
        .then(data => {
            data.categories.forEach(category => {
                const option = document.createElement('option');
                option.value = category.strCategory;
                option.textContent = category.strCategory;
                categorySelect.appendChild(option);
            });
        });

    // Search meal by name
    searchButton.addEventListener('click', () => {
        const query = searchInput.value;
        fetch(`https://www.themealdb.com/api/json/v1/1/search.php?s=${query}`)
            .then(response => response.json())
            .then(data => {
                resultsContainer.innerHTML = '';
                if (data.meals) {
                    data.meals.forEach(meal => {
                        const mealDiv = createMealDiv(meal);
                        resultsContainer.appendChild(mealDiv);
                    });
                } else {
                    resultsContainer.textContent = 'No results found';
                }
            });
    });

    // Filter by category
    categorySelect.addEventListener('change', () => {
        const category = categorySelect.value;
        if (category) {
            fetch(`https://www.themealdb.com/api/json/v1/1/filter.php?c=${category}`)
                .then(response => response.json())
                .then(data => {
                    resultsContainer.innerHTML = '';
                    data.meals.forEach(meal => {
                        const mealDiv = createMealDiv(meal);
                        resultsContainer.appendChild(mealDiv);
                    });
                });
        } else {
            resultsContainer.innerHTML = '';
        }
    });

    // Function to create a meal div
    function createMealDiv(meal) {
        const mealDiv = document.createElement('div');
        mealDiv.classList.add('meal');
        mealDiv.setAttribute('draggable', 'true');
        mealDiv.setAttribute('data-id', meal.idMeal);
        mealDiv.innerHTML = `
            <h3>${meal.strMeal}</h3>
            <img src="${meal.strMealThumb}/preview" alt="${meal.strMeal}">
        `;
        mealDiv.addEventListener('dragstart', (e) => {
            e.dataTransfer.setData('text/plain', meal.idMeal);
        });
        return mealDiv;
    }

    // Handle drag and drop
    dropzones.forEach(dropzone => {
        dropzone.addEventListener('dragover', (e) => {
            e.preventDefault();
            dropzone.classList.add('dragging-over');
        });

        dropzone.addEventListener('dragleave', () => {
            dropzone.classList.remove('dragging-over');
        });

        dropzone.addEventListener('drop', (e) => {
            e.preventDefault();
            dropzone.classList.remove('dragging-over');
            const mealId = e.dataTransfer.getData('text/plain');
            const mealDiv = document.querySelector(`[data-id="${mealId}"]`);
            dropzone.appendChild(mealDiv);
            dropzone.classList.add('meal-dropped');
        });
    });
});