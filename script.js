document.addEventListener('DOMContentLoaded', () => {
    const search = document.getElementById('input');
    const grid = document.getElementById('grid');
    const text = document.getElementById('text');
    const modal = document.getElementById('modal');
    const recipe = document.getElementById('recipe');
    const button = document.querySelector('.close');

    //Search meals
    async function searchMeals(query) {
        const res = await fetch(`https://www.themealdb.com/api/json/v1/1/search.php?s=${query}`);
        const data = await res.json();
        return data.meals;
    }

    //Create grid of meals 
    function gridMeals(meals, query) {
        grid.innerHTML = '';
        text.innerHTML = '';
        if (meals) {
            meals.forEach(meal => {
                const item = document.createElement('div');
                item.className = 'meal-item';
                item.dataset.id = meal.idMeal;
                item.innerHTML = `
                    <img src="${meal.strMealThumb}" alt="${meal.strMeal}">
                    <h3>${meal.strMeal}</h3>`;
                grid.appendChild(item);
            });
            text.textContent = `These are the results for « ${query} » :`;
            grid.parentElement.classList.remove("no-result");
        } else {
            text.innerHTML = `<span class="underline">No results</span> found for <b>« ${query} »</b> ☹`;
            grid.parentElement.classList.add("no-result");
        }
        grid.parentElement.classList.remove("no-search");
    }

    //Info from id
    async function IdMeals(id) {
        const res = await fetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${id}`);
        const data = await res.json();
        return data.meals[0];
    }

    //Create recipe card
    function recipeCard(meal) {
        const ingredientKeys = Object.keys(meal).filter(key => key.startsWith('strIngredient') && meal[key]);
        recipe.innerHTML = `
            <h2>${meal.strMeal}</h2>
            <div class="recipe-desc">
                <div class="recipe-img">
                    <img src="${meal.strMealThumb}" alt="">
                </div>
                <div class="recipe-ing">
                    <h3>Ingredients:</h3>
                    <ul>
                    ${ingredientKeys.map(key => {
                        const ingredientId = key.slice(13);
                        const measure = `strMeasure${ingredientId}`;
                        return `<li>${meal[key]} - ${meal[measure]}</li>`;
                    }).join('')}
                    </ul>
                </div>
            </div>
            <div>
                <h3>Instructions:</h3>
                <p>${meal.strInstructions}</p>
            </div>
        `;
        modal.classList.add("modal-open");
        document.body.classList.add("overflow-hidden");
    }

    //Search bar input
    search.addEventListener('keyup', async (event) => {
        if (event.key === 'Enter') {
            const query = search.value.trim();
            if (query) {
                const meals = await searchMeals(query);
                gridMeals(meals, query);
            }
        }
    });

    //Meal onlick
    grid.addEventListener('click', async (event) => {
        const item = event.target.closest('.meal-item');
        if (item) {
            const mealId = item.dataset.id;
            const meal = await IdMeals(mealId);
            recipeCard(meal);
        }
    });

    //Close modal button 
    modal.addEventListener('click', (event) => {
        if (event.target === modal || event.target === button) {
            modal.classList.remove("modal-open");
            document.body.classList.remove("overflow-hidden");
        }
    });
});