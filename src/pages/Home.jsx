import { useEffect, useState } from "react";

export default function HomePage() {
  const [loading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const ingredientCategories = ['Protein', 'Carbohydrate', 'Vegetable', 'Sauce', 'Fruit'];

  const [selectedIngredients, setSelectedIngredients] = useState({
    protein: '',
    carbohydrate: '',
    vegetable: '',
    sauce: '',
    fruits: '',
  });

  const [categoryOptions, setCategoryOptions] = useState({});

  useEffect(() => {
    const fetchOptions = async () => {
      try {
        setIsLoading(true);
        const accessToken = "patAbFrCQW8wvlTHA.fed8fb93ee5726076bdc2f4b9dd036b84ec99484f207fec3cd5a8c4f193b8f0e";

        if (!accessToken) {
          setIsLoading(false);
          return;
        }

        const optionsPromises = ingredientCategories.map(async (category) => {
          const categoryUrl = new URL(`https://api.airtable.com/v0/appGeOPo1wvGG1oUQ/tbltaBSXQfqqSQ13T`,);
          categoryUrl.searchParams.append('filterByFormula', `{Category}='${category}'`);
          const categoryResponse = await fetch(categoryUrl, {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          });
          const categoryData = await categoryResponse.json();
          console.log(`Data for ${category}:`, categoryData); // Debug log
          return { [category.toLowerCase()]: categoryData.records.map(record => record.fields) };
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
      [category]: value,
    }));
  };

  const getOptionsForCategory = (category) => {
    const selectedProtein = selectedIngredients.protein.toLowerCase();

    console.log("category", category);
    console.log("selectedprotein", selectedProtein);
    
    return categoryOptions[category.toLowerCase()]?.filter(option => {
      const proteins = option.Proteins?.toLowerCase().split(',').map(p => p.trim());
      console.log("proteins", proteins);
      console.log("filtered proteins", proteins.filter(protein => protein === selectedProtein));
      return !selectedProtein || proteins?.filter(protein => protein === selectedProtein);
    });
  };

  return (
    <div className="container mx-auto mt-8 p-4">
      <div className="bg-white rounded-lg shadow-md">
        <form className="flex flex-col space-y-4 pb-6">
          <div className="bg-nav-color h-14 w-full">
            <h2 className="text-white text-center my-3 text-lg font-extrabold tracking-tight">Create your own or randomize a meal!</h2>
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
                onChange={(e) => handleIngredientChange(category.toLowerCase(), e.target.value)}
                className="mt-2 p-2 border border-my-gray rounded-md w-full"
              >
                <option value="">Select {category}</option>
                {Object.keys(categoryOptions).length === 0 && categoryOptions.constructor === Object ? <></>
                : getOptionsForCategory(category).map((option) => (
                  <option key={option.IngredientName} value={option.IngredientName}>
                    {option.IngredientName}
                  </option>))}
              </select>
            </div>
          ))}
          <button
            type="button"
            onClick={() => console.log("Randomize Ingredients clicked!")}
            className="bg-nav-color text-white p-2 rounded-md mt-4 w-3/4 m-auto"
          >
            Randomize Ingredients
          </button>
        </form>
      </div>
    </div>
  );
}
