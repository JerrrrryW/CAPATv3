const handleChange = (e) => {
    if (e.target.name === "image") {
      setFormData({
        ...formData,
        [e.target.name]: e.target.files[0],
      });
    } else {
      setFormData({
        ...formData,
        [e.target.name]: e.target.value,
      });
    }
  };
  useEffect(() => {
    console.log(formData.food_drink);
  }, [formData.food_drink]);
  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(formData);
    const postData = new FormData();
    postData.append("name", formData.name);
    postData.append("ingredients", formData.ingredients);
    postData.append("price", formData.price);
    postData.append("food_drink", formData.food_drink);
    postData.append("image", formData.image);
    fetch("/addProduct", {
        method: "POST",
        body: postData,
      })
        .then((response) => response.json())
        .then((data) => {
          console.log(data);
          setFormData({
            ...formData,
            food_drink: "pizza",
            ingredients: "",
            name: "",
            price: "",
            image: null,
          });
        })
    .catch((error) => {
        console.error(error);
    });
};