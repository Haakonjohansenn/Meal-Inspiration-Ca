import { useEffect, useState } from "react";

const HomePage = () => {
  const [loading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const ingredientCategories = [
    "Protein",
    "Carbohydrate",
    "Vegetable",
    "Sauce",
    "Fruit",
  ];

  const [selectedIngredients, setSelectedIngredients] = useState({
    protein: "",
    carbohydrate: "",
    vegetable: "",
    sauce: "",
    fruit: "",
  });

  const [categoryOptions, setCategoryOptions] = useState({});

  useEffect(() => {
    const fetchOptions = async () => {
      try {
        setIsLoading(true);
        const accessToken =
          "patAbFrCQW8wvlTHA.fed8fb93ee5726076bdc2f4b9dd036b84ec99484f207fec3cd5a8c4f193b8f0e";

        if (!accessToken) {
          setIsLoading(false);
          return;
        }

        const optionsPromises = ingredientCategories.map(async (category) => {
          const categoryUrl = new URL(
            `https://api.airtable.com/v0/appGeOPo1wvGG1oUQ/tbltaBSXQfqqSQ13T`
          );
          categoryUrl.searchParams.append(
            "filterByFormula",
            `{Category}='${category}'`
          );
          const categoryResponse = await fetch(categoryUrl, {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          });
          const categoryData = await categoryResponse.json();
          console.log(`Data for ${category}:`, categoryData); // Debug log
          return {
            [category.toLowerCase()]: categoryData.records.map(
              (record) => record.fields
            ),
          };
        });

        const categoryOptionsArray = await Promise.all(optionsPromises);
        const optionsObject = Object.assign({}, ...categoryOptionsArray);
        setCategoryOptions(optionsObject);
      } catch (error) {
        setError(error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchOptions();
  }, []);

  const handleIngredientChange = (category, value) => {
    setSelectedIngredients((prevIngredients) => ({
      ...prevIngredients,
      [category]: value.toLowerCase(),
    }));
  };

  const getOptionsForCategory = (category) => {
    const selectedCategory = category.toLowerCase();
  
    const options = categoryOptions[selectedCategory] || [];
  
    // Remove duplicates by creating a Set
    const uniqueOptions = new Set(options.map((option) => option.IngredientName.toLowerCase()));
  
    // Include the selected ingredient in the options only if it's not already there
    const updatedOptions = [
      ...Array.from(uniqueOptions).map((optionName) => ({ IngredientName: optionName })),
    ];
  
    return updatedOptions;
  };

  const getRandomMeal = () => {
    const selectedProtein = selectedIngredients.protein.toLowerCase();

    const randomMeal = {
      protein: selectedProtein,
      carbohydrate: getRandomOption("Carbohydrate"),
      vegetable: getRandomOption("Vegetable"),
      sauce: getRandomOption("Sauce"),
      fruit: getRandomOption("Fruit"),
    };

    // Update selectedIngredients with randomized values
    setSelectedIngredients({
      ...selectedIngredients,
      carbohydrate: randomMeal.carbohydrate,
      vegetable: randomMeal.vegetable,
      sauce: randomMeal.sauce,
      fruit: randomMeal.fruit,
    });

    console.log("Random Meal:", randomMeal);
    // You can use the randomMeal object as needed, e.g., display it on the UI
  };

  const getRandomOption = (category) => {
    const options = getOptionsForCategory(category);
    const randomIndex = Math.floor(Math.random() * options.length);
    return options[randomIndex]?.IngredientName || "";
  };

  return (
    <div className="container mx-auto mt-8 p-4">
      <div className="bg-white rounded-lg shadow-md">
        <form className="flex flex-col space-y-4 pb-6">
          <div className="bg-nav-color h-14 w-full">
            <h2 className="text-white text-center my-3 text-lg font-extrabold tracking-tight">
              Create your own or randomize a meal!
            </h2>
          </div>
          {ingredientCategories.map((category) => (
            <div key={category} className="w-3/4 m-auto">
              <label htmlFor={category} className="text-lg font-semibold">
                {category}
              </label>
              <select
                id={category}
                name={category}
                value={selectedIngredients[category.toLowerCase()]}
                onChange={(e) =>
                  handleIngredientChange(
                    category.toLowerCase(),
                    e.target.value
                  )
                }
                className="mt-2 p-2 border border-my-gray rounded-md w-full"
              >
                <option value="">Select {category}</option>
                {getOptionsForCategory(category).map((option) => (
                  <option
                    key={option.IngredientName}
                    value={option.IngredientName}
                  >
                    {option.IngredientName}
                  </option>
                ))}
              </select>
            </div>
          ))}
          <button
            type="button"
            onClick={getRandomMeal}
            className="bg-nav-color text-white p-2 rounded-md mt-4 w-3/4 m-auto"
            disabled={!selectedIngredients.protein}
          >
            Randomize Ingredients
          </button>
        </form>
      </div>
    </div>
  );
};

export default HomePage;
