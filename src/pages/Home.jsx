import { useEffect, useState } from "react";
import { useSpring, animated } from "@react-spring/web";

const HomePage = () => {
  const [loading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [message, setMessage] = useState("");
  const [fadeIn, setFadeIn] = useSpring(() => ({ opacity: 1 }));

  useEffect(() => {
    setFadeIn({ opacity: 1 });
  }, [setFadeIn]);

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

  const fadeInInput = useSpring({
    opacity: 1,
    from: { opacity: 0 },
    config: { duration: 500 },
  });

  const cardStyle = {
    boxShadow: "0 0 10px rgba(0, 0, 0, 0.1)",
    backgroundColor: "#ffffff",
    border: "1px solid #e5e5e5",
  };

  const handleIngredientChange = (category, value) => {
    setSelectedIngredients((prevIngredients) => ({
      ...prevIngredients,
      [category]: value.toLowerCase(),
    }));
  };

  const getOptionsForCategory = (category) => {
    const selectedCategory = category.toLowerCase();

    const options = categoryOptions[selectedCategory] || [];

    const uniqueOptions = new Set(
      options.map((option) => option.IngredientName.toLowerCase())
    );

    const updatedOptions = [
      ...Array.from(uniqueOptions).map((optionName) => ({
        IngredientName: optionName,
      })),
    ];

    return updatedOptions;
  };

  const getRandomMeal = () => {
    const selectedProtein = selectedIngredients.protein.toLowerCase();

    if (!selectedProtein) {
      setMessage("Please select a protein first to randomize ingredients.");
      return;
    } else {
      setMessage("");
    }

    const randomMeal = {
      protein: selectedProtein,
      carbohydrate: getRandomOption("Carbohydrate"),
      vegetable: getRandomOption("Vegetable"),
      sauce: getRandomOption("Sauce"),
      fruit: getRandomOption("Fruit"),
    };

    setSelectedIngredients({
      ...selectedIngredients,
      carbohydrate: randomMeal.carbohydrate,
      vegetable: randomMeal.vegetable,
      sauce: randomMeal.sauce,
      fruit: randomMeal.fruit,
    });

    console.log("Random Meal:", randomMeal);
  };

  const getRandomOption = (category) => {
    const options = getOptionsForCategory(category);
    const randomIndex = Math.floor(Math.random() * options.length);
    return options[randomIndex]?.IngredientName || "";
  };

  return (
    <animated.div className="container mx-auto mt-8 p-4" style={fadeIn}>
      <animated.div className="bg-white rounded-lg shadow-md" style={{ ...fadeIn, ...cardStyle }}>
        <form className="flex flex-col space-y-4 pb-6">
          <animated.div className="bg-nav-color h-1/6 w-full" style={fadeIn}>
            <h2 className="text-white text-center my-3 text-lg font-extrabold tracking-tight">
              Create your own or randomize a meal!
            </h2>
          </animated.div>
          {ingredientCategories.map((category) => (
            <animated.div key={category} className="w-3/4 m-auto" style={fadeInInput}>
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
                className="mt-2 p-2 border rounded-md w-full focus:border-nav-color"
              >
                <option value="">
                  Select {category}
                </option>
                {getOptionsForCategory(category).map((option) => (
                  <option
                    key={option.IngredientName}
                    value={option.IngredientName}
                  >
                    {option.IngredientName}
                  </option>
                ))}
              </select>
            </animated.div>
          ))}
          {message && (
            <p className="text-not-success-red">{message}</p>
          )}
          <animated.button
            type="button"
            onClick={getRandomMeal}
            className="bg-nav-color text-white p-2 rounded-md mt-4 w-3/4 m-auto"
            style={fadeIn}
          >
            Randomize Ingredients
          </animated.button>
        </form>
      </animated.div>
    </animated.div>
  );
};

export default HomePage;
