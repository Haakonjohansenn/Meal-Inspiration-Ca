import { useCallback, useEffect, useMemo, useState } from "react";

const ACCESS_TOKEN =
  "patAbFrCQW8wvlTHA.fed8fb93ee5726076bdc2f4b9dd036b84ec99484f207fec3cd5a8c4f193b8f0e";

export default function HomePage() {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedIngredients, setSelectedIngredients] = useState({
    protein: "",
    carbohydrate: "",
    vegetable: "",
    sauce: "",
    fruits: "",
  });
  const [categoryOptions, setCategoryOptions] = useState({});
  const ingredientCategories = useMemo(
    () => ["Protein", "Carbohydrate", "Vegetable", "Sauce", "Fruit"],
    []
  );

  const fetchCategories = useCallback(async () => {
    setIsLoading(true);

    try {
      if (!ACCESS_TOKEN) {
        throw new Error("No access token provided");
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
            Authorization: `Bearer ${ACCESS_TOKEN}`,
          },
        });

        const categoryData = await categoryResponse.json();

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
  }, [ingredientCategories]);

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  const handleIngredientChange = (category, value) => {
    setSelectedIngredients((prevIngredients) => ({
      ...prevIngredients,
      [category]: value,
    }));
  };

  const getOptionsForCategory = (category) => {
    console.log("selectedIngredients >>>", selectedIngredients);
    const selectedCategory = selectedIngredients[category.toLowerCase()];
    console.log("selectedCategory >>>", selectedCategory);

    return categoryOptions[category.toLowerCase()]?.filter((option) => {
      const proteins = option.Proteins?.toLowerCase()
        .split(",")
        .map((p) => p.trim());

      return (
        !selectedCategory ||
        proteins?.filter((protein) => protein === selectedCategory)
      );
    });
  };

  console.log("selectedIngredients >>>", selectedIngredients);

  if (error) {
    return <p>Something went wrong</p>;
  }

  if (isLoading || ingredientCategories.length === 0) {
    return <p>Loading...</p>;
  }

  return (
    <div className="container p-4 mx-auto mt-8">
      <div className="bg-white rounded-lg shadow-md">
        <form className="flex flex-col pb-6 space-y-4">
          <div className="w-full bg-nav-color h-14">
            <h2 className="my-3 text-lg font-extrabold tracking-tight text-center text-white">
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
                  handleIngredientChange(category.toLowerCase(), e.target.value)
                }
                className="w-full p-2 mt-2 border rounded-md border-my-gray"
              >
                <option value="">Select {category}</option>
                {Object.keys(categoryOptions).length === 0 &&
                categoryOptions.constructor === Object ? (
                  <></>
                ) : (
                  getOptionsForCategory(category).map((option) => (
                    <option
                      key={option.IngredientName}
                      value={option.IngredientName}
                    >
                      {option.IngredientName}
                    </option>
                  ))
                )}
              </select>
            </div>
          ))}

          <button
            type="button"
            onClick={() => console.log("Randomize Ingredients clicked!")}
            className="w-3/4 p-2 m-auto mt-4 text-white rounded-md bg-nav-color"
          >
            Randomize Ingredients
          </button>
        </form>
      </div>
    </div>
  );
}
