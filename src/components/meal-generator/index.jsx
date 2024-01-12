import { useEffect, useState } from "react";

export default function MealGenerator() {
  const [loading, setIsLoading] = useState(true);
  const [meals, setMeals] = useState([]);
  const [error, setError] = useState(null);

  // Sample ingredient categories, replace with your actual categories
  const ingredientCategories = ['Protein', 'Carbohydrate', 'Vegetables', 'Sauce', 'Fruits'];

  const [selectedIngredients, setSelectedIngredients] = useState({
    protein: '',
    carbohydrate: '',
    vegetables: '',
    sauce: '',
    fruits: '',
  });

  useEffect(() => {
    const fetchMeals = async () => {
      try {
        setIsLoading(true);
        const accessToken = localStorage.getItem("accessToken");
        console.log(accessToken)
        const url = new URL(`https://api.airtable.com/v0/appGeOPo1wvGG1oUQ/tbltaBSXQfqqSQ13T`);
        const mealResponse = await fetch(url, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });
        const fetchedMeals = await mealResponse.json();
        setMeals(fetchedMeals);
      } catch (error) {
        setError(error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchMeals();
  }, [meals, error]);

  const handleIngredientChange = (category, value) => {
    setSelectedIngredients((prevIngredients) => ({
      ...prevIngredients,
      [category]: value,
    }));
  };

  const handleRandomizeIngredients = () => {
    // Implement your logic to randomize ingredients based on the selected categories
    console.log("Randomize Ingredients clicked!");
  };

  return (
    <div className="container mx-auto mt-8 p-4">
      <form className="flex flex-col space-y-4">
        {ingredientCategories.map((category) => (
          <div key={category}>
            <label htmlFor={category} className="text-lg font-semibold">
              {category}
            </label>
            <select
              id={category}
              name={category}
              value={selectedIngredients[category.toLowerCase()]}
              onChange={(e) => handleIngredientChange(category.toLowerCase(), e.target.value)}
              className="mt-2 p-2 border border-my-gray rounded-md w-full"
            >
              {/* Include options for each ingredient category */}
              <option value="">Select {category}</option>
              {/* Add actual options based on your data */}
              <option value="Option1">Option1</option>
              <option value="Option2">Option2</option>
              {/* ... */}
            </select>
          </div>
        ))}
        <button
          type="button"
          onClick={handleRandomizeIngredients}
          className="bg-nav-color text-white p-2 rounded-md mt-4"
        >
          Randomize Ingredients
        </button>
      </form>
    </div>
  );
}
